// The helloamar wordmark: "hello" ink, "amar" accent orange. Manrope 800, tight tracking.
// If the name ever changes, edit the two words below.
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-[5px] text-xl leading-none font-extrabold tracking-[-.03em] ${className}`}>
      <span className="text-ink">hello</span>
      <span className="text-accent">amar</span>
    </span>
  )
}
