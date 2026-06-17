import Image from 'next/image'

const LOGO_SRC = {
  mark: '/brand/logo-mark.svg',
  full: '/brand/logo-full.svg',
  wordmark: '/brand/logo-wordmark.svg',
} as const

type LogoVariant = keyof typeof LOGO_SRC

type LogoProps = {
  variant?: LogoVariant
  className?: string
  priority?: boolean
}

export default function Logo({ variant = 'full', className, priority = false }: LogoProps) {
  const src = LOGO_SRC[variant]

  return (
    <Image
      src={src}
      alt="CampusFound"
      width={variant === 'mark' ? 64 : variant === 'wordmark' ? 280 : 360}
      height={variant === 'wordmark' ? 40 : 64}
      className={className}
      priority={priority}
    />
  )
}
