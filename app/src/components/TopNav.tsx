import { Link, useLocation } from 'react-router'
import { Logo } from './Logo'

/** Sticky site header. Anchors always include the leading "/" so they work from any page, not just Home. */
export function TopNav() {
  const { pathname } = useLocation()
  if (/^\/projects\/[^/]+/.test(pathname)) return null // project pages have their own BackPill

  return (
    <header className="sticky top-0 z-10 border-b border-ink/8 bg-[rgb(244_241_236/.88)] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-5 px-6 py-[18px]">
        <Link to="/" aria-label="helloamar, home" className="hover:text-ink">
          <Logo />
        </Link>
        <nav className="flex flex-wrap items-center gap-7 text-sm font-semibold">
          <Link to="/#work">Work</Link>
          <Link to="/#about">About</Link>
          <Link to="/contact">Contact</Link>
          <span className="flex items-center gap-2 font-mono text-xs font-normal text-muted">
            <span className="h-[7px] w-[7px] rounded-full bg-status" />
            Open to work
          </span>
        </nav>
      </div>
    </header>
  )
}
