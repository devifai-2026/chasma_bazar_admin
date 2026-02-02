import { useEffect, useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { getAllProducts, deleteProduct as deleteProductAPI } from "../../Api/productApi";
import { toast, Toaster } from "react-hot-toast";

const Products = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter and pagination state
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    frameSize: '',
    minPrice: '',
    maxPrice: '',
    material: '',
    company: '',
    frameType: '',
    frameShape: '',
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Fetch products from API
  const fetchProducts = async (filterParams = filters, pageParams = pagination) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = {
        ...filterParams,
        page: pageParams.page,
        limit: pageParams.limit,
      };

      // Remove empty filter values
      Object.keys(queryParams).forEach(key => {
        if (!queryParams[key]) {
          delete queryParams[key];
        }
      });

      const response = await getAllProducts(queryParams);

      if (response.success) {
        setProducts(response.data);
        setPagination({
          page: response.currentPage,
          limit: pageParams.limit,
          total: response.total,
          totalPages: response.totalPages,
        });
      } else {
        setError(response.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message || 'An error occurred while fetching products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 }); // Reset to page 1
    fetchProducts(newFilters, { ...pagination, page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      const newPagination = { ...pagination, page: newPage };
      setPagination(newPagination);
      fetchProducts(filters, newPagination);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        const response = await deleteProductAPI(id);
        
        if (response.success) {
          toast.success('Product deleted successfully!');
          // Refresh the products list
          fetchProducts(filters, pagination);
        } else {
          toast.error('Error deleting product: ' + (response.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Error deleting product: ' + (error.message || 'Please try again.'));
      }
    }
  };

  // Calculate status based on stock
  const getStatus = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock < 20) return "Low Stock";
    return "In Stock";
  };

  // Calculate average price
  const calculateAveragePrice = () => {
    if (products.length === 0) return "0.00";
    const total = products.reduce((sum, p) => {
      const price = typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0;
      return sum + price;
    }, 0);
    return (total / products.length).toFixed(2);
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
        <Toaster position="top-right" />

        <main
          className={`flex-1 overflow-y-auto bg-gray-50 p-6 transition-all duration-300 ${sidebarOpen ? "lg:pl-6" : "lg:pl-6"
            }`}
        >
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                  <p className="text-gray-600">
                    Manage your products inventory
                  </p>
                  <div className="mt-2 text-sm text-gray-500">
                    <span className="inline-flex items-center">
                      <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
                      Blue border indicates demo products
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Link
                    to="/products/add"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Product
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
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
              <select
                value={filters.frameSize}
                onChange={(e) => handleFilterChange('frameSize', e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Sizes</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="xlarge">X-Large</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <select
                value={filters.material}
                onChange={(e) => handleFilterChange('material', e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Materials</option>
                <option value="Metal">Metal</option>
                <option value="Plastic">Plastic</option>
                <option value="Acetate">Acetate</option>
                <option value="Titanium">Titanium</option>
                <option value="Stainless Steel">Stainless Steel</option>
              </select>
              <button
                onClick={() => {
                  setFilters({
                    search: '',
                    category: '',
                    frameSize: '',
                    minPrice: '',
                    maxPrice: '',
                    material: '',
                    company: '',
                    frameType: '',
                    frameShape: '',
                  });
                  setPagination({ ...pagination, page: 1 });
                  fetchProducts({
                    search: '',
                    category: '',
                    frameSize: '',
                    minPrice: '',
                    maxPrice: '',
                    material: '',
                    company: '',
                    frameType: '',
                    frameShape: '',
                  }, { ...pagination, page: 1 });
                }}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Clear Filters
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <p className="text-red-700">{error}</p>
                </div>
              )}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-12 text-center">
                            <div className="text-gray-500">
                              No products found. Try adjusting your filters or add a new product.
                            </div>
                          </td>
                        </tr>
                      ) : (
                        products.map((product) => (
                          <tr key={product._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  className="h-10 w-10 rounded-lg object-cover"
                                  src={product.image || "N/A"}
                                  alt={product.name}
                                  
                                />
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {product.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    ID: #{product.sku || product._id?.toString()?.slice(-6) || 'N/A'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                {product.userCategory || 'General'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              ₹{typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${product.stock > 50
                                        ? "bg-green-500"
                                        : product.stock > 20
                                          ? "bg-yellow-500"
                                          : "bg-red-500"
                                      }`}
                                    style={{
                                      width: `${Math.min(product.stock || 0, 100)}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="ml-3 text-sm text-gray-600">
                                  {product.stock || 0} units
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-3 py-1 text-xs rounded-full ${getStatus(product.stock) === "In Stock"
                                    ? "bg-green-100 text-green-800"
                                    : getStatus(product.stock) === "Low Stock"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                              >
                                {getStatus(product.stock)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <Link
                                  to={`/products/view/${product._id}`}
                                  className="p-1 text-blue-600 hover:text-blue-800"
                                  title="View"
                                >
                                  <EyeIcon className="h-5 w-5" />
                                </Link>
                                <Link
                                  to={`/products/edit/${product._id}`}
                                  className="p-1 text-green-600 hover:text-green-800"
                                  title="Edit"
                                >
                                  <PencilIcon className="h-5 w-5" />
                                </Link>
                                <button
                                  className="p-1 text-red-600 hover:text-red-800"
                                  title="Delete"
                                  onClick={() => handleDeleteProduct(product._id)}
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
              )}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span> of{" "}
                <span className="font-medium">{pagination.total}</span> products
              </div>
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .slice(
                    Math.max(0, pagination.page - 2),
                    Math.min(pagination.totalPages, pagination.page + 1)
                  )
                  .map((page) => (
                    <button
                      key={page}
                      className={`px-3 py-1 rounded-lg ${page === pagination.page
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                <button
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-gray-600">Total Products</div>
                <div className="text-2xl font-bold mt-2">{pagination.total}</div>
                <div className="text-sm text-green-600 mt-1">
                  Total in database
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-gray-600">Out of Stock</div>
                <div className="text-2xl font-bold mt-2">
                  {products.filter((p) => (p.stock || 0) === 0).length}
                </div>
                <div className="text-sm text-red-600 mt-1">
                  Needs restock
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-gray-600">Low Stock</div>
                <div className="text-2xl font-bold mt-2">
                  {products.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) < 20).length}
                </div>
                <div className="text-sm text-yellow-600 mt-1">
                  Need attention
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-gray-600">Avg. Price</div>
                <div className="text-2xl font-bold mt-2">
                  ₹{calculateAveragePrice()}
                </div>
                <div className="text-sm text-blue-600 mt-1">
                  Current page average
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Products;