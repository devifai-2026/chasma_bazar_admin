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
  MapPinIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { getAllCompanies, deleteCompany as deleteCompanyAPI } from "../../Api/companyApi";

const Companies = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Fetch companies from API
  useEffect(() => {
    fetchCompanies();
  }, [page, searchTerm]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllCompanies({
        name: searchTerm,
        page: page,
        limit: limit
      });
      
      if (response.success) {
        setCompanies(response.data);
        setTotal(response.total);
        setTotalPages(response.totalPages);
      } else {
        setError('Failed to fetch companies');
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError(err.message || 'Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  // Filter companies based on client-side filter
  const filteredCompanies = companies.filter(company => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'established' && company.establishedYear < 2000) ||
                         (filter === 'new' && company.establishedYear >= 2015) ||
                         (filter === 'premium' && company.rating >= 4.5);
    
    return matchesFilter;
  });

  // Calculate statistics
  const calculateStats = () => {
    const totalCompanies = total;
    const avgRating = companies.length > 0 
      ? (companies.reduce((sum, c) => sum + (c.rating || 0), 0) / companies.length).toFixed(1)
      : "0.0";
    const establishedCompanies = companies.filter(c => c.establishedYear && c.establishedYear < 2000).length;
    const uniqueCities = [...new Set(companies.map(c => c.address?.city).filter(Boolean))].length;

    return { totalCompanies, avgRating, establishedCompanies, uniqueCities };
  };

  const stats = calculateStats();
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Reset to page 1 when search term changes
  const handleSearch = (value) => {
    setSearchTerm(value);
    setPage(1);
  };

  const deleteCompany = async (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await deleteCompanyAPI(id);
        alert("Company deleted successfully!");
        // Refresh the list after deletion
        setPage(1);
        fetchCompanies();
      } catch (err) {
        console.error("Error deleting company:", err);
        alert("Failed to delete company");
      }
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
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={fetchCompanies}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    disabled={loading}
                  >
                    {loading ? "Refreshing..." : "Refresh"}
                  </button>
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

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <XCircleIcon className="h-5 w-5 mr-2" />
                  <span>{error}</span>
                </div>
                <button
                  onClick={fetchCompanies}
                  className="text-red-800 hover:text-red-900 font-medium"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Search and Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search companies by name..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
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
                    {loading ? (
                      [...Array(5)].map((_, index) => (
                        <tr key={index} className="animate-pulse">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                              <div className="ml-4 space-y-2 flex-1">
                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-32"></div>
                              <div className="h-3 bg-gray-200 rounded w-24"></div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="h-3 bg-gray-200 rounded w-24"></div>
                              <div className="h-3 bg-gray-200 rounded w-32"></div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <div className="h-5 w-5 bg-gray-200 rounded"></div>
                              <div className="h-5 w-5 bg-gray-200 rounded"></div>
                              <div className="h-5 w-5 bg-gray-200 rounded"></div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : filteredCompanies.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            {searchTerm || filter !== 'all'
                              ? "No companies found matching your criteria."
                              : "No companies found. Click 'Add Company' to get started."}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredCompanies.map((company) => (
                        <tr
                          key={company._id}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                {company.logo?.url ? (
                                  <img
                                    className="h-12 w-12 rounded-lg object-cover border shadow-sm"
                                    src={company.logo.url}
                                    alt={company.name}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "https://images.unsplash.com/photo-1567446537710-0c5ff5a6ac32?w=150&h=150&fit=crop&crop=face";
                                    }}
                                  />
                                ) : (
                                  <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center border shadow-sm">
                                    <span className="text-xs text-gray-500 font-medium">N/A</span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {company.name}
                                </div>
                                <div className="text-sm text-gray-500 line-clamp-2">
                                  {company.description || 'N/A'}
                                </div>
                                {company.weblinks && company.weblinks.length > 0 && (
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
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-900">
                                <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                                {company.email || 'N/A'}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                                {company.phone || 'N/A'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-900">
                                <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                                {company.address?.city || 'N/A'}, {company.address?.state || 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {company.address?.street || 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500">
                                PIN: {company.pinCode || 'N/A'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 font-medium">
                              {company.establishedYear || 'N/A'}
                            </div>
                            {company.establishedYear && (
                              <div className="text-sm text-gray-500">
                                {new Date().getFullYear() - company.establishedYear} years
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {company.rating ? (
                              <>
                                <div className="flex items-center">
                                  <StarIcon className="h-5 w-5 text-yellow-400" />
                                  <span className="ml-1 text-sm font-medium text-gray-900">
                                    {company.rating}
                                  </span>
                                  <span className="ml-1 text-sm text-gray-500">
                                    ({company.totalRatings || 0})
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
                              </>
                            ) : (
                              <span className="text-sm text-gray-500">N/A</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <Link
                                to={`/company/view/${company._id}`}
                                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                                title="View"
                              >
                                <EyeIcon className="h-5 w-5" />
                              </Link>
                              <Link
                                to={`/company/update/${company._id}`}
                                className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                                title="Edit"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </Link>
                              <button
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                title="Delete"
                                onClick={() => deleteCompany(company._id)}
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
                Showing page <span className="font-medium">{page}</span> of{" "}
                <span className="font-medium">{totalPages}</span> ({" "}
                <span className="font-medium">{total}</span> total companies)
              </div>
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={page === 1}
                  onClick={() => setPage(Math.max(1, page - 1))}
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  // Show first page, last page, current page, and adjacent pages
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    Math.abs(pageNum - page) <= 1
                  ) {
                    return (
                      <button
                        key={pageNum}
                        className={`px-3 py-1 rounded-lg ${
                          page === pageNum
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (
                    (pageNum === 2 && page > 3) ||
                    (pageNum === totalPages - 1 && page < totalPages - 2)
                  ) {
                    return (
                      <span key={pageNum} className="px-2 py-1">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
                <button
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={page === totalPages}
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
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
                <div className="text-sm text-blue-600 mt-2">
                  From backend database
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
                      {stats.uniqueCities}
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