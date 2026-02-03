import React, { useEffect, useState } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  RectangleStackIcon,
  BeakerIcon,
  ScaleIcon,
  CurrencyDollarIcon,
  ArrowsPointingOutIcon,
  PhotoIcon,
  TagIcon
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { getFrames, deleteFrame as deleteFrameAPI } from "../../Api/frameapi";
import toast from 'react-hot-toast'

const Frame = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [frames, setFrames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Load frames from API
  const loadFrames = async () => {
    try {
      const response = await getFrames();
      const apiFrames = response.data || response;
      setFrames(Array.isArray(apiFrames) ? apiFrames : []);
    } catch (error) {
      console.error("Error loading frames:", error);
      setFrames([]);
    }
  };

  useEffect(() => {
    loadFrames();
  }, []);


  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

const deleteFrame = async (id) => {
 
    const frameToDelete = frames.find((f) => f.id === id || f._id === id);

    try {
      // Call the delete endpoint
      const frameId = frameToDelete._id || id;
      await deleteFrameAPI(frameId);
      const updatedFrames = frames.filter((frame) => frame._id !== frameId && frame.id !== id);
      setFrames(updatedFrames);
      toast.success('Frame deleted successfully!');
    } catch (error) {
      console.error('Error deleting frame:', error);
      toast.error('Error deleting frame. Please try again.');
    }

};

  // Filter frames based on search and filter
  const filteredFrames = frames.filter(frame => {
    const matchesSearch = frame.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         frame.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         frame.color.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'lightweight' && frame.weight <= 25) ||
                         (filter === 'discounted' && frame.frameDiscount >= 10) ||
                         (filter === 'premium' && frame.price >= 1000);
    
    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const calculateStats = () => {
    const totalFrames = frames.length;
    const avgWeight = frames.length > 0 
      ? (frames.reduce((sum, f) => sum + (f.weight || 0), 0) / frames.length).toFixed(1)
      : "0.0";
    const totalDiscount = frames.reduce((sum, f) => sum + (f.frameDiscount || 0), 0);
    const avgDiscount = frames.length > 0 ? (totalDiscount / frames.length).toFixed(1) : "0";

    return { totalFrames, avgWeight, avgDiscount };
  };

  const stats = calculateStats();

  const getShapeColor = (shape) => {
    const colors = {
      'wayfarer': 'bg-blue-100 text-blue-800',
      'aviator': 'bg-yellow-100 text-yellow-800',
      'round': 'bg-green-100 text-green-800',
      'square': 'bg-red-100 text-red-800',
      'rectangle': 'bg-purple-100 text-purple-800',
      'oval': 'bg-pink-100 text-pink-800',
      'cat-eye': 'bg-indigo-100 text-indigo-800',
      'butterfly': 'bg-teal-100 text-teal-800',
      'sports': 'bg-orange-100 text-orange-800',
      'browline': 'bg-cyan-100 text-cyan-800',
      'clubmaster': 'bg-amber-100 text-amber-800',
      'geometric': 'bg-violet-100 text-violet-800'
    };
    return colors[shape] || 'bg-gray-100 text-gray-800';
  };

  const getMaterialColor = (material) => {
    const colors = {
      'acetate': 'bg-blue-50 text-blue-700',
      'metal': 'bg-gray-50 text-gray-700',
      'titanium': 'bg-slate-50 text-slate-700',
      'stainless steel': 'bg-zinc-50 text-zinc-700',
      'monel': 'bg-neutral-50 text-neutral-700',
      'plastic': 'bg-stone-50 text-stone-700',
      'tr-90': 'bg-emerald-50 text-emerald-700',
      'carbon fiber': 'bg-lime-50 text-lime-700',
      'wood': 'bg-amber-50 text-amber-700',
      'horn': 'bg-orange-50 text-orange-700'
    };
    return colors[material] || 'bg-gray-50 text-gray-700';
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
                  <h1 className="text-2xl font-bold text-gray-900">Frames</h1>
                  <p className="text-gray-600">
                    Manage eyewear frames inventory
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Link
                    to="/frame/add"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Frame
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <RectangleStackIcon className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Total Frames</div>
                    <div className="text-2xl font-bold mt-1">{stats.totalFrames}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <ScaleIcon className="h-8 w-8 text-purple-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Avg. Weight</div>
                    <div className="text-2xl font-bold mt-1">{stats.avgWeight}g</div>
                  </div>
                </div>
                <div className="text-sm text-blue-600 mt-2">
                  Based on all frames
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <BeakerIcon className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Materials</div>
                    <div className="text-2xl font-bold mt-1">
                      {[...new Set(frames.map(f => f.material))].length}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Unique materials
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-8 w-8 text-yellow-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Avg. Discount</div>
                    <div className="text-2xl font-bold mt-1">{stats.avgDiscount}%</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Average discount rate
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
                    placeholder="Search frames by name, material, or color..."
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
                <option value="all">All Frames</option>
                <option value="lightweight">Lightweight (≤25g)</option>
                <option value="discounted">Discounted (10%+)</option>
                <option value="premium">Premium (₹1000+)</option>
              </select>
              {/* <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <FunnelIcon className="h-5 w-5 mr-2" />
                More Filters
                <ChevronDownIcon className="h-4 w-4 ml-2" />
              </button> */}
            </div>

            {/* Frames Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Frame Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Images
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dimensions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Weight
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pricing
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied Discounts
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFrames.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            No frames found. Click "Add Frame" to get started.
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredFrames.map((frame) => (
                        <tr
                          key={frame._id || frame.id}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${getShapeColor(frame.shape)}`}>
                                <RectangleStackIcon className="h-6 w-6" />
                              </div>
                              <div className="ml-4">
                                <div className="flex items-center">
                                  <div className="text-sm font-medium text-gray-900">
                                    {frame.name}
                                  </div>
                                </div>
                                <div className="mt-1 flex flex-wrap gap-2">
                                  {frame.shape && (
                                    <span className={`text-xs px-2 py-1 rounded-full ${getShapeColor(frame.shape)}`}>
                                      {frame.shape.charAt(0).toUpperCase() + frame.shape.slice(1)}
                                    </span>
                                  )}
                                  {frame.material && (
                                    <span className={`text-xs px-2 py-1 rounded-full ${getMaterialColor(frame.material)}`}>
                                      {frame.material.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                    </span>
                                  )}
                                  {frame.color && (
                                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                                      {frame.color}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {frame.images && frame.images.length > 0 ? (
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center -space-x-2">
                                  {frame.images.slice(0, 3).map((img, idx) => (
                                    <img
                                      key={idx}
                                      src={img.url}
                                      alt={img.alt || `Frame image ${idx + 1}`}
                                      className="h-10 w-10 rounded-lg border border-gray-200 object-cover"
                                      title={img.alt}
                                    />
                                  ))}
                                </div>
                                {frame.images.length > 3 && (
                                  <span className="text-xs text-gray-500 font-medium">+{frame.images.length - 3}</span>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center text-gray-400">
                                <PhotoIcon className="h-5 w-5 mr-2" />
                                <span className="text-sm text-gray-500">No images</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-900">
                                <ArrowsPointingOutIcon className="h-4 w-4 mr-2 text-gray-400" />
                                {frame.dimensions}
                              </div>
                              <div className="text-sm text-gray-500 space-y-1">
                                <div className="flex items-center">
                                  <span className="w-20">Lens:</span>
                                  <span className="font-medium">{frame.size}</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="w-20">Bridge:</span>
                                  <span className="font-medium">{frame.bridgeSize}</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="w-20">Temple:</span>
                                  <span className="font-medium">{frame.templeLength}</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="w-20">Width:</span>
                                  <span className="font-medium">{frame.width}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <ScaleIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {frame.weight}g
                                </div>
                                <div className="text-sm text-gray-500">
                                  {frame.weight <= 25 ? 'Lightweight' : frame.weight <= 30 ? 'Standard' : 'Heavy'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-900">
                                <CurrencyDollarIcon className="h-4 w-4 mr-2 text-gray-400" />
                                ₹{frame.price}
                                {frame.frameDiscount > 0 && (
                                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                                    -{frame.frameDiscount}%
                                  </span>
                                )}
                              </div>
                              {frame.frameDiscount > 0 && (
                                <div className="text-sm text-gray-500">
                                  <span className="line-through">₹{frame.price}</span>
                                  <span className="ml-2 text-green-600 font-medium">
                                    ₹{(frame.price * (1 - frame.frameDiscount / 100)).toFixed(2)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {frame.appliedDiscounts && frame.appliedDiscounts.length > 0 ? (
                              <div className="space-y-1">
                                {frame.appliedDiscounts.slice(0, 2).map((discount, idx) => (
                                  <div key={idx} className="inline-flex items-center bg-green-50 px-2 py-1 rounded text-xs text-green-700 mr-1 mb-1">
                                    <TagIcon className="h-3 w-3 mr-1" />
                                    <span className="font-medium">
                                      {typeof discount === 'string' ? `Discount ${idx + 1}` : discount.name || `Discount ${idx + 1}`}
                                    </span>
                                  </div>
                                ))}
                                {frame.appliedDiscounts.length > 2 && (
                                  <div className="text-xs text-gray-500">+{frame.appliedDiscounts.length - 2} more</div>
                                )}
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">None</span>
                            )}
                          </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
  <div className="flex items-center space-x-2">
    <Link
      to={`/frame/view/${frame._id || frame.id}`}
      className="p-1 text-blue-600 hover:text-blue-800"
      title="View"
    >
      <EyeIcon className="h-5 w-5" />
    </Link>
    <Link
      to={`/frame/update/${frame._id || frame.id}`}
      className="p-1 text-green-600 hover:text-green-800"
      title="Edit Frame"
    >
      <PencilIcon className="h-5 w-5" />
    </Link>
    <button
      onClick={() => deleteFrame(frame._id || frame.id)}
      className="p-1 text-red-600 hover:text-red-800"
      title="Delete Frame"
    >
      <TrashIcon className="h-5 w-5" />
    </button>
  </div>
</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{filteredFrames.length}</span> of{" "}
                <span className="font-medium">{frames.length}</span> frames
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
                {frames.length > 10 && (
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
                  disabled={frames.length <= 10}
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

export default Frame;