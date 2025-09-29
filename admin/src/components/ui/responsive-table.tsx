import { ReactNode, useState } from 'react'
import { ChevronDown, ChevronRight, MoreVertical } from 'lucide-react'
import { Button } from './button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu'

interface ResponsiveTableProps {
  children: ReactNode
  className?: string
}

interface ResponsiveTableHeaderProps {
  children: ReactNode
  className?: string
}

interface ResponsiveTableBodyProps {
  children: ReactNode
  className?: string
}

interface ResponsiveTableRowProps {
  children: ReactNode
  className?: string
  mobileCard?: ReactNode
  onClick?: () => void
}

interface ResponsiveTableCellProps {
  children: ReactNode
  className?: string
  hideOnMobile?: boolean
}

// Main table container - shows table on desktop, cards on mobile
export function ResponsiveTable({ children, className = '' }: ResponsiveTableProps) {
  return (
    <div className={`table-enhanced ${className}`}>
      {/* Desktop table view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {children}
        </table>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden">
        {children}
      </div>
    </div>
  )
}

export function ResponsiveTableHeader({ children, className = '' }: ResponsiveTableHeaderProps) {
  return (
    <>
      {/* Desktop header */}
      <thead className={`bg-gray-50 hidden md:table-header-group ${className}`}>
        {children}
      </thead>

      {/* Mobile header (optional title) */}
      <div className="md:hidden bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">Items</h3>
      </div>
    </>
  )
}

export function ResponsiveTableBody({ children, className = '' }: ResponsiveTableBodyProps) {
  return (
    <>
      {/* Desktop body */}
      <tbody className={`bg-white divide-y divide-gray-200 hidden md:table-row-group ${className}`}>
        {children}
      </tbody>

      {/* Mobile body */}
      <div className="md:hidden divide-y divide-gray-200">
        {children}
      </div>
    </>
  )
}

export function ResponsiveTableRow({
  children,
  className = '',
  mobileCard,
  onClick
}: ResponsiveTableRowProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      {/* Desktop row */}
      <tr
        className={`hidden md:table-row hover:bg-gray-50 ${onClick ? 'cursor-pointer' : ''} ${className}`}
        onClick={onClick}
      >
        {children}
      </tr>

      {/* Mobile card */}
      <div className="md:hidden">
        {mobileCard || (
          <div className={`p-4 hover:bg-gray-50 ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
            <div className="space-y-2">
              {children}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export function ResponsiveTableCell({
  children,
  className = '',
  hideOnMobile = false
}: ResponsiveTableCellProps) {
  return (
    <>
      {/* Desktop cell */}
      <td className={`hidden md:table-cell px-4 py-3 text-sm text-gray-900 ${className}`}>
        {children}
      </td>

      {/* Mobile cell */}
      {!hideOnMobile && (
        <div className="md:hidden text-sm">
          {children}
        </div>
      )}
    </>
  )
}

// Mobile card actions component
interface MobileCardActionsProps {
  actions: Array<{
    label: string
    onClick: () => void
    variant?: 'default' | 'destructive'
  }>
}

export function MobileCardActions({ actions }: MobileCardActionsProps) {
  return (
    <div className="flex justify-end md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {actions.map((action, index) => (
            <DropdownMenuItem
              key={index}
              onClick={action.onClick}
              className={action.variant === 'destructive' ? 'text-red-600 focus:text-red-600' : ''}
            >
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Mobile-friendly search and filter bar
interface MobileSearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  placeholder?: string
  actions?: ReactNode
}

export function MobileSearchBar({
  searchQuery,
  onSearchChange,
  placeholder = "Search...",
  actions
}: MobileSearchBarProps) {
  return (
    <div className="p-4 bg-white border-b border-gray-200">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        {actions && (
          <div className="flex gap-2 flex-wrap">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}