import { useState } from 'react'
import { Link } from 'react-router'
import { Canvas } from '@react-three/fiber'
import { ParticleField } from '../scenes/home/ParticleField'
import { homeSceneConfig, shapeNames } from '../scenes/home/config'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { site } from '../content/site'
import { about, contactCta, hero, projectRows } from '../content/home'

const mono = 'font-mono text-xs text-muted'
const shell = 'mx-auto w-full max-w-[1240px]'

export default function Home() {
  const [active, setActive] = useState(0)
  const [row, setRow] = useState(0)
  const reduced = useReducedMotion()

  return (
    <>
      <title>{`${site.name} — Software developer`}</title>

      {/* fixed full-screen particle scene */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        <Canvas camera={{ fov: 35, near: 0.1, far: 50, position: [0, 0, 6] }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
          <ParticleField config={homeSceneConfig} reducedMotion={reduced} onActive={setActive} />
        </Canvas>
      </div>

      <main className="relative z-[1]">
        {/* 1 Hero */}
        <section id="top" data-shape="0" className="flex min-h-svh flex-col justify-center px-6 pt-[120px] pb-16 md:pb-20">
          <div className={`${shell} flex max-lg:text-panel max-w-[680px] flex-col gap-6`}>
            <span className={mono}>{hero.eyebrow(site.city)}</span>
            <h1 className="m-0 text-[clamp(40px,8vw,124px)] leading-[.92] font-extrabold tracking-[-.05em] text-balance">{hero.title}</h1>
            <p className="m-0 max-w-[480px] text-[clamp(17px,1.5vw,21px)] leading-[1.55] text-pretty text-text-2">{hero.lead}</p>
            <div className="flex flex-wrap gap-3">
              <a href="#projects" className="lift-sm rounded-full bg-ink px-6 py-[15px] text-[15px] font-bold text-bg shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_12px_24px_-12px_rgba(30,31,36,.6)]">
                Explore projects
              </a>
              <Link to="/contact" className="lift-sm rounded-full border border-ink/30 px-6 py-[15px] text-[15px] font-bold">
                Get in touch
              </Link>
            </div>
          </div>
          <div className={`${shell} mt-16 flex flex-wrap items-center justify-between gap-4 max-lg:text-panel`}>
            <span className={mono}>Scroll to explore ↓</span>
            <Link to="/projects/black-hole" className="rounded-full border border-ink/[.14] bg-white/70 px-4 py-2 text-[13px] font-bold">
              {hero.newPill}
            </Link>
          </div>
        </section>

        {/* 2 Selected projects */}
        <section id="projects" data-shape="1" className="px-6 py-20 md:py-[120px]">
          <div className={`${shell} flex flex-col gap-10 max-lg:text-panel`}>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="flex flex-col gap-3">
                <span className={mono}>01 · Selected projects</span>
                <h2 className="m-0 text-[clamp(40px,5.6vw,80px)] leading-[.98] font-extrabold tracking-[-.03em]">Things you can explore</h2>
              </div>
              <Link to="/projects" className="border-b-2 border-ink pb-0.5 text-[15px] font-bold whitespace-nowrap">
                All projects →
              </Link>
            </div>

            <div className="grid gap-10 [grid-template-columns:repeat(auto-fit,minmax(min(100%,460px),1fr))]">
              <ul className="m-0 flex list-none flex-col border-t border-ink/[.12] p-0">
                {projectRows.map((p, i) => (
                  <li key={p.slug} className="border-b border-ink/[.12]">
                    <Link
                      to={`/projects/${p.slug}`}
                      onMouseEnter={() => setRow(i)}
                      onFocus={() => setRow(i)}
                      className="block py-4"
                    >
                      <span className="flex items-baseline gap-4">
                        <span className={mono}>0{i + 1}</span>
                        <span className={`flex-1 text-[clamp(26px,3vw,40px)] font-extrabold tracking-[-.02em] ${row === i ? 'text-ink' : 'text-[#80818a]'}`}>{p.title}</span>
                        <span className={`${mono} whitespace-nowrap`}>{p.category}</span>
                      </span>
                      {row === i && <span className="mt-2 block max-w-[420px] pl-[42px] text-[15px] leading-[1.5] text-pretty text-text-2">{p.description}</span>}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="sticky top-[110px] hidden self-start md:block">
                <div className="media-slot flex aspect-[16/10] flex-col justify-end gap-1 rounded-[24px] p-5">
                  <span className={mono}>{projectRows[row].category}</span>
                  <span className="text-xl font-bold">{projectRows[row].title}</span>
                </div>
                <div className="mt-3 flex items-baseline justify-between px-1">
                  <span className={mono}>Live preview · {projectRows[row].title}</span>
                  <Link to={`/projects/${projectRows[row].slug}`} className="text-[13px] font-bold">
                    Open project →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 About: left column stays empty so the helix shows */}
        <section id="about" data-shape="2" className="flex min-h-svh items-center px-6 py-20 md:py-[120px]">
          <div className={`${shell} grid gap-10 [grid-template-columns:repeat(auto-fit,minmax(min(100%,480px),1fr))]`}>
            <div className="hidden min-[1048px]:block" />
            <div className="flex flex-col gap-7 max-lg:text-panel">
              <div className="flex items-center gap-5">
                <div className="media-slot flex size-[72px] shrink-0 items-center justify-center rounded-full font-mono text-[10px] text-placeholder">portrait</div>
                <span className={mono}>{about.eyebrow}</span>
              </div>
              <p className="m-0 text-[clamp(24px,2.5vw,34px)] leading-[1.3] font-semibold text-pretty">{about.statement}</p>
              <p className="m-0 text-[17px] leading-[1.55] text-pretty text-text-2">{about.body}</p>
              <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))]">
                {about.skills.map((s) => (
                  <div key={s.title} className="flex flex-col gap-2 border-t border-ink/10 pt-3">
                    <span className="text-sm font-bold">{s.title}</span>
                    <span className={mono}>{s.stack}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col rounded-[22px] bg-[rgba(30,31,36,.05)] p-1">
                {about.rows(site.school).map(([k, v]) => (
                  <div key={k} className="grid gap-4 px-4 py-3 text-[15px] [grid-template-columns:110px_1fr]">
                    <span className={`${mono} pt-0.5`}>{k}</span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <a href={site.cvHref} className="rounded-full bg-ink px-6 py-[13px] text-sm font-bold text-bg">
                  Download CV ↓
                </a>
                <a href={site.socials.find((s) => s.label === 'GitHub')?.href ?? '#'} className="rounded-full border border-ink/30 px-6 py-[13px] text-sm font-bold">
                  GitHub ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Contact CTA */}
        <section id="contact" data-shape="3" className="flex min-h-svh flex-col justify-center px-6 pt-20 pb-10 md:pt-[120px]">
          <div className={`${shell} flex flex-col items-center gap-8 text-center max-lg:text-panel`}>
            <span className={mono}>{contactCta.eyebrow}</span>
            <h2 className="m-0 text-[clamp(44px,7vw,108px)] leading-[.98] font-extrabold tracking-[-.04em] text-balance">{contactCta.title}</h2>
            <Link
              to="/contact"
              className="lift-sm rounded-full bg-[#e8702a] px-[30px] py-4 text-[clamp(18px,2.2vw,26px)] font-extrabold text-ink shadow-[0_20px_60px_-20px_rgba(232,112,42,.6)]"
            >
              {contactCta.cta}
            </Link>
            <div className="flex flex-wrap justify-center gap-6 text-[15px] font-semibold">
              {site.socials
                .filter((s) => s.label === 'GitHub' || s.label === 'LinkedIn')
                .map((s) => (
                  <a key={s.label} href={s.href}>
                    {s.label} ↗
                  </a>
                ))}
            </div>
          </div>
          <div className={`${shell} mt-16 flex flex-wrap justify-between gap-4 font-mono text-xs text-muted md:mt-[120px]`}>
            <span>
              © {site.year} {site.name}
            </span>
            <span>{contactCta.footerRight}</span>
          </div>
        </section>
      </main>

      {/* shape indicator */}
      <div className="pointer-events-none fixed bottom-[22px] left-6 z-[5] flex items-center gap-2.5 font-mono text-xs text-text-2 max-sm:hidden">
        <span className="font-medium text-ink">0{active + 1}</span>
        <span className="h-px w-7 bg-ink" />
        <span>{shapeNames[active]}</span>
      </div>
    </>
  )
}
