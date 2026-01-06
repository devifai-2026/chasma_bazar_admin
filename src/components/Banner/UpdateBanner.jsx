import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

const UpdateBanner = () => {
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDummyBanner, setIsDummyBanner] = useState(false);

  const navigate = useNavigate();

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
      
      // Find the banner to edit
      const bannerToEdit = allCombinedBanners.find(banner => banner.id === parseInt(id));

      if (bannerToEdit) {
        // Check if it's a dummy banner
        setIsDummyBanner(bannerToEdit.isDummy || false);

        // Format dates for input fields
        const startDate = bannerToEdit.startDate ? bannerToEdit.startDate.split('T')[0] : '';
        const endDate = bannerToEdit.endDate ? bannerToEdit.endDate.split('T')[0] : '';

        setFormData({
          ...bannerToEdit,
          startDate,
          endDate
        });
      } else {
        alert("Banner not found!");
        navigate("/banner");
      }
    } catch (error) {
      console.error("Error loading banner:", error);
      alert("Error loading banner data");
      navigate("/banner");
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
  };

  const handlePagesChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          pages: [...prev.pages, value]
        };
      } else {
        return {
          ...prev,
          pages: prev.pages.filter(page => page !== value)
        };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get all user banners from localStorage
    const allBanners = JSON.parse(localStorage.getItem("banners") || "[]");
    
    // If editing a dummy banner, we need to create a new user banner
    if (isDummyBanner) {
      // Create new banner with dummy data as base
      const newBanner = {
        ...formData,
        id: Date.now(), // New ID
        isDummy: false, // Not a dummy anymore
        // Convert dates back to full ISO string
        startDate: new Date(formData.startDate + 'T00:00:00.000Z').toISOString(),
        endDate: new Date(formData.endDate + 'T23:59:59.000Z').toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Remove isDummy property before saving
      const { isDummy, ...bannerToSave } = newBanner;

      // Add to user banners
      allBanners.push(bannerToSave);
      
      // Save to localStorage
      localStorage.setItem("banners", JSON.stringify(allBanners));
      
      // Show success message
      alert("Banner updated successfully! Demo banner has been converted to a user banner.");
    } else {
      // For existing user banners, find and update
      const bannerIndex = allBanners.findIndex(banner => banner.id === formData.id);
      
      if (bannerIndex === -1) {
        alert("Banner not found!");
        return;
      }

      // Update the banner
      const updatedBanner = {
        ...formData,
        // Convert dates back to full ISO string
        startDate: new Date(formData.startDate + 'T00:00:00.000Z').toISOString(),
        endDate: new Date(formData.endDate + 'T23:59:59.000Z').toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Remove isDummy property as it's not needed in saved data
      const { isDummy, ...bannerToSave } = updatedBanner;

      // Update the array
      allBanners[bannerIndex] = bannerToSave;
      
      // Save to localStorage
      localStorage.setItem("banners", JSON.stringify(allBanners));
      
      // Show success message
      alert("Banner updated successfully!");
    }
    
    // Navigate back to banners list
    navigate("/banner");
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

  if (!formData) {
    return null;
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
                    to="/banner"
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
                  >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to Banners
                  </Link>
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Update Banner</h1>
                      <p className="text-gray-600">
                        Edit banner: {formData.title}
                      </p>
                    </div>
                    {isDummyBanner && (
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        Demo Banner
                      </div>
                    )}
                  </div>
                  {isDummyBanner && (
                    <div className="mt-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                      <p>
                        <strong>Note:</strong> You are editing a demo banner. When you save changes, 
                        it will be converted to a user banner and saved to your local storage.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Banner Details Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Banner Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banner Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Summer Sale 2025"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Get 50% off on all sunglasses"
                      required
                    />
                  </div>

                  {/* Image URL */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banner Image URL *
                    </label>
                    <div className="flex space-x-4">
                      <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/banner-image.jpg"
                        required
                      />
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                        onClick={() => {
                          const sampleImages = [
                            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=400&fit=crop",
                            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200&h=400&fit=crop",
                            "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1200&h=400&fit=crop"
                          ];
                          setFormData(prev => ({ ...prev, image: sampleImages[Math.floor(Math.random() * sampleImages.length)] }));
                        }}
                      >
                        <PhotoIcon className="h-5 w-5 mr-2" />
                        Sample
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Enter a direct URL to your banner image (recommended size: 1200x400px)
                    </p>
                    {formData.image && (
                      <div className="mt-4">
                        <div className="text-sm text-gray-700 mb-2">Preview:</div>
                        <div className="h-40 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/1200x400/cccccc/969696?text=Invalid+Image+URL";
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Button Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Text *
                    </label>
                    <input
                      type="text"
                      name="buttonText"
                      value={formData.buttonText}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Shop Now"
                      required
                    />
                  </div>

                  {/* Button Link */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Link *
                    </label>
                    <input
                      type="text"
                      name="buttonLink"
                      value={formData.buttonLink}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., /products/sale"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Display Settings Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Display Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pages */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Display on Pages *
                    </label>
                    <div className="space-y-2">
                      {['home', 'products', 'cart', 'checkout', 'about'].map((page) => (
                        <label key={page} className="flex items-center">
                          <input
                            type="checkbox"
                            value={page}
                            checked={formData.pages.includes(page)}
                            onChange={handlePagesChange}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-sm text-gray-700 capitalize">
                            {page} Page
                          </span>
                        </label>
                      ))}
                    </div>
                    <p className="mt-3 text-sm text-gray-500">
                      Select pages where this banner should appear
                    </p>
                  </div>

                  {/* Position and Priority */}
                  <div className="space-y-6">
                    {/* Position */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position *
                      </label>
                      <select
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="top">Top of Page</option>
                        <option value="middle">Middle of Page</option>
                        <option value="bottom">Bottom of Page</option>
                      </select>
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
                        min="1"
                        max="100"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        Lower numbers have higher priority (1 is highest)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Schedule & Status</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Active Status */}
                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        Set as active (visible on website)
                      </span>
                    </label>
                    <p className="mt-2 text-sm text-gray-500">
                      Inactive banners won't be displayed even within schedule
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <Link
                  to="/banner"
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => navigate("/banner")}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {isDummyBanner ? 'Save as New Banner' : 'Update Banner'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UpdateBanner;