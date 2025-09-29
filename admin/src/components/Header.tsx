import { Bell, Search, User, LogOut, Menu, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { toast } from '@/hooks/use-toast'

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void
}

export default function Header({ setSidebarOpen }: HeaderProps) {
  const { user, signOut } = useAdminAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "Successfully logged out of admin panel",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <header className="enhanced-header">
      <div className="mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Mobile menu button + Page info */}
          <div className="flex items-center flex-1">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden mr-4 btn-enhanced hover-lift"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open sidebar</span>
            </Button>
            
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gradient truncate">
                Content Management
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block font-medium">
                Manage your spiritual content with ease
              </p>
            </div>
          </div>
          
          {/* Right side - Actions */}
          <div className="flex items-center space-x-1 sm:space-x-4">
            {/* Search - Future enhancement */}
            <Button variant="ghost" size="icon" className="relative hidden sm:flex">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Notifications - Future enhancement */}
            <Button variant="ghost" size="icon" className="relative btn-enhanced hover-lift">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 h-1.5 w-1.5 sm:h-2 sm:w-2 bg-red-500 rounded-full pulse-animation"></span>
              <span className="sr-only">Notifications</span>
            </Button>
            
            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <span className="sr-only">Admin menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-gray-900">Admin Account</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Shield className="mr-2 h-4 w-4 text-orange-600" />
                  <span>Admin Privileges</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  <span>System Notifications</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}