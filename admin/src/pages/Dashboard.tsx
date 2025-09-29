import { Users, Heart, Sparkles, Music, Quote, TrendingUp, Lightbulb, RefreshCw, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DatabaseTest from '@/components/DatabaseTest'
import { useRecentActivity } from '@/hooks/useRecentActivity'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  const navigate = useNavigate()
  const { recentActivity, tableCounts, loading, error, refetch } = useRecentActivity()

  // Quick action handlers
  const handleQuickAction = (page: string) => {
    navigate(page)
  }

  // Generate dynamic stats from real data
  const stats = [
    {
      name: 'Saints',
      value: tableCounts.saints.toString(),
      change: `${tableCounts.saints} total`,
      changeType: 'neutral',
      icon: Users,
      color: 'bg-blue-500',
      route: '/saints'
    },
    {
      name: 'Living Saints', 
      value: tableCounts.living_saints.toString(),
      change: `${tableCounts.living_saints} total`,
      changeType: 'neutral',
      icon: Heart,
      color: 'bg-red-500',
      route: '/living-saints'
    },
    {
      name: 'Divine Forms',
      value: tableCounts.divine_forms.toString(),
      change: `${tableCounts.divine_forms} total`,
      changeType: 'neutral',
      icon: Sparkles,
      color: 'bg-purple-500',
      route: '/divine-forms'
    },
    {
      name: 'Bhajans',
      value: tableCounts.bhajans.toString(),
      change: `${tableCounts.bhajans} total`,
      changeType: 'neutral', 
      icon: Music,
      color: 'bg-green-500',
      route: '/bhajans'
    },
    {
      name: 'Quotes',
      value: tableCounts.quotes.toString(),
      change: `${tableCounts.quotes} total`,
      changeType: 'neutral',
      icon: Quote,
      color: 'bg-orange-500',
      route: '/quotes'
    },
    {
      name: 'Spiritual Facts',
      value: tableCounts.spiritual_facts.toString(),
      change: `${tableCounts.spiritual_facts} total`,
      changeType: 'neutral',
      icon: Lightbulb,
      color: 'bg-yellow-500',
      route: '/spiritual-facts'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Welcome to SantVaani Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            onClick={() => handleQuickAction(stat.route)}
            className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 cursor-pointer hover:shadow-lg hover:border-gray-300 transition-all duration-200 touch-manipulation"
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-xl sm:text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm">
                  <TrendingUp className={`flex-shrink-0 h-4 w-4 ${
                    stat.changeType === 'increase' ? 'text-green-500' : 'text-gray-400'
                  }`} />
                  <span className={`ml-2 ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              <Button
                onClick={refetch}
                variant="outline"
                size="sm"
                disabled={loading}
                className="text-xs"
              >
                {loading ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <RefreshCw className="h-3 w-3 mr-1" />
                )}
                Refresh
              </Button>
            </div>
            
            {loading && recentActivity.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">Loading recent activity...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                <p>Error loading recent activity</p>
                <p className="text-sm text-gray-500">{error}</p>
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No recent activity found</p>
                <p className="text-sm">Start adding content to see activity here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                      activity.type === 'saint' ? 'bg-blue-500' :
                      activity.type === 'living-saint' ? 'bg-red-500' :
                      activity.type === 'bhajan' ? 'bg-green-500' :
                      activity.type === 'quote' ? 'bg-orange-500' :
                      activity.type === 'spiritual-fact' ? 'bg-yellow-500' : 
                      'bg-purple-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user}</span>
                        {' '}
                        <span className="text-gray-600">{activity.action}</span>
                        {' '}
                        <span className="font-medium">{activity.item}</span>
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => handleQuickAction('/saints')}
                className="w-full text-left p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors group"
              >
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                  <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-blue-700">
                    Manage Saints
                  </span>
                </div>
              </button>
              
              <button 
                onClick={() => handleQuickAction('/living-saints')}
                className="w-full text-left p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-red-400 hover:bg-red-50 transition-colors group"
              >
                <div className="flex items-center">
                  <Heart className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
                  <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-red-700">
                    Manage Living Saints
                  </span>
                </div>
              </button>

              <button 
                onClick={() => handleQuickAction('/divine-forms')}
                className="w-full text-left p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50 transition-colors group"
              >
                <div className="flex items-center">
                  <Sparkles className="h-5 w-5 text-gray-400 group-hover:text-purple-500" />
                  <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-purple-700">
                    Manage Divine Forms
                  </span>
                </div>
              </button>
              
              <button 
                onClick={() => handleQuickAction('/bhajans')}
                className="w-full text-left p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50 transition-colors group"
              >
                <div className="flex items-center">
                  <Music className="h-5 w-5 text-gray-400 group-hover:text-green-500" />
                  <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-green-700">
                    Manage Bhajans
                  </span>
                </div>
              </button>
              
              <button 
                onClick={() => handleQuickAction('/quotes')}
                className="w-full text-left p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-400 hover:bg-orange-50 transition-colors group"
              >
                <div className="flex items-center">
                  <Quote className="h-5 w-5 text-gray-400 group-hover:text-orange-500" />
                  <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-orange-700">
                    Manage Quotes
                  </span>
                </div>
              </button>
              
              <button 
                onClick={() => handleQuickAction('/spiritual-facts')}
                className="w-full text-left p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-yellow-400 hover:bg-yellow-50 transition-colors group"
              >
                <div className="flex items-center">
                  <Lightbulb className="h-5 w-5 text-gray-400 group-hover:text-yellow-500" />
                  <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-yellow-700">
                    Manage Spiritual Facts
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Database Connection Test */}
      <DatabaseTest />

      {/* Tips for Students */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">📚 Tips for Content Contributors</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">📝 Writing Guidelines</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Always include both English and Hindi text</li>
              <li>• Keep descriptions clear and respectful</li>
              <li>• Verify historical accuracy before publishing</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">🎯 Quality Standards</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Use high-quality, appropriate images</li>
              <li>• Check spelling and grammar carefully</li>
              <li>• Preview content before saving</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}