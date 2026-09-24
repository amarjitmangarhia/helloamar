import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { WORK_GRID, previewSrc, type WorkItem } from '../content/workGrid'
import { useMediaQuery, usePrefersReducedMotion } from '../hooks/useMediaQuery'

/**
 * Work grid. First card is featured (full width, 21:9); the rest are 4:3, auto-fit >= 340px.
 * Desktop (hover): the card's video fades in and plays on hover/focus, pauses and hides on leave.
 * Touch: videos play while the card is >= 60% on screen.
 * No preview videos are recorded yet (see PROGRESS.md) — cards show their solid colour + title
 * until /public/previews/<slug>.{webm,mp4,jpg} exist; nothing breaks in the meantime.
 */
export function WorkSection() {
  return (
    <section id="work" className="border-t border-ink/8 px-6 py-[clamp(56px,8vw,96px)]">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-10">
        <div className="flex flex-wrap items-baseline justify-between gap-5">
          <h2 className="m-0 text-[clamp(32px,3.6vw,48px)] font-bold tracking-[-.035em]">Selected work</h2>
          <Link to="/projects" className="text-[15px] font-bold">
            All projects →
          </Link>
        </div>
        <ul className="m-0 grid list-none gap-x-7 gap-y-10 p-0 [grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))]">
          {WORK_GRID.map((p, i) => (
            <li key={p.slug} className={i === 0 ? 'col-span-full' : ''}>
              <ProjectCard project={p} index={i} featured={i === 0} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ProjectCard({ project: p, index, featured }: { project: WorkItem; index: number; featured: boolean }) {
  const canHover = useMediaQuery('(hover: hover)')
  const reduced = usePrefersReducedMotion()
  const [on, setOn] = useState(false)
  const video = useRef<HTMLVideoElement>(null)
  const src = previewSrc(p.slug)

  // Hover devices: play on hover/focus
  useEffect(() => {
    const v = video.current
    if (!v || !canHover || reduced) return
    if (on) {
      v.currentTime = 0
      v.play().catch(() => {})
    } else v.pause()
  }, [on, canHover, reduced])

  // Touch devices: play while visible
  useEffect(() => {
    const v = video.current
    if (!v || canHover || reduced) return
    const io = new IntersectionObserver(
      ([e]) => {
        setOn(e.isIntersecting)
        e.isIntersecting ? v.play().catch(() => {}) : v.pause()
      },
      { threshold: 0.6 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [canHover, reduced])

  return (
    <Link
      to={p.href}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      onFocus={() => setOn(true)}
      onBlur={() => setOn(false)}
      className="group flex flex-col gap-4 hover:text-ink"
    >
      <div
        className={`relative overflow-hidden rounded-[18px] transition-transform duration-[350ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[.985] ${featured ? 'aspect-[21/9]' : 'aspect-[4/3]'}`}
        style={{ background: p.bg }}
      >
        <video
          ref={video}
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${on && !reduced ? 'opacity-100' : 'opacity-0'}`}
          muted
          loop
          playsInline
          preload="none"
          poster={src.poster}
        >
          <source src={src.webm} type="video/webm" />
          <source src={src.mp4} type="video/mp4" />
        </video>
        {/* Title layer sits UNDER the video in the prototype; keep it visible when the video is hidden */}
        <div className={`absolute inset-0 flex items-end justify-between gap-3 px-[22px] py-5 transition-opacity duration-300 ${on && !reduced ? 'opacity-0' : 'opacity-100'}`}>
          <span className="text-[clamp(22px,2.4vw,32px)] font-extrabold leading-none tracking-[-.03em]" style={{ color: p.fg }}>
            {p.title}
          </span>
          <span className="font-mono text-xs opacity-70" style={{ color: p.fg }}>
            0{index + 1}
          </span>
        </div>
      </div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-base leading-normal text-body">{p.description}</span>
        <span className="shrink-0 font-mono text-xs text-muted">{p.category}</span>
      </div>
    </Link>
  )
}
