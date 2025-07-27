'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/Authcontext';

export default function OrdersPage() {
  const { userId, isLoggedIn, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refundModalOrder, setRefundModalOrder] = useState(null);
  const [refundForm, setRefundForm] = useState({ upiId: '', bankDetails: '' });
  const [refundFormError, setRefundFormError] = useState('');
  const [refundFormLoading, setRefundFormLoading] = useState(false);
  const [refundFormSuccess, setRefundFormSuccess] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn || !userId) {
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/orders/user/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
      })
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId, isLoggedIn, authLoading]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-orange-700">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/90 rounded-2xl shadow-lg p-6 border-2 border-orange-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Order History</h1>
            <p className="text-gray-600">
              {orders.length} {orders.length === 1 ? 'order' : 'orders'} • Total spent: ₹{orders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white/90 rounded-2xl shadow-lg p-12 border-2 border-orange-100 text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">No orders yet</h2>
          <p className="text-gray-600 mb-8">
            Start shopping to see your order history here.
          </p>
          <Link
            href="/collection"
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 font-semibold"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white/90 rounded-2xl shadow-lg border-2 border-orange-100 overflow-hidden">
              {/* Order Header */}
              <div className="p-6 border-b border-orange-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Order #{order.orderNumber || order._id}</h3>
                      <p className="text-sm text-gray-600">Placed on {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    {/* Refund Status Badge */}
                    {order.paymentMethod === 'online' && order.isPaid && order.status === 'cancelled' && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ml-2
                        ${order.refundStatus === 'refunded' ? 'bg-green-100 text-green-800' :
                          order.refundStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          order.refundStatus === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'}
                      `}>
                        Refund: {order.refundStatus || 'not_requested'}
                      </span>
                    )}
                    <span className="text-lg font-bold text-gray-800">₹{order.total}</span>
                    <button
                      onClick={() => openOrderDetails(order)}
                      className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                    >
                      View Details
                    </button>
                    {/* Cancel Order Button (list) */}
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!window.confirm('Are you sure you want to cancel this order?')) return;
                          try {
                            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/orders/${order._id}/cancel`, {
                              method: 'PUT',
                            });
                            const data = await res.json();
                            if (res.ok) {
                              setOrders((prev) => prev.map((o) => o._id === order._id ? { ...o, status: 'cancelled' } : o));
                            } else {
                              alert(data.message || 'Failed to cancel order');
                            }
                          } catch (err) {
                            alert('Failed to cancel order');
                          }
                        }}
                        className="px-4 py-2 text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 ml-2"
                      >
                        Cancel Order
                      </button>
                    )}
                    {/* Request Refund Button */}
                    {order.paymentMethod === 'online' && order.isPaid && order.status === 'cancelled' &&
                      order.refundStatus !== 'refunded' && order.refundStatus !== 'requested' && (
                      <button
                        onClick={() => {
                          setRefundModalOrder(order);
                          setRefundForm({ upiId: '', bankDetails: '' });
                          setRefundFormError('');
                          setRefundFormSuccess('');
                        }}
                        className="px-4 py-2 text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 ml-2"
                      >
                        Request Refund
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="p-6">
                <div className="flex gap-4 overflow-x-auto">
                  {order.items.map((item, idx) => (
                    <div key={item.productId || idx} className="flex items-center gap-3 min-w-0 flex-shrink-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate">{item.title}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium text-orange-600">₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="font-semibold">{selectedOrder.orderNumber || selectedOrder._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-semibold">{selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleDateString() : ''}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="font-semibold text-lg">₹{selectedOrder.total}</p>
                </div>
                {/* Refund Status & Details */}
                {selectedOrder.paymentMethod === 'online' && selectedOrder.isPaid && selectedOrder.status === 'cancelled' && (
                  <div className="col-span-2 mt-2">
                    <p className="text-sm text-gray-600">Refund Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${selectedOrder.refundStatus === 'refunded' ? 'bg-green-100 text-green-800' :
                        selectedOrder.refundStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        selectedOrder.refundStatus === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'}
                    `}>
                      {selectedOrder.refundStatus || 'not_requested'}
                    </span>
                    {selectedOrder.refundDetails && (
                      <div className="mt-2 text-sm text-gray-700 space-y-1">
                        {selectedOrder.refundDetails.refundAmount && (
                          <div>Amount: ₹{selectedOrder.refundDetails.refundAmount}</div>
                        )}
                        {selectedOrder.refundDetails.refundDate && (
                          <div>Date: {new Date(selectedOrder.refundDetails.refundDate).toLocaleString()}</div>
                        )}
                        {selectedOrder.refundDetails.refundReason && (
                          <div>Reason: {selectedOrder.refundDetails.refundReason}</div>
                        )}
                        {selectedOrder.refundStatus === 'failed' && selectedOrder.refundDetails.refundError && (
                          <div className="text-red-600">Error: {selectedOrder.refundDetails.refundError}</div>
                        )}
                        {selectedOrder.refundDetails.upiId && (
                          <div>UPI ID: {selectedOrder.refundDetails.upiId}</div>
                        )}
                        {selectedOrder.refundDetails.bankDetails && (
                          <div>Bank Details: {selectedOrder.refundDetails.bankDetails}</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Shipping Address</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium">{selectedOrder.customerDetails?.name}</p>
                  <p className="text-gray-600">{selectedOrder.customerDetails?.address}</p>
                  <p className="text-gray-600">
                    {selectedOrder.customerDetails?.city}, {selectedOrder.customerDetails?.state} {selectedOrder.customerDetails?.pincode}
                  </p>
                </div>
              </div>

              {/* Tracking Info */}
              {selectedOrder.trackingNumber && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Tracking Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">Tracking Number: {selectedOrder.trackingNumber}</p>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={item.productId || idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.title}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">₹{item.price}</p>
                        <p className="text-sm text-gray-600">Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Cancel Order Button (modal) */}
              {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                <button
                  onClick={async () => {
                    if (!window.confirm('Are you sure you want to cancel this order?')) return;
                    try {
                      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/orders/${selectedOrder._id}/cancel`, {
                        method: 'PUT',
                      });
                      const data = await res.json();
                      if (res.ok) {
                        setOrders((prev) => prev.map((o) => o._id === selectedOrder._id ? { ...o, status: 'cancelled' } : o));
                        setSelectedOrder((prev) => ({ ...prev, status: 'cancelled' }));
                      } else {
                        alert(data.message || 'Failed to cancel order');
                      }
                    } catch (err) {
                      alert('Failed to cancel order');
                    }
                  }}
                  className="px-6 py-2 text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Refund Request Modal */}
      {refundModalOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Request Refund</h2>
            <p className="mb-2 text-gray-700">Please provide your UPI ID or bank details for the refund.</p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setRefundFormError('');
                setRefundFormSuccess('');
                if (!refundForm.upiId && !refundForm.bankDetails) {
                  setRefundFormError('Please enter UPI ID or bank details.');
                  return;
                }
                setRefundFormLoading(true);
                try {
                  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/orders/${refundModalOrder._id}/request-refund`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(refundForm)
                  });
                  const data = await res.json();
                  if (res.ok) {
                    setRefundFormSuccess('Refund request submitted!');
                    setOrders((prev) => prev.map((o) => o._id === refundModalOrder._id ? data.order : o));
                  } else {
                    setRefundFormError(data.message || 'Failed to request refund');
                  }
                } catch (err) {
                  setRefundFormError('Failed to request refund');
                }
                setRefundFormLoading(false);
              }}
            >
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2"
                  value={refundForm.upiId}
                  onChange={e => setRefundForm(f => ({ ...f, upiId: e.target.value }))}
                  placeholder="your-upi@bank"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Details</label>
                <textarea
                  className="w-full border rounded-lg px-3 py-2"
                  value={refundForm.bankDetails}
                  onChange={e => setRefundForm(f => ({ ...f, bankDetails: e.target.value }))}
                  placeholder="Account number, IFSC, account holder name, etc."
                  rows={3}
                />
              </div>
              {refundFormError && <div className="text-red-600 mb-2">{refundFormError}</div>}
              {refundFormSuccess && <div className="text-green-600 mb-2">{refundFormSuccess}</div>}
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  disabled={refundFormLoading}
                >
                  {refundFormLoading ? 'Submitting...' : 'Submit Request'}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  onClick={() => setRefundModalOrder(null)}
                  disabled={refundFormLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 