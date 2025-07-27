"use client";
import React, { useState, useEffect } from "react";
import { FiEye, FiTrash2, FiEdit, FiRefreshCw } from "react-icons/fi";

export default function PlacedOrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState("");
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/orders/`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    
    try {
      setDeleting(id);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/orders/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order');
    } finally {
      setDeleting("");
    }
  };

  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setShowEditModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/orders/${selectedOrder._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: editStatus })
      });
      if (!response.ok) throw new Error('Failed to update status');
      const updatedOrder = await response.json();
      setOrders((prev) => prev.map((o) => o._id === updatedOrder._id ? updatedOrder : o));
      setShowEditModal(false);
      setSelectedOrder(null);
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-purple-100 text-purple-700';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-orange-700">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 p-6 rounded-2xl shadow-xl border-2 border-orange-100">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-orange-700">Placed Orders</h1>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition flex items-center gap-2"
        >
          <FiRefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-16 text-lg text-gray-700">No orders found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white/90 rounded-xl shadow border border-orange-100">
            <thead>
              <tr className="bg-orange-100 text-orange-700">
                <th className="py-3 px-4 text-left">Order Number</th>
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Address</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Total (₹)</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Payment</th>
                <th className="py-3 px-4 text-left">Placed At</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-orange-50 hover:bg-orange-50/40 transition">
                  <td className="py-2 px-4 font-semibold text-orange-800">{order.orderNumber}</td>
                  <td className="py-2 px-4">
                    <div>
                      <div className="font-medium">{order.customerDetails.name}</div>
                      <div className="text-sm text-gray-600">{order.customerDetails.email}</div>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="text-sm">
                      <div>{order.customerDetails.address}</div>
                      <div className="text-gray-600">
                        {order.customerDetails.city}, {order.customerDetails.state} - {order.customerDetails.pincode}
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4">{order.customerDetails.phone}</td>
                  <td className="py-2 px-4 font-medium text-pink-600">₹{order.total}</td>
                  <td className="py-2 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <div className="text-sm">
                      <div className="font-medium">{order.paymentMethod.toUpperCase()}</div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 
                        order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4 text-sm">{formatDate(order.createdAt)}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                      title="View Details"
                      onClick={() => {
                        // TODO: Implement view order details modal/page
                        alert(`Order Details for ${order.orderNumber}\nItems: ${order.items.length}\nStatus: ${order.status}`);
                      }}
                    >
                      <FiEye size={18} />
                    </button>
                    <button
                      className="p-2 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 transition"
                      title="Update Status"
                      onClick={() => handleEditClick(order)}
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(order._id)}
                      className={`p-2 rounded-lg bg-pink-100 text-pink-700 hover:bg-pink-200 transition ${deleting === order._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title="Delete Order"
                      disabled={deleting === order._id}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Edit Status Modal */}
      {showEditModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Update Order Status</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Number</label>
              <div className="font-semibold text-orange-700 mb-2">{selectedOrder.orderNumber}</div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={editStatus}
                onChange={e => setEditStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="Pending Payment">Pending Payment</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                disabled={updating}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                disabled={updating}
              >
                {updating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}