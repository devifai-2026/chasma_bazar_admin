import React, { useState } from 'react';

const RecentOrders = ({ orders, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format status to be more user-friendly
  const formatStatus = (status) => {
    switch (status) {
      case 'shipped':
        return 'Shipped';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'shipped':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format customer name from user data
  const getCustomerName = (user) => {
    if (!user) return 'N/A';
    return user.email.split('@')[0]; // Using email prefix as name
  };

  // Calculate total pages
  const totalPages = Math.ceil((orders?.length || 0) / ordersPerPage);

  // Get current orders for the page
  const getCurrentOrders = () => {
    if (!orders || orders.length === 0) return [];
    
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    return orders.slice(startIndex, endIndex);
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Render page numbers
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbers = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
    let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

    // Adjust if we're at the end
    if (endPage - startPage + 1 < maxPageNumbers) {
      startPage = Math.max(1, endPage - maxPageNumbers + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            currentPage === i
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          } border border-gray-300`}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800">
            View all →
          </button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <p className="text-sm text-gray-500">
            Showing {((currentPage - 1) * ordersPerPage) + 1} to{' '}
            {Math.min(currentPage * ordersPerPage, orders?.length || 0)} of{' '}
            {orders?.length || 0} orders
          </p>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-800 mt-2 sm:mt-0">
          View all →
        </button>
      </div>
      
      <div className="overflow-x-auto mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="pb-3 text-left text-sm font-medium text-gray-600">Order ID</th>
              <th className="pb-3 text-left text-sm font-medium text-gray-600">Customer</th>
              <th className="pb-3 text-left text-sm font-medium text-gray-600">Product</th>
              <th className="pb-3 text-left text-sm font-medium text-gray-600">Date</th>
              <th className="pb-3 text-left text-sm font-medium text-gray-600">Amount</th>
              <th className="pb-3 text-left text-sm font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {getCurrentOrders().length > 0 ? (
              getCurrentOrders().map((order) => (
                <tr key={order._id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 text-sm font-medium">
                    {order.orderId ? order.orderId.substring(0, 8) + '...' : 'N/A'}
                  </td>
                  <td className="py-3 text-sm text-gray-600">
                    {getCustomerName(order.userId)}
                  </td>
                  <td className="py-3 text-sm text-gray-600">
                    {order.productId?.name || 'N/A'}
                  </td>
                  <td className="py-3 text-sm text-gray-600">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-3 text-sm font-medium">
                    ₹{order.pricing?.totalAmount?.toLocaleString('en-IN') || '0'}
                  </td>
                  <td className="py-3">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                      {formatStatus(order.status)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-500">
                  No recent orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between border-t pt-6">
          <div className="text-sm text-gray-700 mb-4 sm:mb-0">
            Showing page {currentPage} of {totalPages}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } border border-gray-300 flex items-center`}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex space-x-1">
              {renderPageNumbers()}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } border border-gray-300 flex items-center`}
            >
              Next
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentOrders;