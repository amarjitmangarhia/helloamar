// helloamar email gate: visitor verifies email with a 6-digit code, then the owner approves at /admin.
const enc = new TextEncoder();
const MIN = 60000, DAY = 86400000;
let ready = null;

const sha = async s => [...new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(s)))].map(b => b.toString(16).padStart(2, '0')).join('');
const rand = () => [...crypto.getRandomValues(new Uint8Array(32))].map(b => b.toString(16).padStart(2, '0')).join('');
const code6 = () => String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, '0');
const json = (o, status = 200, headers = {}) => new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers } });
const sidCookie = (v, age) => `sid=${v}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${age}`;
const getCookie = (req, name) => {
  for (const part of (req.headers.get('cookie') || '').split(/;\s*/)) {
    const i = part.indexOf('=');
    if (part.slice(0, i) === name) return part.slice(i + 1);
  }
  return null;
};

function init(db) {
  if (!ready) {
    ready = db.batch([
      db.prepare(`CREATE TABLE IF NOT EXISTS requests (email TEXT PRIMARY KEY, name TEXT, status TEXT NOT NULL DEFAULT 'new', code_hash TEXT, code_exp INTEGER DEFAULT 0, attempts INTEGER DEFAULT 0, last_sent INTEGER DEFAULT 0, created INTEGER)`),
      db.prepare(`CREATE TABLE IF NOT EXISTS sessions (hash TEXT PRIMARY KEY, email TEXT, admin INTEGER DEFAULT 0, exp INTEGER)`),
    ]).catch(e => { ready = null; throw e; });
  }
  return ready;
}

async function mail(env, to, subject, text) {
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from: `helloamar <${env.FROM_EMAIL}>`, to: [to], subject, text }),
    });
    return r.ok;
  } catch { return false; }
}

async function page(env, request, path) {
  const res = await env.ASSETS.fetch(new Request(new URL(path, request.url)));
  const h = new Headers(res.headers);
  h.set('cache-control', 'no-store');
  h.set('x-content-type-options', 'nosniff');
  h.set('referrer-policy', 'same-origin');
  return new Response(res.body, { status: res.status, headers: h });
}

async function getSession(request, env) {
  const t = getCookie(request, 'sid');
  if (!t) return null;
  const s = await env.DB.prepare('SELECT s.email, s.admin, s.exp, r.name, r.status FROM sessions s JOIN requests r ON r.email = s.email WHERE s.hash = ?').bind(await sha(t)).first();
  return s && s.exp > Date.now() && s.status !== 'rejected' ? s : null;
}

async function requestCode(request, env, admin) {
  const b = await request.json().catch(() => ({}));
  const email = String(b.email || '').trim().toLowerCase();
  const isAdmin = email === admin;
  const name = isAdmin ? 'Admin' : String(b.name || '').trim().slice(0, 80);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return json({ error: 'Enter a valid email.' }, 400);
  if (!name) return json({ error: 'Enter your name.' }, 400);
  const now = Date.now();
  const row = await env.DB.prepare('SELECT status, last_sent FROM requests WHERE email = ?').bind(email).first();
  if (row && row.status === 'rejected') return json({ error: 'This email can’t be used here.' }, 403);
  if (row && now - row.last_sent < MIN) return json({ error: 'Please wait a minute before asking for a new code.' }, 429);
  const { n } = await env.DB.prepare('SELECT COUNT(*) AS n FROM requests WHERE last_sent > ?').bind(now - 60 * MIN).first();
  if (n >= 30) return json({ error: 'Lots of requests right now. Try again later.' }, 429);
  const code = code6();
  await env.DB.prepare(
    `INSERT INTO requests (email, name, status, code_hash, code_exp, attempts, last_sent, created) VALUES (?, ?, ?, ?, ?, 0, ?, ?)
     ON CONFLICT(email) DO UPDATE SET name = CASE WHEN requests.status = 'new' THEN excluded.name ELSE requests.name END,
       code_hash = excluded.code_hash, code_exp = excluded.code_exp, attempts = 0, last_sent = excluded.last_sent`
  ).bind(email, name, isAdmin ? 'approved' : 'new', await sha(email + ':' + code), now + 10 * MIN, now, now).run();
  const ok = await mail(env, email, 'Your helloamar code', `Your code is ${code}\n\nIt expires in 10 minutes. If you didn’t ask for it, ignore this email.`);
  return ok ? json({ ok: true }) : json({ error: 'Couldn’t send the email. Try again soon.' }, 502);
}

async function verify(request, env, admin) {
  const b = await request.json().catch(() => ({}));
  const email = String(b.email || '').trim().toLowerCase();
  const code = String(b.code || '').trim();
  const now = Date.now();
  const row = await env.DB.prepare('SELECT name, status, code_hash, code_exp, attempts FROM requests WHERE email = ?').bind(email).first();
  if (!row || !row.code_hash) return json({ error: 'Ask for a new code.' }, 400);
  if (row.status === 'rejected') return json({ error: 'This email can’t be used here.' }, 403);
  if (row.attempts >= 5) return json({ error: 'Too many tries. Ask for a new code.' }, 429);
  if (now > row.code_exp) return json({ error: 'That code expired. Ask for a new one.' }, 400);
  await env.DB.prepare('UPDATE requests SET attempts = attempts + 1 WHERE email = ?').bind(email).run();
  if ((await sha(email + ':' + code)) !== row.code_hash) return json({ error: 'That code isn’t right.' }, 400);
  const isAdmin = email === admin;
  let status = row.status;
  if (isAdmin) status = 'approved';
  else if (status === 'new') {
    status = 'pending';
    await mail(env, admin, 'helloamar: new access request', `${row.name} <${email}> wants access.\n\nReview it here: ${env.SITE_URL}/admin`);
  }
  await env.DB.batch([
    env.DB.prepare('UPDATE requests SET code_hash = NULL, status = ? WHERE email = ?').bind(status, email),
    env.DB.prepare('DELETE FROM sessions WHERE exp < ?').bind(now),
  ]);
  const token = rand();
  const age = isAdmin ? 7 * DAY : 30 * DAY;
  await env.DB.prepare('INSERT INTO sessions (hash, email, admin, exp) VALUES (?, ?, ?, ?)').bind(await sha(token), email, isAdmin ? 1 : 0, now + age).run();
  return json({ status }, 200, { 'set-cookie': sidCookie(token, age / 1000) });
}

async function adminApi(request, env, admin, p) {
  const s = await getSession(request, env);
  if (!s || s.admin !== 1 || s.email !== admin) return json({ error: 'Not allowed.' }, 403);
  if (p === '/api/admin/list') {
    const { results } = await env.DB.prepare(
      `SELECT email, name, status, created FROM requests WHERE status IN ('pending','approved','rejected') AND email != ?
       ORDER BY CASE status WHEN 'pending' THEN 0 ELSE 1 END, created DESC LIMIT 200`
    ).bind(admin).all();
    return json({ items: results });
  }
  if (p === '/api/admin/decide' && request.method === 'POST') {
    const b = await request.json().catch(() => ({}));
    const email = String(b.email || '').trim().toLowerCase();
    if (!['approve', 'reject'].includes(b.decision) || email === admin) return json({ error: 'Bad request.' }, 400);
    const row = await env.DB.prepare(`SELECT name FROM requests WHERE email = ? AND status IN ('pending','approved','rejected')`).bind(email).first();
    if (!row) return json({ error: 'Not found.' }, 404);
    const approve = b.decision === 'approve';
    await env.DB.prepare('UPDATE requests SET status = ? WHERE email = ?').bind(approve ? 'approved' : 'rejected', email).run();
    if (!approve) await env.DB.prepare('DELETE FROM sessions WHERE email = ?').bind(email).run();
    await mail(env, email,
      approve ? 'You’re approved on helloamar' : 'Your helloamar request',
      approve ? `Hi ${row.name}, you’re approved. Open ${env.SITE_URL} and you’ll be in.`
              : `Hi ${row.name}, thanks for asking. I can’t give you access right now.`);
    return json({ ok: true });
  }
  return json({ error: 'Not found.' }, 404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const p = url.pathname;
    const post = request.method === 'POST';
    const admin = env.ADMIN_EMAIL.toLowerCase();
    try {
      await init(env.DB);
      const origin = request.headers.get('origin');
      if (post && origin && origin !== url.origin) return json({ error: 'Blocked.' }, 403);
      if (p === '/api/request' && post) return await requestCode(request, env, admin);
      if (p === '/api/verify' && post) return await verify(request, env, admin);
      if (p === '/api/logout' && post) {
        const t = getCookie(request, 'sid');
        if (t) await env.DB.prepare('DELETE FROM sessions WHERE hash = ?').bind(await sha(t)).run();
        return json({ ok: true }, 200, { 'set-cookie': sidCookie('', 0) });
      }
      if (p === '/api/me') {
        const s = await getSession(request, env);
        if (!s) return json({ error: 'none' }, 401);
        return json({ status: s.status, name: s.name, email: s.email, admin: s.admin === 1 && s.email === admin });
      }
      if (p.startsWith('/api/admin/')) return await adminApi(request, env, admin, p);
      if (p === '/admin') return page(env, request, '/admin.html');
      if (p === '/') {
        const s = await getSession(request, env);
        return page(env, request, s && s.status === 'approved' ? '/site.html' : '/gate.html');
      }
      return new Response('Not found', { status: 404 });
    } catch (e) {
      return json({ error: 'Something went wrong. Try again.' }, 500);
    }
  },
};
