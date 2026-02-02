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
import { getDashboardStats, getRecentUsers, getAllRecentOrders, getAllPerformanceMetrics } from '../Api/dashboardApi'
import { useEffect, useState } from 'react'

const MainContent = ({ sidebarOpen }) => {
  const [stats, setStats] = useState([])
  const [recentUsersData, setRecentUsersData] = useState([])
  const [dailyActiveUsers, setDailyActiveUsers] = useState([])
  const [performanceMetrics, setPerformanceMetrics] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeUsersCount, setActiveUsersCount] = useState(0)
  // const [revenueData, setRevenueData] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [dashboardStats, recentUsers, recentOrdersData, performanceMetricsData] = await Promise.all([
        getDashboardStats(),
        getRecentUsers(),
        getAllRecentOrders(),
        getAllPerformanceMetrics()
      ])

      if (dashboardStats.success) {
        const { revenue, users, orders } = dashboardStats.data

        // Format the stats for display
        const formattedStats = [
          {
            title: 'Total Revenue',
            value: `₹${revenue.total.toLocaleString('en-IN')}`,
            change: `${revenue.growth > 0 ? '+' : ''}${revenue.growth}%`,
            icon: CurrencyDollarIcon,
            color: 'bg-green-500'
          },
          {
            title: 'Total Users',
            value: users.total.toLocaleString('en-IN'),
            change: `${users.growth > 0 ? '+' : ''}${users.growth}%`,
            icon: UserGroupIcon,
            color: 'bg-blue-500'
          },
          {
            title: 'Total Orders',
            value: orders.total.toLocaleString('en-IN'),
            change: `${orders.growth > 0 ? '+' : ''}${orders.growth}%`,
            icon: ShoppingCartIcon,
            color: 'bg-purple-500'
          },
          {
            title: 'Active Users',
            value: recentUsers.data?.activeUsersCount || 0,
            change: 'Live',
            icon: ArrowTrendingUpIcon,
            color: 'bg-orange-500'
          }
        ]

        setStats(formattedStats)
      }

      if (recentUsers.success) {
        setRecentUsersData(recentUsers.data.recentUsers || [])
        setActiveUsersCount(recentUsers.data.activeUsersCount || 0)

        // Format daily active users for chart
        if (recentUsers.data.dailyActiveUsers) {
          const formattedDAU = recentUsers.data.dailyActiveUsers.map(item => ({
            ...item,
            date: item._id
          }))
          setDailyActiveUsers(formattedDAU)
        }
      }

      if (recentOrdersData.success) {
        setRecentOrders(recentOrdersData.data.orders || [])
      }

      if (performanceMetricsData.success) {
        setPerformanceMetrics(performanceMetricsData.data)
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Fallback to default stats if API fails
      setStats([])
      setRecentUsersData([])
      setRecentOrders([])

    } finally {
      setLoading(false)
    }
  }

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Prepare data for Daily Active Users chart
  const prepareDAUChartData = () => {
    // Use actual data if available, otherwise use sample data
    if (dailyActiveUsers.length > 0) {
      const sortedData = [...dailyActiveUsers].sort((a, b) => new Date(a.date) - new Date(b.date))

      return {
        labels: sortedData.map(item => {
          const date = new Date(item.date)
          return date.toLocaleDateString('en-US', { weekday: 'short' })
        }),
        datasets: [{
          label: 'Daily Active Users',
          data: sortedData.map(item => item.count),
          borderColor: 'rgb(139, 92, 246)',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          fill: true,
          tension: 0.4,
        }]
      }
    }

    // Fallback to sample data
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Daily Active Users',
        data: [450, 520, 480, 600, 750, 680, 720],
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
      }]
    }
  }

  // Prepare revenue chart data
  // const prepareRevenueChartData = () => {
  //   if (revenueData) return revenueData

  //   return {
  //     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  //     datasets: [
  //       {
  //         label: 'Revenue',
  //         data: [65000, 78000, 85000, 92000, 105000, 125000, 140000, 135000, 148000, 160000, 175000, 190000],
  //         borderColor: 'rgb(59, 130, 246)',
  //         backgroundColor: 'rgba(59, 130, 246, 0.1)',
  //         fill: true,
  //         tension: 0.4,
  //       },
  //       {
  //         label: 'Target',
  //         data: [70000, 80000, 90000, 100000, 110000, 120000, 130000, 140000, 150000, 160000, 170000, 180000],
  //         borderColor: 'rgb(34, 197, 94)',
  //         backgroundColor: 'transparent',
  //         borderDash: [5, 5],
  //         fill: false,
  //         tension: 0.4,
  //       }
  //     ]
  //   }
  // }

  // Calculate average order value
  const calculateAvgOrderValue = () => {
    if (performanceMetrics?.avgOrderValue?.value) {
      return `₹${performanceMetrics.avgOrderValue.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
    }

    if (!stats[0]?.value || !stats[2]?.value) return '₹0.00'

    const revenue = parseInt(stats[0].value.replace(/[^0-9]/g, ''))
    const orders = parseInt(stats[2].value.replace(/[^0-9]/g, ''))

    if (orders === 0) return '₹0.00'

    return `₹${(revenue / orders).toFixed(2)}`
  }

  // Get user growth percentage
  const getUserGrowthPercentage = () => {
    if (performanceMetrics?.userGrowth?.growthPercentage !== undefined) {
      return `${performanceMetrics.userGrowth.growthPercentage > 0 ? '+' : ''}${performanceMetrics.userGrowth.growthPercentage}%`
    }
    return stats[1]?.change || '+0%'
  }

  return (
    <main className={`flex-1 overflow-y-auto bg-gray-50 p-6 transition-all duration-300 ${sidebarOpen ? 'lg:pl-6' : 'lg:pl-6'}`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        )}

        {/* Recent Orders */}
        <RecentOrders orders={recentOrders} loading={loading} />

        {/* Full Width Revenue Chart */}
        {/* <div className="mt-6 rounded-lg bg-white p-6 shadow">
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
          {loading ? (
            <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
          ) : (
            <LineChart data={prepareRevenueChartData()} />
          )}
        </div> */}

        {/* Progress Chart Row */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Recent Users with DAU Chart */}
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Users & Activity</h2>
              
            </div>



            {/* Recent Users List */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Users</h3>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                        <div className="ml-3">
                          <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-32"></div>
                        </div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentUsersData.slice(0, 5).map((user, index) => (
                    <div key={user._id || index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                          alt={user.firstName}
                          onError={(e) => {
                            e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
                          }}
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Performance Metrics with Progress Charts */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-semibold mb-6">Performance Metrics</h2>

            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : performanceMetrics ? (
              <div className="space-y-6">
                {/* Conversion Rate */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <CircularProgress
                      value={performanceMetrics.conversionRate?.value || 0}
                      maxValue={10}
                      color="text-blue-600"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Conversion Rate</p>
                      <p className="text-xs text-gray-500">{performanceMetrics.conversionRate?.description || 'Orders per unique session user'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {/* FIX: Make sure to append the percentage sign */}
                    <p className="text-lg font-semibold text-blue-600">
                      {performanceMetrics.conversionRate?.value || 0}%
                    </p>
                    {performanceMetrics.conversionRate?.change && (
                      <p className="text-xs text-green-600 flex items-center">
                        <ArrowUpIcon className="h-3 w-3 mr-1" />
                        {/* FIX: Add percentage sign to change value */}
                        +{performanceMetrics.conversionRate.change}%
                      </p>
                    )}
                  </div>
                </div>


                {/* Bounce Rate */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <CircularProgress
                      value={performanceMetrics.bounceRate?.value || 0}
                      maxValue={100}
                      color="text-yellow-600"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Bounce Rate</p>
                      <p className="text-xs text-gray-500">{performanceMetrics.bounceRate?.description || 'Sessions with 1 or fewer page views'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {/* FIX: Add percentage sign */}
                    <p className="text-lg font-semibold text-yellow-600">
                      {performanceMetrics.bounceRate?.value || 0}%
                    </p>
                  </div>
                </div>

                {/* New Sessions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-purple-100">
                      <UserGroupIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">New Sessions</p>
                      <p className="text-xs text-gray-500">{performanceMetrics.newSessions?.description || 'New sessions this month'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-purple-600">
                      {performanceMetrics.newSessions?.value?.toLocaleString('en-IN') || 0}
                    </p>
                    {performanceMetrics.newSessions?.change && (
                      <p className="text-xs text-green-600 flex items-center">
                        <ArrowUpIcon className="h-3 w-3 mr-1" />
                        {/* FIX: Add percentage sign to change */}
                        +{performanceMetrics.newSessions.change}%
                      </p>
                    )}
                  </div>
                </div>
                {/* Additional Info */}
                <div className="pt-6 border-t">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Avg. Order Value</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {calculateAvgOrderValue()}
                      </p>
                      {performanceMetrics.avgOrderValue?.change && (
                        <p className="text-xs text-green-600">
                          +{performanceMetrics.avgOrderValue.change}% vs last month
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">User Growth</p>
                      <p className="text-lg font-semibold text-green-600">
                        {getUserGrowthPercentage()}
                      </p>
                      {performanceMetrics.userGrowth && (
                        <p className="text-xs text-gray-600">
                          {performanceMetrics.userGrowth.newUsersThisMonth?.toLocaleString('en-IN') || 0} new users this month
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Performance metrics not available
              </div>
            )}
          </div>
        </div>



        {/* Refresh Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Data
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  )
}

export default MainContent