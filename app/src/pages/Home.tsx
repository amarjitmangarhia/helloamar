import { lazy, Suspense } from 'react'
import { Link } from 'react-router'
import { WorkSection } from '../sections/WorkSection'
import { site } from '../content/site'

const HeroPlanet = lazy(() => import('../scenes/heroPlanet/HeroPlanet').then((m) => ({ default: m.HeroPlanet })))

/** Full homepage (v2: simple + editorial). The site-wide TopNav renders the header. */
export default function Home() {
  return (
    <>
      <title>{`${site.name} — Software developer`}</title>
      <main id="top">
        <Hero />
        <WorkSection />
        <About />
        <ContactCta />
      </main>
      <Footer />
    </>
  )
}

function Hero() {
  return (
    <section className="px-6 pt-[clamp(56px,9vw,120px)] pb-[clamp(56px,8vw,104px)]">
      <div className="mx-auto grid max-w-[1120px] items-center gap-[clamp(32px,5vw,72px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))]">
        <div className="flex flex-col gap-7">
          <span className="font-mono text-[13px] text-muted">Software developer · {site.city}</span>
          <h1 className="m-0 text-[clamp(40px,5.4vw,74px)] leading-[1.02] font-bold tracking-[-.04em]">
            Hi, I'm {site.name}. I build interactive things about <span className="text-accent-text">space</span>, the ocean and old mysteries.
          </h1>
          <p className="m-0 max-w-[500px] text-lg leading-[1.6] text-body">
            I studied software development and I code because I love it. Each project here is something you can play with, and learn a little from.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#work" className="rounded-full bg-ink px-6 py-[15px] text-[15px] font-bold text-bg transition-colors hover:bg-accent hover:text-ink">
              See my work
            </a>
            <Link to="/contact" className="rounded-full border border-ink/22 px-6 py-[15px] text-[15px] font-bold hover:border-ink hover:text-ink">
              Get in touch
            </Link>
          </div>
        </div>
        {/* Reserve the square so layout doesn't jump while three.js loads */}
        <Suspense fallback={<div className="aspect-square w-full max-w-[520px] justify-self-center" />}>
          <HeroPlanet density={typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches ? 'low' : 'medium'} />
        </Suspense>
      </div>
    </section>
  )
}

const SKILLS = [
  ['Frontend', 'JavaScript, TypeScript, React, CSS'],
  ['Backend', 'Node.js, Python, SQL'],
  ['Creative code', 'three.js, WebGL, GLSL'],
  ['Learning now', 'Shaders, data structures'],
]

function About() {
  const github = site.socials.find((s) => s.label === 'GitHub')?.href ?? '#'
  const linkedin = site.socials.find((s) => s.label === 'LinkedIn')?.href ?? '#'
  return (
    <section id="about" className="border-t border-ink/8 px-6 py-[clamp(56px,8vw,96px)]">
      <div className="mx-auto grid max-w-[1120px] gap-10 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
        <div className="flex flex-col gap-5">
          <h2 className="m-0 text-[clamp(32px,3.6vw,48px)] font-bold tracking-[-.035em]">About</h2>
          <div className="media-slot flex h-24 w-24 items-center justify-center rounded-full font-mono text-[10px] text-placeholder">portrait</div>
        </div>
        <div className="flex min-w-[min(100%,300px)] flex-col gap-7 md:col-span-2">
          <p className="m-0 text-[clamp(20px,2vw,26px)] leading-[1.45] font-medium tracking-[-.015em]">
            Coding turned into my favourite thing to do. I like figuring out how something works, then building my own version of it. I'm looking for
            my first developer role, on a team where I can learn fast and ship real things.
          </p>
          <dl className="m-0 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))]">
            {SKILLS.map(([k, v]) => (
              <div key={k} className="flex flex-col gap-1.5 bg-bg p-[18px]">
                <dt className="font-mono text-xs text-muted">{k}</dt>
                <dd className="m-0 text-[15px] leading-normal font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap gap-6 text-[15px] font-bold">
            <a href={site.cvHref} download className="border-b-2 border-ink pb-0.5">
              Download CV ↓
            </a>
            <a href={github} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
            <a href={linkedin} target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactCta() {
  return (
    <section className="border-t border-ink/8 px-6 py-[clamp(56px,8vw,96px)]">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-end justify-between gap-8">
        <div className="flex max-w-[640px] flex-col gap-3.5">
          <span className="font-mono text-[13px] text-muted">Contact</span>
          <h2 className="m-0 text-[clamp(36px,5vw,68px)] leading-none font-bold tracking-[-.045em]">Have a role or a project in mind?</h2>
        </div>
        <Link to="/contact" className="rounded-full bg-accent px-7 py-[18px] text-[17px] font-extrabold text-ink transition-transform hover:-translate-y-0.5 hover:text-ink">
          Send me a message →
        </Link>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-ink/8">
      <div className="mx-auto flex max-w-[1120px] flex-wrap justify-between gap-4 p-6 font-mono text-xs text-muted">
        <span>© {site.year} {site.name}</span>
        <span>Built with three.js</span>
      </div>
    </footer>
  )
}
