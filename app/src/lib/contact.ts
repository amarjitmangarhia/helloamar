export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const CONTACT_TOPICS = ['Job opportunity', 'Freelance project', 'Collaboration', 'Space talk', 'Just saying hi'] as const
export type ContactTopic = (typeof CONTACT_TOPICS)[number]

export type ContactErrors = Partial<Record<'name' | 'email' | 'message', string>>

export function validateContact(name: string, email: string, message: string): ContactErrors {
  const errors: ContactErrors = {}
  if (!name.trim()) errors.name = 'Please add your name.'
  if (!EMAIL_RE.test(email.trim())) errors.email = "That email doesn't look right."
  if (message.trim().length < 10) errors.message = 'A little more detail, please (10 characters minimum).'
  return errors
}

export type ContactPayload = { name: string; email: string; topic: string; message: string }

/**
 * Sends the message through Web3Forms so the owner's email is never in the frontend.
 * Needs VITE_FORM_KEY set (see .env.example) — throws clearly if it isn't configured yet.
 */
export async function sendMessage(payload: ContactPayload): Promise<void> {
  const key = import.meta.env.VITE_FORM_KEY
  if (!key) throw new Error('VITE_FORM_KEY is not set')
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ access_key: key, subject: `Portfolio: ${payload.topic}`, from_name: payload.name, ...payload }),
  })
  if (!res.ok) throw new Error('send failed')
}

/** "My time" clock for the owner's IANA time zone, e.g. "14:05". */
export function timeInZone(timeZone: string, now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', hour12: false }).format(now)
}
