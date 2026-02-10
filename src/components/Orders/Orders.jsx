import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  TruckIcon,
  EyeIcon,
  PrinterIcon,
  ArrowPathIcon,
  ShoppingBagIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { getAllOrders, updateOrderStatus } from "../../Api/orderApi";

const Orders = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  });
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });
  const [filters, setFilters] = useState({
    status: "",
    page: 1,
    limit: 10,
  });

  // Modal states
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  // Status options for dropdown
  const statusOptions = [
    { value: "pending", label: "Pending", color: "text-yellow-600" },
    { value: "processing", label: "Processing", color: "text-blue-600" },
    { value: "shipped", label: "Shipped", color: "text-purple-600" },
    { value: "delivered", label: "Delivered", color: "text-green-600" },
    { value: "cancelled", label: "Cancelled", color: "text-red-600" },
  ];

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllOrders(filters);
      if (response.success) {
        setOrders(response.data);
        setPagination({
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          total: response.total,
          limit: response.data.length,
        });
        // Set status counts from API response
        if (response.statusCounts) {
          setStatusCounts({
            pending: response.statusCounts.pending || 0,
            processing: response.statusCounts.processing || 0,
            shipped: response.statusCounts.shipped || 0,
            delivered: response.statusCounts.delivered || 0,
            cancelled: response.statusCounts.cancelled || 0,
          });
        }
      }
    } catch (err) {
      setError("Failed to fetch orders. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  // Function to open update modal
  const handleOpenUpdateModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowUpdateModal(true);
    setUpdateError(null);
    setUpdateSuccess(false);
  };

  // Function to close update modal
  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedOrder(null);
    setNewStatus("");
    setUpdateError(null);
    setUpdateSuccess(false);
  };

  // Function to update order status
  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      setUpdateLoading(true);
      setUpdateError(null);
      
      const response = await updateOrderStatus(selectedOrder._id, newStatus);
      
      if (response.success) {
        setUpdateSuccess(true);
        
        // Update the order in local state
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === selectedOrder._id
              ? { ...order, status: newStatus, isDelivered: newStatus === 'delivered' }
              : order
          )
        );
        
        // Refresh orders after a delay
        setTimeout(() => {
          fetchOrders();
          handleCloseUpdateModal();
        }, 1500);
      }
    } catch (err) {
      setUpdateError(err.message || "Failed to update order status");
    } finally {
      setUpdateLoading(false);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "processing":
        return <ArrowPathIcon className="h-5 w-5 text-blue-500" />;
      case "shipped":
        return <TruckIcon className="h-5 w-5 text-purple-500" />;
      case "pending":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case "cancelled":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  

  // Function to print order invoice
  const handlePrintOrder = (order) => {
    const printWindow = window.open("", "_blank");

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order.orderId}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #333;
          }
          .invoice-header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .company-info h1 {
            margin: 0;
            font-size: 28px;
            color: #1e40af;
          }
          .company-info p {
            margin: 5px 0;
            color: #666;
          }
          .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .details-box {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            width: 48%;
          }
          .details-box h3 {
            margin-top: 0;
            color: #1e40af;
          }
          .details-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
          }
          .items-table th {
            background: #1e40af;
            color: white;
            padding: 12px;
            text-align: left;
          }
          .items-table td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
          }
          .total-section {
            text-align: right;
            margin-top: 30px;
          }
          .total-row {
            display: inline-block;
            text-align: left;
            min-width: 300px;
          }
          .total-amount {
            font-size: 24px;
            font-weight: bold;
            color: #1e40af;
            margin-top: 10px;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            margin-left: 10px;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
          .section-title {
            margin-top: 30px;
            color: #1e40af;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
          }
          @media print {
            body {
              margin: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <div class="company-info">
            <h1>Chasma Bazar</h1>
            <p>123 Business Street, City, Country</p>
            <p>Phone: (123) 456-7890 | Email: info@company.com</p>
          </div>
        </div>
        
        <div class="invoice-details">
          <div class="details-box">
            <h3>Invoice Details</h3>
            <div class="details-row">
              <span>Order ID:</span>
              <span><strong>${order.orderId}</strong></span>
            </div>
            <div class="details-row">
              <span>Date:</span>
              <span>${formatDate(order.createdAt)}</span>
            </div>
            <div class="details-row">
              <span>Status:</span>
              <span>${getStatusText(order.status)} 
                <span class="status-badge" style="${getInlineStyleForStatus(order.status)}">
                  ${getStatusText(order.status)}
                </span>
              </span>
            </div>
            <div class="details-row">
              <span>Tracking Number:</span>
              <span>${order.trackingNumber || "N/A"}</span>
            </div>
            <div class="details-row">
              <span>Expected Delivery:</span>
              <span>${order.expectedDeliveryDate ? formatDate(order.expectedDeliveryDate) : "N/A"}</span>
            </div>
            ${order.actualDeliveryDate ? `
            <div class="details-row">
              <span>Actual Delivery:</span>
              <span>${formatDate(order.actualDeliveryDate)}</span>
            </div>
            ` : ""}
          </div>
          
          <div class="details-box">
            <h3>Customer Information</h3>
            <div class="details-row">
              <span>Customer:</span>
              <span><strong>${order.userId?.username || "N/A"}</strong></span>
            </div>
            <div class="details-row">
              <span>Email:</span>
              <span>${order.userId?.email || "N/A"}</span>
            </div>
            <div class="details-row">
              <span>Phone:</span>
              <span>${order.userId?.phone || "N/A"}</span>
            </div>
            <div class="details-row">
              <span>Items:</span>
              <span>${order.quantity}</span>
            </div>
            <div class="details-row">
              <span>Delivery Address:</span>
              <span>${order.address || "N/A"}</span>
            </div>
          </div>
        </div>
        
        <h3 class="section-title">Product Details</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Color</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${order.productId?.name || "Product"}</td>
              <td>${order.color || "N/A"}</td>
              <td>${order.quantity}</td>
              <td>${formatCurrency(order.pricing?.productPrice || 0)}</td>
              <td>${formatCurrency((order.pricing?.productPrice || 0) * order.quantity)}</td>
            </tr>
          </tbody>
        </table>
        
        <h3 class="section-title">Pricing Details</h3>
        <div class="total-section">
          <div class="total-row">
            <div class="details-row">
              <span>Product Price:</span>
              <span>${formatCurrency((order.pricing?.productPrice || 0) * order.quantity)}</span>
            </div>
            <div class="details-row">
              <span>Discounts:</span>
              <span>-${formatCurrency(order.pricing?.discounts?.totalDiscount || 0)}</span>
            </div>
            <div class="details-row">
              <span>Tax:</span>
              <span>${formatCurrency(order.pricing?.tax || 0)}</span>
            </div>
            <div class="details-row">
              <span>Shipping Charges:</span>
              <span>${formatCurrency(order.pricing?.shippingCharges || 0)}</span>
            </div>
            <div class="details-row">
              <span><strong>Total Amount:</strong></span>
              <span><strong>${formatCurrency(order.pricing?.totalAmount || 0)}</strong></span>
            </div>
            <div class="total-amount">
              Total: ${formatCurrency(order.pricing?.totalAmount || 0)}
            </div>
          </div>
        </div>
        
        ${order.cancellationReason ? `
        <h3 class="section-title">Cancellation Details</h3>
        <div class="details-box">
          <div class="details-row">
            <span>Cancellation Reason:</span>
            <span>${order.cancellationReason}</span>
          </div>
          ${order.cancelledAt ? `
          <div class="details-row">
            <span>Cancelled At:</span>
            <span>${formatDate(order.cancelledAt)}</span>
          </div>
          ` : ""}
        </div>
        ` : ""}
        
        <div class="footer">
          <p>Thank you for your business!</p>
          <p>This is a computer-generated invoice and does not require a signature.</p>
          <p>Printed on: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="no-print">
          <button onclick="window.print()" style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #1e40af;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
          ">
            Print Invoice
          </button>
          <button onclick="window.close()" style="
            position: fixed;
            bottom: 20px;
            right: 140px;
            background: #6b7280;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
          ">
            Close
          </button>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => {
              document.querySelector('.no-print').style.display = 'block';
            }, 1000);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const getInlineStyleForStatus = (status) => {
    const colorMap = {
      delivered: "background: #dcfce7; color: #166534;",
      processing: "background: #dbeafe; color: #1e40af;",
      shipped: "background: #f3e8ff; color: #7c3aed;",
      pending: "background: #fef3c7; color: #92400e;",
      cancelled: "background: #fee2e2; color: #991b1b;",
    };
    return colorMap[status] || "background: #f3f4f6; color: #374151;";
  };

  // Handle filter changes
  const handleStatusFilter = (status) => {
    setFilters({ ...filters, status: status || "", page: 1 });
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          closeSidebar={closeSidebar}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <ArrowPathIcon className="h-12 w-12 text-blue-500 animate-spin mx-auto" />
                <p className="mt-4 text-gray-600">Loading orders...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          closeSidebar={closeSidebar}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto" />
                <p className="mt-4 text-red-600">{error}</p>
                <button
                  onClick={fetchOrders}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Retry
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <>
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
                    <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-600">
                      Manage and track customer orders
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusFilter("")}
                      className={`px-4 py-2 rounded ${
                        filters.status === ""
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-700 border"
                      }`}
                    >
                      All
                    </button>
                    {["pending", "processing", "shipped", "delivered", "cancelled"].map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusFilter(status)}
                          className={`px-4 py-2 rounded capitalize ${
                            filters.status === status
                              ? "bg-blue-500 text-white"
                              : "bg-white text-gray-700 border"
                          }`}
                        >
                          {getStatusText(status)}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
                {["pending", "processing", "shipped", "delivered", "cancelled"].map(
                  (status) => (
                    <div key={status} className="bg-white p-6 rounded-lg shadow">
                      <div className="flex items-center">
                        {getStatusIcon(status)}
                        <div className="ml-4">
                          <div className="text-sm text-gray-600 capitalize">
                            {status}
                          </div>
                          <div className="text-2xl font-bold mt-1">
                            {statusCounts[status]}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product & Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Tracking
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pricing
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
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {order.orderId}
                            </div>
                            <div className="text-sm text-gray-500">
                              Qty: {order.quantity}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {order.userId?.username || "N/A"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {order.userId?.email || "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {order.productId?.name || "Product"}
                            </div>
                            <div className="text-sm text-gray-500">
                              Color: {order.color || "N/A"}
                            </div>
                            
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500">
                              Address: {order.address}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {formatDate(order.createdAt)}
                            </div>
                            
                            {order.expectedDeliveryDate && (
                              <div className="text-sm text-gray-500">
                                Expected: {formatDate(order.expectedDeliveryDate)}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(order.pricing?.totalAmount || 0)}
                            </div>
                            <div className="text-sm text-gray-500">
                              Discount: {formatCurrency(order.pricing?.discounts?.totalDiscount || 0)}
                            </div>
                            {order.pricing?.shippingCharges > 0 && (
                              <div className="text-sm text-gray-500">
                                Shipping: {formatCurrency(order.pricing?.shippingCharges || 0)}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {getStatusIcon(order.status)}
                              <span
                                className={`ml-2 px-3 py-1 text-xs rounded-full capitalize ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {getStatusText(order.status)}
                              </span>
                            </div>
                            {order.isDelivered && (
                              <div className="text-xs text-green-600 mt-1">
                                ✓ Delivered
                              </div>
                            )}
                            {order.isCancelled && (
                              <div className="text-xs text-red-600 mt-1">
                                ✗ Cancelled
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handlePrintOrder(order)}
                                className="p-1 text-green-600 hover:text-green-800"
                                title="Print Invoice"
                              >
                                <PrinterIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleOpenUpdateModal(order)}
                                className="p-1 text-gray-600 hover:text-gray-800"
                                title="Update Status"
                              >
                                <ArrowPathIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">
                          {(filters.page - 1) * filters.limit + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(filters.page * filters.limit, pagination.total)}
                        </span>{" "}
                        of <span className="font-medium">{pagination.total}</span>{" "}
                        orders
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePageChange(filters.page - 1)}
                          disabled={filters.page === 1}
                          className={`px-3 py-1 rounded ${
                            filters.page === 1
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 border hover:bg-gray-50"
                          }`}
                        >
                          Previous
                        </button>
                        {[...Array(pagination.totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-3 py-1 rounded ${
                              filters.page === i + 1
                                ? "bg-blue-500 text-white"
                                : "bg-white text-gray-700 border hover:bg-gray-50"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => handlePageChange(filters.page + 1)}
                          disabled={filters.page === pagination.totalPages}
                          className={`px-3 py-1 rounded ${
                            filters.page === pagination.totalPages
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 border hover:bg-gray-50"
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* No Orders Message */}
              {orders.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    No orders found
                  </h3>
                  <p className="mt-2 text-gray-500">
                    {filters.status
                      ? `No orders with status "${getStatusText(filters.status)}"`
                      : "No orders available"}
                  </p>
                </div>
              )}

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Order Activity
                </h2>
                <div className="space-y-4">
                  {orders.slice(0, 4).map((order) => (
                    <div key={order._id} className="flex items-center">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          order.status === "delivered"
                            ? "bg-green-500"
                            : order.status === "shipped"
                            ? "bg-blue-500"
                            : order.status === "processing"
                            ? "bg-yellow-500"
                            : order.status === "pending"
                            ? "bg-purple-500"
                            : "bg-gray-500"
                        } mr-3`}
                      ></div>
                      <div className="flex-1">
                        <span className="font-medium">{order.orderId}</span>
                        <span className="text-gray-600 ml-2">
                          Order {getStatusText(order.status).toLowerCase()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Update Status Modal */}
      {showUpdateModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Update Order Status
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Order ID: {selectedOrder.orderId}
                </p>
              </div>
              <button
                onClick={handleCloseUpdateModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {updateSuccess ? (
                <div className="text-center">
                  <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto" />
                  <h4 className="mt-4 text-lg font-medium text-gray-900">
                    Status Updated Successfully!
                  </h4>
                  <p className="mt-2 text-gray-600">
                    Order status has been updated to{" "}
                    <span className="font-semibold capitalize">{newStatus}</span>
                  </p>
                  <div className="mt-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Current Status */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Status
                    </label>
                    <div className="flex items-center">
                      {getStatusIcon(selectedOrder.status)}
                      <span
                        className={`ml-2 px-3 py-1 text-sm rounded-full capitalize ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </div>
                  </div>

                  {/* New Status Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {statusOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          className={option.color}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Order Summary
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-600">Customer:</div>
                      <div className="font-medium">
                        {selectedOrder.userId?.username || "N/A"}
                      </div>
                      <div className="text-gray-600">Product:</div>
                      <div className="font-medium">
                        {selectedOrder.productId?.name || "Product"}
                      </div>
                      <div className="text-gray-600">Amount:</div>
                      <div className="font-medium">
                        {formatCurrency(selectedOrder.pricing?.totalAmount || 0)}
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {updateError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{updateError}</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t rounded-b-lg">
              {updateSuccess ? (
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Closing automatically...
                  </p>
                </div>
              ) : (
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseUpdateModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateStatus}
                    disabled={updateLoading || newStatus === selectedOrder.status}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      updateLoading || newStatus === selectedOrder.status
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {updateLoading ? (
                      <span className="flex items-center">
                        <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" />
                        Updating...
                      </span>
                    ) : (
                      "Update Status"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Orders;