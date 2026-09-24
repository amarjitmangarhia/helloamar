import { Link } from 'react-router'

type Props = { title: string; subtitle?: string; category?: string; dark?: boolean }

// Fixed top-left "← Projects" pill + top-right title, used on every project page.
// `dark` = variant for the dark scroll-story pages.
export function BackPill({ title, subtitle, category, dark }: Props) {
  return (
    <>
      <Link
        to={category ? `/projects#${category.toLowerCase()}` : '/projects'}
        className={`fixed top-4 left-4 z-20 rounded-full px-4 py-2.5 text-sm font-bold ${
          dark ? 'border border-[#ecebe6]/[.16] bg-[rgba(236,235,230,.1)] text-[#ecebe6] backdrop-blur-[12px]' : 'glass'
        }`}
      >
        ← Projects
      </Link>
      <div className="pointer-events-none fixed top-4 right-5 z-20 flex flex-col items-end gap-0.5 text-right">
        <span className={`text-lg font-extrabold tracking-[-.02em] ${dark ? 'text-[#ecebe6]' : ''}`}>{title}</span>
        {subtitle && <span className={`font-mono text-xs ${dark ? 'text-[#c9d6dc]' : 'text-muted'}`}>{subtitle}</span>}
      </div>
    </>
  )
}
