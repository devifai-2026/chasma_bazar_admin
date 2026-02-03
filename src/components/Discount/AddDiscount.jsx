import React, { useState, useEffect } from 'react'
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
  SparklesIcon,
  CubeIcon,
  BuildingOfficeIcon,
  RectangleStackIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from '../Sidebar'
import Navbar from '../Navbar'
import { createDiscount } from '../../Api/discountApi'
import toast from 'react-hot-toast'

const AddDiscount = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    maxDiscount: '',
    applicableOn: 'global',
    // Schema-specific fields
    applicableProducts: [],
    applicableFrames: [],
    applicableCompanies: [],
    applicableCategories: [],
    priority: '',
    canStackWithOther: false,
    canStackWithPromo: true,
    startDate: '',
    endDate: '',
    usageLimit: '',
    usageCount: 0,
    minOrderValue: '',
    minQuantity: 1,
    isActive: true,
    isAutoApplied: false,
    createdBy: null, // Will be set from auth context
    isDeleted: false
  })
  const [errors, setErrors] = useState({})
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [products, setProducts] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [loadingFrames, setLoadingFrames] = useState(false)
  const [frames, setFrames] = useState([])
  const [selectedFrames, setSelectedFrames] = useState([])
  const [loadingCompanies, setLoadingCompanies] = useState(false)
  const [companies, setCompanies] = useState([])
  const [selectedCompanies, setSelectedCompanies] = useState([])
  const [loading, setLoading] = useState(false)
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

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleApplicableChange = (name, selectedItems) => {
    setFormData(prev => ({
      ...prev,
      [name]: selectedItems.map(item => item._id || item.id)
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Discount name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.discountValue || formData.discountValue <= 0) newErrors.discountValue = 'Valid discount value is required'
    if (formData.discountType === 'percentage' && formData.discountValue > 100) newErrors.discountValue = 'Percentage cannot exceed 100%'
    if (!formData.priority || formData.priority < 0) newErrors.priority = 'Valid priority is required'
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    if (!formData.endDate) newErrors.endDate = 'End date is required'

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date'
      }
    }

    // Validate applicable items for non-global discounts
    if (formData.applicableOn !== 'global') {
      const applicableField = `applicable${formData.applicableOn.charAt(0).toUpperCase() + formData.applicableOn.slice(1)}s`
      if (!formData[applicableField] || formData[applicableField].length === 0) {
        newErrors[`applicable${formData.applicableOn}`] = `Please select at least one ${formData.applicableOn}`
      }
    }

    return newErrors
  }

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true)
      // Replace with your actual API call
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoadingProducts(false)
    }
  }

  const fetchFrames = async () => {
    try {
      setLoadingFrames(true)
      const response = await fetch('/api/frames')
      const data = await response.json()
      setFrames(data)
    } catch (error) {
      console.error('Error fetching frames:', error)
    } finally {
      setLoadingFrames(false)
    }
  }

  const fetchCompanies = async () => {
    try {
      setLoadingCompanies(true)
      const response = await fetch('/api/companies')
      const data = await response.json()
      setCompanies(data)
    } catch (error) {
      console.error('Error fetching companies:', error)
    } finally {
      setLoadingCompanies(false)
    }
  }

  // Fetch data based on applicableOn selection
  useEffect(() => {
    if (formData.applicableOn === 'product') {
      fetchProducts()
    } else if (formData.applicableOn === 'frame') {
      fetchFrames()
    } else if (formData.applicableOn === 'company') {
      fetchCompanies()
    }
  }, [formData.applicableOn])


   const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;
    

    console.log(userId);

  const handleSubmit = async (e) => {
    e.preventDefault()
   
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the errors in the form before submitting.');
      return
    }

    // Prepare data according to schema
    const discountData = {
      name: formData.name,
      description: formData.description,
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue),
      maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : undefined,
      applicableOn: formData.applicableOn,
      applicableProducts: formData.applicableOn === 'product' ? formData.applicableProducts : [],
      applicableFrames: formData.applicableOn === 'frame' ? formData.applicableFrames : [],
      applicableCompanies: formData.applicableOn === 'company' ? formData.applicableCompanies : [],
      applicableCategories: formData.applicableOn === 'category' ? formData.applicableCategories : [],
      priority: parseInt(formData.priority),
      canStackWithOther: formData.canStackWithOther,
      canStackWithPromo: formData.canStackWithPromo,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
      minOrderValue: formData.minOrderValue ? parseFloat(formData.minOrderValue) : 0,
      minQuantity: parseInt(formData.minQuantity),
      isActive: formData.isActive,
      isAutoApplied: formData.isAutoApplied,
      createdBy: userId || null,
      // Note: createdBy will be set from req.user in the backend middleware
    }

    try {
      setLoading(true)

      // Call the API function
      const response = await createDiscount(discountData)

      if (response.success) {
        toast.success('Discount added successfully!');
        
        navigate('/discount')
      } else {
        // Handle backend validation errors
        const backendErrors = {}
        if (response.message.includes('required fields')) {
          backendErrors.general = response.message
        } else if (response.message.includes('Percentage discount cannot exceed')) {
          backendErrors.discountValue = response.message
        } else if (response.message.includes('End date must be after')) {
          backendErrors.endDate = response.message
        } else {
          backendErrors.general = response.message
        }
        setErrors(prev => ({ ...prev, ...backendErrors }))

        toast.error(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error('Error saving discount:', error)
      toast.error('Error saving discount. Please try again.');
      
    } finally {
      setLoading(false)
    }
  }

  const MultiSelectField = ({ label, options, selectedItems, onSelectChange, loading, name }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
        {loading ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : (
          options.map((item) => (
            <label key={item._id || item.id} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={selectedItems.some(s => s._id === item._id || s.id === item.id)}
                onChange={(e) => {
                  const newSelected = e.target.checked
                    ? [...selectedItems, item]
                    : selectedItems.filter(s => s._id !== item._id && s.id !== item.id)
                  onSelectChange(name, newSelected)
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
              />
              <span className="text-sm">{item.name || item.title}</span>
            </label>
          ))
        )}
      </div>
      {selectedItems.length > 0 && (
        <p className="mt-1 text-sm text-blue-600">{selectedItems.length} selected</p>
      )}
    </div>
  )

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
                  <Link to="/discount" className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
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
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                      placeholder="e.g., Summer Sale 20%"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.description ? 'border-red-300' : 'border-gray-300'}`}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type *</label>
                    <select
                      name="discountType"
                      value={formData.discountType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>

                  {/* Discount Value */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {formData.discountType === 'percentage' ? (
                          <span className="text-gray-500">%</span>
                        ) : (
                          <span className="text-gray-500">₹</span>
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
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.discountValue ? 'border-red-300' : 'border-gray-300'}`}
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

                  {/* Max Discount */}
                  {formData.discountType === 'percentage' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Discount (₹)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">₹</span>
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
                    </div>
                  )}

                  {/* Applicable On */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Applicable On *</label>
                    <select

                      name="applicableOn"
                      value={formData.applicableOn}
                      onChange={handleChange}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="global">Global (All Products)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Applicable Items Section - Conditional */}
              {formData.applicableOn !== 'global' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <RectangleStackIcon className="h-5 w-5 mr-2 text-blue-500" />
                    Select Applicable Items
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {formData.applicableOn === 'product' && (
                      <MultiSelectField
                        label="Products"
                        options={products}
                        selectedItems={selectedProducts}
                        onSelectChange={(name, items) => {
                          setSelectedProducts(items)
                          handleApplicableChange('applicableProducts', items)
                        }}
                        loading={loadingProducts}
                        name="applicableProducts"
                      />
                    )}

                    {formData.applicableOn === 'frame' && (
                      <MultiSelectField
                        label="Frames"
                        options={frames}
                        selectedItems={selectedFrames}
                        onSelectChange={(name, items) => {
                          setSelectedFrames(items)
                          handleApplicableChange('applicableFrames', items)
                        }}
                        loading={loadingFrames}
                        name="applicableFrames"
                      />
                    )}

                    {formData.applicableOn === 'company' && (
                      <MultiSelectField
                        label="Companies"
                        options={companies}
                        selectedItems={selectedCompanies}
                        onSelectChange={(name, items) => {
                          setSelectedCompanies(items)
                          handleApplicableChange('applicableCompanies', items)
                        }}
                        loading={loadingCompanies}
                        name="applicableCompanies"
                      />
                    )}

                    {formData.applicableOn === 'category' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                        {['Men', 'Women', 'Kids'].map(category => (
                          <label key={category} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.applicableCategories.includes(category)}
                              onChange={(e) => {
                                const newCategories = e.target.checked
                                  ? [...formData.applicableCategories, category]
                                  : formData.applicableCategories.filter(c => c !== category)
                                setFormData(prev => ({ ...prev, applicableCategories: newCategories }))
                              }}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                            />
                            <span className="text-sm capitalize">{category}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors[`applicable${formData.applicableOn}`] && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                      {errors[`applicable${formData.applicableOn}`]}
                    </p>
                  )}
                </div>
              )}

              {/* Usage Limits & Requirements Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <SparklesIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Usage Limits & Requirements
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit (optional)</label>
                    <input
                      type="number"
                      name="usageLimit"
                      value={formData.usageLimit}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 1000 uses total"
                    />
                    <p className="mt-1 text-sm text-gray-500">Total number of times this discount can be used</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Order Value (₹)</label>
                    <input
                      type="number"
                      name="minOrderValue"
                      value={formData.minOrderValue}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Quantity</label>
                    <input
                      type="number"
                      name="minQuantity"
                      value={formData.minQuantity}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 2"
                    />
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.priority ? 'border-red-300' : 'border-gray-300'}`}
                    >
                      <option value="">Select priority</option>
                      {[1, 5, 10, 20, 50].map(p => (
                        <option key={p} value={p}>{p} - Priority Level</option>
                      ))}
                    </select>
                    <p className="mt-1 text-sm text-gray-500">Higher number = higher priority</p>
                    {errors.priority && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.priority}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="canStackWithOther"
                        checked={formData.canStackWithOther}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">Can stack with other discounts</label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="canStackWithPromo"
                        checked={formData.canStackWithPromo}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">Can stack with promo codes</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date & Status Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
                    Date Range
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CalendarIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="datetime-local"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.startDate ? 'border-red-300' : 'border-gray-300'}`}
                        />
                      </div>
                      {errors.startDate && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                          {errors.startDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
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
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.endDate ? 'border-red-300' : 'border-gray-300'}`}
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

                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <BoltIcon className="h-5 w-5 mr-2 text-blue-500" />
                    Status Settings
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <div className="flex items-center space-x-6">
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

                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        name="isAutoApplied"
                        checked={formData.isAutoApplied}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        Auto-apply discount
                        <span className="block text-xs text-gray-500">
                          Automatically apply to eligible items in cart
                        </span>
                      </label>
                    </div>
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
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Adding...' : 'Add Discount'}
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