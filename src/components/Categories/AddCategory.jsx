import React, { useState } from 'react'
import { 
  ArrowLeftIcon,
  FolderIcon,
  TagIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from '../Sidebar'
import Navbar from '../Navbar'

const AddCategory = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active',
    color: 'blue',
    parentCategory: ''
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field if user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Category name is required'
    if (formData.name.length > 50) newErrors.name = 'Category name must be less than 50 characters'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Generate random product count for demo (between 10-100)
    const randomProducts = Math.floor(Math.random() * 91) + 10

    // Create new category object
    const newCategory = {
      id: Date.now(), // Generate unique ID
      name: formData.name,
      description: formData.description,
      status: formData.status,
      products: randomProducts,
      color: getColorClass(formData.color)
    }

    // Get existing categories from localStorage
    let existingCategories = []
    try {
      const storedCategories = localStorage.getItem('categories')
      existingCategories = storedCategories ? JSON.parse(storedCategories) : []
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      existingCategories = []
    }

    // Add new category at the beginning of the array
    const updatedCategories = [newCategory, ...existingCategories]
    
    // Save to localStorage
    try {
      localStorage.setItem('categories', JSON.stringify(updatedCategories))
      
      // Show success message
      alert('Category added successfully!')
      
      // Redirect to categories page
      navigate('/categories')
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      alert('Error saving category. Please try again.')
    }
  }

  const getColorClass = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      green: 'bg-green-100 text-green-800',
      orange: 'bg-orange-100 text-orange-800',
      red: 'bg-red-100 text-red-800',
      pink: 'bg-pink-100 text-pink-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      indigo: 'bg-indigo-100 text-indigo-800'
    }
    return colorMap[color] || 'bg-blue-100 text-blue-800'
  }

  const colorOptions = [
    { value: 'blue', label: 'Blue', color: 'bg-blue-500' },
    { value: 'purple', label: 'Purple', color: 'bg-purple-500' },
    { value: 'green', label: 'Green', color: 'bg-green-500' },
    { value: 'orange', label: 'Orange', color: 'bg-orange-500' },
    { value: 'red', label: 'Red', color: 'bg-red-500' },
    { value: 'pink', label: 'Pink', color: 'bg-pink-500' },
    { value: 'yellow', label: 'Yellow', color: 'bg-yellow-500' },
    { value: 'indigo', label: 'Indigo', color: 'bg-indigo-500' }
  ]

  const parentCategories = [
    { id: '', name: 'None (Main Category)' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'home', name: 'Home & Kitchen' },
    { id: 'sports', name: 'Sports' }
  ]

  return (
    <div className="flex h-screen">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className={`flex-1 overflow-y-auto bg-gray-50 p-6 transition-all duration-300 ${sidebarOpen ? 'lg:pl-6' : 'lg:pl-6'}`}>
          <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Link 
                    to="/categories" 
                    className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                  </Link>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Category</h1>
                    <p className="text-gray-600">Create a new product category</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <FolderIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Category Information
                </h2>
                
                <div className="space-y-6">
                  {/* Category Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter category name"
                      maxLength="50"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      {formData.name.length}/50 characters
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.description ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter category description"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.status === 'Active' ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:bg-gray-50'
                      }`}>
                        <input
                          type="radio"
                          name="status"
                          value="Active"
                          checked={formData.status === 'Active'}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <CheckCircleIcon className={`h-5 w-5 mr-3 ${
                          formData.status === 'Active' ? 'text-green-500' : 'text-gray-400'
                        }`} />
                        <div>
                          <div className="font-medium">Active</div>
                          <div className="text-sm text-gray-500">Category will be visible</div>
                        </div>
                      </label>
                      <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.status === 'Inactive' ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:bg-gray-50'
                      }`}>
                        <input
                          type="radio"
                          name="status"
                          value="Inactive"
                          checked={formData.status === 'Inactive'}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <XCircleIcon className={`h-5 w-5 mr-3 ${
                          formData.status === 'Inactive' ? 'text-red-500' : 'text-gray-400'
                        }`} />
                        <div>
                          <div className="font-medium">Inactive</div>
                          <div className="text-sm text-gray-500">Category will be hidden</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Color Theme
                    </label>
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                      {colorOptions.map((color) => (
                        <label 
                          key={color.value} 
                          className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all ${
                            formData.color === color.value ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="color"
                            value={color.value}
                            checked={formData.color === color.value}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className={`h-8 w-8 rounded-full ${color.color} mb-2`}></div>
                          <span className="text-xs text-gray-700">{color.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Parent Category (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parent Category (Optional)
                    </label>
                    <select
                      name="parentCategory"
                      value={formData.parentCategory}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {parentCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Leave as "None" to create a main category
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <TagIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Preview
                </h2>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`h-12 w-12 rounded-lg ${getColorClass(formData.color).split(' ')[0]} flex items-center justify-center`}>
                        <FolderIcon className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {formData.name || 'Category Name'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formData.description || 'Category description will appear here'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Products:</span>
                      <span className="font-medium">~100 items</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        formData.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {formData.status || 'Active'}
                      </span>
                    </div>
                    <div className="pt-3 border-t">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500"
                          style={{ width: '75%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                  <Link
                    to="/categories"
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-center"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Create Category
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AddCategory