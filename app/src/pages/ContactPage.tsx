import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Canvas } from '@react-three/fiber'
import { ContactScene, type ContactSceneHandle } from '../scenes/contact/ContactScene'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { CONTACT_TOPICS, sendMessage, timeInZone, validateContact, type ContactErrors } from '../lib/contact'
import { contact, contactSent, ownerTimezone } from '../content/contact'
import { site } from '../content/site'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const inputCls =
  'w-full rounded-[14px] border border-[#ecebe6]/[.12] bg-[#ecebe6]/[.05] px-4 py-3.5 text-base text-[#ecebe6] outline-none placeholder:text-[#80818a] focus:border-[#9fd8e0] focus:bg-[#ecebe6]/[.08] aria-[invalid=true]:border-[#f19a82]'

export default function ContactPage() {
  const { search } = useLocation()
  const preview = new URLSearchParams(search).has('preview') // ?preview=1: no form UI, calmer ambient scene
  const reduced = useReducedMotion()
  const sceneRef = useRef<ContactSceneHandle>(null)

  const [clock, setClock] = useState('')
  useEffect(() => {
    const tick = () => setClock(timeInZone(ownerTimezone))
    tick()
    const id = setInterval(tick, 15000)
    return () => clearInterval(id)
  }, [])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState<(typeof CONTACT_TOPICS)[number]>(CONTACT_TOPICS[0])
  const [message, setMessage] = useState('')
  const [botcheck, setBotcheck] = useState('') // honeypot: real visitors never fill this
  const [errors, setErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const lastPulse = useRef(0)

  const typingPulse = () => {
    if (reduced || preview) return
    const now = performance.now()
    if (now - lastPulse.current < 140) return
    lastPulse.current = now
    sceneRef.current?.burst(0.45, 'sky')
  }

  const pickTopic = (t: (typeof CONTACT_TOPICS)[number]) => {
    setTopic(t)
    if (!reduced && !preview) sceneRef.current?.burst(0.7, 'butter')
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const found = validateContact(name, email, message)
    setErrors(found)
    if (Object.keys(found).length) {
      if (!reduced) sceneRef.current?.burst(0.8, 'coral')
      return
    }
    if (botcheck) {
      // honeypot tripped: pretend it worked, send nothing
      setStatus('sent')
      return
    }
    setStatus('sending')
    if (!reduced) sceneRef.current?.sendBeam()
    else sceneRef.current?.burst(1, 'butter')
    try {
      await sendMessage({ name, email, topic, message })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const reset = () => {
    setName('')
    setEmail('')
    setTopic(CONTACT_TOPICS[0])
    setMessage('')
    setErrors({})
    setStatus('idle')
  }

  const sending = status === 'sending'
  const sent = status === 'sent'

  return (
    <div className="relative min-h-screen bg-[#07080c] text-[#ecebe6] selection:bg-butter selection:text-[#07080c]">
      <title>{`Contact — ${site.name}`}</title>
      <div className="pointer-events-none fixed inset-0 z-0">
        <Canvas flat camera={{ fov: 40, near: 0.1, far: 200, position: [0, 0, 9] }} dpr={[1, 2]} gl={{ antialias: true }}>
          <color attach="background" args={['#07080c']} />
          <ContactScene ref={sceneRef} preview={preview} reducedMotion={reduced} />
        </Canvas>
      </div>

      {!preview && (
        <main className="relative z-[1] mx-auto grid min-h-screen max-w-[1240px] items-center gap-10 px-6 py-[130px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr))] md:gap-[clamp(40px,6vw,96px)]">
          <div className="flex flex-col gap-6">
            <span className="font-mono text-[13px] text-butter">{contact.eyebrow}</span>
            <h1 className="m-0 text-[clamp(48px,8.4vw,104px)] leading-[.9] font-extrabold tracking-[-.055em] text-balance">{contact.title}</h1>
            <p className="m-0 max-w-[440px] text-lg leading-[1.6] text-pretty text-[#c9c8c2]">{contact.lead}</p>
            <div className="flex flex-col border-t border-[#ecebe6]/10">
              <div className="grid gap-4 border-b border-[#ecebe6]/10 py-3.5 text-[15px] [grid-template-columns:120px_1fr]">
                <span className="pt-0.5 font-mono text-xs text-[#a9aab2]">Open to</span>
                <span>{contact.openTo}</span>
              </div>
              <div className="grid gap-4 border-b border-[#ecebe6]/10 py-3.5 text-[15px] [grid-template-columns:120px_1fr]">
                <span className="pt-0.5 font-mono text-xs text-[#a9aab2]">Reply time</span>
                <span>{contact.replyTime}</span>
              </div>
              <div className="grid gap-4 border-b border-[#ecebe6]/10 py-3.5 text-[15px] [grid-template-columns:120px_1fr]">
                <span className="pt-0.5 font-mono text-xs text-[#a9aab2]">My time</span>
                <span className="font-mono">
                  {clock} in {site.city}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {site.socials
                .filter((s) => s.label === 'GitHub' || s.label === 'LinkedIn')
                .map((s) => (
                  <a key={s.label} href={s.href} className="rounded-full border border-[#ecebe6]/30 px-5 py-3 text-sm font-bold">
                    {s.label} ↗
                  </a>
                ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-[#ecebe6]/10 bg-[rgba(14,15,20,.7)] p-[clamp(22px,3vw,36px)] backdrop-blur-[20px]">
            {sent ? (
              <div className="flex flex-col items-center gap-5 py-10 text-center">
                <span className="flex size-16 items-center justify-center rounded-full bg-butter text-2xl font-black text-[#07080c]">✓</span>
                <span className="font-mono text-xs text-[#a9aab2]">Transmission received · {timeInZone(ownerTimezone)}</span>
                <h2 className="m-0 text-3xl font-extrabold tracking-[-.03em]">Signal sent.</h2>
                <p className="m-0 max-w-sm text-[15px] leading-[1.6] text-[#c9c8c2]">{contactSent(name.trim().split(' ')[0] || 'there')}</p>
                <div className="mt-2 flex flex-wrap justify-center gap-3">
                  <Link to="/projects" className="rounded-full bg-[#ecebe6] px-5 py-3 text-sm font-bold text-[#07080c]">
                    Explore projects while you wait
                  </Link>
                  <button onClick={reset} className="cursor-pointer rounded-full border-0 bg-transparent px-5 py-3 text-sm font-bold text-[#ecebe6] underline">
                    Send another
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
                <div className="flex items-center justify-between font-mono text-xs text-[#a9aab2]">
                  <span className="flex items-center gap-2">
                    <span className="size-[7px] rounded-full bg-sky" />
                    New transmission
                  </span>
                  <span>{sending ? 'Transmitting…' : 'Ready'}</span>
                </div>

                <input
                  type="text"
                  name="botcheck"
                  value={botcheck}
                  onChange={(e) => setBotcheck(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-px w-px opacity-0"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm font-semibold">
                    Name
                    <input
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        typingPulse()
                        if (errors.name) setErrors((er) => ({ ...er, name: undefined }))
                      }}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-err' : undefined}
                      className={inputCls}
                    />
                    {errors.name && (
                      <span id="name-err" className="text-[13px] text-coral">
                        {errors.name}
                      </span>
                    )}
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold">
                    Email
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        typingPulse()
                        if (errors.email) setErrors((er) => ({ ...er, email: undefined }))
                      }}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-err' : undefined}
                      className={inputCls}
                    />
                    {errors.email && (
                      <span id="email-err" className="text-[13px] text-coral">
                        {errors.email}
                      </span>
                    )}
                  </label>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold">What's it about?</span>
                  <div role="radiogroup" aria-label="What's it about?" className="flex flex-wrap gap-2">
                    {CONTACT_TOPICS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        role="radio"
                        aria-checked={topic === t}
                        onClick={() => pickTopic(t)}
                        className={`cursor-pointer rounded-full border px-3.5 py-2 text-[13px] font-semibold ${
                          topic === t ? 'border-[#ecebe6] bg-[#ecebe6] text-[#07080c]' : 'border-[#ecebe6]/[.16] bg-transparent text-[#ecebe6]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex flex-col gap-2 text-sm font-semibold">
                  Message
                  <textarea
                    value={message}
                    maxLength={1000}
                    onChange={(e) => {
                      setMessage(e.target.value)
                      typingPulse()
                      if (errors.message) setErrors((er) => ({ ...er, message: undefined }))
                    }}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-err' : undefined}
                    className={`${inputCls} min-h-[150px] resize-y`}
                  />
                  <span className="self-end font-mono text-xs text-[#80818a]">{message.length} / 1000</span>
                  {errors.message && (
                    <span id="message-err" className="text-[13px] text-coral">
                      {errors.message}
                    </span>
                  )}
                </label>

                {status === 'error' && (
                  <p role="alert" className="m-0 text-[13px] text-coral">
                    Couldn't send. Please try again in a moment.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full cursor-pointer rounded-full border-0 bg-butter py-4 text-[17px] font-extrabold text-[#07080c] disabled:cursor-default disabled:opacity-70"
                >
                  {sending ? 'Transmitting…' : 'Send signal →'}
                </button>
                <p className="m-0 text-[13px] text-[#80818a]">Your message goes straight to my inbox. I don't store it anywhere else, and I won't share your email.</p>
              </form>
            )}
          </div>
        </main>
      )}
      <div aria-live="polite" className="sr-only">
        {sent ? 'Signal sent.' : ''}
      </div>
    </div>
  )
}
