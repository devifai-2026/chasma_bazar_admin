import React, { useState, useEffect } from 'react'
import {
  ArrowLeftIcon,
  TicketIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  TagIcon,
  UsersIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from '../Sidebar'
import Navbar from '../Navbar'
import { createPromoCode } from '../../Api/promoCodeApi'
import { getAllProducts } from '../../Api/productApi'
import { getFrames } from '../../Api/frameapi'
import { getAllCompanies } from '../../Api/companyApi'
import toast from 'react-hot-toast'

const AddPromo = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [frames, setFrames] = useState([])
  const [companies, setCompanies] = useState([])
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    maxDiscount: '',
    minOrderValue: '',
    usageLimit: '',
    applicableProducts: [],
    applicableFrames: [],
    applicableCompanies: [],
    startDate: '',
    endDate: '',
    isActive: true
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  // Fetch products, frames, and companies on component mount
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, framesRes, companiesRes] = await Promise.all([
        getAllProducts(),
        getFrames(),
        getAllCompanies()
      ])

      setProducts(productsRes.data || [])
      setFrames(framesRes.data || [])
      setCompanies(companiesRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

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

    if (!formData.code.trim()) {
      newErrors.code = 'Promo code is required'
    } else if (!/^[A-Z0-9_-]+$/.test(formData.code)) {
      newErrors.code = 'Only uppercase letters, numbers, hyphens and underscores allowed'
    }

    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.discountValue || formData.discountValue <= 0) newErrors.discountValue = 'Valid discount value is required'
    if (formData.discountType === 'percentage' && formData.discountValue > 100) newErrors.discountValue = 'Percentage cannot exceed 100%'
    if (!formData.minOrderValue || formData.minOrderValue < 0) newErrors.minOrderValue = 'Valid minimum order value is required'
    if (!formData.usageLimit || formData.usageLimit <= 0) newErrors.usageLimit = 'Usage limit is required'
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    if (!formData.endDate) newErrors.endDate = 'End date is required'

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      if (end <= start) newErrors.endDate = 'End date must be after start date'
    }

    return newErrors
  }

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData(prev => ({ ...prev, code: result }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the highlighted errors') // ✅ ADDED
      return
    }

    setIsLoading(true)

    // Prepare the promo code data according to API structure
    const newPromoCode = {
      code: formData.code.toUpperCase(),
      description: formData.description,
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue),
      maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
      minOrderValue: parseFloat(formData.minOrderValue),
      usageLimit: parseInt(formData.usageLimit),
      applicableProducts: formData.applicableProducts.length > 0 ? formData.applicableProducts : [],
      applicableFrames: formData.applicableFrames.length > 0 ? formData.applicableFrames : [],
      applicableCompanies: formData.applicableCompanies.length > 0 ? formData.applicableCompanies : [],
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      isActive: formData.isActive
    }

    try {
      const response = await createPromoCode(newPromoCode)
      toast.success('Promo code added successfully!')
      navigate('/promoCode')
    } catch (error) {
      console.error('Error saving promo code:', error)
      const errorMessage =
        error.response?.data?.message || 'Error saving promo code. Please try again.'
      setErrors({ submit: errorMessage })
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const discountTypes = [
    { value: 'percentage', label: 'Percentage (%)' },
    { value: 'fixed', label: 'Fixed Amount (₹)' }
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
                    to="/promoCode"
                    className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                  </Link>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Promo Code</h1>
                    <p className="text-gray-600">Create promotional codes for customers</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <TicketIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Promo Code Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Promo Code */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Promo Code *
                    </label>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          name="code"
                          value={formData.code}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono ${errors.code ? 'border-red-300' : 'border-gray-300'
                            }`}
                          placeholder="e.g., SUMMER20"
                          style={{ textTransform: 'uppercase' }}
                        />
                        {errors.code && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                            {errors.code}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={generateRandomCode}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 whitespace-nowrap"
                      >
                        Generate
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Use uppercase letters, numbers, hyphens or underscores
                    </p>
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
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.description ? 'border-red-300' : 'border-gray-300'
                        }`}
                      placeholder="Describe the promo code offer..."
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
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.discountValue ? 'border-red-300' : 'border-gray-300'
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

                  {/* Minimum Order Value */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Order Value (₹) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="minOrderValue"
                        value={formData.minOrderValue}
                        onChange={handleChange}
                        min="0"
                        step="1"
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.minOrderValue ? 'border-red-300' : 'border-gray-300'
                          }`}
                        placeholder="e.g., 2000"
                      />
                    </div>
                    {errors.minOrderValue && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.minOrderValue}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Usage Limits Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <UsersIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Usage Limits
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Usage Limit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Usage Limit *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UsersIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="usageLimit"
                        value={formData.usageLimit}
                        onChange={handleChange}
                        min="1"
                        step="1"
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.usageLimit ? 'border-red-300' : 'border-gray-300'
                          }`}
                        placeholder="e.g., 100"
                      />
                    </div>
                    {errors.usageLimit && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.usageLimit}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Maximum number of times this promo can be used
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex">
                        <ExclamationCircleIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                        <div className="text-sm text-blue-700">
                          <p className="font-medium">Usage Information</p>
                          <p className="mt-1">Usage count will start at 0. You can track usage in the promo codes list.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Applicable Items Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <TagIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Applicable Items (Optional)
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Applicable Products */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Products
                    </label>
                    <select
                      name="applicableProducts"
                      value={formData.applicableProducts.length > 0 ? formData.applicableProducts[0] : ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          setFormData(prev => ({
                            ...prev,
                            applicableProducts: [e.target.value]
                          }))
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="">Select Products (Optional)</option>
                      {products.map(product => (
                        <option key={product._id} value={product._id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-sm text-gray-500">
                      Leave empty to apply to all products
                    </p>
                  </div>

                  {/* Applicable Frames */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frames
                    </label>
                    <select
                      name="applicableFrames"
                      value={formData.applicableFrames.length > 0 ? formData.applicableFrames[0] : ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          setFormData(prev => ({
                            ...prev,
                            applicableFrames: [e.target.value]
                          }))
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="">Select Frames (Optional)</option>
                      {frames.map(frame => (
                        <option key={frame._id} value={frame._id}>
                          {frame.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-sm text-gray-500">
                      Leave empty to apply to all frames
                    </p>
                  </div>

                  {/* Applicable Companies */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Companies
                    </label>
                    <select
                      name="applicableCompanies"
                      value={formData.applicableCompanies.length > 0 ? formData.applicableCompanies[0] : ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          setFormData(prev => ({
                            ...prev,
                            applicableCompanies: [e.target.value]
                          }))
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="">Select Companies (Optional)</option>
                      {companies.map(company => (
                        <option key={company._id} value={company._id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-sm text-gray-500">
                      Leave empty to apply to all companies
                    </p>
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
                        min={today}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.startDate ? 'border-red-300' : 'border-gray-300'
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
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.endDate ? 'border-red-300' : 'border-gray-300'
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
                  <CheckCircleIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Status Settings
                </h2>

                <div className="grid grid-cols-1 gap-6">
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
                    <p className="mt-2 text-sm text-gray-500">
                      Inactive promo codes cannot be used by customers
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                {errors.submit && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{errors.submit}</p>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                  <Link
                    to="/promoCode"
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-center"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                  >
                    {isLoading ? 'Adding Promo Code...' : 'Add Promo Code'}
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

export default AddPromo