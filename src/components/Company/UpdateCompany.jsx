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
import { getCompanyById, updateCompany as updateCompanyAPI } from "../../Api/companyApi";
import toast from 'react-hot-toast'

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
      setError(null);
      
      const response = await getCompanyById(id);
      
      if (response.success && response.data) {
        const company = response.data;
        setFormData({
          name: company.name || "",
          description: company.description || "",
          email: company.email || "",
          phone: company.phone || "",
          establishedYear: company.establishedYear || "",
          rating: company.rating || "",
          totalRatings: company.totalRatings || "",
          employees: company.employees || "",
          annualRevenue: company.annualRevenue || "",
          address: {
            street: company.address?.street || "",
            city: company.address?.city || "",
            state: company.address?.state || "",
            country: company.address?.country || "",
            pinCode: company.address?.pinCode || ""
          },
          logo: {
            url: company.logo?.url || "",
            public_id: company.logo?.public_id || ""
          },
          weblinks: company.weblinks && company.weblinks.length > 0 ? company.weblinks : [{ url: "", label: "" }],
          products: company.products && company.products.length > 0 ? company.products : [""],
          certifications: company.certifications && company.certifications.length > 0 ? company.certifications : [""],
          shippingCountries: company.shippingCountries && company.shippingCountries.length > 0 ? company.shippingCountries : [""]
        });
      } else {
        setError("Failed to load company details");
      }
    } catch (err) {
      console.error("Error fetching company:", err);
      setError(err.message || "Failed to load company details");
      toast.error(err.message || "Failed to load company details");
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
    setError(null);
    
    try {
      // Prepare the data for API call
      const updateData = {
        name: formData.name,
        description: formData.description,
        email: formData.email,
        phone: formData.phone,
        establishedYear: formData.establishedYear,
        rating: formData.rating,
        totalRatings: formData.totalRatings,
        employees: formData.employees,
        annualRevenue: formData.annualRevenue,
        address: formData.address,
        logo: formData.logo,
        weblinks: formData.weblinks.filter(link => link.url || link.label),
        products: formData.products.filter(p => p.trim()),
        certifications: formData.certifications.filter(c => c.trim()),
        shippingCountries: formData.shippingCountries.filter(c => c.trim())
      };

      const response = await updateCompanyAPI(id, updateData);
      
      if (response.success) {
        toast.success("Company updated successfully!");
        navigate(`/company/view/${id}`);
      } else {
        setError(response.message || "Failed to update company");
        toast.error(response.message || "Failed to update company");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      setError(error.message || "Failed to update company");
      toast.error(error.message || "Failed to update company");
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