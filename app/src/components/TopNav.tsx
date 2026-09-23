import { Link, useLocation } from 'react-router'
import { site } from '../content/site'

const linkCls = 'border-b-2 border-transparent pb-0.5'

export function TopNav() {
  const { pathname } = useLocation()
  const onProjects = pathname.startsWith('/projects')
  return (
    <div className="fixed inset-x-0 top-0 z-10 flex justify-center px-5 py-4">
      <nav className="glass-nav flex w-full max-w-[1240px] items-center justify-between gap-4 rounded-full py-2.5 pr-3 pl-5">
        <Link to="/" className="text-[17px] font-extrabold tracking-[-.02em]">
          {site.name}
        </Link>
        <div className="flex flex-wrap items-center gap-[22px] text-sm font-semibold">
          <Link to="/#work" className={linkCls}>Skills</Link>
          <Link to="/#about" className={linkCls}>About</Link>
          <Link to="/projects" className={`${linkCls} ${onProjects ? '!border-ink' : ''}`}>Projects</Link>
          <Link to="/#playground" className={linkCls}>Learning</Link>
          <Link to="/#contact" className="flex items-center gap-2 rounded-full bg-ink px-4 py-[9px] text-bg">
            <span className="size-[7px] rounded-full bg-status" />
            Open to work
          </Link>
        </div>
      </nav>
    </div>
  )
}
