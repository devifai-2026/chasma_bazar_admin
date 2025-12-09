import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  KeyIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    role: 'Viewer',
    status: 'Active',
    department: '',
    joinDate: '',
    permissions: []
  });

  const [errors, setErrors] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const roles = [
    { value: 'Admin', label: 'Administrator', description: 'Full system access' },
    { value: 'Manager', label: 'Manager', description: 'Manage users and content' },
    { value: 'Editor', label: 'Editor', description: 'Create and edit content' },
    { value: 'Viewer', label: 'Viewer', description: 'View only access' },
  ];

  const permissionsList = [
    { id: 'dashboard', label: 'Dashboard Access' },
    { id: 'products', label: 'Product Management' },
    { id: 'orders', label: 'Order Management' },
    { id: 'categories', label: 'Category Management' },
    { id: 'invoices', label: 'Invoice Management' },
    { id: 'documents', label: 'Document Management' },
    { id: 'users', label: 'User Management' },
    { id: 'settings', label: 'System Settings' },
  ];

  const departments = [
    'Sales',
    'Marketing',
    'IT',
    'Finance',
    'HR',
    'Operations',
    'Customer Support',
    'Management'
  ];

  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const user = savedUsers.find(u => u.id === parseInt(id));
        
        if (user) {
          setFormData({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            role: user.role,
            status: user.status,
            department: user.department || '',
            joinDate: user.joinDate,
            permissions: user.permissions || ['dashboard']
          });
        } else {
          alert('User not found!');
          navigate('/users');
        }
      } catch (error) {
        console.error('Error loading user:', error);
        alert('Error loading user data');
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
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePermissionChange = (permissionId) => {
    setFormData(prev => {
      const newPermissions = prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId];
      return { ...prev, permissions: newPermissions };
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[\d\s\+\-\(\)]+$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
    
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.department) newErrors.department = 'Department is required';

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
      // Get existing users from localStorage
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Update the user
      const updatedUsers = existingUsers.map(user => 
        user.id === parseInt(id) ? formData : user
      );
      
      // Save to localStorage
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Dispatch storage event to notify other tabs/components
      window.dispatchEvent(new Event('storage'));
      
      // Show success message
      alert(`User "${formData.name}" has been updated successfully!`);
      
      // Navigate back to users list
      navigate('/users');
      
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user. Please try again.');
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
      // Get existing users from localStorage
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Filter out the user to delete
      const updatedUsers = existingUsers.filter(user => user.id !== parseInt(id));
      
      // Save to localStorage
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Dispatch storage event to notify other tabs/components
      window.dispatchEvent(new Event('storage'));
      
      // Show success message
      alert(`User "${formData.name}" has been deleted successfully!`);
      
      // Navigate back to users list
      navigate('/users');
      
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user. Please try again.');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const getPermissionsForRole = (role) => {
    switch(role) {
      case 'Admin': return permissionsList.map(p => p.id);
      case 'Manager': return ['dashboard', 'products', 'orders', 'categories', 'invoices', 'documents'];
      case 'Editor': return ['dashboard', 'products', 'categories', 'documents'];
      case 'Viewer': return ['dashboard'];
      default: return ['dashboard'];
    }
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      role,
      permissions: getPermissionsForRole(role)
    }));
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
                    Update user information for {formData.name}
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
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`}
                    alt={formData.name}
                  />
                  <div className="ml-4">
                    <h2 className="text-xl font-bold text-gray-900">{formData.name}</h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`px-3 py-1 text-xs rounded-full ${getRoleColor(formData.role)}`}>
                        {formData.role}
                      </span>
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        formData.status === 'Active' 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {formData.status}
                      </span>
                      <span className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-full border border-gray-200">
                        Joined: {formatDate(formData.joinDate)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">User ID</div>
                  <div className="text-2xl font-bold text-gray-900">#{formData.id.toString().padStart(3, '0')}</div>
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
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
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

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
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

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.department ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    {errors.department && (
                      <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Role & Permissions Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <ShieldCheckIcon className="h-6 w-6 mr-2 text-purple-600" />
                  Role & Permissions
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
                        onClick={() => handleRoleChange(role.value)}
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

                {/* Status */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Account Status
                  </label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, status: 'Active' }))}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                        formData.status === 'Active'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, status: 'Inactive' }))}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                        formData.status === 'Inactive'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <XCircleIcon className="h-5 w-5 mr-2" />
                      Inactive
                    </button>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Module Permissions
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {permissionsList.map((permission) => (
                      <div key={permission.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={permission.id}
                          checked={formData.permissions.includes(permission.id)}
                          onChange={() => handlePermissionChange(permission.id)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor={permission.id}
                          className="ml-3 text-sm text-gray-700 cursor-pointer"
                        >
                          {permission.label}
                        </label>
                      </div>
                    ))}
                  </div>
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
                Are you sure you want to delete user <span className="font-semibold">"{formData.name}"</span>?
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

export default UserEdit;