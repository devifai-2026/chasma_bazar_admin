import React, { useState, useEffect } from 'react';
import {
  ArrowLeftIcon,
  RectangleStackIcon,
  BeakerIcon,
  ScaleIcon,
  CurrencyDollarIcon,
  ArrowsPointingOutIcon,
  EyeIcon,
  PencilIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { Link, useParams } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { getFrameById } from '../../Api/frameapi';

const ViewFrame = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [frame, setFrame] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    loadFrame();
  }, [id]);

  const loadFrame = () => {
    try {
      // First try to fetch from API
      fetchFrameFromAPI();
    } catch (error) {
      console.error('Error loading frame:', error);
      setLoading(false);
    }
  };

  const fetchFrameFromAPI = async () => {
    try {
      const data = await getFrameById(id);
      setFrame(data.data || data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching frame from API:', error);
      
    }
  };

  

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

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

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="mx-auto max-w-4xl flex items-center justify-center h-64">
              <div className="text-gray-500">Loading frame data...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!frame) {
    return (
      <div className="flex h-screen">
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="mx-auto max-w-4xl">
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Frame Not Found</h2>
                <p className="text-gray-600 mb-6">The frame you're looking for doesn't exist.</p>
                <Link
                  to="/frame"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Back to Frames
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const discountedPrice = frame.frameDiscount > 0 
    ? frame.price * (1 - frame.frameDiscount / 100)
    : frame.price;

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
          <div className="mx-auto max-w-[95%]">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <Link
                    to="/frame"
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
                  >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to Frames
                  </Link>
                  <div className="flex items-center justify-between gap-6">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{frame.name}</h1>
                      <p className="text-gray-600">Frame Details</p>
                    </div>
                   
                  </div>
                </div>
              </div>
            </div>

            {/* Frame Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Basic Info */}
              <div className="lg:col-span-2 space-y-8">
                {/* Basic Information */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <RectangleStackIcon className="h-5 w-5 mr-2 text-blue-500" />
                    Basic Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-gray-500">Frame Name</div>
                      <div className="text-lg font-medium text-gray-900">
                        {frame.name}
                        {frame.isDummy && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            Demo
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500">Shape</div>
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${getShapeColor(frame.shape)}`}>
                        {frame.shape.charAt(0).toUpperCase() + frame.shape.slice(1)}
                      </span>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500">Material</div>
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${getMaterialColor(frame.material)}`}>
                        {frame.material.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500">Color</div>
                      <div className="text-lg font-medium text-gray-900">
                        {frame.color}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dimensions */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <ArrowsPointingOutIcon className="h-5 w-5 mr-2 text-blue-500" />
                    Dimensions
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-700">Lens Size</div>
                      <div className="text-2xl font-bold text-blue-900 mt-2">
                        {frame.size}
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-green-700">Bridge Size</div>
                      <div className="text-2xl font-bold text-green-900 mt-2">
                        {frame.bridgeSize}
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-purple-700">Temple Length</div>
                      <div className="text-2xl font-bold text-purple-900 mt-2">
                        {frame.templeLength}
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-amber-50 rounded-lg">
                      <div className="text-sm text-amber-700">Width</div>
                      <div className="text-2xl font-bold text-amber-900 mt-2">
                        {frame.width}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Dimension Format</div>
                    <div className="text-lg font-mono font-bold text-gray-900">
                      {frame.dimensions}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Lens Size - Bridge Size - Temple Length
                    </div>
                  </div>
                </div>

                {/* Material & Weight */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Specifications</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center mb-4">
                        <BeakerIcon className="h-5 w-5 text-blue-500 mr-2" />
                        <h3 className="text-sm font-medium text-gray-900">Material Details</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-500">Primary Material</div>
                        <div className="text-lg font-medium text-gray-900">
                          {frame.material.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </div>
                        <div className="text-sm text-gray-500 mt-2">
                          {frame.material === 'acetate' && 'High-quality cellulose acetate, known for durability and flexibility.'}
                          {frame.material === 'metal' && 'Sturdy metal alloy, lightweight and corrosion-resistant.'}
                          {frame.material === 'titanium' && 'Premium titanium, extremely lightweight and hypoallergenic.'}
                          {frame.material === 'plastic' && 'Lightweight plastic, affordable and versatile.'}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-4">
                        <ScaleIcon className="h-5 w-5 text-green-500 mr-2" />
                        <h3 className="text-sm font-medium text-gray-900">Weight</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="text-lg font-bold text-gray-900">
                          {frame.weight} grams
                        </div>
                        <div className="text-sm text-gray-500">
                          {frame.weight <= 25 ? 'Ultra lightweight' : 
                           frame.weight <= 30 ? 'Lightweight' : 
                           frame.weight <= 35 ? 'Medium weight' : 'Heavy'}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${Math.min(frame.weight / 40 * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Price & Actions */}
              <div className="space-y-8">
                {/* Pricing Card */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <CurrencyDollarIcon className="h-5 w-5 mr-2 text-blue-500" />
                    Pricing
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-700">Base Price</div>
                      <div className="text-lg font-bold text-gray-900">
                        ₹{frame.price}
                      </div>
                    </div>
                    
                    {frame.frameDiscount > 0 && (
                      <>
                        <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-sm text-blue-700">Discount</div>
                          <div className="text-lg font-bold text-blue-900">
                            -{frame.frameDiscount}%
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                          <div className="text-sm text-green-700">Discounted Price</div>
                          <div className="text-lg font-bold text-green-900">
                            ₹{discountedPrice.toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-500 text-center">
                          You save: ₹{(frame.price - discountedPrice).toFixed(2)}
                        </div>
                      </>
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

export default ViewFrame;