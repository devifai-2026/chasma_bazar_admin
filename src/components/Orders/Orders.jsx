import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  TruckIcon,
  EyeIcon,
  PrinterIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

const Orders = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const orders = [
    {
      id: "ORD-001",
      customer: "John Smith",
      date: "2024-01-15",
      amount: "₹125.00",
      status: "Completed",
      items: 3,
    },
    {
      id: "ORD-002",
      customer: "Emma Johnson",
      date: "2024-01-15",
      amount: "₹89.99",
      status: "Processing",
      items: 2,
    },
    {
      id: "ORD-003",
      customer: "Michael Brown",
      date: "2024-01-14",
      amount: "₹234.50",
      status: "Shipped",
      items: 5,
    },
    {
      id: "ORD-004",
      customer: "Sarah Davis",
      date: "2024-01-14",
      amount: "₹67.99",
      status: "Pending",
      items: 1,
    },
    {
      id: "ORD-005",
      customer: "David Wilson",
      date: "2024-01-13",
      amount: "₹156.75",
      status: "Completed",
      items: 4,
    },
    {
      id: "ORD-006",
      customer: "Lisa Miller",
      date: "2024-01-13",
      amount: "₹299.99",
      status: "Cancelled",
      items: 2,
    },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "Processing":
        return <ArrowPathIcon className="h-5 w-5 text-blue-500" />;
      case "Shipped":
        return <TruckIcon className="h-5 w-5 text-purple-500" />;
      case "Pending":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case "Cancelled":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to handle viewing order details
  const handleViewOrder = (orderId) => {
    navigate(`/orders/view/${orderId}`);
  };

  // Function to print order invoice
  const handlePrintOrder = (order) => {
    const printWindow = window.open("", "_blank");

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order.id}</title>
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
            min-width: 200px;
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
            <h1>Your Company Name</h1>
            <p>123 Business Street, City, Country</p>
            <p>Phone: (123) 456-7890 | Email: info@company.com</p>
          </div>
        </div>
        
        <div class="invoice-details">
          <div class="details-box">
            <h3>Invoice Details</h3>
            <div class="details-row">
              <span>Invoice Number:</span>
              <span><strong>${order.id}</strong></span>
            </div>
            <div class="details-row">
              <span>Date:</span>
              <span>${order.date}</span>
            </div>
            <div class="details-row">
              <span>Status:</span>
              <span>${order.status} 
                <span class="status-badge" style="background: ${
                  getStatusColor(order.status).split(" ")[0]
                }; color: ${getStatusColor(order.status).split(" ")[1]}">
                  ${order.status}
                </span>
              </span>
            </div>
          </div>
          
          <div class="details-box">
            <h3>Customer Information</h3>
            <div class="details-row">
              <span>Customer:</span>
              <span><strong>${order.customer}</strong></span>
            </div>
            <div class="details-row">
              <span>Items:</span>
              <span>${order.items}</span>
            </div>
            <div class="details-row">
              <span>Total Amount:</span>
              <span><strong>${order.amount}</strong></span>
            </div>
          </div>
        </div>
        
        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sample Product 1</td>
              <td>${order.items}</td>
              <td>₹${(
                parseFloat(order.amount.replace("₹", "")) / order.items
              ).toFixed(2)}</td>
              <td>${order.amount}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="total-section">
          <div class="total-row">
            <div class="details-row">
              <span>Subtotal:</span>
              <span>${order.amount}</span>
            </div>
            <div class="details-row">
              <span>Tax (10%):</span>
              <span>₹${(
                parseFloat(order.amount.replace("₹", "")) * 0.1
              ).toFixed(2)}</span>
            </div>
            <div class="details-row">
              <span>Shipping:</span>
              <span>₹5.00</span>
            </div>
            <div class="details-row">
              <span><strong>Total:</strong></span>
              <span><strong>₹${(
                parseFloat(order.amount.replace("₹", "")) * 1.1 +
                5
              ).toFixed(2)}</strong></span>
            </div>
            <div class="total-amount">
              Total: ₹${(
                parseFloat(order.amount.replace("₹", "")) * 1.1 +
                5
              ).toFixed(2)}
            </div>
          </div>
        </div>
        
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

  // Function to navigate to order update page
  const handleUpdateStatus = (orderId) => {
    navigate(`/orders/update/${orderId}`);
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
                  <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                  <p className="text-gray-600">
                    Manage and track customer orders
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  {getStatusIcon("Pending")}
                  <div className="ml-4">
                    <div className="text-sm text-gray-600">Pending</div>
                    <div className="text-2xl font-bold mt-1">12</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  {getStatusIcon("Processing")}
                  <div className="ml-4">
                    <div className="text-sm text-gray-600">Processing</div>
                    <div className="text-2xl font-bold mt-1">8</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  {getStatusIcon("Shipped")}
                  <div className="ml-4">
                    <div className="text-sm text-gray-600">Shipped</div>
                    <div className="text-2xl font-bold mt-1">15</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  {getStatusIcon("Completed")}
                  <div className="ml-4">
                    <div className="text-sm text-gray-600">Completed</div>
                    <div className="text-2xl font-bold mt-1">156</div>
                  </div>
                </div>
              </div>
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
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
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
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.id}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.items} items
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="h-8 w-8 rounded-full"
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${order.customer}`}
                              alt={order.customer}
                            />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {order.customer}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(order.status)}
                            <span
                              className={`ml-2 px-3 py-1 text-xs rounded-full ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewOrder(order.id)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                              title="View Details"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handlePrintOrder(order)}
                              className="p-1 text-green-600 hover:text-green-800"
                              title="Print Invoice"
                            >
                              <PrinterIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(order.id)}
                              className="p-1 text-gray-600 hover:text-gray-800"
                              title="Update Order"
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
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Order Activity
              </h2>
              <div className="space-y-4">
                {[
                  {
                    order: "ORD-001",
                    action: "Payment received",
                    time: "10 min ago",
                    color: "bg-green-500",
                  },
                  {
                    order: "ORD-002",
                    action: "Order shipped",
                    time: "2 hours ago",
                    color: "bg-blue-500",
                  },
                  {
                    order: "ORD-003",
                    action: "Order processing",
                    time: "3 hours ago",
                    color: "bg-yellow-500",
                  },
                  {
                    order: "ORD-004",
                    action: "New order placed",
                    time: "5 hours ago",
                    color: "bg-purple-500",
                  },
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-center">
                    <div
                      className={`h-3 w-3 rounded-full ${activity.color} mr-3`}
                    ></div>
                    <div className="flex-1">
                      <span className="font-medium">{activity.order}</span>
                      <span className="text-gray-600 ml-2">
                        {activity.action}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Orders;