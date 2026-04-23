interface SectionLabelProps {
  children: React.ReactNode
  center?: boolean
}

export function SectionLabel({ children, center = false }: SectionLabelProps) {
  return (
    <div
      className={`flex items-center gap-2 mb-3.5 ${center ? 'justify-center' : ''}`}
    >
      <div className="w-[18px] h-px bg-accent flex-shrink-0" />
      <span className="text-[11px] font-head font-semibold tracking-[0.12em] uppercase text-accent">
        {children}
      </span>
    </div>
  )
}
