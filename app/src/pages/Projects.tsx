import { Link } from 'react-router'
import { projects } from '../content/projects'
import { site } from '../content/site'

// PLACEHOLDER hub. The real designed hub (categories, cards, previews) is built after the projects.
export default function Projects() {
  return (
    <main className="mx-auto min-h-screen max-w-[1240px] px-6 pt-36 pb-24">
      <title>{`Projects — ${site.name}`}</title>
      <span className="font-mono text-[13px] text-muted">5 categories · 7 projects</span>
      <h1 className="mt-4 mb-10 text-[clamp(48px,7vw,96px)] leading-[.95] font-extrabold tracking-[-.045em] text-balance">Projects</h1>
      <p className="mb-10 max-w-xl text-text-2">
        Being added one at a time. Each one below gets its own page as it is finished.
      </p>
      <ul className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
        {projects.map((p) => (
          <li key={p.slug}>
            <Link to={`/projects/${p.slug}`} className="glass lift flex flex-col gap-2 rounded-[24px] p-6">
              <span className="font-mono text-xs text-muted">{p.category} · {p.status === 'done' ? 'live' : 'coming soon'}</span>
              <span className="text-2xl font-bold tracking-[-.02em]">{p.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
