import { Link } from 'react-router'

// Fixed top-left "← Projects" pill + top-right title, used on every project page.
export function BackPill({ title, subtitle, category }: { title: string; subtitle?: string; category?: string }) {
  return (
    <>
      <Link
        to={category ? `/projects#${category.toLowerCase()}` : '/projects'}
        className="glass fixed top-4 left-4 z-20 rounded-full px-4 py-2.5 text-sm font-bold"
      >
        ← Projects
      </Link>
      <div className="pointer-events-none fixed top-4 right-5 z-20 text-right">
        <div className="text-lg font-extrabold">{title}</div>
        {subtitle && <div className="font-mono text-xs text-muted">{subtitle}</div>}
      </div>
    </>
  )
}
