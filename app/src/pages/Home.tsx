import { useState, type CSSProperties } from 'react'
import { Link } from 'react-router'
import { Canvas } from '@react-three/fiber'
import { ParticleField } from '../scenes/home/ParticleField'
import { homeSceneConfig, shapeNames } from '../scenes/home/config'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { site } from '../content/site'
import { about, hero, learning, skills } from '../content/home'

const mono = 'font-mono text-xs text-muted'
const h2 = 'm-0 text-[clamp(36px,5vw,64px)] leading-none font-extrabold tracking-[-.04em]'
const shell = 'mx-auto w-full max-w-[1240px]'
const tileShadow = 'shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_20px_40px_-26px_rgba(30,31,36,.3)]'

export default function Home() {
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()

  return (
    <>
      <title>{`${site.name} — Software developer`}</title>

      {/* fixed full-screen particle scene */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        <Canvas
          camera={{ fov: 35, near: 0.1, far: 50, position: [0, 0, 6] }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <ParticleField config={homeSceneConfig} reducedMotion={reduced} onActive={setActive} />
        </Canvas>
      </div>

      <main className="relative z-[1]">
        {/* 1 Hero */}
        <section id="top" data-shape="0" className="flex min-h-svh items-end px-6 pt-[120px] pb-14 md:items-center md:pb-20">
          <div className={shell}>
            <div className="flex max-w-[700px] flex-col gap-7">
              <div className="flex flex-wrap gap-3.5 font-mono text-[13px] text-muted">
                <span>Portfolio / {site.year}</span>
                <span>{site.city}</span>
              </div>
              <h1 className="m-0 flex flex-col items-start gap-5">
                <span className="rise inline-flex items-center gap-2.5 rounded-full bg-ink py-2 pr-5 pl-4 text-[clamp(15px,1.4vw,19px)] font-extrabold tracking-[-.02em] text-bg">
                  <span className="size-2 rounded-full bg-seafoam" />
                  {hero.badge(site.name)}
                </span>
                <span className="sr-only">. </span>
                <span className="text-[clamp(32px,5.2vw,74px)] leading-[.98] font-extrabold tracking-[-.045em] text-balance">
                  <span className="rise block" style={{ '--d': '.08s' } as CSSProperties}>{hero.lineA}</span>
                  <span className="rise block text-coral-deep" style={{ '--d': '.16s' } as CSSProperties}>{hero.lineB}</span>
                </span>
              </h1>
              <p className="rise m-0 max-w-[520px] text-[clamp(17px,1.5vw,20px)] leading-[1.55] text-pretty text-text-2" style={{ '--d': '.26s' } as CSSProperties}>{hero.lead}</p>
              <div className="rise flex flex-wrap gap-3" style={{ '--d': '.34s' } as CSSProperties}>
                <a href="#work" className="lift-sm rounded-full bg-ink px-6 py-[15px] text-[15px] font-bold text-bg shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_12px_24px_-12px_rgba(30,31,36,.6)]">
                  What I do
                </a>
                <a href="#contact" className="lift-sm rounded-full border border-ink/10 bg-white/70 px-6 py-[15px] text-[15px] font-bold shadow-[inset_0_1px_0_#fff,0_10px_20px_-14px_rgba(30,31,36,.35)]">
                  Say hello
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 2 What I do */}
        <section id="work" data-shape="1" className="px-6 py-20 md:py-[120px]">
          <div className={`${shell} flex flex-col gap-12`}>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 className={h2}>What I do</h2>
              <span className="font-mono text-[13px] text-muted">Skills I use and keep improving</span>
            </div>
            <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
              {skills.map((s) => (
                <div key={s.n} className="glass flex flex-col gap-[18px] rounded-[30px] p-7">
                  <span className={mono}>{s.n}</span>
                  <span className="text-[26px] font-bold tracking-[-.02em]">{s.title}</span>
                  <p className="m-0 text-base leading-[1.55] text-pretty text-text-2">{s.text}</p>
                  <span className={`${mono} mt-auto`}>{s.stack}</span>
                </div>
              ))}
            </div>
            <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))]">
              <a href="#" className="glass lift flex flex-col gap-[18px] rounded-[30px] px-3.5 pt-3.5 pb-[22px]">
                <div className={`media-slot flex aspect-video items-center justify-center rounded-[20px] ${mono}`}>screenshot of this site</div>
                <div className="flex items-baseline justify-between gap-3 px-2">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-2xl font-bold tracking-[-.02em]">This website</span>
                    <span className="text-[15px] text-text-2">My first project here. Designed and built from scratch, source on GitHub.</span>
                  </div>
                  <span className={`${mono} whitespace-nowrap`}>Project 01 · {site.year}</span>
                </div>
              </a>
              <Link to="/projects" className="lift flex min-h-[220px] flex-col justify-between gap-6 rounded-[30px] bg-ink p-8 text-bg">
                <span className="font-mono text-xs text-[#b9bac1]">Projects 01–04</span>
                <span className="text-[clamp(28px,3vw,40px)] leading-[1.05] font-extrabold tracking-[-.03em]">
                  Scroll from Earth to the edge of the universe, then to the bottom of the sea
                </span>
                <span className="text-[15px] font-bold">Open the projects tab →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 3 About: left column stays empty so the particles show through */}
        <section id="about" data-shape="2" className="flex min-h-svh items-center px-6 py-20 md:py-[120px]">
          <div className={`${shell} grid gap-10 [grid-template-columns:repeat(auto-fit,minmax(min(100%,480px),1fr))]`}>
            <div className="hidden min-[1048px]:block" />
            <div className="glass flex flex-col gap-7 rounded-[32px] p-8">
              <div className="flex items-center gap-5">
                <div className="media-slot flex size-[88px] shrink-0 items-center justify-center rounded-full font-mono text-[10px] text-placeholder">portrait</div>
                <h2 className="m-0 text-[clamp(32px,4vw,48px)] leading-none font-extrabold tracking-[-.04em]">About me</h2>
              </div>
              <p className="m-0 text-[19px] leading-[1.6] text-pretty text-[#2e2f35]">{about.text}</p>
              <div className="flex flex-col border-t border-ink/10">
                {about.rows(site.school).map(([k, v]) => (
                  <div key={k} className="grid gap-4 border-b border-ink/10 py-3.5 text-[15px] [grid-template-columns:130px_1fr]">
                    <span className={`${mono} pt-0.5`}>{k}</span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
              <a href={site.cvHref} className="self-start border-b-2 border-ink pb-0.5 text-[15px] font-bold">Download CV</a>
            </div>
          </div>
        </section>

        {/* 4 Learning */}
        <section id="playground" data-shape="3" className="flex min-h-svh items-center px-6 py-20 md:py-[120px]">
          <div className={`${shell} flex flex-col gap-10`}>
            <div className="flex max-w-[560px] flex-col gap-4">
              <h2 className={h2}>Learning</h2>
              <p className="m-0 text-lg leading-[1.55] text-pretty text-text-2">What I'm working on right now. This list changes as I go.</p>
            </div>
            <div className="grid max-w-[820px] gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))]">
              {learning.map((t) => (
                <div key={t.label} className={`glass flex flex-col gap-2.5 rounded-3xl p-[22px] ${tileShadow}`}>
                  <span className={mono}>{t.label}</span>
                  <span className="text-lg leading-[1.35] font-bold">{t.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5 Contact */}
        <section id="contact" data-shape="4" className="flex min-h-svh flex-col justify-center px-6 pt-20 pb-10 md:pt-[120px]">
          <div className={`${shell} flex flex-col items-center gap-8 text-center`}>
            <span className="font-mono text-[13px] text-muted">Work, collabs, or just a hello</span>
            <h2 className="m-0 text-[clamp(48px,8vw,120px)] leading-[.95] font-extrabold tracking-[-.05em] text-balance">Let's make something.</h2>
            <a
              href={`mailto:${site.email}`}
              className="lift-sm rounded-full border border-ink/[.08] bg-[rgba(250,248,245,.8)] px-[30px] py-4 text-[clamp(20px,2.4vw,30px)] font-semibold backdrop-blur-[14px] shadow-[inset_0_1px_0_#fff,0_20px_40px_-24px_rgba(30,31,36,.4)]"
            >
              {site.email}
            </a>
            <div className="flex flex-wrap justify-center gap-6 text-[15px] font-semibold">
              {site.socials.map((s) => (
                <a key={s.label} href={s.href}>{s.label}</a>
              ))}
            </div>
          </div>
          <div className={`${shell} mt-16 md:mt-[120px] flex flex-wrap justify-between gap-4 font-mono text-xs text-muted`}>
            <span>© {site.year} {site.name}</span>
            <span>Made with three.js and too much coffee</span>
          </div>
        </section>
      </main>

      {/* shape indicator */}
      <div className="pointer-events-none fixed bottom-[22px] left-6 z-[5] flex items-center max-sm:hidden gap-2.5 font-mono text-xs text-text-2">
        <span className="font-medium text-ink">0{active + 1}</span>
        <span className="h-px w-7 bg-ink" />
        <span>{shapeNames[active]}</span>
      </div>
    </>
  )
}
