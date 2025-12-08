import { useState, useEffect } from 'react'
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FolderIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import Sidebar from '../Sidebar'
import Navbar from '../Navbar'

const Categories = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [categories, setCategories] = useState([])

  // Load categories from localStorage
  useEffect(() => {
    loadCategoriesFromStorage()
    
    // Listen for storage events
    const handleStorageChange = (e) => {
      if (e.key === 'categories') {
        loadCategoriesFromStorage()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const loadCategoriesFromStorage = () => {
    try {
      const savedCategories = JSON.parse(localStorage.getItem('categories') || '[]')
      if (savedCategories.length > 0) {
        setCategories(savedCategories)
      } else {
        // Default categories if none exist
        const defaultCategories = [
          { id: 1, name: 'Electronics', description: 'Electronic devices and accessories', products: 45, status: 'Active', color: 'bg-blue-100 text-blue-800' },
          { id: 2, name: 'Fashion', description: 'Clothing and accessories', products: 89, status: 'Active', color: 'bg-purple-100 text-purple-800' },
          { id: 3, name: 'Home & Kitchen', description: 'Home appliances and kitchenware', products: 67, status: 'Active', color: 'bg-green-100 text-green-800' },
          { id: 4, name: 'Sports', description: 'Sports equipment and gear', products: 34, status: 'Active', color: 'bg-orange-100 text-orange-800' },
          { id: 5, name: 'Books', description: 'Books and educational materials', products: 23, status: 'Inactive', color: 'bg-red-100 text-red-800' },
          { id: 6, name: 'Beauty', description: 'Beauty and personal care', products: 56, status: 'Active', color: 'bg-pink-100 text-pink-800' },
        ]
        setCategories(defaultCategories)
        localStorage.setItem('categories', JSON.stringify(defaultCategories))
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  // Save categories to localStorage whenever they change
  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem('categories', JSON.stringify(categories))
    }
  }, [categories])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  const handleDeleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const updatedCategories = categories.filter(category => category.id !== id)
      setCategories(updatedCategories)
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
                  <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                  <p className="text-gray-600">Organize your products into categories</p>
                  <div className="mt-2 text-sm text-gray-500">
                    Total: {categories.length} categories
                  </div>
                </div>
                <Link 
                  to="/categories/add"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Category
                </Link>
              </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {categories.length === 0 ? (
                <div className="col-span-3 text-center py-12">
                  <FolderIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No categories found</h3>
                  <p className="text-gray-500">Add your first category to get started</p>
                  <Link 
                    to="/categories/add"
                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Category
                  </Link>
                </div>
              ) : (
                categories.map((category) => (
                  <div key={category.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`h-12 w-12 rounded-lg ${category.color.split(' ')[0]} flex items-center justify-center`}>
                          <FolderIcon className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-500">{category.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-blue-600 hover:text-blue-800" title="Edit">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button 
                          className="p-1 text-red-600 hover:text-red-800" 
                          title="Delete"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Products:</span>
                        <span className="font-medium">{category.products} items</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          category.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {category.status}
                        </span>
                      </div>
                      <div className="pt-3 border-t">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500"
                            style={{ width: `${Math.min((category.products / 100) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Category Tree */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Hierarchy</h2>
              <div className="space-y-2">
                {categories.slice(0, 3).map((category, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <FolderIcon className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="font-medium">{category.name}</span>
                      <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                        {category.products} products
                      </span>
                    </div>
                    <div className="ml-7 space-y-1">
                      {['Sub-category 1', 'Sub-category 2', 'Sub-category 3'].map((child, childIdx) => (
                        <div key={childIdx} className="flex items-center text-sm text-gray-600">
                          <div className="h-1 w-4 border-t border-gray-300 mr-2"></div>
                          <FolderIcon className="h-4 w-4 text-gray-400 mr-2" />
                          {child}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                    <FolderIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Categories</div>
                    <div className="text-2xl font-bold mt-1">{categories.length}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mr-4">
                    <PhotoIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Active Categories</div>
                    <div className="text-2xl font-bold mt-1">{categories.filter(c => c.status === 'Active').length}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center mr-4">
                    <div className="text-orange-600 font-bold">∅</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Avg. Products per Category</div>
                    <div className="text-2xl font-bold mt-1">
                      {categories.length > 0 
                        ? Math.round(categories.reduce((sum, cat) => sum + cat.products, 0) / categories.length)
                        : 0}
                    </div>
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

export default Categories