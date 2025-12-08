import { useState } from 'react'
import { 
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  TruckIcon,
  EyeIcon,
  PrinterIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import Sidebar from '../Sidebar'
import Navbar from '../Navbar'

const Orders = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  const orders = [
    { id: '#ORD-001', customer: 'John Smith', date: '2024-01-15', amount: '$125.00', status: 'Completed', items: 3 },
    { id: '#ORD-002', customer: 'Emma Johnson', date: '2024-01-15', amount: '$89.99', status: 'Processing', items: 2 },
    { id: '#ORD-003', customer: 'Michael Brown', date: '2024-01-14', amount: '$234.50', status: 'Shipped', items: 5 },
    { id: '#ORD-004', customer: 'Sarah Davis', date: '2024-01-14', amount: '$67.99', status: 'Pending', items: 1 },
    { id: '#ORD-005', customer: 'David Wilson', date: '2024-01-13', amount: '$156.75', status: 'Completed', items: 4 },
    { id: '#ORD-006', customer: 'Lisa Miller', date: '2024-01-13', amount: '$299.99', status: 'Cancelled', items: 2 },
  ]

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'Processing': return <ArrowPathIcon className="h-5 w-5 text-blue-500" />
      case 'Shipped': return <TruckIcon className="h-5 w-5 text-purple-500" />
      case 'Pending': return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'Cancelled': return <XCircleIcon className="h-5 w-5 text-red-500" />
      default: return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Processing': return 'bg-blue-100 text-blue-800'
      case 'Shipped': return 'bg-purple-100 text-purple-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className={`flex-1 overflow-y-auto bg-gray-50 p-6 transition-all duration-300 ${sidebarOpen ? 'lg:pl-6' : 'lg:pl-6'}`}>
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                  <p className="text-gray-600">Manage and track customer orders</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Export
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    New Order
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  {getStatusIcon('Pending')}
                  <div className="ml-4">
                    <div className="text-sm text-gray-600">Pending</div>
                    <div className="text-2xl font-bold mt-1">12</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  {getStatusIcon('Processing')}
                  <div className="ml-4">
                    <div className="text-sm text-gray-600">Processing</div>
                    <div className="text-2xl font-bold mt-1">8</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  {getStatusIcon('Shipped')}
                  <div className="ml-4">
                    <div className="text-sm text-gray-600">Shipped</div>
                    <div className="text-2xl font-bold mt-1">15</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  {getStatusIcon('Completed')}
                  <div className="ml-4">
                    <div className="text-sm text-gray-600">Completed</div>
                    <div className="text-2xl font-bold mt-1">156</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.id}</div>
                          <div className="text-sm text-gray-500">{order.items} items</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="h-8 w-8 rounded-full"
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${order.customer}`}
                              alt={order.customer}
                            />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(order.status)}
                            <span className={`ml-2 px-3 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-blue-600 hover:text-blue-800" title="View">
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            <button className="p-1 text-green-600 hover:text-green-800" title="Print">
                              <PrinterIcon className="h-5 w-5" />
                            </button>
                            <button className="p-1 text-gray-600 hover:text-gray-800" title="Update Status">
                              <ArrowPathIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Order Activity</h2>
              <div className="space-y-4">
                {[
                  { order: '#ORD-001', action: 'Payment received', time: '10 min ago', color: 'bg-green-500' },
                  { order: '#ORD-002', action: 'Order shipped', time: '2 hours ago', color: 'bg-blue-500' },
                  { order: '#ORD-003', action: 'Order processing', time: '3 hours ago', color: 'bg-yellow-500' },
                  { order: '#ORD-004', action: 'New order placed', time: '5 hours ago', color: 'bg-purple-500' },
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className={`h-3 w-3 rounded-full ${activity.color} mr-3`}></div>
                    <div className="flex-1">
                      <span className="font-medium">{activity.order}</span>
                      <span className="text-gray-600 ml-2">{activity.action}</span>
                    </div>
                    <div className="text-sm text-gray-500">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Orders