// Notes: posts + images for the helloamar site. Drafts and published notes live in D1.
const J = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const rid = () => [...crypto.getRandomValues(new Uint8Array(5))].map(b => b.toString(16).padStart(2, '0')).join('');
let ready = null;

function init(db) {
  if (!ready) {
    ready = db.batch([
      db.prepare(`CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY, title TEXT, body TEXT, cat TEXT, status TEXT DEFAULT 'draft', featured INTEGER DEFAULT 0, image_id TEXT, alt TEXT, created INTEGER, updated INTEGER, published_at INTEGER)`),
      db.prepare(`CREATE TABLE IF NOT EXISTS images (id TEXT PRIMARY KEY, mime TEXT, data TEXT, w INTEGER, h INTEGER, created INTEGER)`),
    ]).catch(e => { ready = null; throw e; });
  }
  return ready;
}

async function dropImage(env, id) {
  if (!id) return;
  const u = await env.DB.prepare('SELECT COUNT(*) AS n FROM posts WHERE image_id = ?').bind(id).first();
  if (!u.n) await env.DB.prepare('DELETE FROM images WHERE id = ?').bind(id).run();
}

export async function handlePosts(request, env, admin, p, getSession) {
  const mine = p === '/api/posts' || p.startsWith('/api/posts/') || p.startsWith('/img/') || p.startsWith('/api/admin/post') || p === '/api/admin/image';
  if (!mine) return null;
  await init(env.DB);
  const s = await getSession(request, env);
  const isAdmin = !!s && s.admin === 1 && s.email === admin;
  const member = isAdmin || (!!s && s.status === 'approved');
  if (!member) return p.startsWith('/img/') ? new Response('Forbidden', { status: 403 }) : J({ error: 'Not allowed.' }, 403);
  const post = request.method === 'POST';

  if (p === '/api/posts') {
    const { results } = await env.DB.prepare(`SELECT id, title, cat, image_id, featured, published_at, substr(body, 1, 160) AS excerpt FROM posts WHERE status = 'published' ORDER BY published_at DESC LIMIT 200`).all();
    return J({ items: results });
  }
  if (p.startsWith('/api/posts/')) {
    const r = await env.DB.prepare('SELECT id, title, body, cat, image_id, alt, published_at, status FROM posts WHERE id = ?').bind(p.slice(11)).first();
    if (!r || (r.status !== 'published' && !isAdmin)) return J({ error: 'Not found.' }, 404);
    return J({ post: r });
  }
  if (p.startsWith('/img/')) {
    const r = await env.DB.prepare('SELECT mime, data FROM images WHERE id = ?').bind(p.slice(5)).first();
    if (!r) return new Response('Not found', { status: 404 });
    const bin = Uint8Array.from(atob(r.data), c => c.charCodeAt(0));
    return new Response(bin, { headers: { 'content-type': r.mime, 'cache-control': 'private, max-age=86400', 'x-content-type-options': 'nosniff' } });
  }

  if (!isAdmin) return J({ error: 'Not allowed.' }, 403);

  if (p === '/api/admin/posts') {
    const { results } = await env.DB.prepare('SELECT id, title, cat, status, featured, image_id, updated, published_at FROM posts ORDER BY updated DESC LIMIT 300').all();
    return J({ items: results });
  }
  if (p === '/api/admin/post/save' && post) {
    const b = await request.json().catch(() => ({}));
    const title = String(b.title || '').trim().slice(0, 200);
    const body = String(b.body || '').slice(0, 50000);
    const cat = String(b.cat || '').trim().slice(0, 40);
    const alt = String(b.alt || '').slice(0, 300);
    const status = b.status === 'published' ? 'published' : 'draft';
    const featured = b.featured ? 1 : 0;
    const imageId = b.image_id ? String(b.image_id) : null;
    if (status === 'published' && (!title || !body.trim() || !cat)) return J({ error: 'Add a title, text and a category before publishing.' }, 400);
    if (!title && !body.trim()) return J({ error: 'Nothing to save yet.' }, 400);
    const now = Date.now();
    let id = String(b.id || '');
    const old = id ? await env.DB.prepare('SELECT image_id, published_at FROM posts WHERE id = ?').bind(id).first() : null;
    if (!old) id = rid();
    const pubAt = status === 'published' ? ((old && old.published_at) || now) : (old ? old.published_at : null);
    if (old) {
      await env.DB.prepare('UPDATE posts SET title=?, body=?, cat=?, status=?, featured=?, image_id=?, alt=?, updated=?, published_at=? WHERE id=?')
        .bind(title, body, cat, status, featured, imageId, alt, now, pubAt, id).run();
    } else {
      await env.DB.prepare('INSERT INTO posts (id, title, body, cat, status, featured, image_id, alt, created, updated, published_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
        .bind(id, title, body, cat, status, featured, imageId, alt, now, now, pubAt).run();
    }
    if (featured && status === 'published') await env.DB.prepare('UPDATE posts SET featured = 0 WHERE id != ?').bind(id).run();
    if (old && old.image_id && old.image_id !== imageId) await dropImage(env, old.image_id);
    return J({ ok: true, id, status, updated: now });
  }
  if (p === '/api/admin/post/delete' && post) {
    const b = await request.json().catch(() => ({}));
    const r = await env.DB.prepare('SELECT image_id FROM posts WHERE id = ?').bind(String(b.id || '')).first();
    if (!r) return J({ error: 'Not found.' }, 404);
    await env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(String(b.id)).run();
    await dropImage(env, r.image_id);
    return J({ ok: true });
  }
  if (p.startsWith('/api/admin/post/') && !post) {
    const r = await env.DB.prepare('SELECT id, title, body, cat, status, featured, image_id, alt FROM posts WHERE id = ?').bind(p.slice(16)).first();
    return r ? J({ post: r }) : J({ error: 'Not found.' }, 404);
  }
  if (p === '/api/admin/image' && post) {
    const b = await request.json().catch(() => ({}));
    const mime = String(b.mime || ''), data = String(b.data || '');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(mime)) return J({ error: 'Use a JPG, PNG or WebP image.' }, 400);
    if (!/^[A-Za-z0-9+/=]+$/.test(data) || data.length > 1500000) return J({ error: 'Image is too large after shrinking.' }, 400);
    const id = rid() + rid();
    await env.DB.prepare('INSERT INTO images (id, mime, data, w, h, created) VALUES (?,?,?,?,?,?)')
      .bind(id, mime, data, parseInt(b.w) || 0, parseInt(b.h) || 0, Date.now()).run();
    return J({ id });
  }
  return J({ error: 'Not found.' }, 404);
}
