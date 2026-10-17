/** The Bible Atlas mark: a cobalt disc with a traced route between three stops. */
export function LogoMark({ className = 'size-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden focusable="false">
      <circle cx="16" cy="16" r="16" fill="#2448b0" />
      <path d="M2 16h28M16 2v28" stroke="#fcfbf8" strokeOpacity="0.16" />
      <ellipse cx="16" cy="16" rx="6.6" ry="14" fill="none" stroke="#fcfbf8" strokeOpacity="0.16" />
      <path d="M7.6 21.6C11.2 13.6 17 13.4 24.4 9.6" fill="none" stroke="#fcfbf8" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="7.6" cy="21.6" r="2.4" fill="#fcfbf8" />
      <circle cx="15.7" cy="15" r="1.7" fill="#fcfbf8" />
      <circle cx="24.4" cy="9.6" r="2.4" fill="#fcfbf8" />
    </svg>
  )
}

/** "Bible Atlas AI" set in the display serif, with "AI" in cobalt. */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-display text-[17px] font-semibold tracking-[-0.01em] text-ink-950 ${className}`}>
      Bible Atlas <span className="text-cobalt-600">AI</span>
    </span>
  )
}
