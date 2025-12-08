import { useState } from 'react'
import { 
  PlusIcon,
  ReceiptRefundIcon,
  EyeIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import Sidebar from '../Sidebar'
import Navbar from '../Navbar'

const Invoices = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const invoices = [
    { id: '#INV-001', client: 'Tech Corp Inc.', date: '2024-01-15', amount: '$1,250.00', status: 'Paid', dueDate: '2024-02-15' },
    { id: '#INV-002', client: 'Global Retail', date: '2024-01-14', amount: '$890.50', status: 'Pending', dueDate: '2024-02-14' },
    { id: '#INV-003', client: 'Innovate Solutions', date: '2024-01-13', amount: '$2,340.00', status: 'Paid', dueDate: '2024-02-13' },
    { id: '#INV-004', client: 'Startup Ventures', date: '2024-01-12', amount: '$560.75', status: 'Overdue', dueDate: '2024-01-31' },
    { id: '#INV-005', client: 'Enterprise Ltd.', date: '2024-01-11', amount: '$3,780.20', status: 'Paid', dueDate: '2024-02-11' },
  ]

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid': return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'Pending': return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'Overdue': return <XCircleIcon className="h-5 w-5 text-red-500" />
      default: return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Overdue': return 'bg-red-100 text-red-800'
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
                  <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
                  <p className="text-gray-600">Manage and track your invoices</p>
                </div>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create Invoice
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <ReceiptRefundIcon className="h-8 w-8 text-blue-500 mr-4" />
                  <div>
                    <div className="text-sm text-gray-600">Total Invoices</div>
                    <div className="text-2xl font-bold mt-1">48</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-8 w-8 text-green-500 mr-4" />
                  <div>
                    <div className="text-sm text-gray-600">Paid</div>
                    <div className="text-2xl font-bold mt-1">32</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <ClockIcon className="h-8 w-8 text-yellow-500 mr-4" />
                  <div>
                    <div className="text-sm text-gray-600">Pending</div>
                    <div className="text-2xl font-bold mt-1">12</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <XCircleIcon className="h-8 w-8 text-red-500 mr-4" />
                  <div>
                    <div className="text-sm text-gray-600">Overdue</div>
                    <div className="text-2xl font-bold mt-1">4</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{invoice.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{invoice.client}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {invoice.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.dueDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(invoice.status)}
                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(invoice.status)}`}>
                              {invoice.status}
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
                            <button className="p-1 text-purple-600 hover:text-purple-800" title="Download">
                              <ArrowDownTrayIcon className="h-5 w-5" />
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
            <div className="mt-8 bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Invoice Activity</h2>
              <div className="space-y-4">
                {[
                  { invoice: '#INV-001', action: 'Payment received', time: '2 hours ago', color: 'bg-green-500' },
                  { invoice: '#INV-002', action: 'Invoice sent', time: '5 hours ago', color: 'bg-blue-500' },
                  { invoice: '#INV-004', action: 'Reminder sent', time: '1 day ago', color: 'bg-red-500' },
                  { invoice: '#INV-003', action: 'Invoice generated', time: '2 days ago', color: 'bg-purple-500' },
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className={`h-3 w-3 rounded-full ${activity.color} mr-3`}></div>
                    <div className="flex-1">
                      <span className="font-medium">{activity.invoice}</span>
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

export default Invoices