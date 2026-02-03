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
import {getPromoCodeById , updatePromoCode } from '../../Api/promoCodeApi';
import toast from 'react-hot-toast'

const UpdatePromo = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: '',
    discountValue: '',
    maxDiscount: '',
    minOrderValue: '',
    usageLimit: '',
    startDate: '',
    endDate: '',
    isActive: false
  });
  const [originalData, setOriginalData] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadPromoCode();
  }, [id]);

  const loadPromoCode = async () => {
    try {
      setLoading(true);
      const response = await getPromoCodeById(id);
      
      // Handle both direct object response and object with data property
      const data = response.data || response;
      
      if (data) {
        setOriginalData(data);
        setFormData({
          code: data.code || '',
          description: data.description || '',
          discountType: data.discountType || '',
          discountValue: data.discountValue?.toString() || '',
          maxDiscount: data.maxDiscount?.toString() || '',
          minOrderValue: data.minOrderValue?.toString() || '',
          usageLimit: data.usageLimit?.toString() || '',
          startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
          endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '',
          isActive: data.isActive || false
        });
      } else {
        navigate('/promoCode');
      }
    } catch (error) {
      console.error('Error loading promo code:', error);
      toast.error('Failed to load promo code');
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
    
    if (formData.discountType === 'percentage' && parseFloat(formData.discountValue) > 100) {
      newErrors.discountValue = 'Percentage cannot exceed 100%';
    }

    if (formData.minOrderValue && parseFloat(formData.minOrderValue) < 0) {
      newErrors.minOrderValue = 'Minimum order value cannot be negative';
    }

    if (formData.maxDiscount && parseFloat(formData.maxDiscount) < 0) {
      newErrors.maxDiscount = 'Maximum discount cannot be negative';
    }

    if (formData.usageLimit && parseFloat(formData.usageLimit) < 0) {
      newErrors.usageLimit = 'Usage limit cannot be negative';
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the highlighted errors'); // ✅
      return;
    }

    try {
      setSubmitting(true);

      // Prepare updated data
      const updateData = {
        code: formData.code,
        description: formData.description,
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
        minOrderValue: parseFloat(formData.minOrderValue),
        usageLimit: formData.usageLimit ? parseFloat(formData.usageLimit) : null,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        isActive: formData.isActive
      };

      // Call the update API
      const response = await updatePromoCode(id, updateData);
      
      if (response) {
        toast.success('Promo code updated successfully!');
        navigate(`/promoCode/view/${id}`);
      }
    } catch (error) {
      console.error('Error updating promo code:', error);
      toast.error('Error updating promo code. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getDiscountTypeLabel = () => {
    const discountType = formData.discountType || originalData?.discountType;
    const labels = {
      'percentage': 'Percentage (%)',
      'fixed': 'Fixed Amount (₹)',
      'free_shipping': 'Free Shipping'
    };
    return labels[discountType] || discountType;
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
                    <p className="text-gray-600">Update promo code details</p>
                    <div className="mt-1 text-sm text-gray-500">
                      Code: <span className="font-mono font-bold">{originalData?.code || 'Loading...'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Promo Code Details Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <TicketIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Promo Code Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={handleChange}
                      name="code"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={handleChange}
                      name="description"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                    <select
                      value={formData.discountType}
                      onChange={handleChange}
                      name="discountType"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                      <option value="free_shipping">Free Shipping</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order Value</label>
                    <input
                      type="number"
                      value={formData.minOrderValue}
                      onChange={handleChange}
                      name="minOrderValue"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.minOrderValue ? 'border-red-300' : 'border-gray-300'
                      }`}
                      min="0"
                    />
                    {errors.minOrderValue && (
                      <p className="mt-1 text-sm text-red-600">{errors.minOrderValue}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={handleChange}
                      name="startDate"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={handleChange}
                      name="endDate"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.endDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit</label>
                    <input
                      type="number"
                      value={formData.usageLimit}
                      onChange={handleChange}
                      name="usageLimit"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.usageLimit ? 'border-red-300' : 'border-gray-300'
                      }`}
                      min="0"
                      placeholder="Leave empty for unlimited"
                    />
                    {errors.usageLimit && (
                      <p className="mt-1 text-sm text-red-600">{errors.usageLimit}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Active Status</label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Promo code is active</span>
                    </label>
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
                        {formData.discountType === 'percentage' ? (
                          <span className="text-gray-500">%</span>
                        ) : formData.discountType === 'fixed' ? (
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
                        step={formData.discountType === 'percentage' ? '0.1' : '1'}
                        min="0"
                        max={formData.discountType === 'percentage' ? '100' : undefined}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.discountValue ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder={formData.discountType === 'percentage' ? 'e.g., 20' : 'e.g., 100'}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <div className="text-sm text-gray-500">
                          Current: {originalData?.discountValue}
                          {formData.discountType === 'percentage' ? '%' : '₹'}
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
                      {formData.discountType === 'percentage' ? (
                        'Enter new percentage value (0-100)'
                      ) : formData.discountType === 'fixed' ? (
                        'Enter new fixed amount in ₹'
                      ) : (
                        'This is a free shipping promo. Discount value should be 0.'
                      )}
                    </div>
                  </div>

                  {/* Max Discount for percentage type */}
                  {formData.discountType === 'percentage' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Discount (₹)</label>
                      <input
                        type="number"
                        value={formData.maxDiscount}
                        onChange={handleChange}
                        name="maxDiscount"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.maxDiscount ? 'border-red-300' : 'border-gray-300'
                        }`}
                        min="0"
                        placeholder="Leave empty for no limit"
                      />
                      {errors.maxDiscount && (
                        <p className="mt-1 text-sm text-red-600">{errors.maxDiscount}</p>
                      )}
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
                      {originalData?.discountValue}
                      {formData.discountType === 'percentage' ? '%' : '₹'}
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
                      originalData && parseFloat(formData.discountValue) > originalData.discountValue ? 'text-green-900' :
                      originalData && parseFloat(formData.discountValue) < originalData.discountValue ? 'text-red-900' : 'text-gray-900'
                    }`}>
                      {formData.discountValue && originalData ? (
                        <>
                          {parseFloat(formData.discountValue) > originalData.discountValue ? '+' : ''}
                          {(parseFloat(formData.discountValue) - originalData.discountValue).toFixed(1)}
                          {formData.discountType === 'percentage' ? '%' : '₹'}
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
                      Last updated: {formatDate(originalData?.updatedAt || originalData?.createdAt)}
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
                      disabled={submitting}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Updating...' : 'Update Promo Code'}
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