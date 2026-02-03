import React, { useState } from 'react'
import { useEffect } from 'react'
import { 
  ArrowLeftIcon,
  RectangleStackIcon,
  BeakerIcon,
  ScaleIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  ArrowsPointingOutIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from '../Sidebar'
import Navbar from '../Navbar'
import {createFrame} from '../../Api/frameapi'
import {getAllDiscounts} from '../../Api/discountApi'
import uploadToCloudinary from '../../utils/cloudinary'
import toast from 'react-hot-toast'

const AddFrame = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    shape: '',
    material: '',
    color: '',
    size: '',
    width: '',
    dimensions: '',
    bridgeSize: '',
    templeLength: '',
    weight: '',
    price: '',
    frameDiscount: '',
    appliedDiscounts: '',
    images: []
  })
  const [imagePreviews, setImagePreviews] = useState([])
  const [discounts, setDiscounts] = useState([])
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  // Load discounts on component mount
  useEffect(() => {
    const loadDiscounts = async () => {
      try {
        const response = await getAllDiscounts()
        // Adjust based on your API response structure
        const discountsData = response.data || response
        setDiscounts(Array.isArray(discountsData) ? discountsData : discountsData.discounts || [])
      } catch (error) {
        console.error('Error loading discounts:', error)
        setDiscounts([])
      }
    }
    loadDiscounts()
  }, [])

  const handleChange = (e) => {
    const { name, value, type } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || '' : value
    }))
    
    // Clear error for this field if user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleDiscountChange = (e) => {
    const selectedValue = e.target.value
    setFormData(prev => ({
      ...prev,
      appliedDiscounts: selectedValue
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Frame name is required'
    if (!formData.shape) newErrors.shape = 'Shape is required'
    if (!formData.material) newErrors.material = 'Material is required'
    if (!formData.color.trim()) newErrors.color = 'Color is required'
    if (!formData.size.trim()) newErrors.size = 'Size is required'
    if (!formData.width.trim()) newErrors.width = 'Width is required'
    if (!formData.dimensions.trim()) newErrors.dimensions = 'Dimensions are required'
    if (!formData.bridgeSize.trim()) newErrors.bridgeSize = 'Bridge size is required'
    if (!formData.templeLength.trim()) newErrors.templeLength = 'Temple length is required'
    if (!formData.weight || formData.weight <= 0) newErrors.weight = 'Valid weight is required'
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required'
    if (!formData.frameDiscount || formData.frameDiscount < 0) newErrors.frameDiscount = 'Valid discount is required'

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the errors in the form before submitting.')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Upload images to Cloudinary
      let images = []
      if (formData.images.length > 0) {
        const uploadPromises = formData.images.map((image) =>
          uploadToCloudinary(image, { folder: 'chasma_bazar/frames' })
        )
        const uploadResponses = await Promise.all(uploadPromises)
        images = uploadResponses.map((response) => ({
          url: response.secure_url,
          public_id: response.public_id,
          alt: `${formData.name} image`
        }))
      }

      // Prepare the frame data according to API structure
      const frameData = {
        name: formData.name,
        shape: formData.shape,
        material: formData.material,
        color: formData.color,
        size: formData.size,
        width: formData.width,
        dimensions: formData.dimensions,
        bridgeSize: formData.bridgeSize,
        templeLength: formData.templeLength,
        weight: parseFloat(formData.weight),
        price: parseFloat(formData.price),
        frameDiscount: parseFloat(formData.frameDiscount) || 0,
        images: images,
        appliedDiscounts: formData.appliedDiscounts ? [formData.appliedDiscounts] : []
      }

      // Call the createFrame API
      await createFrame(frameData)
      
      // Update localStorage to trigger refresh on the frame list page
      localStorage.setItem('frames_updated', Date.now().toString())
      
      toast.success('Frame added successfully!')
      navigate('/frame')
    } catch (error) {
      console.error('Error saving frame:', error)
      
      // Handle specific error cases
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 'Server error occurred'
        toast.error(`Error: ${errorMessage}`)
      } else if (error.request) {
        // Request was made but no response received
        toast.error('No response from server. Please check your connection.')
      } else {
        // Something else happened
        toast.error('Error saving frame. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const shapes = [
    'round',
    'square',
    'rectangle',
    'oval',
    'cat-eye',
    'aviator',
    'wayfarer',
    'clubmaster',
    'geometric',
    'other'
  ]

  const materials = [
    'plastic',
    'metal',
    'acetate',
    'titanium',
    'wood',
    'carbon_fiber',
    'mixed',
    'other'
  ]

  const colors = [
    'Black',
    'Brown',
    'Tortoise',
    'Clear',
    'Gold',
    'Silver',
    'Gunmetal',
    'Blue',
    'Red',
    'Green',
    'Purple',
    'Rose Gold',
    'Two-tone',
    'Multi-color'
  ]

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    
    // Create previews and store files
    const newPreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    
    setImagePreviews(prev => [...prev, ...newPreviews])
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }))
    
    // Reset input
    e.target.value = ''
  }

  const removeImage = (index) => {
    setImagePreviews(prev => {
      const newPreviews = [...prev]
      URL.revokeObjectURL(newPreviews[index].preview)
      newPreviews.splice(index, 1)
      return newPreviews
    })
    
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const sizes = [
    '48mm',
    '50mm',
    '52mm',
    '54mm',
    '56mm',
    '58mm',
    '60mm'
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
                    to="/frame" 
                    className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                  </Link>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Frame</h1>
                    <p className="text-gray-600">Fill in the details to add a new eyewear frame</p>
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
                  {/* Frame Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frame Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="e.g., Wayfarer Classic"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Shape */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shape *
                    </label>
                    <select
                      name="shape"
                      value={formData.shape}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.shape ? 'border-red-300' : 'border-gray-300'
                      } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                      <option value="">Select shape</option>
                      {shapes.map(shape => (
                        <option key={shape} value={shape}>
                          {shape.charAt(0).toUpperCase() + shape.slice(1)}
                        </option>
                      ))}
                    </select>
                    {errors.shape && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.shape}
                      </p>
                    )}
                  </div>

                  {/* Material */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Material *
                    </label>
                    <select
                      name="material"
                      value={formData.material}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.material ? 'border-red-300' : 'border-gray-300'
                      } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                      <option value="">Select material</option>
                      {materials.map(material => (
                        <option key={material} value={material}>
                          {material.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </option>
                      ))}
                    </select>
                    {errors.material && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.material}
                      </p>
                    )}
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color *
                    </label>
                    <select
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.color ? 'border-red-300' : 'border-gray-300'
                      } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                      <option value="">Select color</option>
                      {colors.map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                    {errors.color && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.color}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Dimensions Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <ArrowsPointingOutIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Dimensions
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lens Size *
                    </label>
                    <select
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.size ? 'border-red-300' : 'border-gray-300'
                      } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                      <option value="">Select size</option>
                      {sizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                    {errors.size && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.size}
                      </p>
                    )}
                  </div>

                  {/* Width */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frame Width *
                    </label>
                    <input
                      type="text"
                      name="width"
                      value={formData.width}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.width ? 'border-red-300' : 'border-gray-300'
                      } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="e.g., 145mm"
                    />
                    {errors.width && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.width}
                      </p>
                    )}
                  </div>

                  {/* Dimensions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Dimensions *
                    </label>
                    <input
                      type="text"
                      name="dimensions"
                      value={formData.dimensions}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.dimensions ? 'border-red-300' : 'border-gray-300'
                      } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="e.g., 52-18-145"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Format: Lens Size - Bridge Size - Temple Length
                    </p>
                    {errors.dimensions && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.dimensions}
                      </p>
                    )}
                  </div>

                  {/* Bridge Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bridge Size *
                    </label>
                    <input
                      type="text"
                      name="bridgeSize"
                      value={formData.bridgeSize}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.bridgeSize ? 'border-red-300' : 'border-gray-300'
                      } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="e.g., 18mm"
                    />
                    {errors.bridgeSize && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.bridgeSize}
                      </p>
                    )}
                  </div>

                  {/* Temple Length */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Temple Length *
                    </label>
                    <input
                      type="text"
                      name="templeLength"
                      value={formData.templeLength}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.templeLength ? 'border-red-300' : 'border-gray-300'
                      } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="e.g., 145mm"
                    />
                    {errors.templeLength && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.templeLength}
                      </p>
                    )}
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (g) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ScaleIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        step="0.1"
                        min="0"
                        disabled={isSubmitting}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.weight ? 'border-red-300' : 'border-gray-300'
                        } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        placeholder="e.g., 28"
                      />
                    </div>
                    {errors.weight && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.weight}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Pricing
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        disabled={isSubmitting}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.price ? 'border-red-300' : 'border-gray-300'
                        } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        placeholder="e.g., 500"
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.price}
                      </p>
                    )}
                  </div>

                  {/* Frame Discount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount (%) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="frameDiscount"
                        value={formData.frameDiscount}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        disabled={isSubmitting}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.frameDiscount ? 'border-red-300' : 'border-gray-300'
                        } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        placeholder="e.g., 5"
                      />
                    </div>
                    {errors.frameDiscount && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.frameDiscount}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Applied Discounts Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Applied Discounts
                </h2>
                
                <div className="grid grid-cols-1 gap-6">
                  {/* Applied Discounts Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Discount (Optional)
                    </label>
                    <select
                      name="appliedDiscounts"
                      value={formData.appliedDiscounts}
                      onChange={handleDiscountChange}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.appliedDiscounts ? 'border-red-300' : 'border-gray-300'
                      } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                      <option value="">-- No Discount --</option>
                      {discounts.map(discount => (
                        <option key={discount._id} value={discount._id}>
                          {discount.name} ({discount.discountPercentage}%)
                        </option>
                      ))}
                    </select>
                    {errors.appliedDiscounts && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.appliedDiscounts}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Images Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <PhotoIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Frame Images
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Upload Frame Images
                  </label>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isSubmitting}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center">
                        <PhotoIcon className="h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-900">Click to upload images</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </label>
                  </div>
                  
                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Uploaded Images ({imagePreviews.length})</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <div className="h-32 w-full rounded-lg overflow-hidden border border-gray-200">
                              <img
                                src={preview.preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              disabled={isSubmitting}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                              title="Remove image"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            <p className="text-xs text-gray-500 mt-1 truncate">{preview.file.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                  <Link
                    to="/frame"
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-center disabled:opacity-50"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isSubmitting 
                        ? 'bg-blue-400 cursor-not-allowed opacity-50' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isSubmitting ? 'Adding Frame...' : 'Add Frame'}
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

export default AddFrame
