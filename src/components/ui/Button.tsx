import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-cobalt-600 text-white shadow-[0_10px_24px_-12px_rgb(36_72_176/0.75)] hover:bg-cobalt-700 active:bg-cobalt-800 disabled:bg-stone-300 disabled:text-ink-500 disabled:shadow-none',
  secondary:
    'bg-paper text-ink-800 ring-1 ring-inset ring-stone-300 hover:bg-stone-50 hover:ring-stone-400 active:bg-stone-100 disabled:text-ink-400',
  ghost: 'text-ink-700 hover:bg-stone-150 hover:text-ink-950 active:bg-stone-200 disabled:text-ink-400',
}

const SIZES: Record<Size, string> = {
  sm: 'h-8 gap-1.5 px-3 text-[13px]',
  md: 'h-10 gap-2 px-4 text-sm',
  lg: 'h-12 gap-2.5 px-6 text-[15px]',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: ReactNode
}

export function Button({ variant = 'secondary', size = 'md', icon, className = '', children, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-medium tracking-[-0.005em] transition-[background-color,box-shadow,color] duration-150 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  size?: 'sm' | 'md' | 'lg'
  tone?: 'plain' | 'filled' | 'primary'
}

const ICON_SIZES = { sm: 'size-8', md: 'size-10', lg: 'size-12' } as const
const ICON_TONES = {
  plain: 'text-ink-700 hover:bg-stone-150 hover:text-ink-950 active:bg-stone-200',
  filled: 'bg-paper text-ink-800 ring-1 ring-inset ring-stone-300 hover:bg-stone-50 hover:ring-stone-400',
  primary: 'bg-cobalt-600 text-white hover:bg-cobalt-700 active:bg-cobalt-800',
} as const

/** An icon-only button; `label` is required so it always has an accessible name. */
export function IconButton({ label, size = 'md', tone = 'plain', className = '', children, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex shrink-0 items-center justify-center rounded-full transition-colors duration-150 disabled:pointer-events-none disabled:opacity-35 ${ICON_SIZES[size]} ${ICON_TONES[tone]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
