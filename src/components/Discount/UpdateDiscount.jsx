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
import { getDiscountById, updateDiscount } from '../../Api/discountApi';

const UpdateDiscount = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discountValue: '',
    maxDiscount: '',
    applicableOn: 'global',
    priority: '',
    canStackWithOther: false,
    canStackWithPromo: false,
    startDate: '',
    endDate: '',
    usageLimit: '',
    minOrderValue: '',
    minQuantity: '',
    isActive: true,
    isAutoApplied: false
  });
  const [originalData, setOriginalData] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isDummyDiscount, setIsDummyDiscount] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadDiscount();
  }, [id]);

  const loadDiscount = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const response = await getDiscountById(id);
      console.log({response});
      
      // API returns { success: true, discount: {...} }
      if (response && response.discount) {
        const discount = response.discount;
        setOriginalData(discount);
        setFormData({
          name: discount.name || '',
          description: discount.description || '',
          discountValue: discount.discountValue.toString(),
          maxDiscount: discount.maxDiscount?.toString() || '',
          applicableOn: discount.applicableOn || 'global',
          priority: discount.priority?.toString() || '',
          canStackWithOther: discount.canStackWithOther || false,
          canStackWithPromo: discount.canStackWithPromo || false,
          startDate: discount.startDate ? new Date(discount.startDate).toISOString().slice(0, 16) : '',
          endDate: discount.endDate ? new Date(discount.endDate).toISOString().slice(0, 16) : '',
          usageLimit: discount.usageLimit?.toString() || '',
          minOrderValue: discount.minOrderValue?.toString() || '',
          minQuantity: discount.minQuantity?.toString() || '',
          isActive: discount.isActive || false,
          isAutoApplied: discount.isAutoApplied || false
        });
        setIsDummyDiscount(false);
      } else {
        throw new Error('Discount not found');
      }
    } catch (error) {
      console.error('Error loading discount from API:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load discount data. Please try again.';
      setLoadError(errorMessage);
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
    
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Discount name is required';
    }
    
    if (!formData.description || formData.description.trim() === '') {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.discountValue || parseFloat(formData.discountValue) < 0) {
      newErrors.discountValue = 'Valid discount value is required';
    }
    
    if (originalData?.discountType === 'percentage' && parseFloat(formData.discountValue) > 100) {
      newErrors.discountValue = 'Percentage cannot exceed 100%';
    }
    
    if (formData.maxDiscount && parseFloat(formData.maxDiscount) < 0) {
      newErrors.maxDiscount = 'Max discount cannot be negative';
    }
    
    if (!formData.priority || parseFloat(formData.priority) < 0) {
      newErrors.priority = 'Valid priority is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    if (formData.usageLimit && parseFloat(formData.usageLimit) < 0) {
      newErrors.usageLimit = 'Usage limit cannot be negative';
    }
    
    if (formData.minOrderValue && parseFloat(formData.minOrderValue) < 0) {
      newErrors.minOrderValue = 'Minimum order value cannot be negative';
    }
    
    if (formData.minQuantity && parseFloat(formData.minQuantity) < 0) {
      newErrors.minQuantity = 'Minimum quantity cannot be negative';
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
      setLoading(true);
      
      const updateData = {
        name: formData.name,
        description: formData.description,
        discountValue: parseFloat(formData.discountValue),
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
        applicableOn: formData.applicableOn,
        priority: parseFloat(formData.priority),
        canStackWithOther: formData.canStackWithOther,
        canStackWithPromo: formData.canStackWithPromo,
        startDate: formData.startDate,
        endDate: formData.endDate,
        usageLimit: formData.usageLimit ? parseFloat(formData.usageLimit) : null,
        minOrderValue: formData.minOrderValue ? parseFloat(formData.minOrderValue) : null,
        minQuantity: formData.minQuantity ? parseFloat(formData.minQuantity) : null,
        isActive: formData.isActive,
        isAutoApplied: formData.isAutoApplied
      };

      const response = await updateDiscount(id, updateData);
      
      if (response) {
        alert('Discount updated successfully!');
        navigate('/discount');
      }
    } catch (error) {
      console.error('Error updating discount:', error);
      alert(error.response?.data?.message || 'Error updating discount. Please try again.');
    } finally {
      setLoading(false);
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

  if (loadError) {
    return (
      <div className="flex h-screen">
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="mx-auto max-w-4xl">
              <div className="flex items-center justify-center h-64">
                <div className="bg-white rounded-lg shadow p-8 max-w-md w-full">
                  <div className="text-center">
                    <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                      Error Loading Discount
                    </h2>
                    <p className="text-gray-600 mb-4">{loadError}</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={loadDiscount}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Retry
                      </button>
                      <Link
                        to="/discount"
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-center"
                      >
                        Go Back
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
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
                  </div>
                  {isDummyDiscount && (
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      Demo Discount
                    </div>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <InformationCircleIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Basic Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Summer Sale 40%"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>
                  
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.description ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Brief description of the discount"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.description}
                      </p>
                    )}
                  </div>
                  
                  {/* Discount Type (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Type
                    </label>
                    <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {getDiscountTypeLabel()}
                    </div>
                  </div>
                  
                  {/* Applicable On */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Applicable On
                    </label>
                    <select
                      name="applicableOn"
                      value={formData.applicableOn}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="global">Global</option>
                      <option value="category">Category</option>
                      <option value="product">Product</option>
                      <option value="company">Company</option>
                      <option value="frame">Frame</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Discount Value & Limits Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Discount Value & Limits
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Discount Value */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Value *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {originalData?.discountType === 'percentage' ? (
                          <span className="text-gray-500">%</span>
                        ) : originalData?.discountType === 'fixed' ? (
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
                        step={originalData?.discountType === 'percentage' ? '0.1' : '1'}
                        min="0"
                        max={originalData?.discountType === 'percentage' ? '100' : undefined}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.discountValue ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder={originalData?.discountType === 'percentage' ? 'e.g., 40' : 'e.g., 500'}
                      />
                    </div>
                    {errors.discountValue && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.discountValue}
                      </p>
                    )}
                  </div>

                  {/* Max Discount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Discount Limit (₹)
                    </label>
                    <input
                      type="number"
                      name="maxDiscount"
                      value={formData.maxDiscount}
                      onChange={handleChange}
                      min="0"
                      step="1"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.maxDiscount ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 3000"
                    />
                    {errors.maxDiscount && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.maxDiscount}
                      </p>
                    )}
                  </div>

                  {/* Min Order Value */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Order Value (₹)
                    </label>
                    <input
                      type="number"
                      name="minOrderValue"
                      value={formData.minOrderValue}
                      onChange={handleChange}
                      min="0"
                      step="1"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.minOrderValue ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 1000"
                    />
                    {errors.minOrderValue && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.minOrderValue}
                      </p>
                    )}
                  </div>

                  {/* Min Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Quantity
                    </label>
                    <input
                      type="number"
                      name="minQuantity"
                      value={formData.minQuantity}
                      onChange={handleChange}
                      min="0"
                      step="1"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.minQuantity ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 1"
                    />
                    {errors.minQuantity && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.minQuantity}
                      </p>
                    )}
                  </div>

                  {/* Usage Limit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      name="usageLimit"
                      value={formData.usageLimit}
                      onChange={handleChange}
                      min="0"
                      step="1"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.usageLimit ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 100"
                    />
                    {errors.usageLimit && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.usageLimit}
                      </p>
                    )}
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority *
                    </label>
                    <input
                      type="number"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      min="0"
                      step="1"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.priority ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 1"
                    />
                    {errors.priority && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.priority}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Date & Time Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Validity Period
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.startDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.startDate}
                      </p>
                    )}
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.endDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.endDate}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Stacking & Settings Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <BoltIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Stacking & Settings
                </h2>
                
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="canStackWithOther"
                      checked={formData.canStackWithOther}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      Can Stack with Other Discounts
                    </span>
                  </label>
                  <p className="text-sm text-gray-500 ml-7">
                    Allow this discount to be combined with other discounts
                  </p>

                  <label className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      name="canStackWithPromo"
                      checked={formData.canStackWithPromo}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      Can Stack with Promo Codes
                    </span>
                  </label>
                  <p className="text-sm text-gray-500 ml-7">
                    Allow this discount to be combined with promo codes
                  </p>

                  <label className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      name="isAutoApplied"
                      checked={formData.isAutoApplied}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      Auto-Apply Discount
                    </span>
                  </label>
                  <p className="text-sm text-gray-500 ml-7">
                    Automatically apply this discount when conditions are met
                  </p>

                  <label className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      Set as Active
                    </span>
                  </label>
                  <p className="text-sm text-gray-500 ml-7">
                    {formData.isActive ? 'This discount is currently active' : 'This discount is currently inactive'}
                  </p>
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
                      disabled={loading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Updating...' : 'Update Discount'}
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