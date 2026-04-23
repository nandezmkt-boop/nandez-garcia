'use client'
import { useState } from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  glow?: boolean
  style?: React.CSSProperties
}

export function Card({ children, className = '', glow = false, style }: CardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 14,
        border: `1px solid ${hovered ? 'rgba(61,64,82,1)' : 'var(--border)'}`,
        background: 'var(--bg2)',
        padding: 28,
        transition: 'all 0.2s',
        boxShadow: hovered && glow ? '0 8px 40px rgba(0,0,0,0.35)' : 'none',
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  )
}
