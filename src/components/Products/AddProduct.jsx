import React, { useState, useEffect } from 'react'
import { 
  ArrowLeftIcon,
  TagIcon,
  CurrencyDollarIcon,
  CubeIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  SparklesIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from '../Sidebar'
import Navbar from '../Navbar'
import {getFrames} from '../../Api/frameapi';
import {getAllCompanies} from '../../Api/companyApi';
import {createProduct} from '../../Api/productApi';
import uploadToCloudinary from '../../utils/cloudinary';
import toast from 'react-hot-toast'

const AddProduct = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [frames, setFrames] = useState([])
  const [companies, setCompanies] = useState([])
  const [loadingFrames, setLoadingFrames] = useState(false)
  const [loadingCompanies, setLoadingCompanies] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreviews, setImagePreviews] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    type: 'optical',
    frameType: '',
    userCategory: '',
    description: '',
    price: '',
    productDiscount: 0,
    appliedDiscounts: [],
    company: '',
    colors: [{ 
      color: '', 
      hexCode: '#000000', 
      imageSets: [
        {
          normalImages: [{ url: '', public_id: '', alt: '' }],
          image3d: { url: '', public_id: '', alt: '' }
        }
      ]
    }],
    stock: '',
    specsType: 'eyeglasses',
    model: '',
    material: '',
    weight: '',
    dimensions: { height: '', width: '', depth: '' },
    warranty: { duration: '', durationType: 'months', description: '' },
    isFeatured: false,
    tags: '',
    ageGroup: 'all'
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  // Fetch frames and companies on component mount
  useEffect(() => {
    const fetchFramesAndCompanies = async () => {
      try {
        setLoadingFrames(true)
        const framesData = await getFrames()
        setFrames(framesData?.data || [])
      } catch (error) {
        console.error('Error fetching frames:', error)
        setFrames([])
      } finally {
        setLoadingFrames(false)
      }

      try {
        setLoadingCompanies(true)
        const companiesData = await getAllCompanies()
        setCompanies(companiesData?.data || [])
      } catch (error) {
        console.error('Error fetching companies:', error)
        setCompanies([])
      } finally {
        setLoadingCompanies(false)
      }
    }

    fetchFramesAndCompanies()
  }, [])

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

  const handleImageUrlChange = (colorIndex, setIndex, imageIndex, field, value) => {
    const updatedColors = [...formData.colors]
    updatedColors[colorIndex].imageSets[setIndex].normalImages[imageIndex][field] = value
    setFormData(prev => ({ ...prev, colors: updatedColors }))
  }

  const handle3dImageUrlChange = (colorIndex, setIndex, field, value) => {
    const updatedColors = [...formData.colors]
    updatedColors[colorIndex].imageSets[setIndex].image3d[field] = value
    setFormData(prev => ({ ...prev, colors: updatedColors }))
  }

  const handleNormalImageUpload = (colorIndex, setIndex, imageIndex, files) => {
    if (!files || files.length === 0) return
    
    const updatedColors = [...formData.colors]
    const newPreviews = { ...imagePreviews }
    const imageSet = updatedColors[colorIndex].imageSets[setIndex]
    
    // Ensure normalImages array exists
    if (!imageSet.normalImages) {
      imageSet.normalImages = []
    }
    
    // Ensure the imageIndex exists in the array
    if (!imageSet.normalImages[imageIndex]) {
      imageSet.normalImages[imageIndex] = { url: '', public_id: '', alt: '' }
    }
    
    // Process all selected files
    Array.from(files).forEach((file, fileIndex) => {
      const preview = URL.createObjectURL(file)
      
      if (fileIndex === 0) {
        // Replace the first image at the current index
        const key = `normal-${colorIndex}-${setIndex}-${imageIndex}`
        newPreviews[key] = { file, preview }
        imageSet.normalImages[imageIndex].file = file
      } else {
        // Add remaining files as new image entries
        const key = `normal-${colorIndex}-${setIndex}-${imageSet.normalImages.length}`
        newPreviews[key] = { file, preview }
        imageSet.normalImages.push({ 
          url: '', 
          public_id: '', 
          alt: '',
          file: file 
        })
      }
    })
    
    setImagePreviews(newPreviews)
    setFormData(prev => ({ ...prev, colors: updatedColors }))
  }

  const handle3dImageUpload = (colorIndex, setIndex, files) => {
    if (!files || files.length === 0) return
    
    const file = files[0]
    const preview = URL.createObjectURL(file)
    
    // Store preview and file
    const key = `3d-${colorIndex}-${setIndex}`
    setImagePreviews(prev => ({
      ...prev,
      [key]: { file, preview }
    }))
    
    // Update formData with the file object
    const updatedColors = [...formData.colors]
    updatedColors[colorIndex].imageSets[setIndex].image3d.file = file
    setFormData(prev => ({ ...prev, colors: updatedColors }))
  }

  const removeNormalImagePreview = (colorIndex, setIndex, imageIndex) => {
    const key = `normal-${colorIndex}-${setIndex}-${imageIndex}`
    if (imagePreviews[key]) {
      URL.revokeObjectURL(imagePreviews[key].preview)
    }
    
    setImagePreviews(prev => {
      const newPreviews = { ...prev }
      delete newPreviews[key]
      return newPreviews
    })
    
    // Clear from formData
    const updatedColors = [...formData.colors]
    updatedColors[colorIndex].imageSets[setIndex].normalImages[imageIndex].file = null
    setFormData(prev => ({ ...prev, colors: updatedColors }))
  }

  const remove3dImagePreview = (colorIndex, setIndex) => {
    const key = `3d-${colorIndex}-${setIndex}`
    if (imagePreviews[key]) {
      URL.revokeObjectURL(imagePreviews[key].preview)
    }
    
    setImagePreviews(prev => {
      const newPreviews = { ...prev }
      delete newPreviews[key]
      return newPreviews
    })
    
    // Clear from formData
    const updatedColors = [...formData.colors]
    updatedColors[colorIndex].imageSets[setIndex].image3d.file = null
    setFormData(prev => ({ ...prev, colors: updatedColors }))
  }

  const addNormalImage = (colorIndex, setIndex) => {
    const updatedColors = [...formData.colors]
    const imageSet = updatedColors[colorIndex].imageSets[setIndex]
    if (imageSet && !imageSet.normalImages) {
      imageSet.normalImages = []
    }
    if (imageSet && imageSet.normalImages) {
      imageSet.normalImages.push({ url: '', public_id: '', alt: '' })
    }
    setFormData(prev => ({ ...prev, colors: updatedColors }))
  }

  const removeNormalImage = (colorIndex, setIndex, imageIndex) => {
    const updatedColors = [...formData.colors]
    const imageSet = updatedColors[colorIndex].imageSets[setIndex]
    if (imageSet && imageSet.normalImages && imageSet.normalImages.length > 1) {
      removeNormalImagePreview(colorIndex, setIndex, imageIndex)
      imageSet.normalImages.splice(imageIndex, 1)
      setFormData(prev => ({ ...prev, colors: updatedColors }))
    }
  }

  const addImageSet = (colorIndex) => {
    const updatedColors = [...formData.colors]
    updatedColors[colorIndex].imageSets.push({
      normalImages: [{ url: '', public_id: '', alt: '' }],
      image3d: { url: '', public_id: '', alt: '' }
    })
    setFormData(prev => ({ ...prev, colors: updatedColors }))
  }

  const removeImageSet = (colorIndex, setIndex) => {
    const updatedColors = [...formData.colors]
    if (updatedColors[colorIndex].imageSets.length > 1) {
      updatedColors[colorIndex].imageSets.splice(setIndex, 1)
      setFormData(prev => ({ ...prev, colors: updatedColors }))
    }
  }

  const addColor = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, { 
        color: '', 
        hexCode: '#000000', 
        imageSets: [
          {
            normalImages: [{ url: '', public_id: '', alt: '' }],
            image3d: { url: '', public_id: '', alt: '' }
          }
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
    if (!formData.type) newErrors.type = 'Product type is required'
    if (!formData.frameType) newErrors.frameType = 'Frame type is required'
    if (!formData.userCategory) newErrors.userCategory = 'User category is required'
    if (!formData.description.trim()) newErrors.description = 'Product description is required'
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required'
    if (formData.productDiscount < 0 || formData.productDiscount > 100) newErrors.productDiscount = 'Discount must be between 0-100'
    if (!formData.company) newErrors.company = 'Company is required'
    if (!formData.stock || formData.stock < 0) newErrors.stock = 'Valid stock quantity is required'
    if (!formData.specsType) newErrors.specsType = 'Specs type is required'
    if (!formData.model.trim()) newErrors.model = 'Model is required'
    if (!formData.material.trim()) newErrors.material = 'Material is required'
    if (!formData.weight || formData.weight <= 0) newErrors.weight = 'Valid weight is required'
    if (!formData.dimensions.height || formData.dimensions.height <= 0) newErrors.dimensions_height = 'Valid height is required'
    if (!formData.dimensions.width || formData.dimensions.width <= 0) newErrors.dimensions_width = 'Valid width is required'
    if (!formData.dimensions.depth || formData.dimensions.depth <= 0) newErrors.dimensions_depth = 'Valid depth is required'
    if (!formData.warranty.duration || formData.warranty.duration <= 0) newErrors.warranty_duration = 'Valid warranty duration is required'
    if (!formData.ageGroup) newErrors.ageGroup = 'Age group is required'
    
    // Validate colors and images (check for files, not URLs)
    formData.colors.forEach((color, index) => {
      if (!color.color.trim()) {
        newErrors[`color_${index}`] = 'Color name is required'
      }
      if (!color.hexCode.trim()) {
        newErrors[`hexCode_${index}`] = 'Hex code is required'
      }
      // Validate image sets
      if (!color.imageSets || color.imageSets.length === 0) {
        newErrors[`imageSets_${index}`] = 'At least one image set is required'
      } else {
        color.imageSets.forEach((imageSet, setIndex) => {
          // Validate normal images (at least one required)
          if (!imageSet.normalImages || imageSet.normalImages.length === 0 || !imageSet.normalImages.some(img => img.file)) {
            newErrors[`normal_images_${index}_${setIndex}`] = 'At least one normal image is required'
          }
          // Alt text is optional
          // Validate 3D image (exactly one required)
          if (!imageSet.image3d?.file) {
            newErrors[`image_3d_${index}_${setIndex}`] = '3D image is required'
          }
          // Alt text is optional for 3D image as well
        })
      }
    })

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // First, validate basic form data (without image URLs)
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the errors in the form before submitting.', validationErrors)
      return
    }

    setIsSubmitting(true)

    try {
      // Upload images to Cloudinary FIRST
      const uploadedColors = await Promise.all(
        formData.colors.map(async (color) => {
          // Flatten imageSets into a single images array with type field
          const uploadedImages = []
          
          for (const imageSet of color.imageSets) {
            // Upload normal images
            for (const image of imageSet.normalImages) {
              if (image.file) {
                const uploadResponse = await uploadToCloudinary(image.file, {
                  folder: 'chasma_bazar/products'
                })
                uploadedImages.push({
                  type: 'normal',
                  url: uploadResponse.secure_url,
                  public_id: uploadResponse.public_id,
                  alt: image.alt
                })
              }
            }
            
            // Upload 3D image
            if (imageSet.image3d?.file) {
              const uploadResponse = await uploadToCloudinary(imageSet.image3d.file, {
                folder: 'chasma_bazar/products/3d'
              })
              uploadedImages.push({
                type: '3d',
                url: uploadResponse.secure_url,
                public_id: uploadResponse.public_id,
                alt: imageSet.image3d.alt
              })
            }
          }
          
          return {
            color: color.color,
            hexCode: color.hexCode,
            images: uploadedImages
          }
        })
      )

      // Prepare the product data with uploaded images
      const newProduct = {
        name: formData.name,
        sku: formData.sku,
        type: formData.type,
        frameType: formData.frameType,
        userCategory: formData.userCategory,
        description: formData.description,
        price: parseFloat(formData.price),
        productDiscount: parseFloat(formData.productDiscount) || 0,
        appliedDiscounts: formData.appliedDiscounts,
        company: formData.company,
        colors: uploadedColors,
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

      // Send to API with Cloudinary URLs
      const response = await createProduct(newProduct)
      if (response.success) {
        toast.success('Product created successfully!')
        navigate('/products')
      } else {
        toast.error(response.message || 'Error creating product')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error creating product'
      console.error('Error creating product:', error)

      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const productTypes = ['optical', 'sunglasses', 'reading_glasses', 'sports_glasses']
  const userCategories = ['Men', 'Women', 'Kids']
  const materialOptions = ['Metal', 'Plastic', 'Acetate', 'Titanium', 'Stainless Steel', 'Aluminum', 'TR90', 'Carbon Fiber', 'Wood', 'Nylon', 'Polycarbonate', 'Mixed Materials']
  const specTypes = ['eyeglasses', 'sunglasses', 'computer_glasses', 'reading_glasses']
  const ageGroups = ['children', 'teens', 'adults', 'seniors', 'all']
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
                      disabled={loadingFrames}
                    >
                      <option value="">{loadingFrames ? 'Loading frames...' : 'Select frame type'}</option>
                      {frames.map(frame => (
                        <option key={frame._id} value={frame._id}>
                          {frame.name}
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
                      User Category *
                    </label>
                    <select
                      name="userCategory"
                      value={formData.userCategory}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.userCategory ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select category</option>
                      {userCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.userCategory && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.userCategory}
                      </p>
                    )}
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
                      Company *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.company ? 'border-red-300' : 'border-gray-300'
                        }`}
                        disabled={loadingCompanies}
                      >
                        <option value="">{loadingCompanies ? 'Loading companies...' : 'Select company'}</option>
                        {companies.map(company => (
                          <option key={company._id} value={company._id}>
                            {company.name}
                          </option>
                        ))}
                      </select>
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
                      {specTypes.map(type => (
                        <option key={type} value={type}>{type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</option>
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
                    <select
                      name="material"
                      value={formData.material}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.material ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select material</option>
                      {materialOptions.map(material => (
                        <option key={material} value={material}>{material}</option>
                      ))}
                    </select>
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
                    placeholder="Enter product description..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                      {errors.description}
                    </p>
                  )}
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
                        Image Sets *
                      </label>

                      {color.imageSets && color.imageSets.map((imageSet, setIndex) => (
                        <div key={setIndex} className="mb-6 p-4 bg-white border-2 border-indigo-300 rounded-lg">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-gray-700 text-base flex items-center">
                              <div className="h-4 w-4 rounded-full bg-indigo-500 mr-2"></div>
                              Image Set {setIndex + 1}
                            </h4>
                            {color.imageSets.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeImageSet(colorIndex, setIndex)}
                                className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                              >
                                Remove Set
                              </button>
                            )}
                          </div>

                          {/* Normal Images Section */}
                          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-medium text-gray-700 flex items-center text-sm">
                                <PhotoIcon className="h-4 w-4 mr-1 text-blue-500" />
                                Normal Images (Multiple)
                              </h5>
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                                {imageSet.normalImages?.length || 0} images
                              </span>
                            </div>
                            
                            {imageSet.normalImages && imageSet.normalImages.map((image, imageIndex) => (
                              <div key={imageIndex} className="mb-3 p-2 bg-white rounded border border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs text-gray-600">Image {imageIndex + 1}</span>
                                  {imageSet.normalImages.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeNormalImage(colorIndex, setIndex, imageIndex)}
                                      className="text-red-500 hover:text-red-700 text-xs"
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <div>
                                    <input
                                      type="file"
                                      multiple
                                      accept="image/*"
                                      onChange={(e) => handleNormalImageUpload(colorIndex, setIndex, imageIndex, e.target.files)}
                                      disabled={isSubmitting}
                                      className="w-full px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-blue-400"
                                    />
                                  </div>
                                  
                                  <input
                                    type="text"
                                    value={image.alt}
                                    onChange={(e) => handleImageUrlChange(colorIndex, setIndex, imageIndex, 'alt', e.target.value)}
                                    disabled={isSubmitting}
                                    className="w-full px-2 py-1 text-xs border rounded"
                                    placeholder="Alt text (optional)"
                                  />
                                  
                                  {imagePreviews[`normal-${colorIndex}-${setIndex}-${imageIndex}`] && (
                                    <div className="relative inline-block">
                                      <img
                                        src={imagePreviews[`normal-${colorIndex}-${setIndex}-${imageIndex}`].preview}
                                        alt={image.alt}
                                        className="h-20 w-20 object-cover rounded border"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removeNormalImagePreview(colorIndex, setIndex, imageIndex)}
                                        disabled={isSubmitting}
                                        className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-full hover:bg-red-600 text-xs"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={() => addNormalImage(colorIndex, setIndex)}
                              className="w-full mt-2 py-1 border border-blue-300 rounded text-blue-600 hover:bg-blue-50 text-xs"
                            >
                              + Add Normal Image
                            </button>
                          </div>

                          {/* 3D Image Section */}
                          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-medium text-gray-700 flex items-center text-sm">
                                <CubeIcon className="h-4 w-4 mr-1 text-purple-500" />
                                3D Image (Single)
                              </h5>
                            </div>

                            <div className="space-y-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handle3dImageUpload(colorIndex, setIndex, e.target.files)}
                                disabled={isSubmitting}
                                className="w-full px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-purple-400"
                              />
                              
                              <input
                                type="text"
                                value={imageSet.image3d?.alt || ''}
                                onChange={(e) => handle3dImageUrlChange(colorIndex, setIndex, 'alt', e.target.value)}
                                disabled={isSubmitting}
                                className="w-full px-2 py-1 text-xs border rounded"
                                placeholder="Alt text (optional)"
                              />
                              
                              {imagePreviews[`3d-${colorIndex}-${setIndex}`] && (
                                <div className="relative inline-block">
                                  <img
                                    src={imagePreviews[`3d-${colorIndex}-${setIndex}`].preview}
                                    alt={imageSet.image3d?.alt || 'preview'}
                                    className="h-20 w-20 object-cover rounded border"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => remove3dImagePreview(colorIndex, setIndex)}
                                    disabled={isSubmitting}
                                    className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-full hover:bg-red-600 text-xs"
                                  >
                                    ✕
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addImageSet(colorIndex)}
                        className="w-full mt-3 py-2 border-2 border-dashed border-indigo-300 rounded text-indigo-600 hover:bg-indigo-50 text-sm"
                      >
                        + Add Another Image Set
                      </button>
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
                    className={`px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-center transition-colors ${
                      isSubmitting 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50' 
                        : 'hover:bg-gray-50 cursor-pointer'
                    }`}
                    onClick={(e) => isSubmitting && e.preventDefault()}
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center min-w-[140px] ${
                      isSubmitting
                        ? 'bg-blue-400 text-white cursor-not-allowed opacity-75'
                        : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="inline-block animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Creating...
                      </>
                    ) : (
                      'Add Product'
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

export default AddProduct