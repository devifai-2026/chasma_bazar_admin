import React, { useState, useEffect } from 'react';
import {
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { getUserById, updateUser, deleteUser } from '../../Api/usersApi';

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'user',
    accountStatus: 'active',
    dateOfBirth: '',
    gender: ''
  });

  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [joinDate, setJoinDate] = useState('');

  const roles = [
    { value: 'admin', label: 'Administrator', description: 'Full system access' },
    { value: 'manager', label: 'Manager', description: 'Manage users and content' },
    { value: 'editor', label: 'Editor', description: 'Create and edit content' },
    { value: 'user', label: 'User', description: 'Regular user access' },
    { value: 'viewer', label: 'Viewer', description: 'View only access' },
  ];

  const accountStatuses = ['active', 'inactive', 'suspended', 'pending'];

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const response = await getUserById(id);

        if (response && response.status === 'success' && response.data) {
          const userData = response.data;
          const userFormData = {
            username: userData.username || '',
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            phone: userData.phone || '',
            role: (userData.role || 'user').toLowerCase(),
            accountStatus: (userData.accountStatus || 'active').toLowerCase(),
            dateOfBirth: userData.dateOfBirth || '',
            gender: userData.gender || ''
          };
          
          setFormData(userFormData);
          setOriginalData(userFormData);
          setJoinDate(userData.createdAt || '');
        } else {
          alert('User not found!');
          navigate('/users');
        }
      } catch (error) {
        console.error('Error loading user:', error);
        alert(`Error loading user data: ${error.message || 'Unknown error'}`);
        navigate('/users');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [id, navigate]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username?.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.phone && !/^[\d\s\+\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    if (!formData.accountStatus) {
      newErrors.accountStatus = 'Account status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      // Prepare update data with only changed fields
      const updateData = {};
      
      // Only include fields that have changed
      if (formData.username !== originalData.username) {
        updateData.username = formData.username;
      }
      if (formData.firstName !== originalData.firstName) {
        updateData.firstName = formData.firstName;
      }
      if (formData.lastName !== originalData.lastName) {
        updateData.lastName = formData.lastName;
      }
      if (formData.email !== originalData.email) {
        updateData.email = formData.email.toLowerCase();
      }
      if (formData.phone !== originalData.phone) {
        updateData.phone = formData.phone;
      }
      if (formData.role !== originalData.role) {
        updateData.role = formData.role.toLowerCase();
      }
      if (formData.accountStatus !== originalData.accountStatus) {
        updateData.accountStatus = formData.accountStatus.toLowerCase();
      }
      if (formData.dateOfBirth !== originalData.dateOfBirth) {
        updateData.dateOfBirth = formData.dateOfBirth;
      }
      if (formData.gender !== originalData.gender) {
        updateData.gender = formData.gender?.toLowerCase();
      }

      console.log('Sending update data:', updateData);

      const response = await updateUser(id, updateData);

      if (response && response.status === 'success') {
        alert(`User "${formData.username}" has been updated successfully!`);
        navigate('/users');
      } else {
        // Handle backend validation errors
        if (response && response.message) {
          throw new Error(response.message);
        } else {
          throw new Error('Failed to update user');
        }
      }

    } catch (error) {
      console.error('Error updating user:', error);
      
      // Check for specific backend error messages
      const errorMessage = error.message || 'Please try again.';
      if (errorMessage.includes('already exists')) {
        // Extract which field has duplicate
        if (errorMessage.includes('Username')) {
          setErrors(prev => ({ ...prev, username: 'Username already exists' }));
        } else if (errorMessage.includes('Email')) {
          setErrors(prev => ({ ...prev, email: 'Email already exists' }));
        } else if (errorMessage.includes('Phone')) {
          setErrors(prev => ({ ...prev, phone: 'Phone number already exists' }));
        }
      }
      
      alert(`Error updating user: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/users');
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const response = await deleteUser(id);

      if (response && response.status === 'success') {
        alert(`User "${formData.username || formData.email}" has been deleted successfully!`);
        navigate('/users');
      } else {
        throw new Error(response?.message || 'Failed to delete user');
      }

    } catch (error) {
      console.error('Error deleting user:', error);
      alert(`Error deleting user: ${error.message || 'Please try again.'}`);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get display name
  const getDisplayName = () => {
    if (formData.firstName && formData.lastName) {
      return `${formData.firstName} ${formData.lastName}`;
    } else if (formData.firstName) {
      return formData.firstName;
    } else if (formData.lastName) {
      return formData.lastName;
    }
    return formData.username || formData.email?.split('@')[0] || 'User';
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <main className={`flex-1 overflow-y-auto bg-gray-50 p-6 transition-all duration-300 ${sidebarOpen ? 'lg:pl-6' : 'lg:pl-6'}`}>
          <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={handleCancel}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Users
              </button>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
                  <p className="text-gray-600 mt-1">
                    Update user information for {getDisplayName()}
                  </p>
                </div>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <TrashIcon className="h-5 w-5 mr-2" />
                  Delete User
                </button>
              </div>
            </div>

            {/* User Info Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center">
                  <img
                    className="h-16 w-16 rounded-full border-4 border-white shadow"
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username || formData.email}`}
                    alt={formData.username}
                  />
                  <div className="ml-4">
                    <h2 className="text-xl font-bold text-gray-900">{getDisplayName()}</h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`px-3 py-1 text-xs rounded-full ${getRoleColor(formData.role)}`}>
                        {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                      </span>
                      <span className={`px-3 py-1 text-xs rounded-full ${formData.accountStatus.toLowerCase() === 'active'
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : formData.accountStatus.toLowerCase() === 'inactive'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : formData.accountStatus.toLowerCase() === 'suspended'
                          ? 'bg-orange-100 text-orange-800 border border-orange-200'
                          : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        }`}>
                        {formData.accountStatus.charAt(0).toUpperCase() + formData.accountStatus.slice(1)}
                      </span>
                      {joinDate && (
                        <span className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-full border border-gray-200">
                          Joined: {formatDate(joinDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">User ID</div>
                  <div className="text-2xl font-bold text-gray-900">
                    #{id && id.length > 8 ? id.substring(0, 8) : id}
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <UserIcon className="h-6 w-6 mr-2 text-blue-600" />
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username *
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.username ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="johndoe"
                    />
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={`w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="john@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="John"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Doe"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Role & Status Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <ShieldCheckIcon className="h-6 w-6 mr-2 text-purple-600" />
                  Role & Status
                </h2>

                {/* Role Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    User Role *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {roles.map((role) => (
                      <button
                        type="button"
                        key={role.value}
                        onClick={() => setFormData(prev => ({ ...prev, role: role.value }))}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          formData.role === role.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-left">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-semibold ${
                              formData.role === role.value ? 'text-blue-700' : 'text-gray-800'
                            }`}>
                              {role.label}
                            </span>
                            {formData.role === role.value && (
                              <CheckCircleIcon className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600">{role.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                  )}
                </div>

                {/* Account Status Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Account Status *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {accountStatuses.map((status) => (
                      <button
                        type="button"
                        key={status}
                        onClick={() => setFormData(prev => ({ ...prev, accountStatus: status }))}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          formData.accountStatus === status
                            ? status === 'active'
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : status === 'inactive'
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : status === 'suspended'
                              ? 'border-orange-500 bg-orange-50 text-orange-700'
                              : 'border-yellow-500 bg-yellow-50 text-yellow-700'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-left">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-semibold ${
                              formData.accountStatus === status
                                ? status === 'active'
                                  ? 'text-green-700'
                                  : status === 'inactive'
                                  ? 'text-red-700'
                                  : status === 'suspended'
                                  ? 'text-orange-700'
                                  : 'text-yellow-700'
                                : 'text-gray-800'
                            }`}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                            {formData.accountStatus === status && (
                              status === 'active' ? (
                                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                              ) : status === 'inactive' ? (
                                <XCircleIcon className="h-5 w-5 text-red-500" />
                              ) : (
                                <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
                              )
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.accountStatus && (
                    <p className="mt-1 text-sm text-red-600">{errors.accountStatus}</p>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Review all changes before updating the user account.
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className={`px-6 py-2 bg-blue-600 text-white rounded-lg transition-colors flex items-center ${
                        saving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                      }`}
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="h-5 w-5 mr-2" />
                          Update User
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                Are you sure you want to delete user <span className="font-semibold">"{getDisplayName()}"</span>?
                This will permanently remove the user from the system.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className={`px-4 py-2 bg-red-600 text-white rounded-lg transition-colors flex items-center ${
                  deleting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                }`}
              >
                {deleting ? (
                  <>
                    <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <TrashIcon className="h-5 w-5 mr-2" />
                    Delete User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function for role colors
const getRoleColor = (role) => {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-800 border border-red-200";
    case "manager":
      return "bg-blue-100 text-blue-800 border border-blue-200";
    case "editor":
      return "bg-green-100 text-green-800 border border-green-200";
    case "user":
      return "bg-purple-100 text-purple-800 border border-purple-200";
    case "viewer":
      return "bg-gray-100 text-gray-800 border border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200";
  }
};

export default UserEdit;