'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiPackage, 
  FiAlertTriangle, 
  FiTrendingDown, 
  FiTrendingUp,
  FiRefreshCw,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiEdit,
  FiPlus,
  FiMinus,
  FiCheck,
  FiX,
  FiDatabase
} from 'react-icons/fi';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API + '/api/inventory';

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [summary, setSummary] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [initializing, setInitializing] = useState(false);

  // Stock update form
  const [stockForm, setStockForm] = useState({
    quantity: '',
    movementType: 'restock',
    reason: '',
    cost: ''
  });

  // Alert resolution form
  const [alertForm, setAlertForm] = useState({
    actionTaken: '',
    resolvedBy: 'admin'
  });

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [summaryRes, inventoryRes, alertsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/summary`),
        axios.get(`${API_BASE_URL}/all`),
        axios.get(`${API_BASE_URL}/alerts`)
      ]);

      setSummary(summaryRes.data);
      setInventory(inventoryRes.data.inventory || []);
      setAlerts(alertsRes.data);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      setError('Failed to load inventory data. You may need to initialize inventory first.');
      // Set default values to prevent further errors
      setSummary({
        totalProducts: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0,
        activeAlerts: 0,
        totalInventoryValue: 0
      });
      setInventory([]);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const initializeInventory = async () => {
    try {
      setInitializing(true);
      setError('');
      
      const response = await axios.post(`${API_BASE_URL}/initialize-all`);
      
      if (response.data.success) {
        setError('');
        await fetchInventoryData(); // Refresh data after initialization
      }
    } catch (error) {
      console.error('Error initializing inventory:', error);
      setError('Failed to initialize inventory. Please try again.');
    } finally {
      setInitializing(false);
    }
  };

  const handleStockUpdate = async (productId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/update-stock`, {
        productId,
        quantity: parseInt(stockForm.quantity),
        movementType: stockForm.movementType,
        reason: stockForm.reason,
        performedBy: 'admin',
        cost: stockForm.cost ? parseFloat(stockForm.cost) : null
      });

      if (response.data.success) {
        setShowStockModal(false);
        setStockForm({ quantity: '', movementType: 'restock', reason: '', cost: '' });
        fetchInventoryData();
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      setError('Failed to update stock');
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/alerts/${alertId}/resolve`, {
        resolvedBy: alertForm.resolvedBy,
        actionTaken: alertForm.actionTaken
      });

      if (response.data.success) {
        setShowAlertModal(false);
        setAlertForm({ actionTaken: '', resolvedBy: 'admin' });
        fetchInventoryData();
      }
    } catch (error) {
      console.error('Error resolving alert:', error);
      setError('Failed to resolve alert');
    }
  };

  const openStockModal = (product) => {
    setSelectedProduct(product);
    setShowStockModal(true);
  };

  const openAlertModal = (alert) => {
    setSelectedAlert(alert);
    setShowAlertModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-700';
      case 'out_of_stock':
        return 'bg-red-100 text-red-700';
      case 'overstock':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.productId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.productId?.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || item.productId?.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || 
                         (filterStatus === 'Low Stock' && item.isLowStock) ||
                         (filterStatus === 'Out of Stock' && item.isOutOfStock) ||
                         (filterStatus === 'Normal' && !item.isLowStock && !item.isOutOfStock);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 p-6">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-orange-700">Loading inventory...</p>
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
            <h1 className="text-3xl font-bold text-orange-700">Inventory Management</h1>
            <p className="text-gray-600">Track stock levels, manage alerts, and monitor inventory</p>
          </div>
          <div className="flex gap-3">
            {summary.totalProducts === 0 && (
              <button
                onClick={initializeInventory}
                disabled={initializing}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2 disabled:opacity-50"
              >
                <FiDatabase size={16} />
                {initializing ? 'Initializing...' : 'Initialize Inventory'}
              </button>
            )}
            <button
              onClick={fetchInventoryData}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition flex items-center gap-2"
            >
              <FiRefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/90 rounded-2xl shadow-lg p-6 border-2 border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Products</p>
                <p className="text-2xl font-bold text-orange-700">{summary.totalProducts || 0}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <FiPackage className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/90 rounded-2xl shadow-lg p-6 border-2 border-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-700">{summary.lowStockProducts || 0}</p>
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
                <p className="text-2xl font-bold text-red-700">{summary.outOfStockProducts || 0}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FiAlertTriangle className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/90 rounded-2xl shadow-lg p-6 border-2 border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Alerts</p>
                <p className="text-2xl font-bold text-green-700">{summary.activeAlerts || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FiTrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/90 rounded-2xl shadow-lg p-6 mb-8 border-2 border-orange-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Mugs">Mugs</option>
              <option value="Jugs">Jugs</option>
              <option value="Vases">Vases</option>
              <option value="Plates">Plates</option>
              <option value="Home Decor">Home Decor</option>
              <option value="Pots">Pots</option>
              <option value="Dinning">Dinning</option>
              <option value="Others">Others</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
            >
              <option value="All">All Status</option>
              <option value="Normal">Normal</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white/90 rounded-2xl shadow-lg overflow-hidden border-2 border-orange-100">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-orange-100">
                <tr>
                  <th className="py-4 px-6 text-left text-orange-700 font-semibold">Product</th>
                  <th className="py-4 px-6 text-left text-orange-700 font-semibold">Category</th>
                  <th className="py-4 px-6 text-left text-orange-700 font-semibold">Current Stock</th>
                  <th className="py-4 px-6 text-left text-orange-700 font-semibold">Threshold</th>
                  <th className="py-4 px-6 text-left text-orange-700 font-semibold">Status</th>
                  <th className="py-4 px-6 text-left text-orange-700 font-semibold">Last Updated</th>
                  <th className="py-4 px-6 text-left text-orange-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">
                      {summary.totalProducts === 0 ? (
                        <div>
                          <FiDatabase className="mx-auto mb-2 text-gray-400" size={32} />
                          <p className="text-lg font-medium">No inventory data found</p>
                          <p className="text-sm">Click "Initialize Inventory" to set up inventory tracking for your products.</p>
                        </div>
                      ) : (
                        <div>
                          <FiSearch className="mx-auto mb-2 text-gray-400" size={32} />
                          <p className="text-lg font-medium">No products match your filters</p>
                          <p className="text-sm">Try adjusting your search or filter criteria.</p>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((item) => (
                    <tr key={item._id} className="border-b border-orange-50 hover:bg-orange-50/40 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.productId?.image?.[0] || '/images/placeholder.jpg'}
                            alt={item.productId?.title}
                            className="w-12 h-12 object-cover rounded-lg border-2 border-orange-200"
                          />
                          <div>
                            <p className="font-semibold text-gray-800">{item.productId?.title}</p>
                            <p className="text-sm text-gray-600">₹{item.productId?.price}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                          {item.productId?.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`font-semibold ${
                          item.currentStock === 0 ? 'text-red-600' :
                          item.currentStock <= item.lowStockThreshold ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {item.currentStock}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {item.lowStockThreshold}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.isOutOfStock ? 'bg-red-100 text-red-700' :
                          item.isLowStock ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {item.isOutOfStock ? 'Out of Stock' :
                           item.isLowStock ? 'Low Stock' : 'Normal'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {new Date(item.lastUpdated).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openStockModal(item)}
                            className="p-2 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 transition"
                            title="Update Stock"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => {/* TODO: View details */}}
                            className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                            title="View Details"
                          >
                            <FiEye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="mt-8 bg-white/90 rounded-2xl shadow-lg p-6 border-2 border-orange-100">
            <h2 className="text-xl font-bold text-orange-700 mb-4">Active Alerts</h2>
            <div className="space-y-4">
              {alerts.slice(0, 5).map((alert) => (
                <div key={alert._id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(alert.severity)}`}></div>
                    <div>
                      <p className="font-semibold text-gray-800">{alert.message}</p>
                      <p className="text-sm text-gray-600">
                        {alert.productId?.title} • {new Date(alert.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => openAlertModal(alert)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                  >
                    Resolve
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stock Update Modal */}
      {showStockModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Update Stock</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                <p className="text-gray-800 font-semibold">{selectedProduct.productId?.title}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Movement Type</label>
                <select
                  value={stockForm.movementType}
                  onChange={(e) => setStockForm({...stockForm, movementType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="restock">Restock</option>
                  <option value="adjustment">Adjustment</option>
                  <option value="damage">Damage</option>
                  <option value="return">Return</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  value={stockForm.quantity}
                  onChange={(e) => setStockForm({...stockForm, quantity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter quantity"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <input
                  type="text"
                  value={stockForm.reason}
                  onChange={(e) => setStockForm({...stockForm, reason: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter reason"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost (optional)</label>
                <input
                  type="number"
                  value={stockForm.cost}
                  onChange={(e) => setStockForm({...stockForm, cost: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter cost per unit"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowStockModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStockUpdate(selectedProduct.productId._id)}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                Update Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Resolution Modal */}
      {showAlertModal && selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Resolve Alert</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alert</label>
                <p className="text-gray-800">{selectedAlert.message}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Action Taken</label>
                <textarea
                  value={alertForm.actionTaken}
                  onChange={(e) => setAlertForm({...alertForm, actionTaken: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows="3"
                  placeholder="Describe the action taken to resolve this alert"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAlertModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleResolveAlert(selectedAlert._id)}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Resolve Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 