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

const Discount = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [discounts, setDiscounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  // Dummy discounts data
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
      isDummy: true,
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
      isDummy: true,
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
      isDummy: true,
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
      isDummy: true,
    },
  ];

  // Load discounts from localStorage
  useEffect(() => {
    loadDiscountsFromStorage();
  }, []);

  const loadDiscountsFromStorage = () => {
    try {
      const savedDiscounts = JSON.parse(
        localStorage.getItem("discounts") || "[]"
      );

      // Filter out any dummy discounts that might have been saved previously
      const userDiscounts = savedDiscounts.filter(
        (discount) => !discount.isDummy
      );

      // Combine dummy discounts with user's discounts (dummy first, then user's)
      const allDiscounts = [...dummyDiscounts, ...userDiscounts];

      setDiscounts(allDiscounts);

      // Only save if we need to initialize or update
      if (savedDiscounts.length === 0) {
        localStorage.setItem("discounts", JSON.stringify(userDiscounts));
      }
    } catch (error) {
      console.error("Error loading discounts:", error);
      // If error, just show dummy discounts
      setDiscounts(dummyDiscounts);
    }
  };

  // Save only user discounts to localStorage whenever discounts change
  useEffect(() => {
    if (discounts.length > 0) {
      // Filter out dummy discounts before saving
      const userDiscounts = discounts.filter((discount) => !discount.isDummy);
      localStorage.setItem("discounts", JSON.stringify(userDiscounts));
    }
  }, [discounts]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const deleteDiscount = (id) => {
    if (window.confirm("Are you sure you want to delete this discount?")) {
      const discountToDelete = discounts.find((d) => d.id === id);

      // Show extra warning for demo discounts
      if (discountToDelete?.isDummy) {
        if (
          !window.confirm(
            "This is a demo discount. Are you sure you want to delete it?"
          )
        ) {
          return;
        }
      }

      const updatedDiscounts = discounts.filter(
        (discount) => discount.id !== id
      );
      setDiscounts(updatedDiscounts);
    }
  };

  // Filter discounts based on search and filter
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
    const userDiscounts = discounts.filter((d) => !d.isDummy);
    const totalDiscounts = discounts.length;
    const userAdded = userDiscounts.length;
    const activeDiscounts = discounts.filter((d) => d.isActive).length;
    const expiredDiscounts = discounts.filter(
      (d) => new Date(d.endDate) < new Date()
    ).length;
    const percentageDiscounts = discounts.filter(
      (d) => d.discountType === "percentage"
    ).length;

    return {
      totalDiscounts,
      userAdded,
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
                  <div className="mt-2 text-sm text-gray-500">
                    <span className="inline-flex items-center">
                      <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
                      Blue border indicates demo discounts
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
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
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Discounts</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
                <option value="percentage">Percentage Discounts</option>
              </select>
              <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <FunnelIcon className="h-5 w-5 mr-2" />
                More Filters
                <ChevronDownIcon className="h-4 w-4 ml-2" />
              </button>
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
                    {filteredDiscounts.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            No discounts found. Click "Add Discount" to get
                            started.
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
                          <tr
                            key={discount.id}
                            className={`hover:bg-gray-50 ${
                              discount.isDummy
                                ? "border-l-4 border-blue-500"
                                : ""
                            }`}
                          >
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
                                  <div className="flex items-center">
                                    <div className="text-sm font-medium text-gray-900">
                                      {discount.name}
                                    </div>
                                    {discount.isDummy && (
                                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                        Demo
                                      </span>
                                    )}
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
                                  to={`/discount/view/${discount.id}`}
                                  className="p-1 text-blue-600 hover:text-blue-800"
                                  title="View"
                                >
                                  <EyeIcon className="h-5 w-5" />
                                </Link>
                                <Link
                                  to={`/discount/update/${discount.id}`}
                                  className="p-1 text-green-600 hover:text-green-800"
                                  title="Edit Discount"
                                >
                                  <PencilIcon className="h-5 w-5" />
                                </Link>
                                <button
                                  onClick={() => deleteDiscount(discount.id)}
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
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{filteredDiscounts.length}</span>{" "}
                of <span className="font-medium">{discounts.length}</span>{" "}
                discounts
                <span className="ml-2 text-gray-500">
                  ({discounts.filter((d) => !d.isDummy).length} user-added)
                </span>
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
                {discounts.length > 10 && (
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
                  disabled={discounts.length <= 10}
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
                    <div className="text-sm text-gray-600">Total Discounts</div>
                    <div className="text-2xl font-bold mt-1">
                      {stats.totalDiscounts}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-green-600 mt-2">
                  {stats.userAdded} user-added
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
