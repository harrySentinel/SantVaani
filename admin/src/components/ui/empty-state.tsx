import React from 'react'
import { Button } from './button'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`text-center py-16 px-6 ${className}`}>
      <div className="max-w-md mx-auto">
        {/* Icon */}
        {icon && (
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-2xl gradient-primary mb-6 shadow-lg">
            <div className="text-white text-2xl">
              {icon}
            </div>
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>

        {/* Description */}
        <p className="text-gray-500 mb-8 leading-relaxed">{description}</p>

        {/* Action Button */}
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            className="btn-primary-enhanced hover-lift"
          >
            {actionLabel}
          </Button>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-orange-200 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-orange-300 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce opacity-40"></div>
      </div>
    </div>
  )
}