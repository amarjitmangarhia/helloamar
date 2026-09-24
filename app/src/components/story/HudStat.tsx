import type { RefObject } from 'react'

// One readout in the bottom-left HUD. The scene writes to `valueRef.current.textContent` every frame.
export function HudStat({ label, valueRef, initial, color }: { label: string; valueRef: RefObject<HTMLSpanElement | null>; initial: string; color: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[11px] tracking-[.08em] text-[#c9d6dc] uppercase">{label}</span>
      <span ref={valueRef} className="font-mono text-base font-medium" style={{ color }}>
        {initial}
      </span>
    </div>
  )
}
