// The helloamar wordmark: "hello" ink, "amar" coral, seafoam full stop. Manrope 800, tight tracking.
// If the name ever changes, edit the two words below.
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline text-[21px] leading-none font-extrabold tracking-[-.045em] ${className}`}>
      <span className="text-ink">hello</span>
      <span className="text-coral">amar</span>
      <span className="inline-block text-seafoam transition-transform duration-300 group-hover:-translate-y-[3px] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">.</span>
    </span>
  )
}
