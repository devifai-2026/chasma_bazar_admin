import React, { useState } from 'react'
import { 
  ArrowLeftIcon,
  TagIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  BoltIcon,
  StarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from '../Sidebar'
import Navbar from '../Navbar'

const AddDiscount = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    maxDiscount: '',
    applicableOn: 'global',
    priority: '',
    canStackWithOther: false,
    canStackWithPromo: true,
    startDate: '',
    endDate: '',
    isActive: true,
    isAutoApplied: false
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
               type === 'number' ? parseFloat(value) || '' : value
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
    
    if (!formData.name.trim()) newErrors.name = 'Discount name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.discountValue || formData.discountValue <= 0) newErrors.discountValue = 'Valid discount value is required'
    if (formData.discountType === 'percentage' && formData.discountValue > 100) newErrors.discountValue = 'Percentage cannot exceed 100%'
    if (!formData.priority || formData.priority < 1) newErrors.priority = 'Valid priority is required (1-100)'
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    if (!formData.endDate) newErrors.endDate = 'End date is required'
    
    // Date validation
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date'
      }
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Prepare the discount data according to API structure
    const newDiscount = {
      name: formData.name,
      description: formData.description,
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue),
      maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
      applicableOn: formData.applicableOn,
      priority: parseInt(formData.priority),
      canStackWithOther: formData.canStackWithOther,
      canStackWithPromo: formData.canStackWithPromo,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      isActive: formData.isActive,
      isAutoApplied: formData.isAutoApplied
    }

    try {
      // Here you would make an API call to your backend
      // For now, we'll simulate with localStorage
      let existingDiscounts = []
      try {
        const storedDiscounts = localStorage.getItem('discounts')
        existingDiscounts = storedDiscounts ? JSON.parse(storedDiscounts) : []
      } catch (error) {
        console.error('Error reading from localStorage:', error)
        existingDiscounts = []
      }

      const updatedDiscounts = [newDiscount, ...existingDiscounts]
      localStorage.setItem('discounts', JSON.stringify(updatedDiscounts))
      localStorage.setItem('discounts_updated', Date.now().toString())
      
      alert('Discount added successfully!')
      navigate('/discount')
    } catch (error) {
      console.error('Error saving discount:', error)
      alert('Error saving discount. Please try again.')
    }
  }

  const discountTypes = [
    { value: 'percentage', label: 'Percentage (%)' },
    { value: 'fixed', label: 'Fixed Amount (₹)' },
    { value: 'buy_x_get_y', label: 'Buy X Get Y' },
    { value: 'free_shipping', label: 'Free Shipping' }
  ]

  const applicableOnOptions = [
    { value: 'global', label: 'Global (All Products)' },
    { value: 'category', label: 'Specific Categories' },
    { value: 'product', label: 'Specific Products' },
    { value: 'company', label: 'Specific Companies' },
    { value: 'frame', label: 'Specific Frames' }
  ]

  const priorityOptions = [
    { value: 1, label: '1 - Highest' },
    { value: 5, label: '5 - High' },
    { value: 10, label: '10 - Medium' },
    { value: 20, label: '20 - Low' },
    { value: 50, label: '50 - Lowest' }
  ]

  // Calculate today's date for min date restrictions
  const today = new Date().toISOString().split('T')[0]

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
                    to="/discount" 
                    className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                  </Link>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Discount</h1>
                    <p className="text-gray-600">Create discount rules and promotions</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Basic Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Discount Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Summer Sale 20%"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
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
                      placeholder="Describe the discount offer..."
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Discount Details Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <TagIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Discount Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Discount Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Type *
                    </label>
                    <select
                      name="discountType"
                      value={formData.discountType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {discountTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Discount Value */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Value *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {formData.discountType === 'percentage' ? (
                          <span className="text-gray-500">%</span>
                        ) : (
                          <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <input
                        type="number"
                        name="discountValue"
                        value={formData.discountValue}
                        onChange={handleChange}
                        step={formData.discountType === 'percentage' ? '0.1' : '1'}
                        min="0"
                        max={formData.discountType === 'percentage' ? '100' : undefined}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.discountValue ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder={formData.discountType === 'percentage' ? 'e.g., 20' : 'e.g., 100'}
                      />
                    </div>
                    {errors.discountValue && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.discountValue}
                      </p>
                    )}
                  </div>

                  {/* Max Discount (for percentage) */}
                  {formData.discountType === 'percentage' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Discount (₹)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          name="maxDiscount"
                          value={formData.maxDiscount}
                          onChange={handleChange}
                          min="0"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., 1000 (optional)"
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Maximum discount amount in ₹ (leave empty for no limit)
                      </p>
                    </div>
                  )}

                  {/* Applicable On */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Applicable On
                    </label>
                    <select
                      name="applicableOn"
                      value={formData.applicableOn}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {applicableOnOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Priority & Stacking Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <StarIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Priority & Stacking Rules
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority *
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.priority ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select priority</option>
                      {priorityOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <p className="mt-1 text-sm text-gray-500">
                      Lower number = higher priority (1 is highest)
                    </p>
                    {errors.priority && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.priority}
                      </p>
                    )}
                  </div>

                  {/* Stacking Options */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="canStackWithOther"
                        checked={formData.canStackWithOther}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        Can stack with other discounts
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="canStackWithPromo"
                        checked={formData.canStackWithPromo}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        Can stack with promo codes
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date & Time Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Date & Time Settings
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="datetime-local"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.startDate ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.startDate}
                      </p>
                    )}
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="datetime-local"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        min={formData.startDate || today}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.endDate ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.endDate}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <BoltIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Status Settings
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Active Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="active"
                          name="isActive"
                          checked={formData.isActive === true}
                          onChange={() => setFormData(prev => ({ ...prev, isActive: true }))}
                          className="h-4 w-4 text-green-600 focus:ring-green-500"
                        />
                        <label htmlFor="active" className="ml-2 flex items-center">
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" />
                          <span className="text-sm text-gray-700">Active</span>
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="inactive"
                          name="isActive"
                          checked={formData.isActive === false}
                          onChange={() => setFormData(prev => ({ ...prev, isActive: false }))}
                          className="h-4 w-4 text-gray-600 focus:ring-gray-500"
                        />
                        <label htmlFor="inactive" className="ml-2 flex items-center">
                          <ExclamationCircleIcon className="h-5 w-5 text-gray-500 mr-1" />
                          <span className="text-sm text-gray-700">Inactive</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Auto Apply */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isAutoApplied"
                      checked={formData.isAutoApplied}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Auto-apply discount
                      <span className="block text-xs text-gray-500">
                        Automatically apply to eligible items
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                  <Link
                    to="/discount"
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-center"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Add Discount
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

export default AddDiscount