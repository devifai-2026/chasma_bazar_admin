import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftIcon, 
  PhotoIcon, 
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  LinkIcon,
  EyeIcon,
  ArrowTopRightOnSquareIcon
} from "@heroicons/react/24/outline";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

const ViewBanner = () => {
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBannerData();
  }, [id]);

  const loadBannerData = () => {
    try {
      // Get all banners
      const allBanners = JSON.parse(localStorage.getItem("banners") || "[]");
      const dummyBanners = [
        {
          id: 1,
          title: "Summer Sale 2025",
          description: "Get 50% off on all sunglasses",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h-400&fit=crop",
          buttonText: "Shop Now",
          buttonLink: "/products/sale",
          pages: ["home", "products"],
          position: "top",
          priority: 10,
          isActive: true,
          startDate: "2025-01-01T00:00:00.000Z",
          endDate: "2025-12-31T23:59:59.000Z",
          createdAt: "2024-12-01T10:30:00Z",
          isDummy: true
        },
        {
          id: 2,
          title: "Winter Collection Launch",
          description: "New winter frames now available",
          image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200&h=400&fit=crop",
          buttonText: "Explore",
          buttonLink: "/products/winter-collection",
          pages: ["home"],
          position: "middle",
          priority: 5,
          isActive: true,
          startDate: "2024-11-01T00:00:00.000Z",
          endDate: "2025-02-28T23:59:59.000Z",
          createdAt: "2024-10-25T14:20:00Z",
          isDummy: true
        },
        {
          id: 3,
          title: "Limited Time Offer",
          description: "Buy one get one free on selected items",
          image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1200&h=400&fit=crop",
          buttonText: "Grab Deal",
          buttonLink: "/products/bogo",
          pages: ["home", "products", "cart"],
          position: "bottom",
          priority: 8,
          isActive: false,
          startDate: "2024-10-01T00:00:00.000Z",
          endDate: "2024-10-31T23:59:59.000Z",
          createdAt: "2024-09-28T09:15:00Z",
          isDummy: true
        }
      ];

      // Combine banners
      const allCombinedBanners = [...dummyBanners, ...allBanners];
      
      // Find the banner to view
      const bannerToView = allCombinedBanners.find(banner => banner.id === parseInt(id));

      if (bannerToView) {
        setBanner(bannerToView);
      }
    } catch (error) {
      console.error("Error loading banner:", error);
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

  const getPositionColor = (position) => {
    const colors = {
      'top': 'bg-blue-100 text-blue-800',
      'middle': 'bg-green-100 text-green-800',
      'bottom': 'bg-amber-100 text-amber-800'
    };
    return colors[position] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <main className={`flex-1 overflow-y-auto bg-gray-50 p-6 transition-all duration-300 ${sidebarOpen ? "lg:pl-6" : "lg:pl-6"}`}>
            <div className="mx-auto max-w-4xl flex items-center justify-center h-64">
              <div className="text-gray-500">Loading banner data...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!banner) {
    return (
      <div className="flex h-screen">
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <main className={`flex-1 overflow-y-auto bg-gray-50 p-6 transition-all duration-300 ${sidebarOpen ? "lg:pl-6" : "lg:pl-6"}`}>
            <div className="mx-auto max-w-4xl">
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Banner Not Found</h2>
                <p className="text-gray-600 mb-6">The banner you're looking for doesn't exist.</p>
                <Link
                  to="/banner"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Back to Banners
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const expired = isExpired(banner.endDate);
  const activeNow = isActiveNow(banner);
  const daysRemaining = getDaysRemaining(banner.endDate);

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
                    to="/banner"
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
                  >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to Banners
                  </Link>
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{banner.title}</h1>
                      <p className="text-gray-600">Banner Details</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {!banner.isDummy && (
                        <Link
                          to={`/banner/update/${banner.id}`}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Edit Banner
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Banner Preview */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
              <div className="relative h-64 bg-gray-100">
                {banner.image ? (
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/1200x400/cccccc/969696?text=Banner+Image";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PhotoIcon className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black bg-opacity-50 text-white p-4 rounded-lg">
                    <h3 className="text-xl font-bold mb-2">{banner.title}</h3>
                    <p className="mb-4">{banner.description}</p>
                    <button className="px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-100">
                      {banner.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Basic Information */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Title</div>
                      <div className="text-gray-900 font-medium">{banner.title}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Description</div>
                      <div className="text-gray-900">{banner.description}</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Button Text</div>
                        <div className="text-gray-900 font-medium">{banner.buttonText}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Button Link</div>
                        <div className="flex items-center">
                          <LinkIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <a
                            href={banner.buttonLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 truncate"
                          >
                            {banner.buttonLink}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Display Settings */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Display Settings</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm text-gray-500 mb-2">Position</div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPositionColor(banner.position)}`}>
                          {banner.position.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-2">Priority</div>
                        <div className="text-gray-900 font-medium">{banner.priority}</div>
                        <div className="text-xs text-gray-500 mt-1">Lower numbers have higher priority</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Display Pages</div>
                      <div className="flex flex-wrap gap-2">
                        {banner.pages.map((page, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                          >
                            {page.charAt(0).toUpperCase() + page.slice(1)} Page
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Status & Actions */}
              <div className="space-y-8">
                {/* Status Card */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Status & Schedule</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {activeNow ? (
                          <>
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                            <span className="font-medium text-green-600">Currently Active</span>
                          </>
                        ) : expired ? (
                          <>
                            <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                            <span className="font-medium text-red-600">Expired</span>
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="h-5 w-5 text-gray-500 mr-2" />
                            <span className="font-medium text-gray-600">Inactive</span>
                          </>
                        )}
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        activeNow ? 'bg-green-100 text-green-800' :
                        expired ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Schedule
                      </div>
                      <div className="text-sm">
                        <div className="mb-1">
                          <span className="text-gray-500">Start: </span>
                          <span className="font-medium">{formatDate(banner.startDate)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">End: </span>
                          <span className="font-medium">{formatDate(banner.endDate)}</span>
                        </div>
                      </div>
                    </div>

                    {!expired && activeNow && (
                      <div className="pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600 mb-1">Time Remaining</div>
                        <div className="text-lg font-bold text-green-600">
                          {daysRemaining} days
                        </div>
                      </div>
                    )}

                    {banner.createdAt && (
                      <div className="pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600 mb-1">Created</div>
                        <div className="text-sm">{formatDate(banner.createdAt)}</div>
                      </div>
                    )}
                  </div>
                </div>

              
               
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ViewBanner;