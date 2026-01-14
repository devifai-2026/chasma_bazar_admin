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

const Banner = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [banners, setBanners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  // Dummy banners data based on your API structure
  const dummyBanners = [
    {
      id: 1,
      title: "Summer Sale 2025",
      description: "Get 50% off on all sunglasses",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h-400&fit=crop",
      buttonText: "Shop Now",
      buttonLink: "/products/sale",
      pages: ["home", "products"],
      position: "top",
      priority: 10,
      isActive: true,
      startDate: "2025-01-01T00:00:00.000Z",
      endDate: "2025-12-31T23:59:59.000Z",
      createdAt: "2024-12-01T10:30:00Z",
      isDummy: true,
    },
    {
      id: 2,
      title: "Winter Collection Launch",
      description: "New winter frames now available",
      image:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200&h=400&fit=crop",
      buttonText: "Explore",
      buttonLink: "/products/winter-collection",
      pages: ["home"],
      position: "middle",
      priority: 5,
      isActive: true,
      startDate: "2024-11-01T00:00:00.000Z",
      endDate: "2025-02-28T23:59:59.000Z",
      createdAt: "2024-10-25T14:20:00Z",
      isDummy: true,
    },
    {
      id: 3,
      title: "Limited Time Offer",
      description: "Buy one get one free on selected items",
      image:
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1200&h=400&fit=crop",
      buttonText: "Grab Deal",
      buttonLink: "/products/bogo",
      pages: ["home", "products", "cart"],
      position: "bottom",
      priority: 8,
      isActive: false,
      startDate: "2024-10-01T00:00:00.000Z",
      endDate: "2024-10-31T23:59:59.000Z",
      createdAt: "2024-09-28T09:15:00Z",
      isDummy: true,
    },
  ];

  // Load banners from localStorage
  useEffect(() => {
    loadBannersFromStorage();
  }, []);

  const loadBannersFromStorage = () => {
    try {
      const savedBanners = JSON.parse(localStorage.getItem("banners") || "[]");

      // Add isDummy: false to user-created banners
      const userBanners = savedBanners.map((banner) => ({
        ...banner,
        isDummy: false,
      }));

      // Combine dummy banners with user's banners
      const allBanners = [...dummyBanners, ...userBanners];

      setBanners(allBanners);
    } catch (error) {
      console.error("Error loading banners:", error);
      setBanners(dummyBanners);
    }
  };

  // Save only user banners to localStorage
  useEffect(() => {
    if (banners.length > 0) {
      const userBanners = banners.filter((banner) => !banner.isDummy);
      const bannersToSave = userBanners.map(({ isDummy, ...rest }) => rest);
      localStorage.setItem("banners", JSON.stringify(bannersToSave));
    }
  }, [banners]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const deleteBanner = (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      const bannerToDelete = banners.find((b) => b.id === id);

      if (bannerToDelete?.isDummy) {
        if (
          !window.confirm(
            "This is a demo banner. Are you sure you want to delete it?"
          )
        ) {
          return;
        }
      }

      const updatedBanners = banners.filter((banner) => banner.id !== id);
      setBanners(updatedBanners);

      if (bannerToDelete?.isDummy) {
        const deletedDummyIds = JSON.parse(
          localStorage.getItem("deletedBannerIds") || "[]"
        );
        deletedDummyIds.push(id);
        localStorage.setItem(
          "deletedBannerIds",
          JSON.stringify(deletedDummyIds)
        );
      }
    }
  };

  // Filter banners
  const filteredBanners = banners.filter((banner) => {
    const matchesSearch =
      banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      banner.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "active" && banner.isActive) ||
      (filter === "inactive" && !banner.isActive) ||
      (filter === "expired" && new Date(banner.endDate) < new Date());

    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const calculateStats = () => {
    const userBanners = banners.filter((b) => !b.isDummy);
    const totalBanners = banners.length;
    const userAdded = userBanners.length;
    const activeBanners = banners.filter((b) => b.isActive).length;
    const expiredBanners = banners.filter(
      (b) => new Date(b.endDate) < new Date()
    ).length;
    const currentBanners = banners.filter(
      (b) =>
        b.isActive &&
        new Date(b.startDate) <= new Date() &&
        new Date(b.endDate) >= new Date()
    ).length;

    return {
      totalBanners,
      userAdded,
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

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  const isActiveNow = (banner) => {
    const now = new Date();
    const start = new Date(banner.startDate);
    const end = new Date(banner.endDate);
    return banner.isActive && start <= now && end >= now;
  };

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const formatPages = (pages) => {
    return pages
      .map((page) => page.charAt(0).toUpperCase() + page.slice(1))
      .join(", ");
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
              <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <FunnelIcon className="h-5 w-5 mr-2" />
                More Filters
                <ChevronDownIcon className="h-4 w-4 ml-2" />
              </button>
            </div>

            {/* Banners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBanners.length === 0 ? (
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
                  const expired = isExpired(banner.endDate);
                  const activeNow = isActiveNow(banner);
                  const daysRemaining = getDaysRemaining(banner.endDate);

                  return (
                    <div
                      key={banner.id}
                      className={`bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300 ${
                        banner.isDummy ? "border-l-4 border-blue-500" : ""
                      }`}
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
                        {banner.isDummy && (
                          <div className="absolute top-3 left-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              Demo
                            </span>
                          </div>
                        )}
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
                            {formatDate(banner.startDate)} -{" "}
                            {formatDate(banner.endDate)}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {activeNow ? (
                                <>
                                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" />
                                  <span className="text-green-600 font-medium">
                                    Active
                                  </span>
                                  {!expired && (
                                    <span className="ml-2 text-xs text-green-500">
                                      {daysRemaining} days left
                                    </span>
                                  )}
                                </>
                              ) : expired ? (
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
                                to={`/banner/view/${banner.id}`}
                                className="p-1 text-blue-600 hover:text-blue-800"
                                title="View Details"
                              >
                                <EyeIcon className="h-5 w-5" />
                              </Link>

                              {/* Edit Button - NOW ENABLED FOR ALL */}
                              <Link
                                to={`/banner/update/${banner.id}`}
                                className="p-1 text-green-600 hover:text-green-800"
                                title="Edit Banner"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </Link>

                              <button
                                onClick={() => deleteBanner(banner.id)}
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
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{filteredBanners.length}</span> of{" "}
                <span className="font-medium">{banners.length}</span> banners
                <span className="ml-2 text-gray-500">
                  ({banners.filter((b) => !b.isDummy).length} user-added)
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
                <button
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={banners.length <= 9}
                >
                  Next
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <div className="text-sm text-green-600 mt-2">
                  {stats.userAdded} user-added
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default Banner;
