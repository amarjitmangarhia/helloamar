import { useParams } from 'react-router'
import { BackPill } from '../components/BackPill'
import { projects } from '../content/projects'

// PLACEHOLDER: replaced per project, one at a time, by a real scene page.
export default function ProjectPage() {
  const { slug } = useParams()
  const p = projects.find((x) => x.slug === slug)
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <BackPill title={p?.title ?? 'Not found'} category={p?.category} />
      <title>{`${p?.title ?? 'Not found'} — Your Name`}</title>
      <p className="font-mono text-sm text-muted">{p ? 'This project is being built next.' : 'No such project.'}</p>
    </main>
  )
}
