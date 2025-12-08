import { 
  ArrowTrendingUpIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline'
import RecentOrders from './RecentOrders'
import StatCard from './StatCard'
import CircularProgress from './CircularProgress'
import LineChart from './LineChart'
import ProgressChart from './ProgressChart'
import { Line } from 'react-chartjs-2'

const MainContent = ({ sidebarOpen }) => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231',
      change: '+20.1%',
      icon: CurrencyDollarIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Total Users',
      value: '2,350',
      change: '+18.1%',
      icon: UserGroupIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+12.1%',
      icon: ShoppingCartIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'Growth',
      value: '30.5%',
      change: '+4.3%',
      icon: ArrowTrendingUpIcon,
      color: 'bg-orange-500'
    }
  ]

  return (
    <main className={`flex-1 overflow-y-auto bg-gray-50 p-6 transition-all duration-300 ${sidebarOpen ? 'lg:pl-6' : 'lg:pl-6'}`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts and Recent Orders */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Monthly Target Card */}
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Monthly Target</h2>
                <p className="text-sm text-gray-500">Target you've set for each month</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View Details →
              </button>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Circular Progress Bar */}
              <div className="flex-shrink-0">
                <CircularProgress percentage={75.55} size={160} strokeWidth={12} />
              </div>
              
              {/* Target Details */}
              <div className="flex-1">
                <div className="space-y-6">
                  {/* Progress comparison */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <ArrowUpIcon className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">+10%</p>
                          <p className="text-xs text-gray-500">Increase from last month</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-gray-900">75.55%</span>
                    </div>
                  </div>
                  
                  {/* Earnings info */}
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">You earn $3287 today</span>, it's higher than last 
                      month. Keep up your good work!
                    </p>
                  </div>
                  
                  {/* Target breakdown */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Target</span>
                      <span className="text-sm font-medium text-gray-900">$50,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Current Earnings</span>
                      <span className="text-sm font-medium text-gray-900">$37,775</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Remaining</span>
                      <span className="text-sm font-medium text-gray-900">$12,225</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="mt-8 flex space-x-4">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                Set New Target
              </button>
              <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                View Report
              </button>
            </div>
          </div>

          {/* Recent Orders */}
          <RecentOrders />
        </div>

        {/* Full Width Revenue Chart */}
        <div className="mt-6 rounded-lg bg-white p-6 shadow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
              <p className="text-sm text-gray-500">Monthly revenue vs target for the last 12 months</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-500 mr-2 border border-dashed border-green-500"></div>
                <span className="text-sm text-gray-600">Target</span>
              </div>
              <select className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
                <option>Last 12 months</option>
                <option>Last 6 months</option>
                <option>Last 3 months</option>
              </select>
            </div>
          </div>
          <LineChart />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Current Month</p>
              <p className="text-xl font-bold text-gray-900">$120,000</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Target</p>
              <p className="text-xl font-bold text-gray-900">$105,000</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Growth</p>
              <p className="text-xl font-bold text-green-600">+14.3%</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600">Avg. Monthly</p>
              <p className="text-xl font-bold text-gray-900">$78,500</p>
            </div>
          </div>
        </div>

        {/* Progress Chart Row */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">User Growth Progress</h2>
                <p className="text-sm text-gray-500">Weekly user acquisition and conversion rates</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Details →
              </button>
            </div>
            <ProgressChart />
          </div>

          {/* Recent Users */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-semibold mb-4">Recent Users</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      className="h-8 w-8 rounded-full"
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                      alt="User"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium">User {i}</p>
                      <p className="text-xs text-gray-500">user{i}@example.com</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                    Active
                  </span>
                </div>
              ))}
            </div>
            
            {/* Mini Chart for User Activity */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Daily Active Users</h3>
              <div className="h-32">
                <Line data={{
                  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  datasets: [{
                    data: [450, 520, 480, 600, 750, 680, 720],
                    borderColor: 'rgb(139, 92, 246)',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                  }]
                }} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true, grid: { display: false } }
                  }
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold mb-6">Performance Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">3.2%</div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">4m 23s</div>
              <div className="text-sm text-gray-600">Avg. Session</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 mb-2">34.5%</div>
              <div className="text-sm text-gray-600">Bounce Rate</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">68%</div>
              <div className="text-sm text-gray-600">New Sessions</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default MainContent