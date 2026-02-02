import React, { useEffect, useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhotoIcon,
  InformationCircleIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { getAllBanners, deleteBanner } from "../../Api/bannerApi";

const Banner = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [banners, setBanners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBanners, setTotalBanners] = useState(0);
  const [pageSize] = useState(10);

  // Load banners from API
  useEffect(() => {
    fetchBanners(currentPage);
  }, [currentPage, filter]);

  const fetchBanners = async (page) => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page,
        limit: pageSize,
      };

      // Add filter for isActive if selected
      if (filter === "active") {
        params.isActive = "true";
      } else if (filter === "inactive") {
        params.isActive = "false";
      }

      const response = await getAllBanners(params);

      setBanners(response.data || []);
      
      // Extract pagination data from response.pagination object
      if (response.pagination) {
        setCurrentPage(response.pagination.currentPage || page);
        setTotalPages(response.pagination.totalPages || 1);
        setTotalBanners(response.pagination.total || 0);
      } else {
        setCurrentPage(page);
        setTotalPages(1);
        setTotalBanners(response.data?.length || 0);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to load banners";
      setError(errorMessage);
      console.error("Error fetching banners:", err);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const deleteBannerHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        const response = await deleteBanner(id);

        if (response.success) {
          // Refresh the products list
          fetchBanners(currentPage);
        }
      } catch (error) {
        console.error('Error deleting product:', error);

      }
    }
  };

  // Filter banners by search term (client-side)
  const filteredBanners = banners.filter((banner) => {
    const matchesSearch =
      banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      banner.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Calculate statistics
  const calculateStats = () => {
    const activeBanners = banners.filter((b) => b.isActive).length;
    const expiredBanners = banners.filter(
      (b) => new Date(b.endDate || Date.now() + 365 * 24 * 60 * 60 * 1000) < new Date()
    ).length;
    const currentBanners = banners.filter(
      (b) =>
        b.isActive &&
        new Date(b.startDate || 0) <= new Date() &&
        new Date(b.endDate || Date.now() + 365 * 24 * 60 * 60 * 1000) >= new Date()
    ).length;

    return {
      totalBanners,
      activeBanners,
      expiredBanners,
      currentBanners,
    };
  };

  const stats = calculateStats();

  const getPositionColor = (position) => {
    const colors = {
      top: "bg-blue-100 text-blue-800",
      middle: "bg-green-100 text-green-800",
      bottom: "bg-amber-100 text-amber-800",
      sidebar: "bg-purple-100 text-purple-800",
      popup: "bg-pink-100 text-pink-800",
    };
    return colors[position] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isActiveNow = (banner) => {
    const now = new Date();
    const start = new Date(banner.startDate || 0);
    const end = new Date(banner.endDate || Date.now() + 365 * 24 * 60 * 60 * 1000);
    return banner.isActive && start <= now && end >= now;
  };

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate || Date.now() + 365 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
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
                  <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
                  <p className="text-gray-600">
                    Manage promotional banners across your website
                  </p>
                  <div className="mt-2 text-sm text-gray-500">
                    <span className="inline-flex items-center">
                      <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
                      Blue border indicates demo banners
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Link
                    to="/banner/add"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Banner
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <PhotoIcon className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Total Banners</div>
                    <div className="text-2xl font-bold mt-1">
                      {stats.totalBanners}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">
                      Currently Active
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {stats.currentBanners}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-green-600 mt-2">
                  Showing on site now
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-8 w-8 text-amber-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Active (Total)</div>
                    <div className="text-2xl font-bold mt-1">
                      {stats.activeBanners}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Including scheduled
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <XCircleIcon className="h-8 w-8 text-red-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Expired</div>
                    <div className="text-2xl font-bold mt-1">
                      {stats.expiredBanners}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2">Past end date</div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by title or description..."
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
                <option value="all">All Banners</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
              </select>
              {/* <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <FunnelIcon className="h-5 w-5 mr-2" />
                More Filters
                <ChevronDownIcon className="h-4 w-4 ml-2" />
              </button> */}
            </div>

            {/* Banners Grid */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full bg-white rounded-lg shadow p-12 text-center">
                  <div className="text-gray-500">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <div className="text-lg font-medium">Loading banners...</div>
                  </div>
                </div>
              ) : filteredBanners.length === 0 ? (
                <div className="col-span-full bg-white rounded-lg shadow p-12 text-center">
                  <div className="text-gray-500">
                    <PhotoIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <div className="text-lg font-medium mb-2">
                      No banners found
                    </div>
                    <p className="text-gray-600 mb-4">
                      Click "Add Banner" to create your first banner
                    </p>
                  </div>
                </div>
              ) : (
                filteredBanners.map((banner) => {
                  const activeNow = isActiveNow(banner);
                  const daysRemaining = getDaysRemaining(banner.endDate);

                  return (
                    <div
                      key={banner._id}
                      className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      {/* Banner Image */}
                      <div className="relative h-48 bg-gray-100">
                        {banner.image ? (
                          <img
                            src={banner.image}
                            alt={banner.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <PhotoIcon className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(
                              banner.position
                            )}`}
                          >
                            {banner.position.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Banner Content */}
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-bold text-gray-900 truncate">
                            {banner.title}
                          </h3>
                          <span className="text-sm text-gray-500">
                            Priority: {banner.priority}
                          </span>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {banner.description}
                        </p>

                        {/* Button Info */}
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              {banner.buttonText}
                            </span>
                            <a
                              href={banner.buttonLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                              title="Preview Link"
                            >
                              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                            </a>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 truncate">
                            {banner.buttonLink}
                          </div>
                        </div>

                        {/* Pages */}
                        <div className="mb-4">
                          <div className="text-xs text-gray-500 mb-1">
                            Display Pages:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {banner.pages.map((page, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                              >
                                {page}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Dates and Status */}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                            {banner.startDate ? formatDate(banner.startDate) : "No start date"} -{" "}
                            {banner.endDate ? formatDate(banner.endDate) : "No end date"}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {activeNow ? (
                                <>
                                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" />
                                  <span className="text-green-600 font-medium">
                                    Active
                                  </span>
                                  {banner.endDate && (
                                    <span className="ml-2 text-xs text-green-500">
                                      {getDaysRemaining(banner.endDate)} days left
                                    </span>
                                  )}
                                </>
                              ) : banner.endDate && new Date(banner.endDate) < new Date() ? (
                                <>
                                  <XCircleIcon className="h-5 w-5 text-red-500 mr-1" />
                                  <span className="text-red-600 font-medium">
                                    Expired
                                  </span>
                                </>
                              ) : (
                                <>
                                  <XCircleIcon className="h-5 w-5 text-gray-500 mr-1" />
                                  <span className="text-gray-600 font-medium">
                                    Inactive
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2">
                              <Link
                                to={`/banner/view/${banner._id}`}
                                className="p-1 text-blue-600 hover:text-blue-800"
                                title="View Details"
                              >
                                <EyeIcon className="h-5 w-5" />
                              </Link>

                              {/* Edit Button - NOW ENABLED FOR ALL */}
                              <Link
                                to={`/banner/update/${banner._id}`}
                                className="p-1 text-green-600 hover:text-green-800"
                                title="Edit Banner"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </Link>

                              <button
                                onClick={() => deleteBannerHandler(banner._id)}
                                className="p-1 text-red-600 hover:text-red-800"
                                title="Delete Banner"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, totalBanners)}
                </span>{" "}
                of <span className="font-medium">{totalBanners}</span> banners
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-lg">
                  {currentPage}
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>

            
          </div>
        </main>
      </div>
    </div>
  );
};

export default Banner;
