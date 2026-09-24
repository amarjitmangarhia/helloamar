import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router'
import { BackPill } from '../BackPill'

export type Stage = { label: string; tag: string; title: string; body: string }
export type Outro = { kicker: string; title: string; body: string; next: { to: string; label: string } }

type Props = {
  title: string
  subtitle: string
  category: string
  stages: Stage[]
  idx: number
  onGo: (i: number) => void
  accent: string // e.g. '#9fd8e0'
  outro?: Outro // the default "Next" outro section...
  customOutro?: ReactNode // ...or your own final section (e.g. Fermi's vote)
  pageBg?: string
  cardBg?: string
  bodyColor?: string
  preview: boolean
  hud?: ReactNode
  children: ReactNode // the <Canvas>, rendered fixed behind the text
}

/** Shared page frame for every scroll story: fixed canvas, 140vh sticky sections, stage rail, outro with "Next". */
export function StoryLayout({ title, subtitle, category, stages, idx, onGo, accent, outro, customOutro, pageBg = '#03050a', cardBg = 'rgba(3,8,16,.5)', bodyColor = '#d3dade', preview, hud, children }: Props) {
  return (
    <div
      className="relative min-h-screen bg-(--page) text-[#ecebe6] selection:bg-(--accent) selection:text-(--page)"
      style={{ '--page': pageBg, '--accent': accent } as CSSProperties}
    >
      <div className="pointer-events-none fixed inset-0 z-0">{children}</div>

      {!preview && (
        <>
          <BackPill dark title={title} subtitle={subtitle} category={category} />

          {hud && <div className="pointer-events-none fixed bottom-[22px] left-[clamp(20px,5vw,72px)] z-10 flex flex-wrap gap-8">{hud}</div>}

          <nav aria-label="Stages" className="fixed top-1/2 right-[18px] z-10 flex -translate-y-1/2 flex-col items-end gap-2">
            {stages.map((s, i) => (
              <button
                key={s.label}
                onClick={() => onGo(i)}
                aria-current={i === idx ? 'step' : undefined}
                className="flex cursor-pointer items-center gap-2.5 border-0 bg-transparent py-1 font-mono text-[11px] text-[#ecebe6]"
              >
                <span className="transition-opacity duration-300" style={{ opacity: i === idx ? 1 : 0.4 }}>
                  {s.label}
                </span>
                <span
                  className="h-0.5 rounded-sm transition-[width] duration-300"
                  style={{ width: i === idx ? 28 : 12, background: i === idx ? accent : 'rgba(236,235,230,.4)' }}
                />
              </button>
            ))}
          </nav>

          <main className="relative z-[1]">
            {stages.map((s) => (
              <section key={s.label} className="h-[140vh]">
                <div className="sticky top-0 box-border flex h-screen items-center px-[clamp(20px,5vw,72px)]">
                  <div
                    className="flex max-w-[460px] flex-col gap-4 rounded-[26px] border border-[#ecebe6]/10 p-7 backdrop-blur-[8px]"
                    style={{ background: cardBg }}
                  >
                    <span className="font-mono text-[13px]" style={{ color: accent }}>
                      {s.tag}
                    </span>
                    <h2 className="m-0 text-[clamp(36px,4.6vw,64px)] leading-none font-extrabold tracking-[-.04em] text-balance">{s.title}</h2>
                    <p className="m-0 text-[17px] leading-[1.6] text-pretty" style={{ color: bodyColor }}>
                      {s.body}
                    </p>
                  </div>
                </div>
              </section>
            ))}

            {customOutro}
            {!customOutro && outro && (
              <section className="box-border flex min-h-screen items-center justify-center px-6 py-[120px]">
                <div className="flex max-w-[720px] flex-col items-center gap-7 text-center">
                  <span className="font-mono text-[13px]" style={{ color: accent }}>
                    {outro.kicker}
                  </span>
                  <h2 className="m-0 text-[clamp(40px,6vw,88px)] leading-[.95] font-extrabold tracking-[-.045em] text-balance">{outro.title}</h2>
                  <p className="m-0 max-w-[520px] text-lg leading-[1.6] text-pretty" style={{ color: bodyColor }}>{outro.body}</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Link to={outro.next.to} className="rounded-full bg-[#ecebe6] px-6 py-[15px] text-[15px] font-bold text-[#03050a] transition-transform hover:-translate-y-0.5">
                      {outro.next.label}
                    </Link>
                    <Link to="/projects" className="rounded-full border border-[#ecebe6]/30 px-6 py-[15px] text-[15px] font-bold text-[#ecebe6]">
                      All projects
                    </Link>
                  </div>
                </div>
              </section>
            )}
          </main>
        </>
      )}
    </div>
  )
}
