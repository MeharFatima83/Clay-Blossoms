'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiPackage, 
  FiShoppingCart, 
  FiUsers, 
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiAlertTriangle,
  FiRefreshCw
} from 'react-icons/fi';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API + '/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    activeAlerts: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch inventory summary
      const inventoryRes = await axios.get(`${API_BASE_URL}/inventory/summary`);
      
      // Fetch orders (you may need to create this endpoint)
      const ordersRes = await axios.get(`${API_BASE_URL}/orders`);
      
      // Calculate stats
      const inventoryData = inventoryRes.data;
      const orders = ordersRes.data || [];
      
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      
      setStats({
        totalProducts: inventoryData.totalProducts || 0,
        totalOrders: orders.length,
        totalRevenue,
        lowStockProducts: inventoryData.lowStockProducts || 0,
        outOfStockProducts: inventoryData.outOfStockProducts || 0,
        activeAlerts: inventoryData.activeAlerts || 0
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      // Set default values to prevent further errors
      setStats({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0,
        activeAlerts: 0
      });
      setRecentOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 p-6">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-orange-700">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-orange-700">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome to ClayBlossoms Admin Panel</p>
          </div>
          <button
            onClick={fetchDashboardData}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white/90 rounded-2xl shadow-lg p-6 border-2 border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Products</p>
                <p className="text-2xl font-bold text-orange-700">{stats.totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <FiPackage className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/90 rounded-2xl shadow-lg p-6 border-2 border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-blue-700">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FiShoppingCart className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/90 rounded-2xl shadow-lg p-6 border-2 border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-green-700">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FiDollarSign className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/90 rounded-2xl shadow-lg p-6 border-2 border-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.lowStockProducts}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <FiTrendingDown className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/90 rounded-2xl shadow-lg p-6 border-2 border-red-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Out of Stock</p>
                <p className="text-2xl font-bold text-red-700">{stats.outOfStockProducts}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FiAlertTriangle className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/90 rounded-2xl shadow-lg p-6 border-2 border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Alerts</p>
                <p className="text-2xl font-bold text-purple-700">{stats.activeAlerts}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FiTrendingUp className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white/90 rounded-2xl shadow-lg p-6 border-2 border-orange-100 mb-8">
          <h2 className="text-xl font-bold text-orange-700 mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FiShoppingCart className="mx-auto mb-2 text-gray-400" size={32} />
              <p>No recent orders</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-orange-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-orange-700 font-semibold">Order ID</th>
                    <th className="py-3 px-4 text-left text-orange-700 font-semibold">Customer</th>
                    <th className="py-3 px-4 text-left text-orange-700 font-semibold">Amount</th>
                    <th className="py-3 px-4 text-left text-orange-700 font-semibold">Status</th>
                    <th className="py-3 px-4 text-left text-orange-700 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-orange-50 hover:bg-orange-50/40 transition">
                      <td className="py-3 px-4 font-medium text-gray-800">#{order._id.slice(-6)}</td>
                      <td className="py-3 px-4 text-gray-600">{order.customerName || 'N/A'}</td>
                      <td className="py-3 px-4 font-semibold text-green-600">₹{order.totalAmount || 0}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'completed' ? 'bg-green-100 text-green-700' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status || 'pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/90 rounded-2xl shadow-lg p-6 border-2 border-orange-100 text-center hover:shadow-xl transition cursor-pointer">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="text-orange-600" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Manage Products</h3>
            <p className="text-gray-600 text-sm">Add, edit, or remove products</p>
          </div>

          <div className="bg-white/90 rounded-2xl shadow-lg p-6 border-2 border-blue-100 text-center hover:shadow-xl transition cursor-pointer">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiShoppingCart className="text-blue-600" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">View Orders</h3>
            <p className="text-gray-600 text-sm">Track and manage orders</p>
          </div>

          <div className="bg-white/90 rounded-2xl shadow-lg p-6 border-2 border-green-100 text-center hover:shadow-xl transition cursor-pointer">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrendingUp className="text-green-600" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Inventory</h3>
            <p className="text-gray-600 text-sm">Monitor stock levels</p>
          </div>

          <div className="bg-white/90 rounded-2xl shadow-lg p-6 border-2 border-purple-100 text-center hover:shadow-xl transition cursor-pointer">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUsers className="text-purple-600" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Customers</h3>
            <p className="text-gray-600 text-sm">Manage customer data</p>
          </div>
        </div>
      </div>
    </div>
  );
}
