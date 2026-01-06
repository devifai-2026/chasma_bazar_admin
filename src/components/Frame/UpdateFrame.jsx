import React, { useState, useEffect } from 'react';
import {
  ArrowLeftIcon,
  RectangleStackIcon,
  ArrowsPointingOutIcon,
  ScaleIcon,
  CurrencyDollarIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';

const UpdateFrame = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    size: '',
  });
  const [originalData, setOriginalData] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isDummyFrame, setIsDummyFrame] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadFrame();
  }, [id]);

  const loadFrame = () => {
    try {
      const allFrames = JSON.parse(localStorage.getItem('frames') || '[]');
      
      // Also check dummy data
      const dummyFrames = [
        {
          id: 1,
          name: "Wayfarer Classic",
          shape: "wayfarer",
          material: "acetate",
          color: "Black",
          size: "52mm",
          width: "145mm",
          dimensions: "52-18-145",
          bridgeSize: "18mm",
          templeLength: "145mm",
          weight: 28,
          price: 500,
          frameDiscount: 5,
          isDummy: true
        },
        {
          id: 2,
          name: "Aviator Gold",
          shape: "aviator",
          material: "metal",
          color: "Gold",
          size: "58mm",
          width: "150mm",
          dimensions: "58-18-150",
          bridgeSize: "18mm",
          templeLength: "150mm",
          weight: 32,
          price: 750,
          frameDiscount: 10,
          isDummy: true
        },
        {
          id: 3,
          name: "Round Tortoise",
          shape: "round",
          material: "acetate",
          color: "Tortoise",
          size: "50mm",
          width: "140mm",
          dimensions: "50-19-140",
          bridgeSize: "19mm",
          templeLength: "140mm",
          weight: 26,
          price: 450,
          frameDiscount: 8,
          isDummy: true
        },
        {
          id: 4,
          name: "Sports Titanium",
          shape: "sports",
          material: "titanium",
          color: "Gunmetal",
          size: "56mm",
          width: "155mm",
          dimensions: "56-20-155",
          bridgeSize: "20mm",
          templeLength: "155mm",
          weight: 22,
          price: 1200,
          frameDiscount: 15,
          isDummy: true
        }
      ];

      const allData = [...dummyFrames, ...allFrames.filter(f => !f.isDummy)];
      const foundFrame = allData.find(f => f.id === parseInt(id));

      if (foundFrame) {
        // Track if it's a dummy frame
        setIsDummyFrame(foundFrame.isDummy || false);

        setOriginalData(foundFrame);
        setFormData({
          size: foundFrame.size,
        });
      } else {
        alert('Frame not found!');
        navigate('/frame');
      }
    } catch (error) {
      console.error('Error loading frame:', error);
      alert('Error loading frame data');
      navigate('/frame');
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.size || !formData.size.includes('mm')) {
      newErrors.size = 'Size must include "mm" (e.g., 51mm)';
    }
    
    const sizeValue = parseFloat(formData.size.replace('mm', ''));
    if (isNaN(sizeValue) || sizeValue < 40 || sizeValue > 70) {
      newErrors.size = 'Size must be between 40mm and 70mm';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Get current frames
      const existingFrames = JSON.parse(localStorage.getItem('frames') || '[]');
      
      // If editing a dummy frame, create a new user frame
      if (isDummyFrame) {
        // Create a new user frame based on the dummy
        const newFrame = {
          ...originalData,
          id: Date.now(), // New ID
          isDummy: false, // Convert to user frame
          size: formData.size,
          // Update dimensions with new size
          dimensions: `${formData.size.replace('mm', '')}-${originalData.bridgeSize}-${originalData.templeLength}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // Remove isDummy property before saving
        const { isDummy, ...frameToSave } = newFrame;

        // Add to user frames
        existingFrames.push(frameToSave);
        
        // Save to localStorage
        localStorage.setItem('frames', JSON.stringify(existingFrames));
        
        alert('Demo frame converted to user frame and updated successfully!');
        navigate('/frame');
      } else {
        // For existing user frames, find and update
        const updatedFrames = existingFrames.map(frame => {
          if (frame.id === parseInt(id)) {
            return {
              ...frame,
              size: formData.size,
              // Update dimensions with new size
              dimensions: `${formData.size.replace('mm', '')}-${frame.bridgeSize}-${frame.templeLength}`,
              updatedAt: new Date().toISOString()
            };
          }
          return frame;
        });

        // Save back to localStorage
        localStorage.setItem('frames', JSON.stringify(updatedFrames));
        
        alert('Frame updated successfully!');
        navigate(`/frame/view/${id}`);
      }
    } catch (error) {
      console.error('Error updating frame:', error);
      alert('Error updating frame. Please try again.');
    }
  };

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

  if (!originalData) {
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
                    to="/frame"
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
                  >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to Frames
                  </Link>
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Update Frame</h1>
                      <p className="text-gray-600">
                        Edit frame: {originalData.name}
                      </p>
                    </div>
                    {isDummyFrame && (
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        Demo Frame
                      </div>
                    )}
                  </div>
                  {isDummyFrame && (
                    <div className="mt-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                      <p>
                        <strong>Note:</strong> You are editing a demo frame. When you save changes, 
                        it will be converted to a user frame and saved to your local storage.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Current Information Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <InformationCircleIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Current Frame Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-500">Frame Name</div>
                    <div className="text-lg font-medium text-gray-900">
                      {originalData.name}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Shape</div>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getShapeColor(originalData.shape)}`}>
                      {originalData.shape.charAt(0).toUpperCase() + originalData.shape.slice(1)}
                    </span>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Material</div>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getMaterialColor(originalData.material)}`}>
                      {originalData.material.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Color</div>
                    <div className="text-lg font-medium text-gray-900">
                      {originalData.color}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Weight</div>
                    <div className="text-lg font-medium text-gray-900">
                      {originalData.weight}g
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Price</div>
                    <div className="text-lg font-medium text-gray-900">
                      ₹{originalData.price}
                      {originalData.frameDiscount > 0 && (
                        <span className="ml-2 text-sm text-green-600">
                          (-{originalData.frameDiscount}%)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Update Size Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <ArrowsPointingOutIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Update Frame Size
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lens Size *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ArrowsPointingOutIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.size ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="e.g., 51mm"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <div className="text-sm text-gray-500">
                          Current: {originalData.size}
                        </div>
                      </div>
                    </div>
                    {errors.size && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.size}
                      </p>
                    )}
                    <div className="mt-2 text-sm text-gray-500">
                      Enter lens size in millimeters (e.g., 51mm). Must be between 40mm and 70mm.
                    </div>
                  </div>

                  {/* Dimensions Preview */}
                  <div className="md:col-span-2">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <InformationCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
                        <div className="text-sm text-blue-700">
                          <p className="font-medium">Dimensions will be updated automatically</p>
                          <p className="mt-1">
                            New dimensions: {formData.size.replace('mm', '') || '??'}-{originalData.bridgeSize}-{originalData.templeLength}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Current Dimensions */}
                  <div className="md:col-span-2">
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Current Dimensions</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-xs text-gray-500">Lens Size</div>
                          <div className="text-sm font-medium">{originalData.size}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Bridge</div>
                          <div className="text-sm font-medium">{originalData.bridgeSize}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Temple</div>
                          <div className="text-sm font-medium">{originalData.templeLength}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Format</div>
                          <div className="text-sm font-medium">{originalData.dimensions}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Update Summary Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <RectangleStackIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Update Summary
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-700">Current Lens Size</div>
                    <div className="text-lg font-bold text-gray-900">
                      {originalData.size}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-700">New Lens Size</div>
                    <div className="text-lg font-bold text-blue-900">
                      {formData.size || 'Not set'}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-700">New Dimensions</div>
                    <div className="text-lg font-bold text-green-900">
                      {formData.size ? `${formData.size.replace('mm', '')}-${originalData.bridgeSize}-${originalData.templeLength}` : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0">
                  <div>
                    <p className="text-sm text-gray-500">
                      Last updated: {new Date(originalData.updatedAt || originalData.createdAt || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <Link
                      to="/frame"
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-center"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      {isDummyFrame ? 'Save as New Frame' : 'Update Frame'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UpdateFrame;