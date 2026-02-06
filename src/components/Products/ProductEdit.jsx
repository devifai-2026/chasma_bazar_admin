import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  CheckIcon,
  PhotoIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  TagIcon,
  CurrencyDollarIcon,
  CubeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { getProductById, updateProduct, deleteProduct } from '../../Api/productApi';
import { getFrames } from '../../Api/frameapi';
import { getAllCompanies } from '../../Api/companyApi';
import uploadToCloudinary from '../../utils/cloudinary';
import toast from 'react-hot-toast'

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [frames, setFrames] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loadingFrames, setLoadingFrames] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [imagePreviews, setImagePreviews] = useState({});
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
  });

  // Product type options
  const productTypes = ['optical', 'sunglasses', 'reading_glasses', 'sports_glasses'];
  const userCategories = ['Men', 'Women', 'Kids'];
  const materialOptions = ['Metal', 'Plastic', 'Acetate', 'Titanium', 'Stainless Steel', 'Aluminum', 'TR90', 'Carbon Fiber', 'Wood', 'Nylon', 'Polycarbonate', 'Mixed Materials'];
  const specTypes = ['eyeglasses', 'sunglasses', 'computer_glasses', 'reading_glasses'];
  const ageGroups = ['children', 'teens', 'adults', 'seniors', 'all'];
  const durationTypes = ['days', 'months', 'years'];

  useEffect(() => {
    loadProduct();
    fetchFramesAndCompanies();
  }, [id]);

  const fetchFramesAndCompanies = async () => {
    try {
      setLoadingFrames(true);
      const framesData = await getFrames();
      setFrames(framesData?.data || []);
    } catch (error) {
      console.error('Error fetching frames:', error);
      setFrames([]);
    } finally {
      setLoadingFrames(false);
    }

    try {
      setLoadingCompanies(true);
      const companiesData = await getAllCompanies();
      setCompanies(companiesData?.data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setCompanies([]);
    } finally {
      setLoadingCompanies(false);
    }
  };

  const loadProduct = async () => {
    setLoading(true);
    try {
      const response = await getProductById(id);
      
      if (response.success && response.data) {
        const foundProduct = response.data;
        setProduct(foundProduct);
        
        // Transform API colors structure to match form structure
        const transformedColors = (foundProduct.colors || []).map(color => {
          // Separate images by type
          const normalImages = (color.images || [])
            .filter(img => img.type === 'normal' || !img.type)
            .map(img => ({
              url: img.url || '',
              public_id: img.public_id || '',
              alt: img.alt || '',
              file: null
            }));

          const image3dData = (color.images || []).find(img => img.type === '3d');
          const image3d = image3dData ? {
            url: image3dData.url || '',
            public_id: image3dData.public_id || '',
            alt: image3dData.alt || '',
            file: null
          } : { url: '', public_id: '', alt: '', file: null };

          return {
            color: color.color || '',
            hexCode: color.hexCode || '#000000',
            imageSets: [
              {
                normalImages: normalImages.length > 0 ? normalImages : [{ 
                  url: '', 
                  public_id: '', 
                  alt: '', 
                  file: null 
                }],
                image3d: image3d
              }
            ]
          };
        });
        
        // Populate form data with all product fields
        setFormData({
          name: foundProduct.name || '',
          sku: foundProduct.sku || '',
          type: foundProduct.type || 'optical',
          frameType: foundProduct.frameType?._id || foundProduct.frameType || '',
          userCategory: foundProduct.userCategory || '',
          description: foundProduct.description || '',
          price: foundProduct.price?.toString() || '',
          productDiscount: foundProduct.productDiscount || 0,
          appliedDiscounts: foundProduct.appliedDiscounts || [],
          company: foundProduct.company?._id || foundProduct.company || '',
          colors: transformedColors.length > 0 ? transformedColors : [{ 
            color: '', 
            hexCode: '#000000', 
            imageSets: [
              {
                normalImages: [{ 
                  url: '', 
                  public_id: '', 
                  alt: '', 
                  file: null 
                }],
                image3d: { 
                  url: '', 
                  public_id: '', 
                  alt: '', 
                  file: null 
                }
              }
            ]
          }],
          stock: foundProduct.stock?.toString() || '',
          specsType: foundProduct.specsType || 'eyeglasses',
          model: foundProduct.model || '',
          material: foundProduct.material || '',
          weight: foundProduct.weight?.toString() || '',
          dimensions: foundProduct.dimensions || { height: '', width: '', depth: '' },
          warranty: foundProduct.warranty || { duration: '', durationType: 'months', description: '' },
          isFeatured: foundProduct.isFeatured || false,
          tags: Array.isArray(foundProduct.tags) ? foundProduct.tags.join(', ') : foundProduct.tags || '',
          ageGroup: foundProduct.ageGroup || 'all'
        });

        // Load image previews from existing URLs
        const previews = {};
        transformedColors.forEach((color, colorIndex) => {
          color.imageSets.forEach((imageSet, setIndex) => {
            // Normal images previews
            imageSet.normalImages.forEach((img, imgIndex) => {
              if (img.url) {
                previews[`normal-${colorIndex}-${setIndex}-${imgIndex}`] = img.url;
              }
            });
            
            // 3D image preview
            if (imageSet.image3d.url) {
              previews[`3d-${colorIndex}-${setIndex}`] = imageSet.image3d.url;
            }
          });
        });
        setImagePreviews(previews);
      } else {
        console.error('Product not found:', response.message);
        toast.error('Product not found');
        navigate('/products');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Error loading product: ' + (error.message || 'Unknown error'));
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('dimensions.')) {
      const dimensionKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        dimensions: { ...prev.dimensions, [dimensionKey]: value }
      }));
    } else if (name.startsWith('warranty.')) {
      const warrantyKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        warranty: { ...prev.warranty, [warrantyKey]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleColorChange = (colorIndex, field, value) => {
    const updatedColors = [...formData.colors];
    updatedColors[colorIndex][field] = value;
    setFormData(prev => ({ ...prev, colors: updatedColors }));
  };

  const handleImageUrlChange = (colorIndex, setIndex, imageIndex, field, value) => {
    const updatedColors = [...formData.colors];
    updatedColors[colorIndex].imageSets[setIndex].normalImages[imageIndex][field] = value;
    setFormData(prev => ({ ...prev, colors: updatedColors }));
  };

  const handle3dImageUrlChange = (colorIndex, setIndex, field, value) => {
    const updatedColors = [...formData.colors];
    updatedColors[colorIndex].imageSets[setIndex].image3d[field] = value;
    setFormData(prev => ({ ...prev, colors: updatedColors }));
  };

  const handleNormalImageUpload = (colorIndex, setIndex, imageIndex, files) => {
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => ({
          ...prev,
          [`normal-${colorIndex}-${setIndex}-${imageIndex}`]: reader.result
        }));
      };
      reader.readAsDataURL(file);

      const updatedColors = [...formData.colors];
      updatedColors[colorIndex].imageSets[setIndex].normalImages[imageIndex].file = file;
      setFormData(prev => ({ ...prev, colors: updatedColors }));
    }
  };

  const handle3dImageUpload = (colorIndex, setIndex, files) => {
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => ({
          ...prev,
          [`3d-${colorIndex}-${setIndex}`]: reader.result
        }));
      };
      reader.readAsDataURL(file);

      const updatedColors = [...formData.colors];
      updatedColors[colorIndex].imageSets[setIndex].image3d.file = file;
      setFormData(prev => ({ ...prev, colors: updatedColors }));
    }
  };

  const removeNormalImagePreview = (colorIndex, setIndex, imageIndex) => {
    const key = `normal-${colorIndex}-${setIndex}-${imageIndex}`;
    setImagePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[key];
      return newPreviews;
    });

    const updatedColors = [...formData.colors];
    updatedColors[colorIndex].imageSets[setIndex].normalImages[imageIndex] = {
      url: '',
      public_id: '',
      alt: '',
      file: null
    };
    setFormData(prev => ({ ...prev, colors: updatedColors }));
  };

  const remove3dImagePreview = (colorIndex, setIndex) => {
    const key = `3d-${colorIndex}-${setIndex}`;
    setImagePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[key];
      return newPreviews;
    });

    const updatedColors = [...formData.colors];
    updatedColors[colorIndex].imageSets[setIndex].image3d = {
      url: '',
      public_id: '',
      alt: '',
      file: null
    };
    setFormData(prev => ({ ...prev, colors: updatedColors }));
  };

  const addNormalImage = (colorIndex, setIndex) => {
    const updatedColors = [...formData.colors];
    updatedColors[colorIndex].imageSets[setIndex].normalImages.push({ 
      url: '', 
      public_id: '', 
      alt: '',
      file: null 
    });
    setFormData(prev => ({ ...prev, colors: updatedColors }));
  };

  const removeNormalImage = (colorIndex, setIndex, imageIndex) => {
    const key = `normal-${colorIndex}-${setIndex}-${imageIndex}`;
    setImagePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[key];
      return newPreviews;
    });

    const updatedColors = [...formData.colors];
    updatedColors[colorIndex].imageSets[setIndex].normalImages = 
      updatedColors[colorIndex].imageSets[setIndex].normalImages.filter((_, i) => i !== imageIndex);
    setFormData(prev => ({ ...prev, colors: updatedColors }));
  };

  const addImageSet = (colorIndex) => {
    const updatedColors = [...formData.colors];
    updatedColors[colorIndex].imageSets.push({
      normalImages: [{ url: '', public_id: '', alt: '', file: null }],
      image3d: { url: '', public_id: '', alt: '', file: null }
    });
    setFormData(prev => ({ ...prev, colors: updatedColors }));
  };

  const removeImageSet = (colorIndex, setIndex) => {
    // Remove all previews for this image set
    const updatedPreviews = { ...imagePreviews };
    Object.keys(updatedPreviews).forEach(key => {
      if (key.startsWith(`normal-${colorIndex}-${setIndex}`) || 
          key.startsWith(`3d-${colorIndex}-${setIndex}`)) {
        delete updatedPreviews[key];
      }
    });
    setImagePreviews(updatedPreviews);

    const updatedColors = [...formData.colors];
    updatedColors[colorIndex].imageSets = 
      updatedColors[colorIndex].imageSets.filter((_, i) => i !== setIndex);
    setFormData(prev => ({ ...prev, colors: updatedColors }));
  };

  const addColor = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, { 
        color: '', 
        hexCode: '#000000', 
        imageSets: [
          {
            normalImages: [{ url: '', public_id: '', alt: '', file: null }],
            image3d: { url: '', public_id: '', alt: '', file: null }
          }
        ]
      }]
    }));
  };

  const removeColor = (index) => {
    if (formData.colors.length > 1) {
      // Remove all previews for this color
      const updatedPreviews = { ...imagePreviews };
      Object.keys(updatedPreviews).forEach(key => {
        if (key.includes(`-${index}-`)) {
          delete updatedPreviews[key];
        }
      });
      setImagePreviews(updatedPreviews);

      const updatedColors = formData.colors.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, colors: updatedColors }));
    }
  };

  const validateImages = () => {
    for (let i = 0; i < formData.colors.length; i++) {
      const color = formData.colors[i];
      
      // Skip validation if color name is empty
      if (!color.color.trim()) {
        continue;
      }
      
      for (let j = 0; j < color.imageSets.length; j++) {
        const imageSet = color.imageSets[j];
        
        // Check if at least one normal image exists
        const hasNormalImage = imageSet.normalImages.some(img => 
          img.url?.trim() || img.file || imagePreviews[`normal-${i}-${j}-${imageSet.normalImages.indexOf(img)}`]
        );
        
        if (!hasNormalImage) {
          toast.error(`At least one Normal Image is required for color: ${color.color}`);
          return false;
        }
        
        // Check if 3D image exists
        const has3DImage = imageSet.image3d.url?.trim() || 
                          imageSet.image3d.file || 
                          imagePreviews[`3d-${i}-${j}`];
        
        if (!has3DImage) {
          toast.error(`3D Image is required for color: ${color.color}`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        toast.error('Product name is required');
        setSaving(false);
        return;
      }
      if (!formData.sku.trim()) {
        toast.error('SKU is required');
        setSaving(false);
        return;
      }
      if (!formData.type) {
        toast.error('Product type is required');
        setSaving(false);
        return;
      }
      if (!formData.frameType) {
        toast.error('Frame type is required');
        setSaving(false);
        return;
      }
      if (!formData.userCategory) {
        toast.error('User category is required');
        setSaving(false);
        return;
      }
      if (!formData.description.trim()) {
        toast.error('Description is required');
        setSaving(false);
        return;
      }
      if (!formData.price) {
        toast.error('Price is required');
        setSaving(false);
        return;
      }
      if (!formData.company) {
        toast.error('Company is required');
        setSaving(false);
        return;
      }
      if (!formData.stock) {
        toast.error('Stock is required');
        setSaving(false);
        return;
      }

      // Validate that each color has both normal and 3D images
      if (!validateImages()) {
        setSaving(false);
        return;
      }

      // Upload images to Cloudinary and process them
      const processedColors = await Promise.all(
        formData.colors.map(async (color, colorIndex) => {
          const allImages = [];

          // Process all image sets for this color
          for (let setIndex = 0; setIndex < color.imageSets.length; setIndex++) {
            const imageSet = color.imageSets[setIndex];

            // Process normal images (type: 'normal')
            for (let imgIndex = 0; imgIndex < imageSet.normalImages.length; imgIndex++) {
              const img = imageSet.normalImages[imgIndex];
              
              if (img.file) {
                // New file uploaded - upload to Cloudinary
                try {
                  const uploadedImage = await uploadToCloudinary(img.file);
                  allImages.push({
                    url: uploadedImage.secure_url,
                    public_id: uploadedImage.public_id,
                    alt: img.alt || color.color || 'product image',
                    type: 'normal'
                  });
                } catch (uploadError) {
                  console.error('Error uploading normal image:', uploadError);
                  toast.error(`Failed to upload normal image for ${color.color}`);
                  throw uploadError;
                }
              } else if (img.url && img.url.trim() !== '') {
                // Keep existing image
                allImages.push({
                  url: img.url,
                  public_id: img.public_id || '',
                  alt: img.alt || color.color || 'product image',
                  type: 'normal'
                });
              }
            }

            // Process 3D image (type: '3d') - MANDATORY
            if (imageSet.image3d.file) {
              try {
                const uploaded3dImage = await uploadToCloudinary(imageSet.image3d.file);
                allImages.push({
                  url: uploaded3dImage.secure_url,
                  public_id: uploaded3dImage.public_id,
                  alt: imageSet.image3d.alt || `${color.color} 3D view`,
                  type: '3d'
                });
              } catch (uploadError) {
                console.error('Error uploading 3D image:', uploadError);
                toast.error(`Failed to upload 3D image for ${color.color}`);
                throw uploadError;
              }
            } else if (imageSet.image3d.url && imageSet.image3d.url.trim() !== '') {
              // Keep existing 3D image
              allImages.push({
                url: imageSet.image3d.url,
                public_id: imageSet.image3d.public_id || '',
                alt: imageSet.image3d.alt || `${color.color} 3D view`,
                type: '3d'
              });
            }
          }

          return {
            color: color.color,
            hexCode: color.hexCode,
            images: allImages
          };
        })
      );

      // Double-check that all colors have at least one normal image and one 3D image
      const colorsWithMissingImages = [];
      processedColors.forEach(color => {
        const normalImages = color.images.filter(img => img.type === 'normal');
        const threeDImages = color.images.filter(img => img.type === '3d');
        
        if (normalImages.length === 0) {
          colorsWithMissingImages.push(`${color.color} (missing normal image)`);
        }
        if (threeDImages.length === 0) {
          colorsWithMissingImages.push(`${color.color} (missing 3D image)`);
        }
      });

      if (colorsWithMissingImages.length > 0) {
        toast.error(`Missing required images for: ${colorsWithMissingImages.join(', ')}`);
        setSaving(false);
        return;
      }

      // Prepare product data
      const updatedProductData = {
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
        colors: processedColors,
        stock: parseInt(formData.stock),
        specsType: formData.specsType,
        model: formData.model,
        material: formData.material,
        weight: formData.weight,
        dimensions: {
          height: parseFloat(formData.dimensions.height) || 0,
          width: parseFloat(formData.dimensions.width) || 0,
          depth: parseFloat(formData.dimensions.depth) || 0
        },
        warranty: {
          duration: parseInt(formData.warranty.duration) || 0,
          durationType: formData.warranty.durationType,
          description: formData.warranty.description
        },
        isFeatured: formData.isFeatured,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : [],
        ageGroup: formData.ageGroup
      };



      // Call update API
      const response = await updateProduct(id, updatedProductData);

      if (response.success) {
        toast.success('Product updated successfully!');
        setTimeout(() => {
          navigate('/products');
        }, 1500);
      } else {
        toast.error('Error updating product: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Error saving product: ' + (error.message || 'Please try again.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        const response = await deleteProduct(id);
        
        if (response.success) {
          toast.success('Product deleted successfully!');
          setTimeout(() => {
            navigate('/products');
          }, 1500);
        } else {
          toast.error('Error deleting product: ' + (response.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Error deleting product: ' + (error.message || 'Please try again.'));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <main className={`flex-1 overflow-y-auto bg-gray-50 p-6 transition-all duration-300 ${sidebarOpen ? 'lg:pl-6' : 'lg:pl-6'}`}>
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Loading product data...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-screen">
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <main className={`flex-1 overflow-y-auto bg-gray-50 p-6 transition-all duration-300 ${sidebarOpen ? 'lg:pl-6' : 'lg:pl-6'}`}>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
              <Link to="/products" className="text-blue-600 hover:text-blue-800">
                ← Back to Products
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        
        <main className={`flex-1 overflow-y-auto bg-gray-50 p-6 transition-all duration-300 ${sidebarOpen ? 'lg:pl-6' : 'lg:pl-6'}`}>
          <div className="mx-auto max-w-6xl">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Link to="/products" className="hover:text-gray-700">Products</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium">Edit Product</span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                  <p className="text-gray-600 mt-1">Update product information</p>
                </div>
                <Link 
                  to="/products"
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  Back
                </Link>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Type *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      {productTypes.map(t => (
                        <option key={t} value={t}>{t.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Frame Type *</label>
                    <select
                      name="frameType"
                      value={formData.frameType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Frame Type</option>
                      {loadingFrames ? <option>Loading...</option> : frames.map(frame => (
                        <option key={frame._id} value={frame._id}>{frame.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">User Category *</label>
                    <select
                      name="userCategory"
                      value={formData.userCategory}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Category</option>
                      {userCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                    <select
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Company</option>
                      {loadingCompanies ? <option>Loading...</option> : companies.map(company => (
                        <option key={company._id} value={company._id}>{company.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                    <select
                      name="material"
                      value={formData.material}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Material</option>
                      {materialOptions.map(mat => (
                        <option key={mat} value={mat}>{mat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="e.g., 25g"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specs Type</label>
                    <select
                      name="specsType"
                      value={formData.specsType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {specTypes.map(spec => (
                        <option key={spec} value={spec}>{spec.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
                    <select
                      name="ageGroup"
                      value={formData.ageGroup}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {ageGroups.map(age => (
                        <option key={age} value={age}>{age}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Discount %</label>
                    <input
                      type="number"
                      name="productDiscount"
                      value={formData.productDiscount}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                {/* Dimensions */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-4">Dimensions</label>
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      name="dimensions.height"
                      value={formData.dimensions.height}
                      onChange={handleChange}
                      placeholder="Height"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      name="dimensions.width"
                      value={formData.dimensions.width}
                      onChange={handleChange}
                      placeholder="Width"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      name="dimensions.depth"
                      value={formData.dimensions.depth}
                      onChange={handleChange}
                      placeholder="Depth"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Warranty */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-4">Warranty</label>
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="number"
                      name="warranty.duration"
                      value={formData.warranty.duration}
                      onChange={handleChange}
                      placeholder="Duration"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                    <select
                      name="warranty.durationType"
                      value={formData.warranty.durationType}
                      onChange={handleChange}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {durationTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      name="warranty.description"
                      value={formData.warranty.description}
                      onChange={handleChange}
                      placeholder="Description"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Tags and Features */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="Comma separated tags"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleChange}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">Featured Product</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Colors and Images */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Colors & Images</h2>
                    <p className="text-sm text-red-600 mt-1">
                      * For each color: At least one Normal Image and one 3D Image are required
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addColor}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Color
                  </button>
                </div>

                <div className="space-y-6">
                  {formData.colors.map((color, colorIndex) => {
                    // Check image requirements for this color
                    const imageStatus = color.imageSets.map((imageSet, setIndex) => {
                      const hasNormalImage = imageSet.normalImages.some(img => 
                        img.url?.trim() || img.file || imagePreviews[`normal-${colorIndex}-${setIndex}-${imageSet.normalImages.indexOf(img)}`]
                      );
                      
                      const has3DImage = imageSet.image3d.url?.trim() || 
                                        imageSet.image3d.file || 
                                        imagePreviews[`3d-${colorIndex}-${setIndex}`];
                      
                      return {
                        hasNormalImage,
                        has3DImage
                      };
                    });
                    
                    const allSetsValid = imageStatus.every(status => 
                      status.hasNormalImage && status.has3DImage
                    );
                    
                    return (
                      <div key={colorIndex} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center">
                            <div 
                              className="w-6 h-6 rounded-full border border-gray-300 mr-3"
                              style={{ backgroundColor: color.hexCode }}
                            />
                            <div>
                              <h3 className="font-medium text-gray-700">
                                {color.color || `Color ${colorIndex + 1}`}
                                {color.color && !allSetsValid && (
                                  <span className="ml-2 text-xs text-red-600">(Missing required images!)</span>
                                )}
                              </h3>
                              <p className="text-xs text-gray-500">{color.hexCode}</p>
                            </div>
                          </div>
                          {formData.colors.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeColor(colorIndex)}
                              className="ml-4 p-2 text-red-600 hover:text-red-800"
                              title="Remove color"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Color Name *
                            </label>
                            <input
                              type="text"
                              value={color.color}
                              onChange={(e) => handleColorChange(colorIndex, 'color', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="e.g., Black"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Hex Code
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={color.hexCode}
                                onChange={(e) => handleColorChange(colorIndex, 'hexCode', e.target.value)}
                                className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                              />
                              <input
                                type="text"
                                value={color.hexCode}
                                onChange={(e) => handleColorChange(colorIndex, 'hexCode', e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Image Sets */}
                        <div className="space-y-6 mt-6">
                          {color.imageSets.map((imageSet, setIndex) => {
                            const hasNormalImage = imageSet.normalImages.some(img => 
                              img.url?.trim() || img.file || imagePreviews[`normal-${colorIndex}-${setIndex}-${imageSet.normalImages.indexOf(img)}`]
                            );
                            
                            const has3DImage = imageSet.image3d.url?.trim() || 
                                              imageSet.image3d.file || 
                                              imagePreviews[`3d-${colorIndex}-${setIndex}`];
                            
                            return (
                              <div key={setIndex} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                  <div className="flex items-center">
                                    <PhotoIcon className="h-5 w-5 text-gray-500 mr-2" />
                                    <h4 className="font-medium text-gray-700">
                                      Image Set {setIndex + 1}
                                      {(!hasNormalImage || !has3DImage) && (
                                        <span className="ml-2 text-xs text-red-600">
                                          {!hasNormalImage && "Need Normal Image"}
                                          {!hasNormalImage && !has3DImage && " & "}
                                          {!has3DImage && "Need 3D Image"}
                                        </span>
                                      )}
                                    </h4>
                                  </div>
                                  {color.imageSets.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeImageSet(colorIndex, setIndex)}
                                      className="text-red-600 hover:text-red-800"
                                      title="Remove image set"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>

                                {/* Normal Images - MANDATORY */}
                                <div className="mb-6">
                                  <div className="flex justify-between items-center mb-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                      Normal Images *
                                    </label>
                                    {!hasNormalImage && (
                                      <span className="text-xs text-red-600">At least one Normal Image is required</span>
                                    )}
                                  </div>
                                  <div className="space-y-4">
                                    {imageSet.normalImages.map((img, imgIndex) => (
                                      <div key={imgIndex} className="flex gap-4 items-start p-3 bg-white rounded-lg border border-gray-200">
                                        <div className="flex-1 space-y-2">
                                          <input
                                            type="text"
                                            value={img.url}
                                            onChange={(e) => handleImageUrlChange(colorIndex, setIndex, imgIndex, 'url', e.target.value)}
                                            placeholder="Image URL * (or upload file)"
                                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                            // required={imgIndex === 0}
                                          />
                                          <input
                                            type="text"
                                            value={img.alt}
                                            onChange={(e) => handleImageUrlChange(colorIndex, setIndex, imgIndex, 'alt', e.target.value)}
                                            placeholder="Image alt text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                          />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                          <div className="relative">
                                            <input
                                              type="file"
                                              accept="image/*"
                                              onChange={(e) => handleNormalImageUpload(colorIndex, setIndex, imgIndex, e.target.files)}
                                              className="text-sm"
                                              required={imgIndex === 0 && !img.url}
                                            />
                                            {(img.url || img.file || imagePreviews[`normal-${colorIndex}-${setIndex}-${imgIndex}`]) && (
                                              <button
                                                type="button"
                                                onClick={() => removeNormalImagePreview(colorIndex, setIndex, imgIndex)}
                                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                                                title="Remove image"
                                              >
                                                <XMarkIcon className="h-3 w-3" />
                                              </button>
                                            )}
                                          </div>
                                          {/* Show preview from file upload or existing URL */}
                                          {imagePreviews[`normal-${colorIndex}-${setIndex}-${imgIndex}`] ? (
                                            <img
                                              src={imagePreviews[`normal-${colorIndex}-${setIndex}-${imgIndex}`]}
                                              alt="Preview"
                                              className="h-20 w-20 object-cover rounded border border-gray-200"
                                            />
                                          ) : img.url ? (
                                            <img
                                              src={img.url}
                                              alt="Image preview"
                                              className="h-20 w-20 object-cover rounded border border-gray-200"
                                              onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                          ) : (
                                            <div className="h-20 w-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                                              <PhotoIcon className="h-8 w-8 text-gray-400" />
                                            </div>
                                          )}
                                        </div>
                                        {imgIndex > 0 && (
                                          <button
                                            type="button"
                                            onClick={() => removeNormalImage(colorIndex, setIndex, imgIndex)}
                                            className="text-red-600 hover:text-red-800"
                                            title="Remove image field"
                                          >
                                            <TrashIcon className="h-5 w-5" />
                                          </button>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => addNormalImage(colorIndex, setIndex)}
                                    className="mt-3 text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                  >
                                    <PlusIcon className="h-4 w-4 mr-1" />
                                    Add Normal Image
                                  </button>
                                </div>

                                {/* 3D Image - MANDATORY */}
                                <div>
                                  <div className="flex justify-between items-center mb-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                      3D Image *
                                    </label>
                                    {!has3DImage && (
                                      <span className="text-xs text-red-600">3D Image is required</span>
                                    )}
                                  </div>
                                  <div className="flex gap-4 items-start p-3 bg-white rounded-lg border border-gray-200">
                                    <div className="flex-1 space-y-2">
                                      <input
                                        type="text"
                                        value={imageSet.image3d.url}
                                        onChange={(e) => handle3dImageUrlChange(colorIndex, setIndex, 'url', e.target.value)}
                                        placeholder="3D Image URL * (or upload file)"
                                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                        // required={!imageSet.image3d.file}
                                      />
                                      <input
                                        type="text"
                                        value={imageSet.image3d.alt}
                                        onChange={(e) => handle3dImageUrlChange(colorIndex, setIndex, 'alt', e.target.value)}
                                        placeholder="3D Image alt text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                      />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                      <div className="relative">
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => handle3dImageUpload(colorIndex, setIndex, e.target.files)}
                                          className="text-sm"
                                          // required={!imageSet.image3d.url}
                                        />
                                        {(imageSet.image3d.url || imageSet.image3d.file || imagePreviews[`3d-${colorIndex}-${setIndex}`]) && (
                                          <button
                                            type="button"
                                            onClick={() => remove3dImagePreview(colorIndex, setIndex)}
                                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                                            title="Remove 3D image"
                                          >
                                            <XMarkIcon className="h-3 w-3" />
                                          </button>
                                        )}
                                      </div>
                                      {/* Show preview from file upload or existing URL */}
                                      {imagePreviews[`3d-${colorIndex}-${setIndex}`] ? (
                                        <img
                                          src={imagePreviews[`3d-${colorIndex}-${setIndex}`]}
                                          alt="3D Preview"
                                          className="h-20 w-20 object-cover rounded border border-gray-200"
                                        />
                                      ) : imageSet.image3d.url ? (
                                        <img
                                          src={imageSet.image3d.url}
                                          alt="3D image preview"
                                          className="h-20 w-20 object-cover rounded border border-gray-200"
                                          onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                      ) : (
                                        <div className="h-20 w-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                                          <CubeIcon className="h-8 w-8 text-gray-400" />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <button
                          type="button"
                          onClick={() => addImageSet(colorIndex)}
                          className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Add Image Set
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-between gap-4">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                >
                  <TrashIcon className="h-5 w-5 mr-2" />
                  Delete Product
                </button>

                <div className="flex gap-3">
                  <Link
                    to="/products"
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-5 w-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductEdit;