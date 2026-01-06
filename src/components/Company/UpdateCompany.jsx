import React, { useEffect, useState } from 'react';
import {
  ArrowLeftIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  PlusIcon,
  XMarkIcon,
  StarIcon
} from "@heroicons/react/24/outline";
import { Link, useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

const UpdateCompany = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    establishedYear: "",
    rating: "",
    totalRatings: "",
    employees: "",
    annualRevenue: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      pinCode: ""
    },
    logo: {
      url: "",
      public_id: ""
    },
    weblinks: [{ url: "", label: "" }],
    products: [""],
    certifications: [""],
    shippingCountries: [""]
  });

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    fetchCompany();
  }, [id]);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      
      // For demo purposes, check localStorage first
      const savedCompanies = JSON.parse(localStorage.getItem("companies") || "[]");
      const dummyCompanies = [
        {
          id: 1,
          name: "Premium Eyewear Co.",
          description: "Premium eyewear brand specializing in designer frames",
          pinCode: "110001",
          email: "contact@premiumeyewear.com",
          phone: "9876543210",
          address: {
            street: "123 Business Park",
            city: "Mumbai",
            state: "Maharashtra",
            country: "India",
            pinCode: "110001"
          },
          logo: {
            url: "https://images.unsplash.com/photo-1567446537710-0c5ff5a6ac32?w-400&h=400&fit=crop",
            public_id: "logo_123"
          },
          establishedYear: 2010,
          rating: 4.5,
          totalRatings: 120,
          weblinks: [
            { url: "https://premiumeyewear.com", label: "Website" },
            { url: "https://facebook.com/premiumeyewear", label: "Facebook" }
          ],
          isDummy: true
        }
      ];

      const allCompanies = [...dummyCompanies, ...savedCompanies];
      const foundCompany = allCompanies.find(c => c.id === parseInt(id));

      if (foundCompany) {
        setFormData({
          name: foundCompany.name || "",
          description: foundCompany.description || "",
          email: foundCompany.email || "",
          phone: foundCompany.phone || "",
          establishedYear: foundCompany.establishedYear || "",
          rating: foundCompany.rating || "",
          totalRatings: foundCompany.totalRatings || "",
          employees: foundCompany.employees || "",
          annualRevenue: foundCompany.annualRevenue || "",
          address: {
            street: foundCompany.address?.street || "",
            city: foundCompany.address?.city || "",
            state: foundCompany.address?.state || "",
            country: foundCompany.address?.country || "",
            pinCode: foundCompany.address?.pinCode || foundCompany.pinCode || ""
          },
          logo: {
            url: foundCompany.logo?.url || "",
            public_id: foundCompany.logo?.public_id || ""
          },
          weblinks: foundCompany.weblinks || [{ url: "", label: "" }],
          products: foundCompany.products || [""],
          certifications: foundCompany.certifications || [""],
          shippingCountries: foundCompany.shippingCountries || [""]
        });
      } else {
        setError("Company not found");
      }
    } catch (err) {
      console.error("Error fetching company:", err);
      setError("Failed to load company details");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handleWeblinkChange = (index, field, value) => {
    const updatedWeblinks = [...formData.weblinks];
    updatedWeblinks[index][field] = value;
    setFormData(prev => ({
      ...prev,
      weblinks: updatedWeblinks
    }));
  };

  const addWeblink = () => {
    setFormData(prev => ({
      ...prev,
      weblinks: [...prev.weblinks, { url: "", label: "" }]
    }));
  };

  const removeWeblink = (index) => {
    const updatedWeblinks = formData.weblinks.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      weblinks: updatedWeblinks
    }));
  };

  const handleArrayFieldChange = (field, index, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [field]: updatedArray
    }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }));
  };

  const removeArrayField = (field, index) => {
    const updatedArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      [field]: updatedArray
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, update in localStorage
      const savedCompanies = JSON.parse(localStorage.getItem("companies") || "[]");
      const companyIndex = savedCompanies.findIndex(c => c.id === parseInt(id));
      
      if (companyIndex !== -1) {
        const updatedCompany = {
          ...savedCompanies[companyIndex],
          ...formData,
          pinCode: formData.address.pinCode, // Keep backward compatibility
          id: parseInt(id)
        };
        
        savedCompanies[companyIndex] = updatedCompany;
        localStorage.setItem("companies", JSON.stringify(savedCompanies));
        
        alert("Company updated successfully!");
        navigate(`/company/view/${id}`);
      } else {
        // For dummy companies, add as new company
        const newCompany = {
          ...formData,
          id: Date.now(), // New ID for the company
          pinCode: formData.address.pinCode,
          isDummy: false
        };
        
        savedCompanies.push(newCompany);
        localStorage.setItem("companies", JSON.stringify(savedCompanies));
        
        alert("Company created successfully!");
        navigate("/company");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      setError("Failed to update company");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading company data...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
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
          <div className="mx-auto max-w-[95%]">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center">
                  <Link to="/company" className="mr-4 text-gray-600 hover:text-gray-900">
                    <ArrowLeftIcon className="h-6 w-6" />
                  </Link>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Update Company</h1>
                    <p className="text-gray-600">Edit company information</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Link
                    to={`/company/view/${id}`}
                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    View Company
                  </Link>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                <div className="p-6">
                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700">{error}</p>
                    </div>
                  )}

                  {/* Basic Information */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                      <BuildingOfficeIcon className="h-6 w-6 mr-2 text-blue-600" />
                      Basic Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Established Year *
                        </label>
                        <input
                          type="number"
                          name="establishedYear"
                          value={formData.establishedYear}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                          min="1800"
                          max={new Date().getFullYear()}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description *
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                      <EnvelopeIcon className="h-6 w-6 mr-2 text-green-600" />
                      Contact Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                      <MapPinIcon className="h-6 w-6 mr-2 text-red-600" />
                      Address
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          name="street"
                          value={formData.address.street}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.address.city}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.address.state}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country *
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.address.country}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          name="pinCode"
                          value={formData.address.pinCode}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Web Links */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                      <GlobeAltIcon className="h-6 w-6 mr-2 text-purple-600" />
                      Website & Social Links
                    </h2>
                    {formData.weblinks.map((link, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Label
                          </label>
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) => handleWeblinkChange(index, 'label', e.target.value)}
                            placeholder="e.g., Website, Facebook"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            URL
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="url"
                              value={link.url}
                              onChange={(e) => handleWeblinkChange(index, 'url', e.target.value)}
                              placeholder="https://example.com"
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {formData.weblinks.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeWeblink(index)}
                                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                              >
                                <XMarkIcon className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addWeblink}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <PlusIcon className="h-5 w-5 mr-1" />
                      Add Another Link
                    </button>
                  </div>

                  {/* Products */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">Products</h2>
                    {formData.products.map((product, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={product}
                          onChange={(e) => handleArrayFieldChange('products', index, e.target.value)}
                          placeholder="Enter product name"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {formData.products.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayField('products', index)}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayField('products')}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <PlusIcon className="h-5 w-5 mr-1" />
                      Add Product
                    </button>
                  </div>

                  {/* Rating Information */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                      <StarIcon className="h-6 w-6 mr-2 text-yellow-600" />
                      Rating Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rating (1-5)
                        </label>
                        <input
                          type="number"
                          name="rating"
                          value={formData.rating}
                          onChange={handleInputChange}
                          min="0"
                          max="5"
                          step="0.1"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total Ratings
                        </label>
                        <input
                          type="number"
                          name="totalRatings"
                          value={formData.totalRatings}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4">
                <Link
                  to="/company"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></span>
                      Saving...
                    </>
                  ) : (
                    "Update Company"
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UpdateCompany;