import React, { useEffect, useState } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  BuildingOfficeIcon,
  StarIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

const Companies = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

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
      url: "https://picsum.photos/seed/eyewear1/150/150",
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
  },
  {
    id: 2,
    name: "Urban Optics Ltd.",
    description: "Modern eyewear for urban professionals",
    pinCode: "400001",
    email: "info@urbanoptics.com",
    phone: "9123456789",
    address: {
      street: "456 Fashion Street",
      city: "Delhi",
      state: "Delhi",
      country: "India",
      pinCode: "400001"
    },
    logo: {
      url: "https://picsum.photos/seed/eyewear2/150/150",
      public_id: "logo_456"
    },
    establishedYear: 2015,
    rating: 4.2,
    totalRatings: 89,
    weblinks: [
      { url: "https://urbanoptics.com", label: "Website" }
    ],
    isDummy: true
  },
  {
    id: 3,
    name: "Classic Frames Inc.",
    description: "Traditional eyewear manufacturer since 1985",
    pinCode: "560001",
    email: "sales@classicframes.com",
    phone: "9988776655",
    address: {
      street: "789 Heritage Road",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      pinCode: "560001"
    },
    logo: {
      url: "https://picsum.photos/seed/eyewear3/150/150",
      public_id: "logo_789"
    },
    establishedYear: 1985,
    rating: 4.7,
    totalRatings: 256,
    weblinks: [
      { url: "https://classicframes.com", label: "Website" },
      { url: "https://instagram.com/classicframes", label: "Instagram" }
    ],
    isDummy: true
  },
  {
    id: 4,
    name: "Visionary Eyewear",
    description: "Innovative eyewear solutions with cutting-edge technology",
    pinCode: "600001",
    email: "info@visionaryeyewear.com",
    phone: "9876543120",
    address: {
      street: "321 Tech Park",
      city: "Chennai",
      state: "Tamil Nadu",
      country: "India",
      pinCode: "600001"
    },
    logo: {
      url: "https://picsum.photos/seed/eyewear4/150/150",
      public_id: "logo_101"
    },
    establishedYear: 2018,
    rating: 4.3,
    totalRatings: 75,
    weblinks: [
      { url: "https://visionaryeyewear.com", label: "Website" },
      { url: "https://twitter.com/visionaryeyewear", label: "Twitter" }
    ],
    isDummy: true
  },
  {
    id: 5,
    name: "SunShades International",
    description: "World's leading sunglasses manufacturer",
    pinCode: "700001",
    email: "sales@sunshades.com",
    phone: "9123456780",
    address: {
      street: "789 Beach Road",
      city: "Kolkata",
      state: "West Bengal",
      country: "India",
      pinCode: "700001"
    },
    logo: {
      url: "https://picsum.photos/seed/eyewear5/150/150",
      public_id: "logo_102"
    },
    establishedYear: 2005,
    rating: 4.8,
    totalRatings: 320,
    weblinks: [
      { url: "https://sunshades.com", label: "Website" },
      { url: "https://instagram.com/sunshades", label: "Instagram" }
    ],
    isDummy: true
  },
  {
    id: 6,
    name: "Optical Precision",
    description: "Precision optics for professionals",
    pinCode: "380001",
    email: "contact@opticalprecision.com",
    phone: "9876543219",
    address: {
      street: "654 Science Street",
      city: "Ahmedabad",
      state: "Gujarat",
      country: "India",
      pinCode: "380001"
    },
    logo: {
      url: "https://picsum.photos/seed/eyewear6/150/150",
      public_id: "logo_103"
    },
    establishedYear: 1995,
    rating: 4.6,
    totalRatings: 189,
    weblinks: [
      { url: "https://opticalprecision.com", label: "Website" },
      { url: "https://linkedin.com/company/opticalprecision", label: "LinkedIn" }
    ],
    isDummy: true
  },
  {
    id: 7,
    name: "Retro Frames Co.",
    description: "Vintage and retro eyewear collections",
    pinCode: "500001",
    email: "info@retroframes.com",
    phone: "9123456781",
    address: {
      street: "987 Vintage Lane",
      city: "Hyderabad",
      state: "Telangana",
      country: "India",
      pinCode: "500001"
    },
    logo: {
      url: "https://picsum.photos/seed/eyewear7/150/150",
      public_id: "logo_104"
    },
    establishedYear: 2012,
    rating: 4.4,
    totalRatings: 142,
    weblinks: [
      { url: "https://retroframes.com", label: "Website" },
      { url: "https://pinterest.com/retroframes", label: "Pinterest" }
    ],
    isDummy: true
  },
  {
    id: 8,
    name: "Eco Vision Optics",
    description: "Sustainable and eco-friendly eyewear",
    pinCode: "411001",
    email: "contact@ecovision.com",
    phone: "9876543220",
    address: {
      street: "456 Green Avenue",
      city: "Pune",
      state: "Maharashtra",
      country: "India",
      pinCode: "411001"
    },
    logo: {
      url: "https://picsum.photos/seed/eyewear8/150/150",
      public_id: "logo_105"
    },
    establishedYear: 2019,
    rating: 4.7,
    totalRatings: 96,
    weblinks: [
      { url: "https://ecovision.com", label: "Website" },
      { url: "https://facebook.com/ecovision", label: "Facebook" }
    ],
    isDummy: true
  }
];

  // Load companies from localStorage
  useEffect(() => {
    loadCompaniesFromStorage();
  }, []);

  const loadCompaniesFromStorage = () => {
    try {
      const savedCompanies = JSON.parse(
        localStorage.getItem("companies") || "[]"
      );

      // Filter out any dummy companies that might have been saved previously
      const userCompanies = savedCompanies.filter((company) => !company.isDummy);

      // Combine dummy companies with user's companies (dummy first, then user's)
      const allCompanies = [...dummyCompanies, ...userCompanies];

      setCompanies(allCompanies);

      // Only save if we need to initialize or update
      if (savedCompanies.length === 0) {
        localStorage.setItem("companies", JSON.stringify(userCompanies));
      }
    } catch (error) {
      console.error("Error loading companies:", error);
      // If error, just show dummy companies
      setCompanies(dummyCompanies);
    }
  };

  // Save only user companies to localStorage whenever companies change
  useEffect(() => {
    if (companies.length > 0) {
      // Filter out dummy companies before saving
      const userCompanies = companies.filter((company) => !company.isDummy);
      localStorage.setItem("companies", JSON.stringify(userCompanies));
    }
  }, [companies]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const deleteCompany = (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      const companyToDelete = companies.find((c) => c.id === id);

      // Show extra warning for demo companies
      if (companyToDelete?.isDummy) {
        if (!window.confirm("This is a demo company. Are you sure you want to delete it?")) {
          return;
        }
      }

      const updatedCompanies = companies.filter((company) => company.id !== id);
      setCompanies(updatedCompanies);
    }
  };

  // Filter companies based on search and filter
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.phone.includes(searchTerm);
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'established' && company.establishedYear < 2000) ||
                         (filter === 'new' && company.establishedYear >= 2015) ||
                         (filter === 'premium' && company.rating >= 4.5);
    
    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const calculateStats = () => {
    const userCompanies = companies.filter(c => !c.isDummy);
    const totalCompanies = companies.length;
    const userAdded = userCompanies.length;
    const avgRating = companies.length > 0 
      ? (companies.reduce((sum, c) => sum + c.rating, 0) / companies.length).toFixed(1)
      : "0.0";
    const establishedCompanies = companies.filter(c => c.establishedYear < 2000).length;

    return { totalCompanies, userAdded, avgRating, establishedCompanies };
  };

  const stats = calculateStats();

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
                  <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
                  <p className="text-gray-600">
                    Manage eyewear manufacturing companies
                  </p>
                  <div className="mt-2 text-sm text-gray-500">
                    <span className="inline-flex items-center">
                      <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
                      Blue border indicates demo companies
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Link
                    to="/company/add"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Company
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
                    placeholder="Search companies by name, email, or phone..."
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
                <option value="all">All Companies</option>
                <option value="established">Established (Before 2000)</option>
                <option value="new">New (After 2015)</option>
                <option value="premium">Premium (Rating 4.5+)</option>
              </select>
              <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <FunnelIcon className="h-5 w-5 mr-2" />
                More Filters
                <ChevronDownIcon className="h-4 w-4 ml-2" />
              </button>
            </div>

            {/* Companies Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Established
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCompanies.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            No companies found. Click "Add Company" to get started.
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredCompanies.map((company) => (
                        <tr
                          key={company.id}
                          className={`hover:bg-gray-50 ${
                            company.isDummy ? "border-l-4 border-blue-500" : ""
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <img
                                  className="h-12 w-12 rounded-lg object-cover border shadow-sm"
                                  src={company.logo.url}
                                  alt={company.name}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://images.unsplash.com/photo-1567446537710-0c5ff5a6ac32?w=150&h=150&fit=crop&crop=face";
                                  }}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {company.name}
                                  {company.isDummy && (
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                      Demo
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500 line-clamp-2">
                                  {company.description}
                                </div>
                                <div className="mt-1 flex flex-wrap gap-2">
                                  {company.weblinks.map((link, index) => (
                                    <a
                                      key={index}
                                      href={link.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                      {link.label}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-900">
                                <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                                {company.email}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                                {company.phone}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-900">
                                <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                                {company.address.city}, {company.address.state}
                              </div>
                              <div className="text-sm text-gray-500">
                                {company.address.street}
                              </div>
                              <div className="text-sm text-gray-500">
                                PIN: {company.pinCode}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 font-medium">
                              {company.establishedYear}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date().getFullYear() - company.establishedYear} years
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <StarIcon className="h-5 w-5 text-yellow-400" />
                              <span className="ml-1 text-sm font-medium text-gray-900">
                                {company.rating}
                              </span>
                              <span className="ml-1 text-sm text-gray-500">
                                ({company.totalRatings})
                              </span>
                            </div>
                            <div className="mt-1">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <StarIcon
                                    key={star}
                                    className={`h-4 w-4 ${
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
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <Link
                                to={`/company/view/${company.id}`}
                                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                                title="View"
                              >
                                <EyeIcon className="h-5 w-5" />
                              </Link>
                              <Link
                                to={`/company/update/${company.id}`}
                                className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                                title="Edit"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </Link>
                              <button
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                title="Delete"
                                onClick={() => deleteCompany(company.id)}
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
                <span className="font-medium">{Math.min(10, filteredCompanies.length)}</span> of{" "}
                <span className="font-medium">{filteredCompanies.length}</span> companies
                <span className="ml-2 text-gray-500">
                  ({companies.filter((c) => !c.isDummy).length} user-added)
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled
                >
                  Previous
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  1
                </button>
                {filteredCompanies.length > 10 && (
                  <>
                    <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">
                      2
                    </button>
                    {filteredCompanies.length > 20 && (
                      <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">
                        3
                      </button>
                    )}
                  </>
                )}
                <button
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={filteredCompanies.length <= 10}
                >
                  Next
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <BuildingOfficeIcon className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Total Companies</div>
                    <div className="text-2xl font-bold mt-1">{stats.totalCompanies}</div>
                  </div>
                </div>
                <div className="text-sm text-green-600 mt-2">
                  {stats.userAdded} user-added
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <StarIcon className="h-8 w-8 text-yellow-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Avg. Rating</div>
                    <div className="text-2xl font-bold mt-1">{stats.avgRating}</div>
                  </div>
                </div>
                <div className="text-sm text-blue-600 mt-2">
                  Based on all companies
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <GlobeAltIcon className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Established</div>
                    <div className="text-2xl font-bold mt-1">{stats.establishedCompanies}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Founded before 2000
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <MapPinIcon className="h-8 w-8 text-purple-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Cities</div>
                    <div className="text-2xl font-bold mt-1">
                      {[...new Set(companies.map(c => c.address.city))].length}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Operating cities
                </div>
              </div>
            </div>

          
           
          </div>
        </main>
      </div>
    </div>
  );
};

export default Companies;