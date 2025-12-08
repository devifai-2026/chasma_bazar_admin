import { useState } from 'react'
import { 
  PlusIcon,
  DocumentIcon,
  FolderIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import Sidebar from '../Sidebar'
import Navbar from '../Navbar'

const Documents = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const documents = [
    { id: 1, name: 'Annual Report 2023', type: 'PDF', size: '2.4 MB', uploaded: '2024-01-15', status: 'Approved' },
    { id: 2, name: 'Project Proposal', type: 'DOCX', size: '1.8 MB', uploaded: '2024-01-14', status: 'Pending' },
    { id: 3, name: 'Financial Statement', type: 'XLSX', size: '3.2 MB', uploaded: '2024-01-13', status: 'Approved' },
    { id: 4, name: 'User Manual', type: 'PDF', size: '4.1 MB', uploaded: '2024-01-12', status: 'Rejected' },
    { id: 5, name: 'Meeting Notes', type: 'DOCX', size: '0.8 MB', uploaded: '2024-01-11', status: 'Approved' },
  ]

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

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
                  <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
                  <p className="text-gray-600">Manage your documents and files</p>
                </div>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Upload Document
                </button>
              </div>
            </div>

            {/* Documents Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <DocumentIcon className="h-8 w-8 text-blue-500 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                              <div className="text-sm text-gray-500">ID: #{doc.id.toString().padStart(3, '0')}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                            {doc.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doc.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doc.uploaded}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full flex items-center w-fit ${
                            doc.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            doc.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {doc.status === 'Approved' ? <CheckCircleIcon className="h-3 w-3 mr-1" /> :
                             doc.status === 'Pending' ? <ClockIcon className="h-3 w-3 mr-1" /> :
                             <TrashIcon className="h-3 w-3 mr-1" />}
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-blue-600 hover:text-blue-800" title="View">
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            <button className="p-1 text-green-600 hover:text-green-800" title="Download">
                              <ArrowDownTrayIcon className="h-5 w-5" />
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
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <FolderIcon className="h-8 w-8 text-blue-500 mr-4" />
                  <div>
                    <div className="text-sm text-gray-600">Total Documents</div>
                    <div className="text-2xl font-bold mt-1">156</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-8 w-8 text-green-500 mr-4" />
                  <div>
                    <div className="text-sm text-gray-600">Approved</div>
                    <div className="text-2xl font-bold mt-1">124</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <ClockIcon className="h-8 w-8 text-yellow-500 mr-4" />
                  <div>
                    <div className="text-sm text-gray-600">Pending</div>
                    <div className="text-2xl font-bold mt-1">18</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <DocumentIcon className="h-8 w-8 text-purple-500 mr-4" />
                  <div>
                    <div className="text-sm text-gray-600">Total Size</div>
                    <div className="text-2xl font-bold mt-1">2.4 GB</div>
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

export default Documents