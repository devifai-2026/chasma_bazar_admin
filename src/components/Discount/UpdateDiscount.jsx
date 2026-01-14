import React, { useState, useEffect } from 'react';
import {
  ArrowLeftIcon,
  TagIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  BoltIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';

const UpdateDiscount = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    discountValue: '',
    isActive: true
  });
  const [originalData, setOriginalData] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isDummyDiscount, setIsDummyDiscount] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadDiscount();
  }, [id]);

  const loadDiscount = () => {
    try {
      const allDiscounts = JSON.parse(localStorage.getItem('discounts') || '[]');
      
      // Also check dummy data
      const dummyDiscounts = [
        {
          id: 1,
          name: "Summer Sale 20%",
          description: "20% discount for summer season",
          discountType: "percentage",
          discountValue: 20,
          maxDiscount: 1000,
          applicableOn: "global",
          priority: 10,
          canStackWithOther: false,
          canStackWithPromo: true,
          startDate: "2024-12-01T00:00:00Z",
          endDate: "2024-12-31T23:59:59Z",
          isActive: true,
          isAutoApplied: false,
          isDummy: true
        },
        {
          id: 2,
          name: "Winter Clearance ₹500 Off",
          description: "Fixed ₹500 off on winter collection",
          discountType: "fixed",
          discountValue: 500,
          maxDiscount: null,
          applicableOn: "category",
          priority: 5,
          canStackWithOther: true,
          canStackWithPromo: false,
          startDate: "2024-11-15T00:00:00Z",
          endDate: "2024-12-15T23:59:59Z",
          isActive: true,
          isAutoApplied: true,
          isDummy: true
        },
        {
          id: 3,
          name: "Buy 1 Get 1 Free",
          description: "Buy one frame, get one free",
          discountType: "buy_x_get_y",
          discountValue: 100,
          maxDiscount: null,
          applicableOn: "product",
          priority: 1,
          canStackWithOther: false,
          canStackWithPromo: false,
          startDate: "2024-10-01T00:00:00Z",
          endDate: "2024-10-31T23:59:59Z",
          isActive: false,
          isAutoApplied: false,
          isDummy: true
        },
        {
          id: 4,
          name: "Free Shipping All Orders",
          description: "Free shipping on all orders",
          discountType: "free_shipping",
          discountValue: 0,
          maxDiscount: null,
          applicableOn: "global",
          priority: 20,
          canStackWithOther: true,
          canStackWithPromo: true,
          startDate: "2024-09-01T00:00:00Z",
          endDate: "2024-12-31T23:59:59Z",
          isActive: true,
          isAutoApplied: true,
          isDummy: true
        }
      ];

      const allData = [...dummyDiscounts, ...allDiscounts.filter(d => !d.isDummy)];
      const foundDiscount = allData.find(d => d.id === parseInt(id));

      if (foundDiscount) {
        // Track if it's a dummy discount
        setIsDummyDiscount(foundDiscount.isDummy || false);

        setOriginalData(foundDiscount);
        setFormData({
          discountValue: foundDiscount.discountValue.toString(),
          isActive: foundDiscount.isActive
        });
      } else {
        alert('Discount not found!');
        navigate('/discount');
      }
    } catch (error) {
      console.error('Error loading discount:', error);
      alert('Error loading discount data');
      navigate('/discount');
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field if user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.discountValue || parseFloat(formData.discountValue) < 0) {
      newErrors.discountValue = 'Valid discount value is required';
    }
    
    if (originalData.discountType === 'percentage' && parseFloat(formData.discountValue) > 100) {
      newErrors.discountValue = 'Percentage cannot exceed 100%';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Get current discounts
      const existingDiscounts = JSON.parse(localStorage.getItem('discounts') || '[]');
      
      // If editing a dummy discount, create a new user discount
      if (isDummyDiscount) {
        // Create a new user discount based on the dummy
        const newDiscount = {
          ...originalData,
          id: Date.now(), // New ID
          isDummy: false, // Convert to user discount
          discountValue: parseFloat(formData.discountValue),
          isActive: formData.isActive,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // Remove isDummy property before saving
        const { isDummy, ...discountToSave } = newDiscount;

        // Add to user discounts
        existingDiscounts.push(discountToSave);
        
        // Save to localStorage
        localStorage.setItem('discounts', JSON.stringify(existingDiscounts));
        
        alert('Demo discount converted to user discount and updated successfully!');
        navigate('/discount');
      } else {
        // For existing user discounts, find and update
        const updatedDiscounts = existingDiscounts.map(discount => {
          if (discount.id === parseInt(id)) {
            return {
              ...discount,
              discountValue: parseFloat(formData.discountValue),
              isActive: formData.isActive,
              updatedAt: new Date().toISOString()
            };
          }
          return discount;
        });

        // Save back to localStorage
        localStorage.setItem('discounts', JSON.stringify(updatedDiscounts));
        
        alert('Discount updated successfully!');
        navigate(`/discount/view/${id}`);
      }
    } catch (error) {
      console.error('Error updating discount:', error);
      alert('Error updating discount. Please try again.');
    }
  };

  const getDiscountTypeLabel = () => {
    if (!originalData) return '';
    const labels = {
      'percentage': 'Percentage (%)',
      'fixed': 'Fixed Amount (₹)',
      'buy_x_get_y': 'Buy 1 Get 1 Free',
      'free_shipping': 'Free Shipping'
    };
    return labels[originalData.discountType] || originalData.discountType;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
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
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="mx-auto max-w-4xl flex items-center justify-center h-64">
              <div className="text-gray-500">Loading discount data...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!originalData) {
    return null;
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        closeSidebar={closeSidebar}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <main
          className={`flex-1 overflow-y-auto bg-gray-50 p-6 transition-all duration-300 ${
            sidebarOpen ? "lg:pl-6" : "lg:pl-6"
          }`}
        >
          <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <Link
                    to="/discount"
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
                  >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to Discounts
                  </Link>
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Update Discount</h1>
                      <p className="text-gray-600">
                        Edit discount: {originalData.name}
                      </p>
                    </div>
                    {isDummyDiscount && (
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        Demo Discount
                      </div>
                    )}
                  </div>
                  {isDummyDiscount && (
                    <div className="mt-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                      <p>
                        <strong>Note:</strong> You are editing a demo discount. When you save changes, 
                        it will be converted to a user discount and saved to your local storage.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Current Information Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <InformationCircleIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Current Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-500">Discount Name</div>
                    <div className="text-lg font-medium text-gray-900">
                      {originalData.name}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Description</div>
                    <div className="text-lg font-medium text-gray-900">
                      {originalData.description}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Discount Type</div>
                    <div className="text-lg font-medium text-gray-900">
                      {getDiscountTypeLabel()}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Applicable On</div>
                    <div className="text-lg font-medium text-gray-900">
                      {originalData.applicableOn}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Start Date</div>
                    <div className="text-lg font-medium text-gray-900">
                      {formatDate(originalData.startDate)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">End Date</div>
                    <div className="text-lg font-medium text-gray-900">
                      {formatDate(originalData.endDate)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Priority</div>
                    <div className="text-lg font-medium text-gray-900">
                      {originalData.priority}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Stackable</div>
                    <div className="text-lg font-medium text-gray-900">
                      {originalData.canStackWithOther ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Update Fields Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Update Discount Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Discount Value */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Value *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {originalData.discountType === 'percentage' ? (
                          <span className="text-gray-500">%</span>
                        ) : originalData.discountType === 'fixed' ? (
                          <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <TagIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <input
                        type="number"
                        name="discountValue"
                        value={formData.discountValue}
                        onChange={handleChange}
                        step={originalData.discountType === 'percentage' ? '0.1' : '1'}
                        min="0"
                        max={originalData.discountType === 'percentage' ? '100' : undefined}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.discountValue ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder={originalData.discountType === 'percentage' ? 'e.g., 20' : 'e.g., 500'}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <div className="text-sm text-gray-500">
                          Current: {originalData.discountValue}
                          {originalData.discountType === 'percentage' ? '%' : '₹'}
                        </div>
                      </div>
                    </div>
                    {errors.discountValue && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.discountValue}
                      </p>
                    )}
                    <div className="mt-2 text-sm text-gray-500">
                      {originalData.discountType === 'percentage' ? (
                        'Enter new percentage value (0-100)'
                      ) : originalData.discountType === 'fixed' ? (
                        'Enter new fixed amount in ₹'
                      ) : (
                        'For free shipping, value should be 0'
                      )}
                    </div>
                  </div>

                  {/* Max Discount for percentage type */}
                  {originalData.discountType === 'percentage' && originalData.maxDiscount && (
                    <div>
                      <div className="text-sm text-gray-700 mb-2">Maximum Discount Limit</div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center">
                          <InformationCircleIcon className="h-4 w-4 text-blue-500 mr-2" />
                          <div className="text-sm text-blue-700">
                            Maximum discount limited to ₹{originalData.maxDiscount}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Active Status */}
                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        Set as active discount
                      </span>
                    </label>
                    <p className="mt-2 text-sm text-gray-500">
                      {formData.isActive ? 'This discount will be available for use' : 'This discount will be inactive'}
                    </p>
                  </div>

                  {/* Special fields for specific types */}
                  {originalData.discountType === 'buy_x_get_y' && (
                    <div className="md:col-span-2">
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <StarIcon className="h-5 w-5 text-amber-500 mr-2" />
                          <div className="text-sm text-amber-700">
                            <p className="font-medium">Buy 1 Get 1 Free Discount</p>
                            <p className="mt-1">
                              This is a special promotional discount. The value represents the percentage off on the second item.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {originalData.isAutoApplied && (
                    <div className="md:col-span-2">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <BoltIcon className="h-5 w-5 text-green-500 mr-2" />
                          <div className="text-sm text-green-700">
                            <p className="font-medium">Auto-Applied Discount</p>
                            <p className="mt-1">
                              This discount is automatically applied when conditions are met.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Update Summary Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <TagIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Update Summary
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-700">Current Discount Value</div>
                    <div className="text-lg font-bold text-gray-900">
                      {originalData.discountValue}
                      {originalData.discountType === 'percentage' ? '%' : originalData.discountType === 'fixed' ? '₹' : ''}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-700">New Discount Value</div>
                    <div className="text-lg font-bold text-blue-900">
                      {formData.discountValue || 'Not set'}
                      {formData.discountValue && originalData.discountType === 'percentage' ? '%' : ''}
                      {formData.discountValue && originalData.discountType === 'fixed' ? '₹' : ''}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-700">Status</div>
                    <div className="text-lg font-bold">
                      {formData.isActive ? (
                        <span className="text-green-900 flex items-center">
                          <CheckCircleIcon className="h-5 w-5 mr-2" />
                          Active
                        </span>
                      ) : (
                        <span className="text-red-900 flex items-center">
                          <XCircleIcon className="h-5 w-5 mr-2" />
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0">
                  <div>
                    <p className="text-sm text-gray-500">
                      Last updated: {formatDate(originalData.updatedAt || originalData.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <Link
                      to="/discount"
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-center"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      {isDummyDiscount ? 'Save as New Discount' : 'Update Discount'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UpdateDiscount;