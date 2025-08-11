import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Heart, 
  Sparkles, 
  Music, 
  Quote,
  Lightbulb,
  Settings,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview and statistics'
  },
  {
    name: 'Saints',
    href: '/saints',
    icon: Users,
    description: 'Manage saints biographies',
    count: 25 // Will be dynamic
  },
  {
    name: 'Living Saints',
    href: '/living-saints', 
    icon: Heart,
    description: 'Contemporary spiritual masters',
    count: 12
  },
  {
    name: 'Divine Forms',
    href: '/divine-forms',
    icon: Sparkles,
    description: 'Sacred manifestations',
    count: 18
  },
  {
    name: 'Bhajans',
    href: '/bhajans',
    icon: Music,
    description: 'Devotional songs and lyrics',
    count: 8
  },
  {
    name: 'Quotes',
    href: '/quotes',
    icon: Quote,
    description: 'Spiritual wisdom and sayings',
    count: 45
  },
  {
    name: 'Spiritual Facts',
    href: '/spiritual-facts',
    icon: Lightbulb,
    description: 'Interesting spiritual facts for homepage',
    count: 0
  }
]

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out border-r border-gray-200 md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
          {/* Close button for mobile */}
          <div className="flex items-center justify-between px-6 md:hidden">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🕉️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SantVaani</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Logo for desktop */}
          <div className="hidden md:flex items-center flex-shrink-0 px-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🕉️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SantVaani</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          </div>
        
        {/* Navigation */}
        <div className="mt-8 flex-grow flex flex-col">
          <nav className="flex-1 px-3 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-orange-50 text-orange-700 border-l-4 border-orange-500'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={cn(
                        'mr-4 h-5 w-5 flex-shrink-0',
                        isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500'
                      )}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span>{item.name}</span>
                        {item.count && (
                          <span className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                            isActive 
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-gray-100 text-gray-600'
                          )}>
                            {item.count}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                    </div>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          
          {/* Settings */}
          <div className="flex-shrink-0 px-3 pb-4">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                cn(
                  'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50'
                )
              }
            >
              <Settings className="mr-4 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              <span>Settings</span>
            </NavLink>
          </div>
        </div>
        </div>
      </div>
    </>
  )
}