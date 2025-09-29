import React from 'react'
import { Button } from './button'
import { Plus } from 'lucide-react'

interface FloatingActionButtonProps {
  onClick: () => void
  icon?: React.ReactNode
  className?: string
  ariaLabel?: string
}

export default function FloatingActionButton({
  onClick,
  icon = <Plus className="h-6 w-6" />,
  className = '',
  ariaLabel = 'Add new item'
}: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={`
        fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full
        gradient-primary shadow-2xl border-0 p-0
        hover:scale-110 active:scale-95
        transition-all duration-300 ease-out
        md:hidden
        ${className}
      `}
      aria-label={ariaLabel}
    >
      <div className="relative">
        {icon}
        <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
      </div>
    </Button>
  )
}