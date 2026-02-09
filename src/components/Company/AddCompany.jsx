import React, { useState } from 'react'
import { 
  ArrowLeftIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  StarIcon,
  LinkIcon,
  PhotoIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  GlobeAltIcon,
  CloudArrowUpIcon,
  TrashIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from '../Sidebar'
import Navbar from '../Navbar'
import cloudinary from '../../utils/cloudinary'
import { createCompany } from '../../Api/companyApi'
import toast from 'react-hot-toast'

const AddCompany = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pinCode: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      pinCode: ''
    },
    logo: {
      url: '',
      public_id: ''
    },
    establishedYear: '',
    rating: '',
    totalRatings: '',
    weblinks: [{ url: '', label: '' }]
  })
  const [errors, setErrors] = useState({})
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [logoPreview, setLogoPreview] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const navigate = useNavigate()

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  const handleChange = (e) => {
    const { name, value, type } = e.target
    
    // Clear submit error when user starts typing
    if (submitError) setSubmitError('')
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'number' ? parseFloat(value) || '' : value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || '' : value
      }))
    }
    
    const fieldName = name.includes('.') ? name.split('.')[0] : name
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }))
    }
  }

  const handleWeblinkChange = (index, field, value) => {
    const updatedWeblinks = [...formData.weblinks]
    updatedWeblinks[index][field] = value
    setFormData(prev => ({ ...prev, weblinks: updatedWeblinks }))
  }

  const addWeblink = () => {
    setFormData(prev => ({
      ...prev,
      weblinks: [...prev.weblinks, { url: '', label: '' }]
    }))
  }

  const removeWeblink = (index) => {
    if (formData.weblinks.length > 1) {
      const updatedWeblinks = formData.weblinks.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, weblinks: updatedWeblinks }))
    }
  }

  const uploadToCloudinary = async (file, customPublicId = '') => {
    setIsUploading(true)
    setUploadProgress(0)
    
    // Use custom public_id if provided, otherwise generate one
    const publicId = customPublicId || `company_logos/logo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      // Upload to Cloudinary using the imported instance
      const uploadOptions = {
        folder: 'company_logos',
        public_id: publicId,
        resource_type: 'image',
        transformation: [
          { width: 300, height: 300, crop: 'limit', quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      }

      const uploadResult = await cloudinary(file, uploadOptions)

      clearInterval(progressInterval)
      setUploadProgress(100)
      
      // Set the form data with Cloudinary response
      setFormData(prev => ({
        ...prev,
        logo: {
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id
        }
      }))
      
      setLogoPreview(uploadResult.secure_url)
      
      // Clear any existing logo errors
      if (errors.logo_url) {
        setErrors(prev => ({
          ...prev,
          logo_url: ''
        }))
      }
      
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
      }, 500)
      
      return uploadResult
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      setErrors(prev => ({
        ...prev,
        logo_url: error.message || 'Failed to upload logo. Please try again.'
      }))
      setIsUploading(false)
      setUploadProgress(0)
      return null
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        logo_url: 'Invalid file type. Please upload an image (JPEG, PNG, GIF, WebP, SVG).'
      }))

      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setErrors(prev => ({
        ...prev,
        logo_url: 'File size too large. Maximum size is 5MB.'
      }))
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Upload to Cloudinary using the public_id from form if provided
    await uploadToCloudinary(file, formData.logo.public_id)
  }

  const removeLogo = () => {
    setFormData(prev => ({
      ...prev,
      logo: {
        url: '',
        public_id: prev.logo.public_id // Keep the public_id if user entered one
      }
    }))
    setLogoPreview('')
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Required fields
    if (!formData.name.trim()) newErrors.name = 'Company name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.address.street.trim()) newErrors.address_street = 'Street address is required'
    if (!formData.address.city.trim()) newErrors.address_city = 'City is required'
    if (!formData.address.state.trim()) newErrors.address_state = 'State is required'
    if (!formData.address.country.trim()) newErrors.address_country = 'Country is required'
    if (!formData.address.pinCode.trim()) newErrors.address_pinCode = 'Address PIN Code is required'
    if (!formData.logo.url.trim()) newErrors.logo_url = 'Logo is required. Please upload a logo.'
    if (!formData.establishedYear) newErrors.establishedYear = 'Established year is required'
    if (!formData.rating || formData.rating < 0 || formData.rating > 5) newErrors.rating = 'Rating must be between 0 and 5'
    if (!formData.totalRatings || formData.totalRatings < 0) newErrors.totalRatings = 'Total ratings must be a positive number'

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    // Phone validation (basic)
    const phoneRegex = /^[0-9]{10}$/
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits'
    }

    // Validate weblinks
    formData.weblinks.forEach((weblink, index) => {
      if (weblink.url.trim() && !weblink.label.trim()) {
        newErrors[`weblink_label_${index}`] = 'Weblink label is required when URL is provided'
      }
      if (weblink.label.trim() && !weblink.url.trim()) {
        newErrors[`weblink_url_${index}`] = 'Weblink URL is required when label is provided'
      }
    })

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Clear previous errors
    setErrors({})
    setSubmitError('')
    
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the errors in the form before submitting.')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Prepare the company data according to API structure
      const newCompany = {
        name: formData.name,
        description: formData.description,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.address.street,
          city: formData.address.city,
          state: formData.address.state,
          country: formData.address.country,
          pinCode: formData.address.pinCode
        },
        logo: {
          url: formData.logo.url,
          public_id: formData.logo.public_id || `logo_${Date.now()}`
        },
        establishedYear: parseInt(formData.establishedYear),
        rating: parseFloat(formData.rating),
        totalRatings: parseInt(formData.totalRatings),
        weblinks: formData.weblinks.filter(link => link.url.trim() !== '' && link.label.trim() !== '')
      }

      // Call the API
    
      const response = await createCompany(newCompany)
      
      if (response.success) {
        setSubmitSuccess(true)
        toast.success('Company created successfully!')
        // Show success message for 2 seconds before navigating
        setTimeout(() => {
          navigate('/company')
        }, 2000)
      } else {
        setSubmitError(response.message || 'Failed to create company')
        toast.error(response.message || 'Failed to create company')
      }
    } catch (error) {
      console.error('Error creating company:', error)
      
      // Handle different types of errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const { data, status } = error.response
        
        if (status === 400) {
          // Handle validation errors from backend
          if (data.errors) {
            const backendErrors = {}
            Object.keys(data.errors).forEach(key => {
              backendErrors[key] = data.errors[key].message
            })
            setErrors(backendErrors)
          } else {
            setSubmitError(data.message || 'Validation failed')
          }
        } else if (status === 401) {
          setSubmitError('Unauthorized. Please log in again.')
        } else if (status === 409) {
          setSubmitError('Company with this name already exists')
        } else {
          setSubmitError(data.message || `Error: ${status}`)
        }
      } else if (error.request) {
        // The request was made but no response was received
        setSubmitError('Network error. Please check your connection.')
      } else {
        // Something happened in setting up the request that triggered an Error
        setSubmitError(error.message || 'An unexpected error occurred')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i)

  return (
    <div className="flex h-screen">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className={`flex-1 overflow-y-auto bg-gray-50 p-6 transition-all duration-300 ${sidebarOpen ? 'lg:pl-6' : 'lg:pl-6'}`}>
          <div className="mx-auto max-w-4xl">
            {/* Success Message */}
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <p className="text-green-700 font-medium">
                    Company created successfully! Redirecting to companies page...
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-red-700 font-medium">{submitError}</p>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Link 
                    to="/company" 
                    className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                  </Link>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Company</h1>
                    <p className="text-gray-600">Fill in the details to add a new company</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <BuildingOfficeIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Basic Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter company name"
                      disabled={isSubmitting || submitSuccess}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter email address"
                        disabled={isSubmitting || submitSuccess}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.phone ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter phone number"
                        disabled={isSubmitting || submitSuccess}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Established Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Established Year *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        name="establishedYear"
                        value={formData.establishedYear}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.establishedYear ? 'border-red-300' : 'border-gray-300'
                        }`}
                        disabled={isSubmitting || submitSuccess}
                      >
                        <option value="">Select year</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    {errors.establishedYear && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.establishedYear}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter company description..."
                    disabled={isSubmitting || submitSuccess}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Address Information Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Address Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Street */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.address_street ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter street address"
                      disabled={isSubmitting || submitSuccess}
                    />
                    {errors.address_street && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.address_street}
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.address_city ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter city"
                      disabled={isSubmitting || submitSuccess}
                    />
                    {errors.address_city && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.address_city}
                      </p>
                    )}
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.address_state ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter state"
                      disabled={isSubmitting || submitSuccess}
                    />
                    {errors.address_state && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.address_state}
                      </p>
                    )}
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.address_country ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter country"
                      disabled={isSubmitting || submitSuccess}
                    />
                    {errors.address_country && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.address_country}
                      </p>
                    )}
                  </div>

                  {/* Address PIN Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address PIN Code *
                    </label>
                    <input
                      type="text"
                      name="address.pinCode"
                      value={formData.address.pinCode}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.address_pinCode ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter PIN code"
                      disabled={isSubmitting || submitSuccess}
                    />
                    {errors.address_pinCode && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.address_pinCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Logo Information Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <PhotoIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Logo Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* File Upload */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Logo *
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                      errors.logo_url ? 'border-red-300' : 'border-gray-300'
                    }`}>
                      {!logoPreview && !isUploading ? (
                        <div className="space-y-4">
                          <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto" />
                          <div>
                            <p className="text-sm text-gray-600">
                              Drag and drop your logo here, or
                            </p>
                            <label className={`inline-block mt-2 px-4 py-2 rounded-lg cursor-pointer ${
                              isSubmitting || submitSuccess
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}>
                              Browse Files
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                                disabled={isUploading || isSubmitting || submitSuccess}
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">
                            Supports: JPEG, PNG, GIF, WebP, SVG (Max 5MB)
                          </p>
                        </div>
                      ) : isUploading ? (
                        <div className="space-y-4">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-600">Uploading to Cloudinary... {uploadProgress}%</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="h-32 w-32 object-contain mx-auto border rounded-lg"
                          />
                          <div className="flex justify-center space-x-4">
                            <label className={`px-4 py-2 rounded-lg cursor-pointer ${
                              isSubmitting || submitSuccess
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}>
                              Change Logo
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                                disabled={isSubmitting || submitSuccess}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={removeLogo}
                              disabled={isSubmitting || submitSuccess}
                              className={`px-4 py-2 rounded-lg flex items-center ${
                                isSubmitting || submitSuccess
                                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  : 'bg-red-100 text-red-600 hover:bg-red-200'
                              }`}
                            >
                              <TrashIcon className="h-4 w-4 mr-2" />
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    {errors.logo_url && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.logo_url}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Rating Information Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <StarIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Rating Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating (0-5) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <StarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        min="0"
                        max="5"
                        step="0.1"
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.rating ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="e.g., 4.5"
                        disabled={isSubmitting || submitSuccess}
                      />
                    </div>
                    {errors.rating && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.rating}
                      </p>
                    )}
                  </div>

                  {/* Total Ratings */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Ratings *
                    </label>
                    <input
                      type="number"
                      name="totalRatings"
                      value={formData.totalRatings}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.totalRatings ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 120"
                      disabled={isSubmitting || submitSuccess}
                    />
                    {errors.totalRatings && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.totalRatings}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Weblinks Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <LinkIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Weblinks
                </h2>
                
                {formData.weblinks.map((weblink, index) => (
                  <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-700">Weblink {index + 1}</h3>
                      {formData.weblinks.length > 1 && !isSubmitting && !submitSuccess && (
                        <button
                          type="button"
                          onClick={() => removeWeblink(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* URL */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          URL
                        </label>
                        <input
                          type="url"
                          value={weblink.url}
                          onChange={(e) => handleWeblinkChange(index, 'url', e.target.value)}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[`weblink_url_${index}`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="https://example.com"
                          disabled={isSubmitting || submitSuccess}
                        />
                        {errors[`weblink_url_${index}`] && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors[`weblink_url_${index}`]}
                          </p>
                        )}
                      </div>

                      {/* Label */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Label
                        </label>
                        <input
                          type="text"
                          value={weblink.label}
                          onChange={(e) => handleWeblinkChange(index, 'label', e.target.value)}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[`weblink_label_${index}`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="e.g., Website"
                          disabled={isSubmitting || submitSuccess}
                        />
                        {errors[`weblink_label_${index}`] && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors[`weblink_label_${index}`]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {!isSubmitting && !submitSuccess && (
                  <button
                    type="button"
                    onClick={addWeblink}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400"
                  >
                    + Add Another Weblink
                  </button>
                )}
              </div>

              {/* Form Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                  <Link
                    to="/companies"
                    className={`px-6 py-2 border rounded-lg text-center ${
                      isSubmitting || submitSuccess
                        ? 'border-gray-300 text-gray-500 bg-gray-100 cursor-not-allowed'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={(e) => {
                      if (isSubmitting || submitSuccess) {
                        e.preventDefault()
                      }
                    }}
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isUploading || isSubmitting || submitSuccess}
                    className={`px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isUploading || isSubmitting || submitSuccess
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Company...
                      </span>
                    ) : submitSuccess ? (
                      <span className="flex items-center justify-center">
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        Created Successfully
                      </span>
                    ) : isUploading ? (
                      'Uploading Logo...'
                    ) : (
                      'Add Company'
                    )}
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

export default AddCompany