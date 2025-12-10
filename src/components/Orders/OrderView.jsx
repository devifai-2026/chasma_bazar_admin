import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  TruckIcon,
  PrinterIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'
import Sidebar from '../Sidebar'
import Navbar from '../Navbar'

const OrderView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  // Mock order data for ALL orders
  const mockOrders = {
    'ORD-001': {
      id: 'ORD-001',
      customer: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
      date: '2024-01-15',
      time: '14:30',
      amount: '₹125.00',
      status: 'Completed',
      paymentMethod: 'Credit Card',
      shippingMethod: 'Express Delivery',
      shippingAddress: '123 Main St, New York, NY 10001',
      billingAddress: '123 Main St, New York, NY 10001',
      items: [
        { id: 1, name: 'Wireless Headphones', price: '₹59.99', quantity: 1, total: '₹59.99', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=headphones' },
        { id: 2, name: 'USB-C Cable', price: '₹19.99', quantity: 2, total: '₹39.98', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=cable' },
        { id: 3, name: 'Phone Case', price: '₹25.03', quantity: 1, total: '₹25.03', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=case' }
      ],
      subtotal: '₹124.00',
      shipping: '₹5.00',
      tax: '₹10.00',
      total: '₹139.00'
    },
    'ORD-002': {
      id: 'ORD-002',
      customer: 'Emma Johnson',
      email: 'emma.j@example.com',
      phone: '+1 (555) 987-6543',
      date: '2024-01-15',
      time: '11:15',
      amount: '₹89.99',
      status: 'Processing',
      paymentMethod: 'PayPal',
      shippingMethod: 'Standard Shipping',
      shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
      billingAddress: '456 Oak Ave, Los Angeles, CA 90001',
      items: [
        { id: 1, name: 'T-shirt', price: '₹24.99', quantity: 2, total: '₹49.98', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=tshirt' },
        { id: 2, name: 'Coffee Mug', price: '₹19.99', quantity: 2, total: '₹39.98', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=mug' }
      ],
      subtotal: '₹89.96',
      shipping: '₹0.00',
      tax: '₹8.10',
      total: '₹98.06'
    },
    'ORD-003': {
      id: 'ORD-003',
      customer: 'Michael Brown',
      email: 'michael.b@example.com',
      phone: '+1 (555) 456-7890',
      date: '2024-01-14',
      time: '09:45',
      amount: '₹234.50',
      status: 'Shipped',
      paymentMethod: 'Credit Card',
      shippingMethod: 'Express Delivery',
      shippingAddress: '789 Pine Rd, Chicago, IL 60601',
      billingAddress: '789 Pine Rd, Chicago, IL 60601',
      items: [
        { id: 1, name: 'Laptop', price: '₹999.99', quantity: 1, total: '₹999.99', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=laptop' },
        { id: 2, name: 'Mouse', price: '₹29.99', quantity: 1, total: '₹29.99', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=mouse' },
        { id: 3, name: 'Keyboard', price: '₹89.99', quantity: 1, total: '₹89.99', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=keyboard' },
        { id: 4, name: 'Monitor', price: '₹299.99', quantity: 1, total: '₹299.99', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=monitor' },
        { id: 5, name: 'Webcam', price: '₹59.99', quantity: 1, total: '₹59.99', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=webcam' }
      ],
      subtotal: '₹1479.95',
      shipping: '₹15.00',
      tax: '₹134.40',
      total: '₹1629.35'
    },
    'ORD-004': {
      id: 'ORD-004',
      customer: 'Sarah Davis',
      email: 'sarah.d@example.com',
      phone: '+1 (555) 789-0123',
      date: '2024-01-14',
      time: '16:20',
      amount: '₹67.99',
      status: 'Pending',
      paymentMethod: 'Debit Card',
      shippingMethod: 'Standard Shipping',
      shippingAddress: '321 Elm St, Miami, FL 33101',
      billingAddress: '321 Elm St, Miami, FL 33101',
      items: [
        { id: 1, name: 'Sunglasses', price: '₹67.99', quantity: 1, total: '₹67.99', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=sunglasses' }
      ],
      subtotal: '₹67.99',
      shipping: '₹5.00',
      tax: '₹6.12',
      total: '₹79.11'
    },
    'ORD-005': {
      id: 'ORD-005',
      customer: 'David Wilson',
      email: 'david.w@example.com',
      phone: '+1 (555) 234-5678',
      date: '2024-01-13',
      time: '13:10',
      amount: '₹156.75',
      status: 'Completed',
      paymentMethod: 'Credit Card',
      shippingMethod: 'Express Delivery',
      shippingAddress: '654 Maple Ave, Seattle, WA 98101',
      billingAddress: '654 Maple Ave, Seattle, WA 98101',
      items: [
        { id: 1, name: 'Smart Watch', price: '₹199.99', quantity: 1, total: '₹199.99', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=watch' },
        { id: 2, name: 'Tablet', price: '₹329.99', quantity: 1, total: '₹329.99', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=tablet' },
        { id: 3, name: 'Phone Charger', price: '₹19.99', quantity: 2, total: '₹39.98', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=charger' },
        { id: 4, name: 'Bluetooth Speaker', price: '₹89.99', quantity: 1, total: '₹89.99', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=speaker' }
      ],
      subtotal: '₹659.95',
      shipping: '₹10.00',
      tax: '₹59.40',
      total: '₹729.35'
    },
    'ORD-006': {
      id: 'ORD-006',
      customer: 'Lisa Miller',
      email: 'lisa.m@example.com',
      phone: '+1 (555) 876-5432',
      date: '2024-01-13',
      time: '10:05',
      amount: '₹299.99',
      status: 'Cancelled',
      paymentMethod: 'PayPal',
      shippingMethod: 'Standard Shipping',
      shippingAddress: '987 Cedar Ln, Denver, CO 80201',
      billingAddress: '987 Cedar Ln, Denver, CO 80201',
      items: [
        { id: 1, name: 'Gaming Console', price: '₹499.99', quantity: 1, total: '₹499.99', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=console' },
        { id: 2, name: 'Game Controller', price: '₹59.99', quantity: 1, total: '₹59.99', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=controller' }
      ],
      subtotal: '₹559.98',
      shipping: '₹0.00',
      tax: '₹50.40',
      total: '₹610.38'
    }
  }

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const orderData = mockOrders[id]
      setOrder(orderData)
      setLoading(false)
    }, 500)
  }, [id])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'Processing': return <ClockIcon className="h-5 w-5 text-blue-500" />
      case 'Shipped': return <TruckIcon className="h-5 w-5 text-purple-500" />
      case 'Pending': return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'Cancelled': return <XCircleIcon className="h-5 w-5 text-red-500" />
      default: return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Processing': return 'bg-blue-100 text-blue-800'
      case 'Shipped': return 'bg-purple-100 text-purple-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Function to print invoice from OrderView page
  const handlePrintInvoice = () => {
    if (!order) return
    
    const printWindow = window.open('', '_blank')
    
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
              <span>${order.date} at ${order.time}</span>
            </div>
            <div class="details-row">
              <span>Status:</span>
              <span>${order.status}</span>
            </div>
          </div>
          
          <div class="details-box">
            <h3>Customer Information</h3>
            <div class="details-row">
              <span>Customer:</span>
              <span><strong>${order.customer}</strong></span>
            </div>
            <div class="details-row">
              <span>Email:</span>
              <span>${order.email}</span>
            </div>
            <div class="details-row">
              <span>Phone:</span>
              <span>${order.phone}</span>
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
            ${order.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price}</td>
                <td>${item.total}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="total-section">
          <div class="total-row">
            <div class="details-row">
              <span>Subtotal:</span>
              <span>${order.subtotal}</span>
            </div>
            <div class="details-row">
              <span>Shipping:</span>
              <span>${order.shipping}</span>
            </div>
            <div class="details-row">
              <span>Tax:</span>
              <span>${order.tax}</span>
            </div>
            <div class="details-row">
              <span><strong>Total:</strong></span>
              <span><strong>${order.total}</strong></span>
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
    `
    
    printWindow.document.write(printContent)
    printWindow.document.close()
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading order details...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-red-600">Order not found</div>
        <button 
          onClick={() => navigate('/orders')}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Orders
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className={`flex-1 overflow-y-auto bg-gray-50 p-6 transition-all duration-300 ${sidebarOpen ? 'lg:pl-6' : 'lg:pl-6'}`}>
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center">
                  <button
                    onClick={() => navigate('/orders')}
                    className="mr-4 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
                    <p className="text-gray-600">Order ID: #{order.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    {getStatusIcon(order.status)}
                    <span className={`ml-2 px-3 py-1 text-sm rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <button 
                    onClick={handlePrintInvoice}
                    className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    title="Print Invoice"
                  >
                    <PrinterIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Order Summary */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items ({order.items.length})</h2>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center">
                          <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover mr-4" />
                          <div>
                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{item.total}</div>
                          <div className="text-sm text-gray-500">{item.price} each</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Totals */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">{order.subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">{order.shipping}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">{order.tax}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t text-lg font-bold">
                        <span>Total</span>
                        <span>{order.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Details Sidebar */}
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <img
                        className="h-12 w-12 rounded-full"
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${order.customer}`}
                        alt={order.customer}
                      />
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">{order.customer}</div>
                        <div className="text-sm text-gray-500">Customer ID: CUST-{order.id.slice(-3)}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{order.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{order.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping & Billing */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping & Billing</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Shipping Address</h3>
                      <div className="flex items-start">
                        <MapPinIcon className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                        <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Billing Address</h3>
                      <div className="flex items-start">
                        <MapPinIcon className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                        <p className="text-sm text-gray-600">{order.billingAddress}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Payment Method</h3>
                      <div className="flex items-center">
                        <CreditCardIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{order.paymentMethod}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Shipping Method</h3>
                      <div className="flex items-center">
                        <TruckIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{order.shippingMethod}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Timeline */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-3"></div>
                      <div className="flex-1">
                        <div className="font-medium">Order Placed</div>
                        <div className="text-sm text-gray-500">{order.date} at {order.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className={`h-3 w-3 rounded-full ${order.status === 'Completed' || order.status === 'Shipped' ? 'bg-green-500' : 'bg-gray-300'} mr-3`}></div>
                      <div className="flex-1">
                        <div className="font-medium">Payment Confirmed</div>
                        <div className="text-sm text-gray-500">{order.date} at {order.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className={`h-3 w-3 rounded-full ${order.status === 'Completed' || order.status === 'Shipped' ? 'bg-green-500' : order.status === 'Processing' ? 'bg-blue-500' : 'bg-gray-300'} mr-3`}></div>
                      <div className="flex-1">
                        <div className="font-medium">Order Processing</div>
                        <div className="text-sm text-gray-500">{order.status === 'Processing' ? 'Currently processing' : order.status === 'Shipped' || order.status === 'Completed' ? '2024-01-15 at 15:30' : 'Pending'}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className={`h-3 w-3 rounded-full ${order.status === 'Completed' || order.status === 'Shipped' ? 'bg-green-500' : 'bg-gray-300'} mr-3`}></div>
                      <div className="flex-1">
                        <div className="font-medium">Order Shipped</div>
                        <div className="text-sm text-gray-500">{order.status === 'Shipped' || order.status === 'Completed' ? '2024-01-16 at 09:15' : 'Not yet shipped'}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className={`h-3 w-3 rounded-full ${order.status === 'Completed' ? 'bg-green-500' : 'bg-gray-300'} mr-3`}></div>
                      <div className="flex-1">
                        <div className="font-medium">Order Delivered</div>
                        <div className="text-sm text-gray-500">{order.status === 'Completed' ? '2024-01-17 at 16:20' : 'Not yet delivered'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default OrderView