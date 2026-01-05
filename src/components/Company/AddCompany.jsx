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
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from '../Sidebar'
import Navbar from '../Navbar'

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
  const navigate = useNavigate()

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  const handleChange = (e) => {
    const { name, value, type } = e.target
    
    // Handle nested objects
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
    
    // Clear error for this field if user starts typing
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

  const validateForm = () => {
    const newErrors = {}
    
    // Required fields
    if (!formData.name.trim()) newErrors.name = 'Company name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.pinCode.trim()) newErrors.pinCode = 'PIN Code is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.address.street.trim()) newErrors.address_street = 'Street address is required'
    if (!formData.address.city.trim()) newErrors.address_city = 'City is required'
    if (!formData.address.state.trim()) newErrors.address_state = 'State is required'
    if (!formData.address.country.trim()) newErrors.address_country = 'Country is required'
    if (!formData.address.pinCode.trim()) newErrors.address_pinCode = 'Address PIN Code is required'
    if (!formData.logo.url.trim()) newErrors.logo_url = 'Logo URL is required'
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
    
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Prepare the company data according to API structure
    const newCompany = {
      name: formData.name,
      description: formData.description,
      pinCode: formData.pinCode,
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

    try {
      // Here you would make an API call to your backend
      // For now, we'll simulate with localStorage
      let existingCompanies = []
      try {
        const storedCompanies = localStorage.getItem('companies')
        existingCompanies = storedCompanies ? JSON.parse(storedCompanies) : []
      } catch (error) {
        console.error('Error reading from localStorage:', error)
        existingCompanies = []
      }

      const updatedCompanies = [newCompany, ...existingCompanies]
      localStorage.setItem('companies', JSON.stringify(updatedCompanies))
      localStorage.setItem('companies_updated', Date.now().toString())
      
      alert('Company added successfully!')
      navigate('/companies') // Adjust this route based on your application
    } catch (error) {
      console.error('Error saving company:', error)
      alert('Error saving company. Please try again.')
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
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* PIN Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PIN Code *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="pinCode"
                        value={formData.pinCode}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.pinCode ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter PIN code"
                      />
                    </div>
                    {errors.pinCode && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.pinCode}
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
                  {/* Logo URL */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo URL *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="url"
                        name="logo.url"
                        value={formData.logo.url}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.logo_url ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                    {errors.logo_url && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.logo_url}
                      </p>
                    )}
                  </div>

                  {/* Logo Public ID */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo Public ID
                    </label>
                    <input
                      type="text"
                      name="logo.public_id"
                      value={formData.logo.public_id}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., logo_123"
                    />
                  </div>

                  {/* Logo Preview */}
                  {formData.logo.url && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo Preview
                      </label>
                      <div className="flex items-center space-x-4">
                        <img
                          src={formData.logo.url}
                          alt="Logo preview"
                          className="h-20 w-20 object-contain border rounded-lg"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80?text=Logo+Error'
                          }}
                        />
                        <div className="text-sm text-gray-500">
                          <p>Logo will be displayed here</p>
                          <p>Recommended size: 80x80 pixels</p>
                        </div>
                      </div>
                    </div>
                  )}
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
                      {formData.weblinks.length > 1 && (
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

                <button
                  type="button"
                  onClick={addWeblink}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400"
                >
                  + Add Another Weblink
                </button>
              </div>

              {/* Form Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                  <Link
                    to="/company"
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-center"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Add Company
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