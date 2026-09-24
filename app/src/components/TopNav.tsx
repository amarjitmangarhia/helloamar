import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Logo } from './Logo'

const links = [
  { label: 'Skills', to: '/#work' },
  { label: 'About', to: '/#about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Learning', to: '/#playground' },
]

export function TopNav() {
  const { pathname, key } = useLocation()
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [key]) // close the phone menu after any navigation
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const onProjects = pathname.startsWith('/projects')
  if (/^\/projects\/[^/]+/.test(pathname)) return null // project pages have their own BackPill

  // Dark nav: currently just /contact. The home redesign will switch Home to this too.
  const dark = pathname === '/contact'
  const linkCls = `border-b-2 border-transparent pb-0.5 ${dark ? 'text-[#ecebe6]' : ''}`
  const navCls = dark
    ? 'flex w-full max-w-[1240px] items-center justify-between gap-4 rounded-full border border-[#ecebe6]/[.09] bg-[rgba(14,15,20,.62)] py-2.5 pr-3 pl-5 backdrop-blur-[16px]'
    : 'glass-nav flex w-full max-w-[1240px] items-center justify-between gap-4 rounded-full py-2.5 pr-3 pl-5'
  const menuBtnCls = dark ? 'bg-[#ecebe6] text-[#07080c]' : 'bg-ink text-bg'
  const menuPanelCls = dark
    ? 'mt-2 flex w-full max-w-[1240px] flex-col gap-1 rounded-[28px] border border-[#ecebe6]/[.09] bg-[rgba(14,15,20,.85)] p-2 backdrop-blur-[16px] md:hidden'
    : 'glass mt-2 flex w-full max-w-[1240px] flex-col gap-1 rounded-[28px] p-2 md:hidden'
  const menuLinkCls = dark ? 'rounded-2xl px-4 py-3.5 text-base font-semibold text-[#ecebe6] hover:bg-[#ecebe6]/[.08]' : 'rounded-2xl px-4 py-3.5 text-base font-semibold hover:bg-ink/[.06]'
  const openToCls = dark ? 'flex items-center gap-2 rounded-full bg-[#ecebe6] px-4 py-[9px] text-[#07080c] hover:bg-butter' : 'flex items-center gap-2 rounded-full bg-ink px-4 py-[9px] text-bg'

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex flex-col items-center px-4 py-3 sm:px-5 sm:py-4">
      <nav className={navCls}>
        <Link to="/" aria-label="helloamar, home" className="group">
          <Logo />
        </Link>

        {/* tablet / desktop: full link row */}
        <div className="hidden items-center gap-[22px] text-sm font-semibold md:flex">
          {links.map((l) => (
            <Link key={l.label} to={l.to} className={`${linkCls} ${l.label === 'Projects' && onProjects ? (dark ? '!border-[#ecebe6]' : '!border-ink') : ''}`}>
              {l.label}
            </Link>
          ))}
          <Link to="/contact" className={openToCls}>
            <span className="size-[7px] rounded-full bg-status" />
            Open to work
          </Link>
        </div>

        {/* phone: menu button */}
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="phone-menu"
          className={`flex h-10 cursor-pointer items-center gap-2 rounded-full border-0 px-4 text-sm font-bold md:hidden ${menuBtnCls}`}
        >
          <span className="size-[7px] rounded-full bg-status" />
          {open ? 'Close' : 'Menu'}
        </button>
      </nav>

      {open && (
        <div id="phone-menu" className={menuPanelCls}>
          {links.map((l) => (
            <Link key={l.label} to={l.to} className={menuLinkCls}>
              {l.label}
            </Link>
          ))}
          <Link to="/contact" className={`mt-1 flex items-center justify-center gap-2 rounded-full py-3.5 text-base font-bold ${dark ? 'bg-[#ecebe6] text-[#07080c]' : 'bg-ink text-bg'}`}>
            <span className="size-[7px] rounded-full bg-status" />
            Open to work
          </Link>
        </div>
      )}
    </div>
  )
}
