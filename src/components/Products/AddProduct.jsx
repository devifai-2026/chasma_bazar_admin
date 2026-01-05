import React, { useState } from 'react'
import { 
  ArrowLeftIcon,
  PhotoIcon,
  TagIcon,
  CurrencyDollarIcon,
  CubeIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  EyeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  SparklesIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from '../Sidebar'
import Navbar from '../Navbar'

const AddProduct = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    type: 'optical',
    frameType: '',
    userCategory: '',
    description: '',
    price: '',
    productDiscount: '',
    company: '',
    colors: [{ color: '', hexCode: '#000000', images: [{ type: 'normal', url: '', public_id: '', alt: '' }, { type: '3d', url: '', public_id: '', alt: '' }] }],
    stock: '',
    specsType: 'eyeglasses',
    model: '',
    material: '',
    weight: '',
    dimensions: { height: '', width: '', depth: '' },
    warranty: { duration: '', durationType: 'months', description: '' },
    isFeatured: false,
    tags: '',
    ageGroup: 'adults'
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    // Handle deeply nested objects
    if (name.includes('.')) {
      const parts = name.split('.')
      if (parts.length === 2) {
        const [parent, child] = parts
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: type === 'number' ? parseFloat(value) || '' : value
          }
        }))
      } else if (parts.length === 3) {
        const [parent, index, child] = parts
        if (parent === 'colors') {
          const colorIndex = parseInt(index)
          const updatedColors = [...formData.colors]
          if (updatedColors[colorIndex]) {
            updatedColors[colorIndex][child] = value
            setFormData(prev => ({ ...prev, colors: updatedColors }))
          }
        }
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : 
               type === 'number' ? parseFloat(value) || '' : value
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

  const handleColorChange = (colorIndex, field, value) => {
    const updatedColors = [...formData.colors]
    updatedColors[colorIndex][field] = value
    setFormData(prev => ({ ...prev, colors: updatedColors }))
  }

  const handleImageUrlChange = (colorIndex, imageIndex, field, value) => {
    const updatedColors = [...formData.colors]
    updatedColors[colorIndex].images[imageIndex][field] = value
    setFormData(prev => ({ ...prev, colors: updatedColors }))
  }

  const addColor = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, { 
        color: '', 
        hexCode: '#000000', 
        images: [
          { type: 'normal', url: '', public_id: '', alt: '' }, 
          { type: '3d', url: '', public_id: '', alt: '' }
        ] 
      }]
    }))
  }

  const removeColor = (index) => {
    if (formData.colors.length > 1) {
      const updatedColors = formData.colors.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, colors: updatedColors }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required'
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required'
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required'
    if (!formData.productDiscount || formData.productDiscount < 0) newErrors.productDiscount = 'Valid discount is required'
    if (!formData.stock || formData.stock < 0) newErrors.stock = 'Valid stock quantity is required'
    if (!formData.company) newErrors.company = 'Company is required'
    if (!formData.frameType) newErrors.frameType = 'Frame type is required'
    if (!formData.type) newErrors.type = 'Product type is required'
    if (!formData.specsType) newErrors.specsType = 'Specs type is required'
    if (!formData.model.trim()) newErrors.model = 'Model is required'
    if (!formData.material.trim()) newErrors.material = 'Material is required'
    if (!formData.weight || formData.weight <= 0) newErrors.weight = 'Valid weight is required'
    if (!formData.dimensions.height || formData.dimensions.height <= 0) newErrors.dimensions_height = 'Valid height is required'
    if (!formData.dimensions.width || formData.dimensions.width <= 0) newErrors.dimensions_width = 'Valid width is required'
    if (!formData.dimensions.depth || formData.dimensions.depth <= 0) newErrors.dimensions_depth = 'Valid depth is required'
    if (!formData.warranty.duration || formData.warranty.duration <= 0) newErrors.warranty_duration = 'Valid warranty duration is required'
    if (!formData.ageGroup) newErrors.ageGroup = 'Age group is required'
    
    // Validate colors
    formData.colors.forEach((color, index) => {
      if (!color.color.trim()) {
        newErrors[`color_${index}`] = 'Color name is required'
      }
      if (!color.hexCode.trim()) {
        newErrors[`hexCode_${index}`] = 'Hex code is required'
      }
      color.images.forEach((img, imgIndex) => {
        if (!img.url.trim()) {
          newErrors[`image_url_${index}_${imgIndex}`] = 'Image URL is required'
        }
        if (!img.alt.trim()) {
          newErrors[`image_alt_${index}_${imgIndex}`] = 'Image alt text is required'
        }
      })
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

    // Prepare the product data according to API structure
    const newProduct = {
      name: formData.name,
      sku: formData.sku,
      type: formData.type,
      frameType: formData.frameType,
      userCategory: formData.userCategory,
      description: formData.description,
      price: parseFloat(formData.price),
      productDiscount: parseFloat(formData.productDiscount) || 0,
      company: formData.company,
      colors: formData.colors.map(color => ({
        color: color.color,
        hexCode: color.hexCode,
        images: color.images.filter(img => img.url.trim() !== '') // Only include images with URLs
      })),
      stock: parseInt(formData.stock),
      specsType: formData.specsType,
      model: formData.model,
      material: formData.material,
      weight: parseFloat(formData.weight),
      dimensions: {
        height: parseFloat(formData.dimensions.height),
        width: parseFloat(formData.dimensions.width),
        depth: parseFloat(formData.dimensions.depth)
      },
      warranty: {
        duration: parseInt(formData.warranty.duration),
        durationType: formData.warranty.durationType,
        description: formData.warranty.description
      },
      isFeatured: formData.isFeatured,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      ageGroup: formData.ageGroup
    }

    try {
      // Here you would make an API call to your backend
      // For now, we'll simulate with localStorage
      let existingProducts = []
      try {
        const storedProducts = localStorage.getItem('api_products')
        existingProducts = storedProducts ? JSON.parse(storedProducts) : []
      } catch (error) {
        console.error('Error reading from localStorage:', error)
        existingProducts = []
      }

      const updatedProducts = [newProduct, ...existingProducts]
      localStorage.setItem('api_products', JSON.stringify(updatedProducts))
      localStorage.setItem('products_updated', Date.now().toString())
      
      alert('Product added successfully!')
      navigate('/products')
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product. Please try again.')
    }
  }

  const productTypes = ['optical', 'sunglasses', 'reading_glasses', 'sports_glasses']
  const frameTypes = [
    { value: 'full_rim', label: 'Full Rim' },
    { value: 'half_rim', label: 'Half Rim' },
    { value: 'rimless', label: 'Rimless' },
    { value: 'sports', label: 'Sports' }
  ]
  const userCategories = ['Men', 'Women', 'Unisex', 'Kids']
  const specTypes = ['eyeglasses', 'sunglasses']
  const ageGroups = ['kids', 'teens', 'adults', 'seniors']
  const durationTypes = ['days', 'months', 'years']
  const imageTypes = ['normal', '3d']

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
                    to="/products" 
                    className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                  </Link>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                    <p className="text-gray-600">Fill in the details to add a new product</p>
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
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter product name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* SKU */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU *
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.sku ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., CBF-001"
                    />
                    {errors.sku && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.sku}
                      </p>
                    )}
                  </div>

                  {/* Product Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.type ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select product type</option>
                      {productTypes.map(type => (
                        <option key={type} value={type}>
                          {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </option>
                      ))}
                    </select>
                    {errors.type && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.type}
                      </p>
                    )}
                  </div>

                  {/* Frame Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frame Type *
                    </label>
                    <select
                      name="frameType"
                      value={formData.frameType}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.frameType ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select frame type</option>
                      {frameTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {errors.frameType && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.frameType}
                      </p>
                    )}
                  </div>

                  {/* User Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User Category
                    </label>
                    <select
                      name="userCategory"
                      value={formData.userCategory}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select category</option>
                      {userCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
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
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.price ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.price}
                      </p>
                    )}
                  </div>

                  {/* Product Discount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Discount (%) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SparklesIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="productDiscount"
                        value={formData.productDiscount}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.productDiscount ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="0"
                      />
                    </div>
                    {errors.productDiscount && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.productDiscount}
                      </p>
                    )}
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company ID *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.company ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter company ID"
                      />
                    </div>
                    {errors.company && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.company}
                      </p>
                    )}
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.stock ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter stock quantity"
                    />
                    {errors.stock && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.stock}
                      </p>
                    )}
                  </div>

                  {/* Specs Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specs Type *
                    </label>
                    <select
                      name="specsType"
                      value={formData.specsType}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.specsType ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select specs type</option>
                      {specTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.specsType && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.specsType}
                      </p>
                    )}
                  </div>

                  {/* Model */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model *
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.model ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Classic-001"
                    />
                    {errors.model && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.model}
                      </p>
                    )}
                  </div>

                  {/* Material */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Material *
                    </label>
                    <input
                      type="text"
                      name="material"
                      value={formData.material}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.material ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Acetate"
                    />
                    {errors.material && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.material}
                      </p>
                    )}
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (g) *
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      step="0.1"
                      min="0"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.weight ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 25"
                    />
                    {errors.weight && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.weight}
                      </p>
                    )}
                  </div>

                  {/* Age Group */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age Group *
                    </label>
                    <select
                      name="ageGroup"
                      value={formData.ageGroup}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.ageGroup ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select age group</option>
                      {ageGroups.map(group => (
                        <option key={group} value={group}>
                          {group.charAt(0).toUpperCase() + group.slice(1)}
                        </option>
                      ))}
                    </select>
                    {errors.ageGroup && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.ageGroup}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter product description..."
                  />
                </div>
              </div>

              {/* Color Variations Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <div className="h-5 w-5 mr-2 text-blue-500 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  </div>
                  Color Variations
                </h2>
                
                {formData.colors.map((color, colorIndex) => (
                  <div key={colorIndex} className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-medium text-gray-700 text-lg">Color {colorIndex + 1}</h3>
                      {formData.colors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeColor(colorIndex)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
                        >
                          Remove Color
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Color Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Color Name *
                        </label>
                        <input
                          type="text"
                          value={color.color}
                          onChange={(e) => handleColorChange(colorIndex, 'color', e.target.value)}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[`color_${colorIndex}`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="e.g., Black"
                        />
                        {errors[`color_${colorIndex}`] && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors[`color_${colorIndex}`]}
                          </p>
                        )}
                      </div>

                      {/* Hex Code */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hex Color Code *
                        </label>
                        <div className="flex items-center">
                          <input
                            type="color"
                            value={color.hexCode}
                            onChange={(e) => handleColorChange(colorIndex, 'hexCode', e.target.value)}
                            className="h-10 w-10 mr-2 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={color.hexCode}
                            onChange={(e) => handleColorChange(colorIndex, 'hexCode', e.target.value)}
                            className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors[`hexCode_${colorIndex}`] ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="#000000"
                          />
                        </div>
                        {errors[`hexCode_${colorIndex}`] && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors[`hexCode_${colorIndex}`]}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Images for this color */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Images *
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {color.images.map((image, imageIndex) => (
                          <div key={imageIndex} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-medium text-gray-700 capitalize">
                                {image.type} Image
                              </h4>
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                {image.type === 'normal' ? 'Front View' : '3D View'}
                              </span>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Image URL *
                                </label>
                                <input
                                  type="url"
                                  value={image.url}
                                  onChange={(e) => handleImageUrlChange(colorIndex, imageIndex, 'url', e.target.value)}
                                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors[`image_url_${colorIndex}_${imageIndex}`] ? 'border-red-300' : 'border-gray-300'
                                  }`}
                                  placeholder="https://example.com/image.jpg"
                                />
                                {errors[`image_url_${colorIndex}_${imageIndex}`] && (
                                  <p className="mt-1 text-sm text-red-600">
                                    {errors[`image_url_${colorIndex}_${imageIndex}`]}
                                  </p>
                                )}
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Public ID
                                </label>
                                <input
                                  type="text"
                                  value={image.public_id}
                                  onChange={(e) => handleImageUrlChange(colorIndex, imageIndex, 'public_id', e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="e.g., black_front_123"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Alt Text *
                                </label>
                                <input
                                  type="text"
                                  value={image.alt}
                                  onChange={(e) => handleImageUrlChange(colorIndex, imageIndex, 'alt', e.target.value)}
                                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors[`image_alt_${colorIndex}_${imageIndex}`] ? 'border-red-300' : 'border-gray-300'
                                  }`}
                                  placeholder="e.g., Black frame front view"
                                />
                                {errors[`image_alt_${colorIndex}_${imageIndex}`] && (
                                  <p className="mt-1 text-sm text-red-600">
                                    {errors[`image_alt_${colorIndex}_${imageIndex}`]}
                                  </p>
                                )}
                              </div>
                              
                              {image.url && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Image Preview
                                  </label>
                                  <img
                                    src={image.url}
                                    alt={image.alt}
                                    className="h-32 w-32 object-cover rounded-lg border mx-auto"
                                    onError={(e) => {
                                      e.target.src = 'https://via.placeholder.com/150?text=Image+Error'
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addColor}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 bg-gray-50"
                >
                  + Add Another Color Variation
                </button>
              </div>

              {/* Dimensions Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <CubeIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Dimensions (mm) *
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height *
                    </label>
                    <input
                      type="number"
                      name="dimensions.height"
                      value={formData.dimensions.height}
                      onChange={handleChange}
                      step="0.1"
                      min="0"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.dimensions_height ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 45"
                    />
                    {errors.dimensions_height && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.dimensions_height}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Width *
                    </label>
                    <input
                      type="number"
                      name="dimensions.width"
                      value={formData.dimensions.width}
                      onChange={handleChange}
                      step="0.1"
                      min="0"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.dimensions_width ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 140"
                    />
                    {errors.dimensions_width && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.dimensions_width}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Depth *
                    </label>
                    <input
                      type="number"
                      name="dimensions.depth"
                      value={formData.dimensions.depth}
                      onChange={handleChange}
                      step="0.1"
                      min="0"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.dimensions_depth ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 145"
                    />
                    {errors.dimensions_depth && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.dimensions_depth}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Warranty Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Warranty Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration *
                    </label>
                    <input
                      type="number"
                      name="warranty.duration"
                      value={formData.warranty.duration}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.warranty_duration ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 12"
                    />
                    {errors.warranty_duration && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.warranty_duration}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration Type
                    </label>
                    <select
                      name="warranty.durationType"
                      value={formData.warranty.durationType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {durationTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Warranty Description
                  </label>
                  <textarea
                    name="warranty.description"
                    value={formData.warranty.description}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 1 year manufacturer warranty"
                  />
                </div>
              </div>

              {/* Additional Information Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <TagIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Additional Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., classic, formal, black, acetate"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Enter tags separated by commas
                    </p>
                  </div>
                </div>

                {/* Featured Product Checkbox */}
                <div className="mt-6 flex items-center">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Mark as featured product
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                  <Link
                    to="/products"
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-center"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Add Product
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

export default AddProduct