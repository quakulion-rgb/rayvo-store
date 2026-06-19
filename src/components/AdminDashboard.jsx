import React, { useState } from 'react';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { orderService } from '../services/firebaseService';

export default function AdminDashboard({ onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      customer: 'John Doe',
      email: 'john@example.com',
      product: 'Premium Foundation',
      amount: 32.99,
      status: 'pending_payment',
      address: '123 Main St, New York, NY 10001',
      date: new Date(),
    },
    {
      id: 'ORD002',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      product: 'Running Sneakers',
      amount: 89.99,
      status: 'in_transit',
      address: '456 Oak Ave, Los Angeles, CA 90001',
      date: new Date(Date.now() - 86400000),
    },
  ]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending_payment: 'bg-yellow-100 text-yellow-800',
      in_transit: 'bg-blue-100 text-blue-800',
      pending_feedback: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
    };
    return statusStyles[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending_payment: 'Pending Payment',
      in_transit: 'In Transit',
      pending_feedback: 'Pending Feedback',
      completed: 'Completed',
    };
    return statusMap[status] || status;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-2 p-4 border-b border-gray-200 sticky top-0 bg-white">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-lg font-bold">Admin Dashboard</h2>
        </div>

        {/* Search and Filter */}
        <div className="p-4 border-b border-gray-200 space-y-3 sticky top-14 bg-white">
          <div className="flex gap-2">
            <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search orders, products, customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ml-2 bg-transparent outline-none flex-1 text-sm"
              />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Filter size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'pending_payment', label: 'Pending Payment' },
              { id: 'in_transit', label: 'In Transit' },
              { id: 'completed', label: 'Completed' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setStatusFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                  statusFilter === filter.id
                    ? 'bg-secondary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Order ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Customer</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Product</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer"
                >
                  <td className="px-4 py-3 font-semibold text-gray-800">{order.id}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-800">{order.customer}</p>
                      <p className="text-xs text-gray-500">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 truncate max-w-xs">{order.product}</td>
                  <td className="px-4 py-3 font-semibold text-primary">${order.amount.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No orders found</p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Total Orders</p>
            <p className="text-xl font-bold text-gray-800">{orders.length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
            <p className="text-xl font-bold text-primary">
              ${orders.reduce((sum, order) => sum + order.amount, 0).toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Pending</p>
            <p className="text-xl font-bold text-yellow-600">
              {orders.filter((o) => o.status === 'pending_payment').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
