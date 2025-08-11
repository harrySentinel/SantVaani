import { Users, Heart, Sparkles, Music, Quote, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DatabaseTest from '@/components/DatabaseTest'

// Stats will be dynamic in the future
const stats = [
  {
    name: 'Saints',
    value: '25',
    change: '+2 this week',
    changeType: 'increase',
    icon: Users,
    color: 'bg-blue-500',
    route: '/saints'
  },
  {
    name: 'Living Saints', 
    value: '12',
    change: '+1 this week',
    changeType: 'increase',
    icon: Heart,
    color: 'bg-red-500',
    route: '/living-saints'
  },
  {
    name: 'Divine Forms',
    value: '18',
    change: 'No change',
    changeType: 'neutral',
    icon: Sparkles,
    color: 'bg-purple-500',
    route: '/divine-forms'
  },
  {
    name: 'Bhajans',
    value: '8',
    change: '+3 this week',
    changeType: 'increase', 
    icon: Music,
    color: 'bg-green-500',
    route: '/bhajans'
  },
  {
    name: 'Quotes',
    value: '45',
    change: '+12 this week',
    changeType: 'increase',
    icon: Quote,
    color: 'bg-orange-500',
    route: '/quotes'
  }
]

const recentActivity = [
  {
    id: 1,
    type: 'saint',
    action: 'added',
    item: 'Sant Tukaram Biography',
    time: '2 hours ago',
    user: 'Admin'
  },
  {
    id: 2,
    type: 'bhajan',
    action: 'updated',
    item: 'Hanuman Chalisa lyrics',
    time: '5 hours ago',
    user: 'Student 1'
  },
  {
    id: 3,
    type: 'quote',
    action: 'added',
    item: '3 new spiritual quotes',
    time: '1 day ago',
    user: 'Student 2'
  },
  {
    id: 4,
    type: 'divine-form',
    action: 'updated',
    item: 'Lord Ganesha attributes',
    time: '2 days ago',
    user: 'Admin'
  }
]

export default function Dashboard() {
  const navigate = useNavigate()

  // Quick action handlers
  const handleQuickAction = (page: string) => {
    navigate(page)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to SantVaani Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.name}
            onClick={() => handleQuickAction(stat.route)}
            className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 cursor-pointer hover:shadow-lg hover:border-gray-300 transition-all duration-200"
          >
            <div className="p-6">
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
                    <dd className="text-2xl font-semibold text-gray-900">
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                    activity.type === 'saint' ? 'bg-blue-500' :
                    activity.type === 'bhajan' ? 'bg-green-500' :
                    activity.type === 'quote' ? 'bg-orange-500' : 'bg-purple-500'
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