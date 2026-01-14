import React, { useEffect, useState } from 'react';
import {
  ArrowLeftIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  StarIcon,
  CalendarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  LinkIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { Link, useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

const ViewCompany = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          description: "Premium eyewear brand specializing in designer frames. We offer high-quality prescription glasses, sunglasses, and contact lenses with advanced lens technology.",
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
            url: "https://images.unsplash.com/photo-1567446537710-0c5ff5a6ac32?w=400&h=400&fit=crop",
            public_id: "logo_123"
          },
          establishedYear: 2010,
          rating: 4.5,
          totalRatings: 120,
          weblinks: [
            { url: "https://premiumeyewear.com", label: "Website" },
            { url: "https://facebook.com/premiumeyewear", label: "Facebook" },
            { url: "https://instagram.com/premiumeyewear", label: "Instagram" }
          ],
          isDummy: true,
          products: ["Designer Frames", "Sunglasses", "Prescription Lenses"],
          employees: 150,
          annualRevenue: "$50M",
          certifications: ["ISO 9001", "FDA Approved"],
          shippingCountries: ["India", "USA", "UK", "UAE", "Australia"]
        }
      ];

      const allCompanies = [...dummyCompanies, ...savedCompanies];
      const foundCompany = allCompanies.find(c => c.id === parseInt(id));

      if (foundCompany) {
        setCompany(foundCompany);
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

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      // Delete logic - for demo, we'll just navigate back
      const savedCompanies = JSON.parse(localStorage.getItem("companies") || "[]");
      const updatedCompanies = savedCompanies.filter(c => c.id !== parseInt(id));
      localStorage.setItem("companies", JSON.stringify(updatedCompanies));
      navigate("/company");
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
                <p className="mt-4 text-gray-600">Loading company details...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="flex h-screen">
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-red-500 text-2xl mb-4">⚠️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Company Not Found</h3>
                <p className="text-gray-600 mb-6">{error || "The company you're looking for doesn't exist."}</p>
                <Link to="/company" className="text-blue-600 hover:text-blue-800">
                  ← Back to Companies
                </Link>
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
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center">
                  <Link to="/company" className="mr-4 text-gray-600 hover:text-gray-900">
                    <ArrowLeftIcon className="h-6 w-6" />
                  </Link>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
                    <p className="text-gray-600">Company Details</p>
                  </div>
                </div>
              
              </div>
            </div>

            {/* Company Details Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Logo and Basic Info */}
                  <div className="md:w-1/3">
                    <div className="mb-6">
                      <img
                        className="w-full h-64 object-cover rounded-lg border"
                        src={company.logo.url}
                        alt={company.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/400x300?text=Company+Logo";
                        }}
                      />
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium text-blue-900 mb-2">Quick Info</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <BuildingOfficeIcon className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="text-sm">Established: {company.establishedYear}</span>
                        </div>
                        <div className="flex items-center">
                          <UserGroupIcon className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="text-sm">Employees: {company.employees || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="text-sm">Revenue: {company.annualRevenue || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Company Details */}
                  <div className="md:w-2/3">
                    {/* Rating */}
                    <div className="mb-6">
                      <div className="flex items-center mb-2">
                        <StarIcon className="h-6 w-6 text-yellow-500" />
                        <span className="ml-2 text-xl font-bold">{company.rating}</span>
                        <span className="ml-2 text-gray-600">({company.totalRatings} ratings)</span>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`h-5 w-5 ${
                              star <= Math.floor(company.rating)
                                ? 'text-yellow-400'
                                : star === Math.ceil(company.rating) && company.rating % 1 !== 0
                                ? 'text-yellow-300'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <p className="text-gray-700">{company.description}</p>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="font-medium">{company.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm text-gray-500">Phone</p>
                              <p className="font-medium">{company.phone}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">Address</h3>
                        <div className="flex items-start">
                          <MapPinIcon className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                          <div>
                            <p className="font-medium">{company.address.street}</p>
                            <p className="text-gray-600">{company.address.city}, {company.address.state}</p>
                            <p className="text-gray-600">{company.address.country} - {company.address.pinCode}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Web Links */}
                    {company.weblinks && company.weblinks.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Website & Social Links</h3>
                        <div className="flex flex-wrap gap-2">
                          {company.weblinks.map((link, index) => (
                            <a
                              key={index}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                            >
                              <LinkIcon className="h-4 w-4 mr-2" />
                              {link.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Additional Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {company.products && company.products.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Products</h4>
                          <div className="flex flex-wrap gap-1">
                            {company.products.map((product, idx) => (
                              <span key={idx} className="px-2 py-1 bg-white text-sm rounded border">
                                {product}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {company.certifications && company.certifications.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Certifications</h4>
                          <div className="space-y-1">
                            {company.certifications.map((cert, idx) => (
                              <div key={idx} className="text-sm text-gray-600">✓ {cert}</div>
                            ))}
                          </div>
                        </div>
                      )}

                      {company.shippingCountries && company.shippingCountries.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Shipping Countries</h4>
                          <div className="flex flex-wrap gap-1">
                            {company.shippingCountries.map((country, idx) => (
                              <span key={idx} className="px-2 py-1 bg-white text-sm rounded border">
                                {country}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <CalendarIcon className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Years in Business</div>
                    <div className="text-2xl font-bold mt-1">
                      {new Date().getFullYear() - company.establishedYear} years
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <StarIcon className="h-8 w-8 text-yellow-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Customer Rating</div>
                    <div className="text-2xl font-bold mt-1">{company.rating}/5</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <GlobeAltIcon className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Market Presence</div>
                    <div className="text-2xl font-bold mt-1">
                      {company.shippingCountries?.length || 1} countries
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="flex justify-center">
              <Link
                to="/company"
                className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Companies List
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ViewCompany;