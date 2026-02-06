import React, { useState } from 'react';
import { ArrowLeftIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { createBanner } from '../../Api/bannerApi';
import uploadToCloudinary from '../../utils/cloudinary';
import toast from 'react-hot-toast'

const AddBanner = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    buttonText: "Shop Now",
    buttonLink: "/products",
    pages: ["home"],
    position: "top",
    priority: 5,
    isActive: true,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const navigate = useNavigate();

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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    setError("");

    try {
      const res = await uploadToCloudinary(file);

      setFormData(prev => ({
        ...prev,
        image: res.url   // ✅ STRING URL ONLY
      }));
    } catch (err) {
      setError("Failed to upload image");
      toast.error('Error uploading image. Please try again.');
    } finally {
      setImageUploading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Prepare banner data for API
      const bannerData = {
        title: formData.title,
        description: formData.description,
        image: formData.image,
        buttonText: formData.buttonText,
        buttonLink: formData.buttonLink,
        pages: formData.pages && formData.pages.length > 0 ? formData.pages : ['all'],
        position: formData.position,
        isActive: formData.isActive,
        priority: formData.priority,
        startDate: formData.startDate ? new Date(formData.startDate + 'T00:00:00.000Z') : null,
        endDate: formData.endDate ? new Date(formData.endDate + 'T23:59:59.000Z') : null,
      };

      // Call API to create banner
      await createBanner(bannerData);

      // Show success message
       toast.success('Banner created successfully!');


      // Navigate back to banners list
      navigate("/banner");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to create banner";
      setError(errorMessage);
      console.error("Error creating banner:", err);
      toast.error('Error creating banner. Please try again.');
    } finally {
      setLoading(false);
    }
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
                  <h1 className="text-2xl font-bold text-gray-900">Add New Banner</h1>
                  <p className="text-gray-600">
                    Create a new promotional banner for your website
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Banner Details Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Banner Details</h2>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

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
                      Banner Image *
                    </label>
                    <div className="space-y-4">
                      {/* File Upload */}
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Upload from Device:</label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={imageUploading}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                          {imageUploading && (
                            <span className="text-sm text-blue-600">Uploading...</span>
                          )}
                        </div>
                      </div>




                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Recommended size: 1200x400px | Max file size: 5MB
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
                              e.target.src = "https://via.placeholder.com/1200x400/cccccc/969696?text=Invalid+Image";
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
                      {['all', 'home', 'products', 'product-detail', 'cart', 'wishlist', 'checkout', 'orders', 'profile'].map((page) => (
                        <label key={page} className="flex items-center">
                          <input
                            type="checkbox"
                            value={page}
                            checked={formData.pages.includes(page)}
                            onChange={handlePagesChange}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-sm text-gray-700 capitalize">
                            {page === 'product-detail' ? 'Product Detail' : page === 'all' ? 'All Pages' : (page.charAt(0).toUpperCase() + page.slice(1)) + ' Page'}
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
                        <option value="sidebar">Sidebar</option>
                        <option value="popup">Popup</option>
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
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        Higher numbers have higher priority in display order
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
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create Banner"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddBanner;