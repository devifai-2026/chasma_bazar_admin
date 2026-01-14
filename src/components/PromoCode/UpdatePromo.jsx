import React, { useState, useEffect } from 'react';
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
  XCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';

const UpdatePromo = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    discountValue: '',
  });
  const [originalData, setOriginalData] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isDummyPromo, setIsDummyPromo] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadPromoCode();
  }, [id]);

  const loadPromoCode = () => {
    try {
      const allPromoCodes = JSON.parse(localStorage.getItem('promoCodes') || '[]');
      
      // Also check dummy data
      const dummyPromoCodes = [
        {
          id: 1,
          code: "SUMMER20",
          description: "Summer sale 20% off",
          discountType: "percentage",
          discountValue: 20,
          maxDiscount: 1000,
          minOrderValue: 2000,
          usageLimit: 100,
          usageCount: 45,
          startDate: "2024-06-01T00:00:00Z",
          endDate: "2024-08-31T23:59:59Z",
          isActive: true,
          isDummy: true,
          createdAt: "2024-05-15T10:30:00Z"
        },
        {
          id: 2,
          code: "WELCOME100",
          description: "Welcome discount ₹100 off",
          discountType: "fixed",
          discountValue: 100,
          maxDiscount: null,
          minOrderValue: 500,
          usageLimit: 1000,
          usageCount: 789,
          startDate: "2024-01-01T00:00:00Z",
          endDate: "2024-12-31T23:59:59Z",
          isActive: true,
          isDummy: true,
          createdAt: "2024-01-01T00:00:00Z"
        },
        {
          id: 3,
          code: "FLASH50",
          description: "Flash sale 50% off",
          discountType: "percentage",
          discountValue: 50,
          maxDiscount: 2000,
          minOrderValue: 1000,
          usageLimit: 50,
          usageCount: 50,
          startDate: "2024-11-01T00:00:00Z",
          endDate: "2024-11-02T23:59:59Z",
          isActive: false,
          isDummy: true,
          createdAt: "2024-10-30T12:00:00Z"
        },
        {
          id: 4,
          code: "FREESHIP",
          description: "Free shipping on all orders",
          discountType: "free_shipping",
          discountValue: 0,
          maxDiscount: null,
          minOrderValue: 1000,
          usageLimit: null,
          usageCount: 123,
          startDate: "2024-09-01T00:00:00Z",
          endDate: "2024-12-31T23:59:59Z",
          isActive: true,
          isDummy: true,
          createdAt: "2024-08-15T09:00:00Z"
        }
      ];

      const allData = [...dummyPromoCodes, ...allPromoCodes.filter(p => !p.isDummy)];
      const foundPromo = allData.find(p => p.id === parseInt(id));

      if (foundPromo) {
        // Track if it's a dummy promo (for UI indication only)
        setIsDummyPromo(foundPromo.isDummy || false);

        setOriginalData(foundPromo);
        setFormData({
          discountValue: foundPromo.discountValue.toString(),
        });
      } else {
        navigate('/promoCode');
      }
    } catch (error) {
      console.error('Error loading promo code:', error);
      navigate('/promoCode');
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      // Get current promocodes
      const existingPromoCodes = JSON.parse(localStorage.getItem('promoCodes') || '[]');
      
      // If editing a dummy promo, create a new user promo
      if (isDummyPromo) {
        // Create a new user promo based on the dummy
        const newPromoCode = {
          ...originalData,
          id: Date.now(), // New ID
          isDummy: false, // Convert to user promo
          discountValue: parseFloat(formData.discountValue),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // Remove isDummy property before saving
        const { isDummy, ...promoToSave } = newPromoCode;

        // Add to user promocodes
        existingPromoCodes.push(promoToSave);
        
        // Save to localStorage
        localStorage.setItem('promoCodes', JSON.stringify(existingPromoCodes));
        
        alert('Demo promo code converted to user promo and updated successfully!');
        navigate('/promoCode');
      } else {
        // For existing user promos, find and update
        const updatedPromoCodes = existingPromoCodes.map(promo => {
          if (promo.id === parseInt(id)) {
            return {
              ...promo,
              discountValue: parseFloat(formData.discountValue),
              updatedAt: new Date().toISOString()
            };
          }
          return promo;
        });

        // Save back to localStorage
        localStorage.setItem('promoCodes', JSON.stringify(updatedPromoCodes));
        
        alert('Promo code updated successfully!');
        navigate(`/promoCode/view/${id}`);
      }
    } catch (error) {
      console.error('Error updating promo code:', error);
      alert('Error updating promo code. Please try again.');
    }
  };

  const getDiscountTypeLabel = () => {
    if (!originalData) return '';
    const labels = {
      'percentage': 'Percentage (%)',
      'fixed': 'Fixed Amount (₹)',
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
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading...</div>
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
                    to={`/promoCode/view/${id}`} 
                    className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                  </Link>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Update Promo Code</h1>
                    <p className="text-gray-600">Update discount value for promo code</p>
                    <div className="mt-1 text-sm text-gray-500">
                      Code: <span className="font-mono font-bold">{originalData.code}</span>
                      {isDummyPromo && (
                        <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                          Demo Promo
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo promo notice */}
              {isDummyPromo && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex">
                    <InformationCircleIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium">Editing Demo Promo Code</p>
                      <p className="mt-1">
                        You are editing a demo promo code. When you save changes, 
                        it will be converted to a user promo code and saved to your local storage.
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
                    <div className="text-sm text-gray-500">Promo Code</div>
                    <div className="text-lg font-medium text-gray-900 font-mono">
                      {originalData.code}
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
                    <div className="text-sm text-gray-500">Minimum Order Value</div>
                    <div className="text-lg font-medium text-gray-900">
                      ₹{originalData.minOrderValue}
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
                    <div className="text-sm text-gray-500">Usage Limit</div>
                    <div className="text-lg font-medium text-gray-900">
                      {originalData.usageLimit || 'Unlimited'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Current Usage</div>
                    <div className="text-lg font-medium text-gray-900">
                      {originalData.usageCount} times
                    </div>
                  </div>
                </div>
              </div>

              {/* Update Discount Value Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Update Discount Value
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Discount Value *
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
                        placeholder={originalData.discountType === 'percentage' ? 'e.g., 20' : 'e.g., 100'}
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
                        'This is a free shipping promo. Discount value should be 0.'
                      )}
                    </div>
                  </div>

                  {/* Max Discount for percentage type */}
                  {originalData.discountType === 'percentage' && originalData.maxDiscount && (
                    <div className="md:col-span-2">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex">
                          <InformationCircleIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                          <div className="text-sm text-blue-700">
                            <p className="font-medium">Maximum Discount Limit</p>
                            <p className="mt-1">
                              Maximum discount is limited to ₹{originalData.maxDiscount}. 
                              This limit remains unchanged when updating the percentage value.
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
                  <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Update Summary
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-700">Current Discount Value</div>
                    <div className="text-lg font-bold text-gray-900">
                      {originalData.discountValue}
                      {originalData.discountType === 'percentage' ? '%' : '₹'}
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
                    <div className="text-sm text-green-700">Change</div>
                    <div className={`text-lg font-bold ${
                      parseFloat(formData.discountValue) > originalData.discountValue ? 'text-green-900' :
                      parseFloat(formData.discountValue) < originalData.discountValue ? 'text-red-900' : 'text-gray-900'
                    }`}>
                      {formData.discountValue ? (
                        <>
                          {parseFloat(formData.discountValue) > originalData.discountValue ? '+' : ''}
                          {(parseFloat(formData.discountValue) - originalData.discountValue).toFixed(1)}
                          {originalData.discountType === 'percentage' ? '%' : '₹'}
                        </>
                      ) : (
                        'N/A'
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
                      to="/promoCode"
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-center"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      {isDummyPromo ? 'Save as New Promo Code' : 'Update Promo Code'}
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

export default UpdatePromo;