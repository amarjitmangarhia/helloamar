import { useParams } from 'react-router'
import { BackPill } from '../components/BackPill'
import { projects } from '../content/projects'
import { site } from '../content/site'
import { projectPages } from './projects/registry'

// Renders the real page for a finished project, otherwise a placeholder.
export default function ProjectPage() {
  const { slug } = useParams()
  const Page = slug ? projectPages[slug] : undefined
  if (Page) return <Page />

  const p = projects.find((x) => x.slug === slug)
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <BackPill title={p?.title ?? 'Not found'} category={p?.category} />
      <title>{`${p?.title ?? 'Not found'} — ${site.name}`}</title>
      <p className="font-mono text-sm text-muted">{p ? 'This project is being built next.' : 'No such project.'}</p>
    </main>
  )
}
