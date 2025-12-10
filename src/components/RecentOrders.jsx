const RecentOrders = () => {
  const orders = [
    { id: '#ORD-001', customer: 'John Doe', date: '2024-01-15', amount: '₹125.00', status: 'Completed' },
    { id: '#ORD-002', customer: 'Jane Smith', date: '2024-01-14', amount: '₹89.99', status: 'Pending' },
    { id: '#ORD-003', customer: 'Bob Johnson', date: '2024-01-14', amount: '₹234.50', status: 'Completed' },
    { id: '#ORD-004', customer: 'Alice Brown', date: '2024-01-13', amount: '₹67.99', status: 'Processing' },
    { id: '#ORD-005', customer: 'Charlie Wilson', date: '2024-01-13', amount: '₹156.75', status: 'Completed' },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Processing':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Recent Orders</h2>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          View all →
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="pb-3 text-left text-sm font-medium text-gray-600">Order ID</th>
              <th className="pb-3 text-left text-sm font-medium text-gray-600">Customer</th>
              <th className="pb-3 text-left text-sm font-medium text-gray-600">Date</th>
              <th className="pb-3 text-left text-sm font-medium text-gray-600">Amount</th>
              <th className="pb-3 text-left text-sm font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-3 text-sm font-medium">{order.id}</td>
                <td className="py-3 text-sm text-gray-600">{order.customer}</td>
                <td className="py-3 text-sm text-gray-600">{order.date}</td>
                <td className="py-3 text-sm font-medium">{order.amount}</td>
                <td className="py-3">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecentOrders