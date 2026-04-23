'use client'
import { useState } from 'react'

interface ButtonProps {
  children: React.ReactNode
  href?: string
  variant?: 'primary' | 'secondary'
  size?: 'default' | 'small'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: () => void
  className?: string
}

export function Button({
  children,
  href,
  variant = 'primary',
  size = 'default',
  type = 'button',
  disabled,
  onClick,
  className = '',
}: ButtonProps) {
  const [hovered, setHovered] = useState(false)

  const base =
    'inline-flex items-center gap-2 font-head font-semibold tracking-tight rounded-lg transition-all duration-200 cursor-pointer'

  const sizeClass =
    size === 'small' ? 'px-[18px] py-[9px] text-[13px]' : 'px-7 py-[14px] text-[15px]'

  const variantStyle =
    variant === 'primary'
      ? {
          background: hovered ? '#6690ff' : 'var(--accent)',
          color: '#fff',
          border: 'none',
          boxShadow: hovered ? '0 0 32px rgba(79,124,255,0.45)' : 'none',
        }
      : {
          background: hovered ? 'var(--bg2)' : 'transparent',
          color: 'var(--text)',
          border: '1px solid var(--border)',
        }

  const Tag = href ? 'a' : 'button'

  return (
    <Tag
      href={href}
      type={href ? undefined : type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={variantStyle}
      className={`${base} ${sizeClass} ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </Tag>
  )
}
