import React, { useEffect, useState } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  TagIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  BoltIcon,
  StarIcon,
  TicketIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { getAllPromoCodes, deletePromoCode } from '../../Api/promoCodeApi';
import toast from 'react-hot-toast'

const PromoCode = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [promoCodes, setPromoCodes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPromoId, setSelectedPromoId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load promocodes from API
  useEffect(() => {
    loadPromoCodesFromAPI();
  }, []);

  const loadPromoCodesFromAPI = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getAllPromoCodes();

      // Handle both direct array response and object with data property
      const data = Array.isArray(response) ? response : (response.data || []);

      setPromoCodes(data);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
      toast.error("Failed to load promo codes");
      setError('Failed to load promo codes. Please try again.');
      // Fallback to empty array instead of dummy data
      setPromoCodes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const confirmDeletePromoCode = async () => {
    if (!selectedPromoId) return;

    try {
      setIsDeleting(true);
      const loadingToast = toast.loading("Deleting promo code...");

      const response = await deletePromoCode(selectedPromoId);

      if (response?.success) {
        toast.success("Promo code deleted successfully", { id: loadingToast });
        loadPromoCodesFromAPI();
        setIsDeleteModalOpen(false);
        setSelectedPromoId(null);
      } else {
        toast.error("Failed to delete promo code", { id: loadingToast });
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter promocodes based on search and filter
  const filteredPromoCodes = promoCodes.filter(promo => {
    const matchesSearch = promo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filter === 'all' ||
      (filter === 'active' && promo.isActive) ||
      (filter === 'inactive' && !promo.isActive) ||
      (filter === 'expired' && new Date(promo.endDate) < new Date()) ||
      (filter === 'usage_limit' && promo.usageLimit && promo.usageCount >= promo.usageLimit);

    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const calculateStats = () => {
    const totalPromoCodes = promoCodes.length;
    const activePromoCodes = promoCodes.filter(p => p.isActive).length;
    const expiredPromoCodes = promoCodes.filter(p => new Date(p.endDate) < new Date()).length;
    const reachedLimit = promoCodes.filter(p => p.usageLimit && p.usageCount >= p.usageLimit).length;

    return { totalPromoCodes, activePromoCodes, expiredPromoCodes, reachedLimit };
  };

  const stats = calculateStats();

  const getDiscountTypeColor = (type) => {
    const colors = {
      'percentage': 'bg-blue-100 text-blue-800',
      'fixed': 'bg-green-100 text-green-800',
      'free_shipping': 'bg-amber-100 text-amber-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getDiscountTypeLabel = (type) => {
    const labels = {
      'percentage': '% Off',
      'fixed': '₹ Off',
      'free_shipping': 'Free Shipping'
    };
    return labels[type] || type;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUsagePercentage = (promo) => {
    if (!promo.usageLimit) return 0;
    return Math.min(Math.round((promo.usageCount / promo.usageLimit) * 100), 100);
  };

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
          className={`flex-1 overflow-y-auto bg-gray-50 p-6 transition-all duration-300 ${sidebarOpen ? "lg:pl-6" : "lg:pl-6"
            }`}
        >
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Promo Codes</h1>
                  <p className="text-gray-600">
                    Manage promo codes and customer discounts
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Link
                    to="/promoCode/add"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Promo Code
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <TicketIcon className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Total Promo Codes</div>
                    <div className="text-2xl font-bold mt-1">{stats.totalPromoCodes}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Active</div>
                    <div className="text-2xl font-bold mt-1">{stats.activePromoCodes}</div>
                  </div>
                </div>
                <div className="text-sm text-green-600 mt-2">
                  Currently active
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <XCircleIcon className="h-8 w-8 text-red-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Expired</div>
                    <div className="text-2xl font-bold mt-1">{stats.expiredPromoCodes}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Past validity date
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <BoltIcon className="h-8 w-8 text-yellow-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Reached Limit</div>
                    <div className="text-2xl font-bold mt-1">{stats.reachedLimit}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Max usage reached
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by promo code or description..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <select
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Promo Codes</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
                <option value="usage_limit">Reached Usage Limit</option>
              </select>
              {/* <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <FunnelIcon className="h-5 w-5 mr-2" />
                More Filters
                <ChevronDownIcon className="h-4 w-4 ml-2" />
              </button> */}
            </div>

            {/* Promo Codes Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center p-12">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Loading promo codes...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="p-6 bg-red-50 border border-red-200 rounded-lg m-4">
                  <div className="text-red-800">
                    <p className="font-medium">Error loading promo codes</p>
                    <p className="text-sm mt-1">{error}</p>
                    <button
                      onClick={loadPromoCodesFromAPI}
                      className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Promo Code Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Discount & Limits
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Validity & Usage
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPromoCodes.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center">
                            <div className="text-gray-500">
                              No promo codes found. Click "Add Promo Code" to get started.
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredPromoCodes.map((promo) => {
                          const expired = isExpired(promo.endDate);
                          const daysRemaining = getDaysRemaining(promo.endDate);
                          const usagePercentage = getUsagePercentage(promo);
                          const reachedLimit = promo.usageLimit && promo.usageCount >= promo.usageLimit;

                          return (
                            <tr
                              key={promo._id || promo.id}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${getDiscountTypeColor(promo.discountType)}`}>
                                    <TicketIcon className="h-6 w-6" />
                                  </div>
                                  <div className="ml-4">
                                    <div className="flex items-center">
                                      <div className="text-lg font-bold text-gray-900 font-mono">
                                        {promo.code}
                                      </div>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                      {promo.description}
                                    </div>
                                    <div className="mt-1 flex flex-wrap gap-2">
                                      <span className={`text-xs px-2 py-1 rounded-full ${getDiscountTypeColor(promo.discountType)}`}>
                                        {getDiscountTypeLabel(promo.discountType)}
                                      </span>
                                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                                        Min Order: ₹{promo.minOrderValue}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="space-y-2">
                                  <div className="flex items-center text-lg font-semibold text-gray-900">
                                    {promo.discountType === 'percentage' ? (
                                      <>
                                        {promo.discountValue}% OFF
                                        {promo.maxDiscount && (
                                          <span className="ml-2 text-sm text-gray-500">
                                            (max ₹{promo.maxDiscount})
                                          </span>
                                        )}
                                      </>
                                    ) : promo.discountType === 'fixed' ? (
                                      <>₹{promo.discountValue} OFF</>
                                    ) : (
                                      <>FREE SHIPPING</>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {promo.discountType === 'percentage' ? 'Percentage Discount' :
                                      promo.discountType === 'fixed' ? 'Fixed Amount Discount' :
                                        'Free Shipping Offer'}
                                  </div>
                                  {promo.usageLimit && (
                                    <div className="text-sm text-gray-600">
                                      Usage: {promo.usageCount}/{promo.usageLimit}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="space-y-2">
                                  <div className="flex items-center text-sm text-gray-900">
                                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                                    {formatDate(promo.startDate)} - {formatDate(promo.endDate)}
                                  </div>
                                  <div className={`text-sm font-medium ${expired ? 'text-red-600' :
                                    daysRemaining <= 7 ? 'text-amber-600' :
                                      'text-green-600'
                                    }`}>
                                    {expired ? (
                                      <span className="inline-flex items-center">
                                        <XCircleIcon className="h-4 w-4 mr-1" />
                                        Expired
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center">
                                        <CalendarIcon className="h-4 w-4 mr-1" />
                                        {daysRemaining} days left
                                      </span>
                                    )}
                                  </div>
                                  {promo.usageLimit && (
                                    <div className="mt-2">
                                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>Usage</span>
                                        <span>{usagePercentage}%</span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                                        <div
                                          className={`h-1.5 rounded-full ${usagePercentage >= 100 ? 'bg-red-600' :
                                            usagePercentage >= 80 ? 'bg-amber-500' : 'bg-green-600'
                                            }`}
                                          style={{ width: `${usagePercentage}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col space-y-2">
                                  <div className="flex items-center">
                                    {promo.isActive ? (
                                      <>
                                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                        <span className="ml-2 text-sm font-medium text-green-600">
                                          Active
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <XCircleIcon className="h-5 w-5 text-red-500" />
                                        <span className="ml-2 text-sm font-medium text-red-600">
                                          Inactive
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  {reachedLimit && (
                                    <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                                      Usage limit reached
                                    </div>
                                  )}
                                  {expired && promo.isActive && (
                                    <div className="text-xs text-amber-600">
                                      Active but expired
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                  <Link
                                    to={`/promoCode/view/${promo._id || promo.id}`}
                                    className="p-1 text-blue-600 hover:text-blue-800"
                                    title="View Details"
                                  >
                                    <EyeIcon className="h-5 w-5" />
                                  </Link>

                                  <Link
                                    to={`/promoCode/update/${promo._id || promo.id}`}
                                    className="p-1 text-green-600 hover:text-green-800"
                                    title="Edit Promo Code"
                                  >
                                    <PencilIcon className="h-5 w-5" />
                                  </Link>

                                  <button
                                    onClick={() => {
                                      setSelectedPromoId(promo._id);
                                      setIsDeleteModalOpen(true);
                                    }}
                                    className="p-1 text-red-600 hover:text-red-800"
                                    title="Delete Promo Code"
                                  >
                                    <TrashIcon className="h-5 w-5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{filteredPromoCodes.length}</span> of{" "}
                <span className="font-medium">{promoCodes.length}</span> promo codes
              </div>
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled
                >
                  Previous
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  1
                </button>
                {promoCodes.length > 10 && (
                  <>
                    <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">
                      2
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">
                      3
                    </button>
                  </>
                )}
                <button
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={promoCodes.length <= 10}
                >
                  Next
                </button>
              </div>
            </div>

            {/* ================= DELETE CONFIRMATION MODAL ================= */}
            {isDeleteModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                  <h2 className="text-lg font-semibold mb-2">
                    Delete Promo Code
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Are you sure you want to delete this promo code?
                    <span className="text-red-600 font-semibold">
                      {" "}This action cannot be undone.
                    </span>
                  </p>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setIsDeleteModalOpen(false);
                        setSelectedPromoId(null);
                      }}
                      disabled={isDeleting}
                      className="px-4 py-2 bg-gray-200 rounded-lg"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={confirmDeletePromoCode}
                      disabled={isDeleting}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50"
                    >
                      {isDeleting ? "Deleting..." : "Yes, Delete"}
                    </button>
                  </div>
                </div>
              </div>
            )}




          </div>
        </main>
      </div>
    </div>
  );
};

export default PromoCode;