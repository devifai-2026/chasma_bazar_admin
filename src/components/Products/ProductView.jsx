import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  ShoppingCartIcon,
  CurrencyRupeeIcon,
  UserGroupIcon,
  TagIcon,
  CubeIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  ArrowTrendingUpIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  PhotoIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ShieldCheckIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import {getProductById} from '../../Api/productApi';

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageGallery, setImageGallery] = useState([]);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const response = await getProductById(id);
      
      if (response.success && response.data) {
        const apiData = response.data;
        
        // Transform API response to component format
        const productData = {
          _id: apiData._id,
          id: apiData._id,
          name: apiData.name,
          sku: apiData.sku,
          description: apiData.description,
          category: apiData.userCategory || 'General',
          price: apiData.price,
          stock: apiData.stock || 0,
          minStock: 10, // Default value
          status: apiData.stock > 0 ? 'In Stock' : 'Out of Stock',
          image: apiData.colors?.[0]?.images?.[0]?.url || 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=400&fit=crop',
          brand: apiData.frameType?.name || 'Unknown',
          location: 'Not specified',
          dimensions: apiData.dimensions,
          weight: apiData.weight,
          features: [
            `Shape: ${apiData.frameType?.name || 'N/A'}`,
            `Material: ${apiData.material || 'N/A'}`,
            `Type: ${apiData.specsType || 'N/A'}`,
            `Model: ${apiData.model || 'N/A'}`,
            `Size: ${apiData.frameType?.size || 'N/A'}`,
            `Width: ${apiData.frameType?.width || 'N/A'}`,
            `Age Group: ${apiData.ageGroup || 'N/A'}`,
            `Weight: ${apiData.weight ? `${apiData.weight}g` : 'N/A'}`,
            `Specs Type: ${apiData.specsType || 'N/A'}`,
          ].filter(f => !f.includes('N/A')),
          supplier: apiData.company?.name || 'Not specified',
          supplierContact: apiData.company?.phone || 'N/A',
          supplierEmail: apiData.company?.email || 'N/A',
          supplierAddress: apiData.company?.address || {},
          revenue: `₹${apiData.price * (apiData.stock || 0)}`,
          totalSold: 0,
          margin: '0%',
          rating: apiData.averageRating || 0,
          reviews: apiData.totalReviews || 0,
          cost: 'N/A',
          isDummy: false,
          frameType: apiData.frameType,
          colors: apiData.colors,
          warranty: apiData.warranty,
          type: apiData.type,
          specsType: apiData.specsType,
          model: apiData.model,
          material: apiData.material,
          ageGroup: apiData.ageGroup,
          isFeatured: apiData.isFeatured,
          createdAt: apiData.createdAt,
          company: apiData.company,
          pricing: response.pricing,
          tags: apiData.tags,
          totalRatings: apiData.totalRatings,
          productDiscount: apiData.productDiscount,
          frameDiscount: apiData.frameType?.frameDiscount
        };
        
        setProduct(productData);
        
        // Set image gallery from colors array
        const imageGalleryArray = [];
        if (apiData.colors && Array.isArray(apiData.colors)) {
          apiData.colors.forEach(color => {
            if (color.images && Array.isArray(color.images)) {
              color.images.forEach(img => {
                if (img.url) {
                  imageGalleryArray.push({
                    url: img.url,
                    type: img.type || 'normal',
                    color: color.color,
                    hexCode: color.hexCode
                  });
                }
              });
            }
          });
        }
        
        // Fallback if no images found
        if (imageGalleryArray.length === 0) {
          imageGalleryArray.push({
            url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=400&fit=crop',
            type: 'normal',
            color: 'Default',
            hexCode: '#000000'
          });
        }
        
        setImageGallery(imageGalleryArray);
      } else {
        console.error('Product not found');
        navigate('/products');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  

  

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Helper function to format dimensions object
  const formatDimensions = (dimensions) => {
    if (!dimensions) return 'N/A';
    if (typeof dimensions === 'string') return dimensions;
    if (typeof dimensions === 'object') {
      const { height, width, depth } = dimensions;
      return `${width || '0'} x ${height || '0'} x ${depth || '0'} cm`;
    }
    return 'N/A';
  };

  // Helper function to format weight
  const formatWeight = (weight) => {
    if (!weight && weight !== 0) return 'N/A';
    if (typeof weight === 'string') return weight;
    if (typeof weight === 'number') return `${weight} g`;
    if (typeof weight === 'object' && weight.value) {
      return `${weight.value} ${weight.unit || 'kg'}`;
    }
    return 'N/A';
  };

  // Helper function to format address
  const formatAddress = (address) => {
    if (!address) return 'N/A';
    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.country) parts.push(address.country);
    if (address.pinCode) parts.push(address.pinCode);
    return parts.join(', ') || 'N/A';
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <main className={`flex-1 overflow-y-auto bg-gray-50 p-6 transition-all duration-300 ${sidebarOpen ? 'lg:pl-6' : 'lg:pl-6'}`}>
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Loading product details...</div>
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

  const visibleFeatures = showAllFeatures ? product.features : product.features.slice(0, 4);

  return (
    <div className="flex h-screen">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className={`flex-1 overflow-y-auto bg-gray-50 p-6 transition-all duration-300 ${sidebarOpen ? 'lg:pl-6' : 'lg:pl-6'}`}>
          <div className="mx-auto max-w-7xl">
            {/* Header with Breadcrumbs */}
            <div className="mb-6">
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Link to="/" className="hover:text-gray-700">Dashboard</Link>
                <span className="mx-2">/</span>
                <Link to="/products" className="hover:text-gray-700">Products</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium">{product.name}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Product Details</h1>
                  <p className="text-gray-600">View and analyze product performance</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/products" 
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back to Products
                  </Link>
                  
                  {product.isFeatured && (
                    <span className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full flex items-center">
                      <StarIcon className="h-4 w-4 mr-1" />
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Product Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Current Stock</p>
                    <p className="text-2xl font-bold mt-1">{product.stock} units</p>
                  </div>
                  <CubeIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Min. Stock: {product.minStock || 10}</span>
                    <span className={`font-medium ${
                      product.stock <= (product.minStock || 10) ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {product.status}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${
                        product.stock > (product.minStock || 10) * 2 ? 'bg-green-500' : 
                        product.stock > (product.minStock || 10) ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min((product.stock / ((product.minStock || 10) * 3)) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pricing</p>
                    <p className="text-2xl font-bold mt-1">₹{product.price}</p>
                  </div>
                  <CurrencyRupeeIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="mt-4">
                  <div className="text-sm space-y-1">
                    {product.pricing && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Original:</span>
                          <span className="line-through">₹{product.pricing.originalPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Discount:</span>
                          <span className="text-green-600">₹{product.pricing.totalDiscount}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span className="text-gray-700">Final:</span>
                          <span className="text-gray-900">₹{product.pricing.finalPrice}</span>
                        </div>
                      </>
                    )}
                    {product.productDiscount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Product Discount:</span>
                        <span className="text-orange-600">{product.productDiscount}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Customer Rating</p>
                    <p className="text-2xl font-bold mt-1">{product.rating || '0.0'}/5.0</p>
                  </div>
                  <UserGroupIcon className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm">
                    <span className="text-gray-600">{product.reviews || 0} reviews</span>
                    <span className="mx-2">•</span>
                    <span className="text-gray-600">{product.totalRatings || 0} ratings</span>
                  </div>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div> */}

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Warranty</p>
                    <p className="text-2xl font-bold mt-1">
                      {product.warranty?.duration || '0'} {product.warranty?.durationType || 'months'}
                    </p>
                  </div>
                  <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="mt-4">
                  <div className="text-sm">
                    <span className="text-gray-600">{product.warranty?.description || 'Standard warranty'}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content with Image Gallery */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Product Image & Details */}
              <div className="lg:col-span-2">
                {/* Product Image Gallery */}
                <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Product Images</h2>
                  </div>
                  <div className="p-6">
                    {/* Main Image Display */}
                    <div className="mb-6">
                      <div className="bg-gray-100 rounded-lg overflow-hidden h-96 flex items-center justify-center">
                        {imageGallery.length > 0 ? (
                          <div className="relative w-full h-full">
                            <img 
                              src={imageGallery[selectedImage].url} 
                              alt={`${product.name} - ${imageGallery[selectedImage].color} - ${imageGallery[selectedImage].type}`}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=400&fit=crop';
                              }}
                            />
                            <div className="absolute top-4 right-4 flex space-x-2">
                              <span className={`px-3 py-1 text-xs rounded-full ${
                                imageGallery[selectedImage].type === '3d' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {imageGallery[selectedImage].type.toUpperCase()}
                              </span>
                              <span 
                                className="px-3 py-1 text-xs rounded-full"
                                style={{ 
                                  backgroundColor: `${imageGallery[selectedImage].hexCode}20`,
                                  color: imageGallery[selectedImage].hexCode
                                }}
                              >
                                {imageGallery[selectedImage].color}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-gray-500">
                            <PhotoIcon className="h-20 w-20 mx-auto text-gray-300 mb-4" />
                            <p>No image available</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Thumbnail Gallery */}
                    {imageGallery.length > 1 && (
                      <div className="mt-4">
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                          {imageGallery.map((img, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedImage(index)}
                              className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                                selectedImage === index 
                                  ? 'border-blue-500 ring-2 ring-blue-200' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <img 
                                src={img.url} 
                                alt={`Thumbnail ${index + 1}`}
                                className="h-20 w-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=150&h=150&fit=crop';
                                }}
                              />
                              {selectedImage === index && (
                                <div className="absolute inset-0 bg-blue-500 bg-opacity-20"></div>
                              )}
                              <div className="absolute bottom-1 left-1">
                                <span className={`px-1 text-[10px] rounded ${
                                  img.type === '3d' 
                                    ? 'bg-purple-100 text-purple-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {img.type}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Color Information */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="font-medium text-gray-900 mb-3">Available Colors</h3>
                        <div className="flex flex-wrap gap-3">
                          {product.colors.map((color, index) => (
                            <div 
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <div 
                                className="h-6 w-6 rounded-full border border-gray-300"
                                style={{ backgroundColor: color.hexCode }}
                                title={color.color}
                              />
                              <span className="text-sm text-gray-600">{color.color}</span>
                              <span className="text-xs text-gray-500">({color.hexCode})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Information Card */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Product Information</h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                          <div className="text-lg font-semibold">{product.name}</div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <div className="text-gray-600">{product.description || 'No description available.'}</div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          <div className="flex items-center">
                            <TagIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                              {product.category}
                            </span>
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                          <div className="text-gray-600 capitalize">{product.type || 'N/A'}</div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                          <div className="text-gray-600 capitalize">{product.ageGroup || 'N/A'}</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                          <div className="font-mono text-gray-900">{product.sku || `PROD-${product.id.slice(-5)}`}</div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Frame Type</label>
                          <div className="text-gray-600">
                            {product.frameType?.name || 'N/A'} 
                            {product.frameType?.size && ` (${product.frameType.size})`}
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                          <div className="text-gray-600">{formatDimensions(product.dimensions)}</div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                          <div className="text-gray-600">{formatWeight(product.weight)}</div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
                          <div className="text-gray-600 flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                            {formatDate(product.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    {product.features && product.features.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">Features & Specifications</h3>
                          {product.features.length > 4 && (
                            <button
                              onClick={() => setShowAllFeatures(!showAllFeatures)}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              {showAllFeatures ? 'Show Less' : `Show All (${product.features.length})`}
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {visibleFeatures.map((feature, index) => (
                            <div key={index} className="flex items-center">
                              <CheckBadgeIcon className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                              <span className="text-gray-600">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {product.tags && product.tags.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {product.tags.map((tag, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Stats & Actions */}
              <div className="space-y-6">
                {/* Company/Supplier Information Card */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">Company Information</h2>
                      {product.company?.logo?.url && (
                        <img 
                          src={product.company.logo.url} 
                          alt={product.company.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                      <div className="text-gray-900 font-medium flex items-center">
                        <BuildingOfficeIcon className="h-5 w-5 mr-2 text-gray-400" />
                        {product.company?.name || 'Not specified'}
                      </div>
                    </div>
                    
                    {product.company?.email && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="text-gray-600 flex items-center">
                          <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                          {product.company.email}
                        </div>
                      </div>
                    )}

                    {product.company?.phone && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <div className="text-gray-600 flex items-center">
                          <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                          {product.company.phone}
                        </div>
                      </div>
                    )}

                    {product.company?.address && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <div className="text-gray-600 flex items-start">
                          <MapPinIcon className="h-4 w-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                          {formatAddress(product.company.address)}
                        </div>
                      </div>
                    )}

                    {product.company?.rating && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Rating</label>
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-gray-900 font-medium">{product.company.rating}/5</span>
                          <span className="text-gray-600 text-sm ml-2">({product.company.totalRatings} ratings)</span>
                        </div>
                      </div>
                    )}

                    {product.company?.establishedYear && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                        <div className="text-gray-600">{product.company.establishedYear}</div>
                      </div>
                    )}

                    <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-center">
                      View Company Details
                    </button>
                  </div>
                </div>

                {/* Pricing Information Card */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Pricing Details</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Original Price:</span>
                        <span className="font-medium">₹{product.pricing?.originalPrice || product.price}</span>
                      </div>
                      
                      {product.productDiscount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Product Discount:</span>
                          <span className="text-orange-600 font-medium">{product.productDiscount}%</span>
                        </div>
                      )}

                      {product.frameDiscount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Frame Discount:</span>
                          <span className="text-orange-600 font-medium">{product.frameDiscount}%</span>
                        </div>
                      )}

                      {product.pricing?.totalDiscount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Discount:</span>
                          <span className="text-green-600 font-medium">₹{product.pricing.totalDiscount}</span>
                        </div>
                      )}

                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between">
                          <span className="text-gray-900 font-semibold">Final Price:</span>
                          <span className="text-xl font-bold text-gray-900">₹{product.pricing?.finalPrice || product.price}</span>
                        </div>
                      </div>

                      {product.pricing?.quantity && (
                        <div className="text-sm text-gray-500 text-center">
                          Quantity: {product.pricing.quantity}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Actions Card */}
                {/* <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      <button 
                        onClick={restockProduct}
                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <CubeIcon className="h-5 w-5 mr-2" />
                        Restock Product
                      </button>
                      <button className="w-full flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                        <DocumentDuplicateIcon className="h-5 w-5 mr-2" />
                        Duplicate Product
                      </button>
                      <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
                        Generate Report
                      </button>
                      <button className="w-full flex items-center justify-center px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50">
                        <ShoppingCartIcon className="h-5 w-5 mr-2" />
                        Create Order
                      </button>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductView;