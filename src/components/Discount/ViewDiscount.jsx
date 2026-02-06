import React, { useEffect, useState } from 'react'
import { 
  ArrowLeftIcon,
  TagIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  BoltIcon,
  StarIcon,
  ChartBarIcon,
  UsersIcon,
  ShoppingBagIcon,
  ClockIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../Sidebar'
import Navbar from '../Navbar'
import { getDiscountById } from '../../Api/discountApi'

const ViewDiscount = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [discount, setDiscount] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  useEffect(() => {
    loadDiscountDetails()
  }, [id])

  const loadDiscountDetails = async () => {
    setLoading(true)
    try {
      // Call the API to fetch discount details
      const response = await getDiscountById(id)
      
      if (response.success && response.discount) {
        setDiscount(response.discount)
      } else {
        setError(response.message || 'Discount not found')
      }
    } catch (error) {
      console.error('Error loading discount:', error)
      setError(error.message || 'Failed to load discount details')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDiscountTypeLabel = (type) => {
    const labels = {
      'percentage': 'Percentage Discount',
      'fixed': 'Fixed Amount Discount',
      'buy_x_get_y': 'Buy X Get Y Offer',
      'free_shipping': 'Free Shipping Offer'
    }
    return labels[type] || type
  }

  const getDiscountTypeIcon = (type) => {
    const icons = {
      'percentage': CurrencyDollarIcon,
      'fixed': CurrencyDollarIcon,
      'buy_x_get_y': ShoppingBagIcon,
      'free_shipping': BoltIcon
    }
    return icons[type] || TagIcon
  }

  const getApplicableOnLabel = (applicableOn) => {
    const labels = {
      'global': 'Global (All Products)',
      'category': 'Specific Categories',
      'product': 'Specific Products',
      'company': 'Specific Companies',
      'frame': 'Specific Frames'
    }
    return labels[applicableOn] || applicableOn
  }

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date()
  }

  const isActiveNow = (startDate, endDate, isActive) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)
    return isActive && now >= start && now <= end
  }

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end - now
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const calculateUsageRate = () => {
    if (!discount) return 0
    const start = new Date(discount.startDate)
    const end = new Date(discount.endDate)
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    return totalDays > 0 ? (discount.usageCount / totalDays).toFixed(1) : discount.usageCount
  }

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading discount details...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error || !discount) {
    return (
      <div className="flex h-screen">
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <ExclamationCircleIcon className="h-16 w-16 text-red-500 mx-auto" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Discount Not Found</h3>
                <p className="mt-2 text-gray-600">{error || 'The discount you are looking for does not exist.'}</p>
                <Link
                  to="/discount"
                  className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  Back to Discounts
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const DiscountTypeIcon = getDiscountTypeIcon(discount.discountType)
  const expired = isExpired(discount.endDate)
  const activeNow = isActiveNow(discount.startDate, discount.endDate, discount.isActive)
  const daysRemaining = getDaysRemaining(discount.endDate)
  const usageRate = calculateUsageRate()

  return (
    <div className="flex h-screen">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className={`flex-1 overflow-y-auto bg-gray-50 p-6 transition-all duration-300 ${sidebarOpen ? 'lg:pl-6' : 'lg:pl-6'}`}>
          <div className="mx-auto max-w-6xl">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Link 
                    to="/discount" 
                    className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                  </Link>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Discount Details</h1>
                    <p className="text-gray-600">View complete discount information</p>
                  </div>
                </div>
                {/* <div className="flex items-center space-x-3">
                  {discount.isDummy && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      Demo Discount
                    </span>
                  )}
                  <Link
                    to={`/discount/edit/${discount.id}`}
                    className={`px-4 py-2 rounded-lg ${
                      discount.isDummy
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                    title={discount.isDummy ? "Cannot edit demo discounts" : "Edit Discount"}
                  >
                    Edit Discount
                  </Link>
                </div> */}
              </div>

              {/* Status Banner */}
              <div className={`p-4 rounded-lg mb-6 ${
                activeNow ? 'bg-green-50 border border-green-200' :
                expired ? 'bg-red-50 border border-red-200' :
                'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {activeNow ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-600 mr-3" />
                    ) : expired ? (
                      <XCircleIcon className="h-6 w-6 text-red-600 mr-3" />
                    ) : (
                      <ClockIcon className="h-6 w-6 text-blue-600 mr-3" />
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {activeNow ? 'Currently Active' : expired ? 'Expired' : 'Scheduled'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {activeNow 
                          ? `Active for ${daysRemaining} more days` 
                          : expired 
                          ? 'Discount validity has ended' 
                          : `Starts in ${getDaysRemaining(discount.startDate)} days`
                        }
                      </p>
                    </div>
                  </div>
                  {discount.isAutoApplied && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full flex items-center">
                      <BoltIcon className="h-4 w-4 mr-1" />
                      Auto-Applied
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Discount Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Basic Information Card */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Basic Information</h2>
                      <p className="text-gray-600">Discount name and description</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        discount.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {discount.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Priority: {discount.priority}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Discount Name</label>
                      <div className="text-xl font-semibold text-gray-900 flex items-center">
                        <DiscountTypeIcon className="h-6 w-6 mr-2 text-blue-500" />
                        {discount.name}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                      <p className="text-gray-700">{discount.description}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Applicable On</label>
                      <div className="flex items-center">
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                          {getApplicableOnLabel(discount.applicableOn)}
                        </span>
                        {discount.applicableCategories && (
                          <div className="ml-3 flex flex-wrap gap-2">
                            {discount.applicableCategories.map((category, index) => (
                              <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                                {category}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Discount Value Card */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Discount Value</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Discount Type</label>
                        <div className="text-lg font-semibold text-gray-900">
                          {getDiscountTypeLabel(discount.discountType)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">
                          {discount.discountType === 'percentage' ? `${discount.discountValue}%` :
                           discount.discountType === 'fixed' ? `₹${discount.discountValue}` :
                           discount.discountType === 'buy_x_get_y' ? 'Buy 1 Get 1 Free' :
                           'Free Shipping'}
                        </div>
                        {discount.maxDiscount && discount.discountType === 'percentage' && (
                          <p className="text-sm text-gray-600 mt-1">Max: ₹{discount.maxDiscount}</p>
                        )}
                      </div>
                    </div>

                    {discount.minOrderValue && (
                      <div className="border-t pt-4">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Minimum Order Value</label>
                        <div className="text-lg font-semibold text-gray-900">
                          ₹{discount.minOrderValue}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Validity Period Card */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
                    Validity Period
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Start Date & Time</label>
                      <div className="text-lg font-semibold text-gray-900">
                        {formatDate(discount.startDate)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(discount.startDate) > new Date() 
                          ? `Starts in ${getDaysRemaining(discount.startDate)} days` 
                          : 'Started'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">End Date & Time</label>
                      <div className="text-lg font-semibold text-gray-900">
                        {formatDate(discount.endDate)}
                      </div>
                      <p className={`text-sm font-medium mt-1 ${
                        expired ? 'text-red-600' : daysRemaining <= 7 ? 'text-amber-600' : 'text-green-600'
                      }`}>
                        {expired 
                          ? 'Expired' 
                          : `${daysRemaining} days remaining`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Stats & Rules */}
              <div className="space-y-8">
                

                {/* Stacking Rules Card */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <StarIcon className="h-5 w-5 mr-2 text-blue-500" />
                    Stacking Rules
                  </h2>
                  
                  <div className="space-y-4">
                    <div className={`flex items-center p-3 rounded-lg ${
                      discount.canStackWithOther ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                      {discount.canStackWithOther ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-red-600 mr-3" />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">
                          {discount.canStackWithOther ? 'Can stack with other discounts' : 'Cannot stack with other discounts'}
                        </div>
                        <p className="text-sm text-gray-600">
                          {discount.canStackWithOther 
                            ? 'This discount can be combined with other active discounts' 
                            : 'This discount cannot be combined with other discounts'}
                        </p>
                      </div>
                    </div>

                    <div className={`flex items-center p-3 rounded-lg ${
                      discount.canStackWithPromo ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                      {discount.canStackWithPromo ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-red-600 mr-3" />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">
                          {discount.canStackWithPromo ? 'Can stack with promo codes' : 'Cannot stack with promo codes'}
                        </div>
                        <p className="text-sm text-gray-600">
                          {discount.canStackWithPromo 
                            ? 'This discount can be combined with promo codes' 
                            : 'This discount cannot be combined with promo codes'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center p-3 rounded-lg bg-blue-50">
                      <BoltIcon className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {discount.isAutoApplied ? 'Auto-applied' : 'Manual application'}
                        </div>
                        <p className="text-sm text-gray-600">
                          {discount.isAutoApplied 
                            ? 'Automatically applied to eligible items' 
                            : 'Requires manual application or code entry'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ViewDiscount