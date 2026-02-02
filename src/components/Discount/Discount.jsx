import React, { useEffect, useState } from "react";
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
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { getAllDiscounts, deleteDiscount as deleteDiscountAPI } from "../../Api/discountApi";

const Discount = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [discounts, setDiscounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 20,
  });

  // Fetch discounts from API
  useEffect(() => {
    fetchDiscounts();
  }, [pagination.currentPage, filter]);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
      };

      // Add filter params based on filter state
      if (filter === "active") {
        params.isActive = true;
      } else if (filter === "inactive") {
        params.isActive = false;
      }

      const response = await getAllDiscounts(params);
      if (response.success) {
        setDiscounts(response.discounts);
        setPagination({
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          total: response.total,
          limit: pagination.limit,
        });
      }
    } catch (err) {
      console.error("Error fetching discounts:", err);
      setError(err.message || "Failed to fetch discounts");
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const deleteDiscount = async (id) => {
    if (window.confirm("Are you sure you want to delete this discount?")) {
      try {
        await deleteDiscountAPI(id);
        
        alert("Discount deleted successfully!");
        // Refresh the list after deletion
        fetchDiscounts();
      } catch (err) {
        console.error("Error deleting discount:", err);
        alert("Failed to delete discount");
      }
    }
  };

  // Filter discounts based on search (client-side filtering)
  const filteredDiscounts = discounts.filter((discount) => {
    const matchesSearch =
      discount.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discount.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "active" && discount.isActive) ||
      (filter === "inactive" && !discount.isActive) ||
      (filter === "expired" && new Date(discount.endDate) < new Date()) ||
      (filter === "percentage" && discount.discountType === "percentage");

    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const calculateStats = () => {
    const totalDiscounts = pagination.total;
    const activeDiscounts = discounts.filter((d) => d.isActive).length;
    const expiredDiscounts = discounts.filter(
      (d) => new Date(d.endDate) < new Date()
    ).length;
    const percentageDiscounts = discounts.filter(
      (d) => d.discountType === "percentage"
    ).length;

    return {
      totalDiscounts,
      activeDiscounts,
      expiredDiscounts,
      percentageDiscounts,
    };
  };

  const stats = calculateStats();

  const getDiscountTypeColor = (type) => {
    const colors = {
      percentage: "bg-blue-100 text-blue-800",
      fixed: "bg-green-100 text-green-800",
      buy_x_get_y: "bg-purple-100 text-purple-800",
      free_shipping: "bg-amber-100 text-amber-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getDiscountTypeLabel = (type) => {
    const labels = {
      percentage: "%",
      fixed: "₹",
      buy_x_get_y: "B1G1",
      free_shipping: "Free Ship",
    };
    return labels[type] || type;
  };

  const getApplicableOnColor = (applicableOn) => {
    const colors = {
      global: "bg-gray-100 text-gray-800",
      category: "bg-indigo-100 text-indigo-800",
      product: "bg-teal-100 text-teal-800",
      company: "bg-cyan-100 text-cyan-800",
      frame: "bg-orange-100 text-orange-800",
    };
    return colors[applicableOn] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page
  };

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <tr key={index} className="animate-pulse">
          <td className="px-6 py-4">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
              <div className="ml-4 space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </td>
          <td className="px-6 py-4">
            <div className="flex space-x-2">
              <div className="h-5 w-5 bg-gray-200 rounded"></div>
              <div className="h-5 w-5 bg-gray-200 rounded"></div>
              <div className="h-5 w-5 bg-gray-200 rounded"></div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );

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
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Discounts
                  </h1>
                  <p className="text-gray-600">
                    Manage discount rules and promotions
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={fetchDiscounts}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    disabled={loading}
                  >
                    {loading ? "Refreshing..." : "Refresh"}
                  </button>
                  <Link
                    to="/discount/add"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Discount
                  </Link>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <XCircleIcon className="h-5 w-5 mr-2" />
                  <span>{error}</span>
                </div>
                <button
                  onClick={fetchDiscounts}
                  className="text-red-800 hover:text-red-900 font-medium"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Search and Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search discounts by name or description..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <select
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filter}
                onChange={(e) => handleFilterChange(e.target.value)}
              >
                <option value="all">All Discounts</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
                <option value="percentage">Percentage Discounts</option>
              </select>
              {/* <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <FunnelIcon className="h-5 w-5 mr-2" />
                More Filters
                <ChevronDownIcon className="h-4 w-4 ml-2" />
              </button> */}
            </div>

            {/* Discounts Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Discount Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value & Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Validity
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
                    {loading ? (
                      <LoadingSkeleton />
                    ) : filteredDiscounts.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            {searchTerm || filter !== "all"
                              ? "No discounts found matching your criteria."
                              : "No discounts found. Click 'Add Discount' to get started."}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredDiscounts.map((discount) => {
                        const expired = isExpired(discount.endDate);
                        const daysRemaining = getDaysRemaining(
                          discount.endDate
                        );

                        return (
                          <tr key={discount._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div
                                  className={`h-12 w-12 rounded-lg flex items-center justify-center ${getDiscountTypeColor(
                                    discount.discountType
                                  )}`}
                                >
                                  <TagIcon className="h-6 w-6" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {discount.name}
                                  </div>
                                  <div className="text-sm text-gray-500 mt-1">
                                    {discount.description}
                                  </div>
                                  <div className="mt-1 flex flex-wrap gap-2">
                                    <span
                                      className={`text-xs px-2 py-1 rounded-full ${getDiscountTypeColor(
                                        discount.discountType
                                      )}`}
                                    >
                                      {getDiscountTypeLabel(
                                        discount.discountType
                                      )}
                                    </span>
                                    <span
                                      className={`text-xs px-2 py-1 rounded-full ${getApplicableOnColor(
                                        discount.applicableOn
                                      )}`}
                                    >
                                      {discount.applicableOn}
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                                      Priority: {discount.priority}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <div className="flex items-center text-lg font-semibold text-gray-900">
                                  {discount.discountType === "percentage" ? (
                                    <>
                                      {discount.discountValue}%
                                      {discount.maxDiscount && (
                                        <span className="ml-2 text-sm text-gray-500">
                                          (max ₹{discount.maxDiscount})
                                        </span>
                                      )}
                                    </>
                                  ) : discount.discountType === "fixed" ? (
                                    <>₹{discount.discountValue}</>
                                  ) : discount.discountType ===
                                    "buy_x_get_y" ? (
                                    <>Buy 1 Get 1 Free</>
                                  ) : (
                                    <>Free Shipping</>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {discount.discountType === "percentage"
                                    ? "Percentage Discount"
                                    : discount.discountType === "fixed"
                                    ? "Fixed Amount Discount"
                                    : discount.discountType === "buy_x_get_y"
                                    ? "Buy X Get Y Offer"
                                    : "Free Shipping Offer"}
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mt-2">
                                  {discount.canStackWithOther ? (
                                    <span className="inline-flex items-center text-green-600">
                                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                                      Stackable
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center text-red-600">
                                      <XCircleIcon className="h-4 w-4 mr-1" />
                                      Not Stackable
                                    </span>
                                  )}
                                </div>
                                {discount.isAutoApplied && (
                                  <div className="text-sm text-blue-600 flex items-center">
                                    <BoltIcon className="h-4 w-4 mr-1" />
                                    Auto-applied
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <div className="flex items-center text-sm text-gray-900">
                                  <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                                  {formatDate(discount.startDate)}
                                </div>
                                <div className="flex items-center text-sm text-gray-900">
                                  <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                                  {formatDate(discount.endDate)}
                                </div>
                                <div
                                  className={`text-sm font-medium ${
                                    expired
                                      ? "text-red-600"
                                      : daysRemaining <= 7
                                      ? "text-amber-600"
                                      : "text-green-600"
                                  }`}
                                >
                                  {expired ? (
                                    <span className="inline-flex items-center">
                                      <XCircleIcon className="h-4 w-4 mr-1" />
                                      Expired
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center">
                                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                                      {daysRemaining} days left
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                {discount.isActive ? (
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
                              {expired && discount.isActive && (
                                <div className="mt-1 text-xs text-amber-600">
                                  Active but expired
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <Link
                                  to={`/discount/view/${discount._id}`}
                                  className="p-1 text-blue-600 hover:text-blue-800"
                                  title="View"
                                >
                                  <EyeIcon className="h-5 w-5" />
                                </Link>
                                <Link
                                  to={`/discount/update/${discount._id}`}
                                  className="p-1 text-green-600 hover:text-green-800"
                                  title="Edit Discount"
                                >
                                  <PencilIcon className="h-5 w-5" />
                                </Link>
                                <button
                                  onClick={() => deleteDiscount(discount._id)}
                                  className="p-1 text-red-600 hover:text-red-800"
                                  title="Delete Discount"
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
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(pagination.currentPage - 1) * pagination.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    pagination.currentPage * pagination.limit,
                    pagination.total
                  )}
                </span>{" "}
                of <span className="font-medium">{pagination.total}</span>{" "}
                discounts
              </div>
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={pagination.currentPage === 1 || loading}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                >
                  Previous
                </button>
                {[...Array(pagination.totalPages)].map((_, index) => {
                  const page = index + 1;
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === pagination.totalPages ||
                    (page >= pagination.currentPage - 1 &&
                      page <= pagination.currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        className={`px-3 py-1 rounded-lg ${
                          pagination.currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => handlePageChange(page)}
                        disabled={loading}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === pagination.currentPage - 2 ||
                    page === pagination.currentPage + 2
                  ) {
                    return <span key={page}>...</span>;
                  }
                  return null;
                })}
                <button
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    pagination.currentPage === pagination.totalPages || loading
                  }
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <TagIcon className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">
                      Total Discounts
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {stats.totalDiscounts}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Active</div>
                    <div className="text-2xl font-bold mt-1">
                      {stats.activeDiscounts}
                    </div>
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
                    <div className="text-2xl font-bold mt-1">
                      {stats.expiredDiscounts}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Past validity date
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-8 w-8 text-yellow-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Percentage</div>
                    <div className="text-2xl font-bold mt-1">
                      {stats.percentageDiscounts}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Percentage type discounts
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Discount;
