import React, { useEffect, useState } from 'react';
import {
  ArrowLeftIcon,
  TicketIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  TagIcon,
  ClockIcon,
  ChartBarIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';

const ViewPromo = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [promoCode, setPromoCode] = useState(null);
  const [loading, setLoading] = useState(true);
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
        setPromoCode(foundPromo);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDiscountTypeLabel = (type) => {
    const labels = {
      'percentage': 'Percentage Discount',
      'fixed': 'Fixed Amount Discount',
      'free_shipping': 'Free Shipping'
    };
    return labels[type] || type;
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusIcon = (isActive) => {
    return isActive ? (
      <CheckCircleIcon className="h-5 w-5 text-green-500" />
    ) : (
      <XCircleIcon className="h-5 w-5 text-red-500" />
    );
  };

  const calculateDaysRemaining = () => {
    if (!promoCode) return 0;
    const end = new Date(promoCode.endDate);
    const now = new Date();
    const diffTime = end - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const isExpired = () => {
    if (!promoCode) return false;
    return new Date(promoCode.endDate) < new Date();
  };

  const getUsagePercentage = () => {
    if (!promoCode || !promoCode.usageLimit) return 0;
    return Math.min(Math.round((promoCode.usageCount / promoCode.usageLimit) * 100), 100);
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

  if (!promoCode) {
    return null;
  }

  const daysRemaining = calculateDaysRemaining();
  const expired = isExpired();
  const usagePercentage = getUsagePercentage();

  return (
    <div className="flex h-screen">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className={`flex-1 overflow-y-auto bg-gray-50 p-6 transition-all duration-300 ${sidebarOpen ? 'lg:pl-6' : 'lg:pl-6'}`}>
          <div className="mx-auto max-w-[95%]">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Link 
                    to="/promoCode" 
                    className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                  </Link>
                  <div>
                    <div className="flex items-center">
                      <h1 className="text-2xl font-bold text-gray-900 mr-3">Promo Code Details</h1>
                      {promoCode.isDummy && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Demo
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">View and manage promo code information</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {!promoCode.isDummy && (
                    <Link
                      to={`/promoCode/edit/${promoCode.id}`}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                    >
                      <TagIcon className="h-5 w-5 mr-2" />
                      Edit Promo Code
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Promo Code Card */}
            <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-14 w-14 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TicketIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h2 className="text-2xl font-bold text-gray-900 font-mono">{promoCode.code}</h2>
                        <div className={`ml-3 px-3 py-1 rounded-full flex items-center ${getStatusColor(promoCode.isActive)}`}>
                          {getStatusIcon(promoCode.isActive)}
                          <span className="ml-1 text-sm font-medium">
                            {promoCode.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 mt-1">{promoCode.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Created On</div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(promoCode.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Discount Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <TagIcon className="h-5 w-5 mr-2 text-blue-500" />
                      Discount Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-500">Discount Type</div>
                        <div className="text-lg font-medium text-gray-900">
                          {getDiscountTypeLabel(promoCode.discountType)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Discount Value</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {promoCode.discountType === 'percentage' ? (
                            <>{promoCode.discountValue}% OFF</>
                          ) : promoCode.discountType === 'fixed' ? (
                            <>₹{promoCode.discountValue} OFF</>
                          ) : (
                            <>FREE SHIPPING</>
                          )}
                        </div>
                      </div>
                      {promoCode.maxDiscount && (
                        <div>
                          <div className="text-sm text-gray-500">Maximum Discount</div>
                          <div className="text-lg font-medium text-gray-900">
                            ₹{promoCode.maxDiscount}
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-sm text-gray-500">Minimum Order Value</div>
                        <div className="text-lg font-medium text-gray-900">
                          ₹{promoCode.minOrderValue}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Usage Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <UsersIcon className="h-5 w-5 mr-2 text-blue-500" />
                      Usage Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-500">Usage Count</div>
                        <div className="text-lg font-medium text-gray-900">
                          {promoCode.usageCount} times
                        </div>
                      </div>
                      {promoCode.usageLimit ? (
                        <>
                          <div>
                            <div className="text-sm text-gray-500">Usage Limit</div>
                            <div className="text-lg font-medium text-gray-900">
                              {promoCode.usageLimit} times
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm text-gray-500 mb-1">
                              <span>Usage Progress</span>
                              <span>{usagePercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  usagePercentage >= 100 ? 'bg-red-600' : 
                                  usagePercentage >= 80 ? 'bg-amber-500' : 'bg-green-600'
                                }`}
                                style={{ width: `${usagePercentage}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {promoCode.usageLimit - promoCode.usageCount} uses remaining
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-500">
                          <InformationCircleIcon className="h-5 w-5 inline mr-1" />
                          No usage limit set
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Validity Period */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
                      Validity Period
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-500">Start Date</div>
                        <div className="text-lg font-medium text-gray-900">
                          {formatDate(promoCode.startDate)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">End Date</div>
                        <div className="text-lg font-medium text-gray-900">
                          {formatDate(promoCode.endDate)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Status</div>
                        <div className={`text-lg font-medium ${expired ? 'text-red-600' : 'text-green-600'}`}>
                          {expired ? (
                            <span className="flex items-center">
                              <XCircleIcon className="h-5 w-5 mr-2" />
                              Expired
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <ClockIcon className="h-5 w-5 mr-2" />
                              {daysRemaining} days remaining
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <ChartBarIcon className="h-5 w-5 mr-2 text-blue-500" />
                      Statistics
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-blue-600">Average Daily Usage</div>
                        <div className="text-xl font-bold text-blue-900 mt-1">
                          {Math.round(promoCode.usageCount / 30)} per day
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm text-green-600">Success Rate</div>
                        <div className="text-xl font-bold text-green-900 mt-1">
                          {promoCode.usageLimit ? 
                            `${Math.round((promoCode.usageCount / promoCode.usageLimit) * 100)}%` : 
                            'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Last updated: {formatDate(promoCode.createdAt)}
                </div>
                <div className="flex space-x-3">
                  <Link
                    to="/promoCode"
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Back to List
                  </Link>
                  {!promoCode.isDummy && (
                    <Link
                      to={`/promoCode/edit/${promoCode.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Edit Promo Code
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ViewPromo;