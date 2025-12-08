import { useState } from 'react'
import { 
  PlusIcon,
  UserIcon,
  PencilIcon,
  TrashIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import Sidebar from '../Sidebar'
import Navbar from '../Navbar'

const Users = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', phone: '+1 234 567 8900', joinDate: '2023-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', status: 'Active', phone: '+1 234 567 8901', joinDate: '2023-02-20' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'Inactive', phone: '+1 234 567 8902', joinDate: '2023-03-10' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Viewer', status: 'Active', phone: '+1 234 567 8903', joinDate: '2023-04-05' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Manager', status: 'Active', phone: '+1 234 567 8904', joinDate: '2023-05-15' },
  ]

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-800'
      case 'Manager': return 'bg-blue-100 text-blue-800'
      case 'Editor': return 'bg-green-100 text-green-800'
      case 'Viewer': return 'bg-gray-100 text-gray-800'
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
                  <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                  <p className="text-gray-600">Manage user accounts and permissions</p>
                </div>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add User
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                              alt={user.name}
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">ID: #{user.id.toString().padStart(3, '0')}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-900">
                              <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                              {user.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                              {user.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {user.status === 'Active' ? (
                              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                            ) : (
                              <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                            )}
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.joinDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-blue-600 hover:text-blue-800" title="Edit">
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button className="p-1 text-red-600 hover:text-red-800" title="Delete">
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <UserIcon className="h-8 w-8 text-blue-500 mr-4" />
                  <div>
                    <div className="text-sm text-gray-600">Total Users</div>
                    <div className="text-2xl font-bold mt-1">156</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-8 w-8 text-green-500 mr-4" />
                  <div>
                    <div className="text-sm text-gray-600">Active Users</div>
                    <div className="text-2xl font-bold mt-1">142</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <UserIcon className="h-8 w-8 text-purple-500 mr-4" />
                  <div>
                    <div className="text-sm text-gray-600">Admins</div>
                    <div className="text-2xl font-bold mt-1">8</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <UserIcon className="h-8 w-8 text-orange-500 mr-4" />
                  <div>
                    <div className="text-sm text-gray-600">New This Month</div>
                    <div className="text-2xl font-bold mt-1">12</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Users