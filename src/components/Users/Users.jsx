import { useState, useEffect } from "react";
import {
  PlusIcon,
  UserIcon,
  PencilIcon,
  TrashIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import {
  getUsers,
  getUsersStatistics,
  deleteUser,
  toggleUserStatus,
} from "../../Api/usersApi";

const Users = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    newThisMonth: 0,
  });
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const statusOptions = ["All", "Active", "Inactive"];
  const roleOptions = ["All", "Admin", "Manager", "Editor", "Viewer"];

  // Fetch users and statistics
  const fetchUsersAndStats = async () => {
    setLoading(true);
    setError(null);
    try {
      // Prepare query parameters
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== "All" && { status: statusFilter }),
        ...(roleFilter !== "All" && { role: roleFilter }),
        ...(sortConfig.key && {
          sortField: sortConfig.key.toUpperCase(),
          sortDirection: sortConfig.direction
        }),
      };

      // Fetch users
      const usersResponse = await getUsers(params);

      if (usersResponse && usersResponse.success) {
        // Extract data from response
        const responseData = usersResponse.data || usersResponse;
        const { users: usersData, pagination, statistics } = responseData;

        if (usersData) {
          // Transform API response to match your UI format
          const transformedUsers = usersData.map(user => ({
            id: user.id,
            name: user.user?.name || user.user?.username || 'Unknown',
            email: user.contact?.email || 'N/A',
            role: user.role || 'Unknown',
            status: user.status || user.accountStatus || 'Unknown',
            phone: user.contact?.phone || "N/A",
            joinDate: user.joinDate || user.createdAt,
            avatar: user.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.user?.username || user.id}`,
            displayId: user.displayId || `#${String(user.id).slice(-3).padStart(3, "0")}`,
          }));

          setUsers(transformedUsers);
          setFilteredUsers(transformedUsers);
          setTotalPages(pagination?.totalPages || 1);
          setTotalItems(pagination?.totalItems || transformedUsers.length);

          // Set statistics
          if (statistics) {
            setStats({
              totalUsers: statistics.totalUsers || 0,
              activeUsers: statistics.activeUsers || 0,
              adminUsers: statistics.adminUsers || 0,
              newThisMonth: statistics.newThisMonth || 0,
            });
          }
        }
      } else {
        throw new Error(usersResponse?.message || 'Invalid response format');
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch users");

      // Fallback to local storage if API fails
      const savedUsers = localStorage.getItem("users");
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        setUsers(parsedUsers);
        setFilteredUsers(parsedUsers);
        setTotalItems(parsedUsers.length);

        // Calculate fallback stats
        const fallbackStats = {
          totalUsers: parsedUsers.length,
          activeUsers: parsedUsers.filter(u => u.status === "Active").length,
          adminUsers: parsedUsers.filter(u => u.role === "Admin").length,
          newThisMonth: parsedUsers.filter(u => {
            const joinDate = new Date(u.joinDate);
            const now = new Date();
            return joinDate.getMonth() === now.getMonth() &&
              joinDate.getFullYear() === now.getFullYear();
          }).length,
        };
        setStats(fallbackStats);
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchUsersAndStats();
  }, [currentPage, sortConfig]);

  // Filter users locally when search/filters change
  useEffect(() => {
    let result = users;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.phone.toLowerCase().includes(term) ||
          user.role.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== "All") {
      result = result.filter((user) => user.status === statusFilter);
    }

    // Apply role filter
    if (roleFilter !== "All") {
      result = result.filter((user) => user.role === roleFilter);
    }

    // Apply sorting
    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle string comparison
        if (typeof aValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        // Handle date comparison
        if (sortConfig.key === "joinDate") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        // Handle number comparison
        if (typeof aValue === "number") {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        return 0;
      });
    }

    setFilteredUsers(result);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, roleFilter, users, sortConfig]);

  // Refresh data when filters change
  const handleFilterChange = () => {
    fetchUsersAndStats();
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-800 border border-red-200";
      case "Manager":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Editor":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Viewer":
        return "bg-gray-100 text-gray-800 border border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      try {
        await deleteUser(id);
        alert(`User "${name}" has been deleted successfully.`);
        fetchUsersAndStats(); // Refresh the list
      } catch (error) {
        console.error("Error deleting user:", error);
        alert(`Failed to delete user "${name}". Please try again.`);
      }
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await toggleUserStatus(id, currentStatus);
      fetchUsersAndStats(); // Refresh the list
    } catch (error) {
      console.error("Error toggling user status:", error);
      alert("Failed to update user status. Please try again.");
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setRoleFilter("All");
    setSortConfig({ key: "id", direction: "asc" });
    fetchUsersAndStats();
  };

  // Calculate pagination for current view
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && currentPage === 1) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
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
          className={`flex-1 overflow-y-auto bg-gray-50 p-6 transition-all duration-300 ${sidebarOpen ? "lg:pl-6" : "lg:pl-6"
            }`}
        >
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                  <p className="text-gray-600">
                    Manage user accounts and permissions ({filteredUsers.length}{" "}
                    users found)
                  </p>
                </div>
                <Link
                  to="/users/add"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add User
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <UserIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Users</div>
                    <div className="text-2xl font-bold mt-1">
                      {stats.totalUsers}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Active Users</div>
                    <div className="text-2xl font-bold mt-1">
                      {stats.activeUsers}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                    <UserIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Admins</div>
                    <div className="text-2xl font-bold mt-1">
                      {stats.adminUsers}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                    <UserIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">New This Month</div>
                    <div className="text-2xl font-bold mt-1">
                      {stats.newThisMonth}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search users by name, email, phone, or role..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleFilterChange();
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <select
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        handleFilterChange();
                      }}
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          Status: {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <select
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={roleFilter}
                      onChange={(e) => {
                        setRoleFilter(e.target.value);
                        handleFilterChange();
                      }}
                    >
                      {roleOptions.map((option) => (
                        <option key={option} value={option}>
                          Role: {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={resetFilters}
                    className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Reset all filters"
                  >
                    <ArrowPathIcon className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center">
                          User
                          {sortConfig.key === "name" && (
                            <span className="ml-1">
                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("role")}
                      >
                        <div className="flex items-center">
                          Role
                          {sortConfig.key === "role" && (
                            <span className="ml-1">
                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center">
                          Status
                          {sortConfig.key === "status" && (
                            <span className="ml-1">
                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("joinDate")}
                      >
                        <div className="flex items-center">
                          Join Date
                          {sortConfig.key === "joinDate" && (
                            <span className="ml-1">
                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentUsers.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            <UserIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                            <p className="text-lg mb-2">No users found</p>
                            <p className="text-sm mb-4">
                              Try adjusting your filters or search terms
                            </p>
                            <button
                              onClick={resetFilters}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Reset all filters
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                alt={user.name}
                              />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.displayId}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-900">
                                <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                                {user.email}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                                {user.phone}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 text-xs rounded-full ${getRoleColor(
                                user.role
                              )}`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleStatusToggle(user.id, user.status)}
                                className={`p-1 rounded-full transition-colors ${user.status === "Active"
                                    ? "text-green-600 hover:text-green-800 hover:bg-green-50"
                                    : "text-red-600 hover:text-red-800 hover:bg-red-50"
                                  }`}
                                title={`Toggle ${user.status === "Active"
                                    ? "Inactive"
                                    : "Active"
                                  }`}
                              >
                                {user.status === "Active" ? (
                                  <CheckCircleIcon className="h-5 w-5" />
                                ) : (
                                  <XCircleIcon className="h-5 w-5" />
                                )}
                              </button>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${user.status === "Active"
                                    ? "bg-green-100 text-green-800 border border-green-200"
                                    : "bg-red-100 text-red-800 border border-red-200"
                                  }`}
                              >
                                {user.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.joinDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <Link
                                to={`/users/edit/${user.id}`}
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                title="Edit"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </Link>
                              <button
                                onClick={() => handleDelete(user.id, user.name)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                                title="Delete"
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
            {filteredUsers.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-lg shadow p-4">
                <div className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredUsers.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredUsers.length}</span>{" "}
                  users
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border ${currentPage === 1
                        ? "text-gray-400 border-gray-300 cursor-not-allowed"
                        : "text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      if (totalPages <= 5) return true;
                      if (page === 1 || page === totalPages) return true;
                      if (page >= currentPage - 1 && page <= currentPage + 1)
                        return true;
                      return false;
                    })
                    .map((page, index, array) => {
                      const prevPage = array[index - 1];
                      if (prevPage && page - prevPage > 1) {
                        return (
                          <div
                            key={`ellipsis-${page}`}
                            className="flex items-center"
                          >
                            <span className="px-2 text-gray-500">...</span>
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-1 rounded-lg ${currentPage === page
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                              {page}
                            </button>
                          </div>
                        );
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded-lg ${currentPage === page
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border ${currentPage === totalPages
                        ? "text-gray-400 border-gray-300 cursor-not-allowed"
                        : "text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Users;