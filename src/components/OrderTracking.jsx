import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Truck, MessageSquare, RotateCcw, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/firebaseService';

export default function OrderTracking({ onClose }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  // Sample orders for demonstration
  const sampleOrders = [
    {
      id: 'ORD001',
      orderDate: new Date(Date.now() - 86400000),
      status: 'pending_payment',
      totalAmount: 125.50,
      items: [
        { name: 'Premium Foundation', quantity: 1, price: 32.99 },
        { name: 'Lipstick Set', quantity: 2, price: 38.99 },
      ],
    },
    {
      id: 'ORD002',
      orderDate: new Date(Date.now() - 172800000),
      status: 'in_transit',
      totalAmount: 89.99,
      items: [{ name: 'Running Sneakers', quantity: 1, price: 89.99 }],
    },
    {
      id: 'ORD003',
      orderDate: new Date(Date.now() - 259200000),
      status: 'pending_feedback',
      totalAmount: 45.99,
      items: [{ name: 'Athletic Leggings', quantity: 1, price: 45.99 }],
    },
    {
      id: 'ORD004',
      orderDate: new Date(Date.now() - 604800000),
      status: 'all',
      totalAmount: 155.98,
      items: [
        { name: 'Stylish Handbag', quantity: 1, price: 55.99 },
        { name: 'Women Casual Sneaker', quantity: 1, price: 65.99 },
      ],
    },
  ];

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        // Replace with actual Firebase call: const orders = await orderService.getUserOrders(user.uid);
        setOrders(sampleOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadOrders();
    }
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending_payment':
        return <Clock size={20} className="text-yellow-500" />;
      case 'in_transit':
        return <Truck size={20} className="text-blue-500" />;
      case 'pending_feedback':
        return <MessageSquare size={20} className="text-purple-500" />;
      case 'return_refund':
        return <RotateCcw size={20} className="text-red-500" />;
      default:
        return <Clock size={20} className="text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending_payment: 'Pending Payment',
      in_transit: 'In Transit',
      pending_feedback: 'Pending Feedback',
      return_refund: 'Return & Refund',
    };
    return statusMap[status] || status;
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  if (selectedOrder) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center md:justify-center overflow-y-auto">
        <div className="bg-white w-full md:max-w-md rounded-t-lg md:rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center gap-2 p-4 border-b border-gray-200 sticky top-0 bg-white">
            <button
              onClick={() => setSelectedOrder(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-lg font-bold">Order {selectedOrder.id}</h2>
          </div>

          {/* Order Details */}
          <div className="p-4 space-y-4">
            {/* Status */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {getStatusIcon(selectedOrder.status)}
              <div>
                <p className="text-xs text-gray-600">Order Status</p>
                <p className="font-semibold text-gray-800">{getStatusText(selectedOrder.status)}</p>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Items</h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name} x {item.quantity}</span>
                    <span className="font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-3">
              <div className="flex justify-between">
                <span className="font-semibold">Total Amount</span>
                <span className="text-lg font-bold text-primary">${selectedOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Order Date */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">Ordered on</p>
              <p className="text-sm font-semibold text-gray-800">
                {selectedOrder.orderDate.toLocaleDateString()}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center md:justify-center overflow-y-auto">
      <div className="bg-white w-full md:max-w-md rounded-t-lg md:rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-lg font-bold">My Orders</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="px-4 pt-3 sticky top-16 bg-white border-b border-gray-200">
          <div className="flex gap-2 overflow-x-auto pb-3 scroll-smooth">
            {[
              { id: 'all', label: 'All' },
              { id: 'pending_payment', label: 'Pending Payment' },
              { id: 'in_transit', label: 'In Transit' },
              { id: 'pending_feedback', label: 'Feedback' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="p-4 space-y-3">
          {loading ? (
            <p className="text-center text-gray-500">Loading orders...</p>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <button
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="w-full text-left border border-gray-300 rounded-lg p-3 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">Order {order.id}</p>
                    <p className="text-xs text-gray-500">{order.orderDate.toLocaleDateString()}</p>
                  </div>
                  {getStatusIcon(order.status)}
                </div>
                <p className="text-xs text-gray-600 mb-2">{getStatusText(order.status)}</p>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-600">{order.items.length} item(s)</p>
                  <p className="font-bold text-primary">${order.totalAmount.toFixed(2)}</p>
                </div>
              </button>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No orders found</p>
          )}
        </div>
      </div>
    </div>
  );
}
