'use client';
import React, { useEffect, useState } from 'react';

const RefundPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refundLoading, setRefundLoading] = useState({});
  const [refundMessage, setRefundMessage] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/orders`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        setError('Failed to fetch orders');
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const eligibleOrders = orders.filter(order =>
    order.paymentMethod === 'online' &&
    order.isPaid &&
    order.status === 'cancelled' &&
    order.refundStatus !== 'refunded'
  );

  const handleRefund = async (orderId) => {
    setRefundLoading(prev => ({ ...prev, [orderId]: true }));
    setRefundMessage(prev => ({ ...prev, [orderId]: '' }));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/orders/${orderId}/refund`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refundReason: 'Order cancelled by admin' })
      });
      const data = await res.json();
      if (res.ok) {
        setRefundMessage(prev => ({ ...prev, [orderId]: 'Refund successful!' }));
      } else {
        setRefundMessage(prev => ({ ...prev, [orderId]: data.message || 'Refund failed' }));
      }
    } catch (err) {
      setRefundMessage(prev => ({ ...prev, [orderId]: 'Refund failed' }));
    }
    setRefundLoading(prev => ({ ...prev, [orderId]: false }));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Refunds</h1>
      {loading ? (
        <div>Loading orders...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : eligibleOrders.length === 0 ? (
        <div>No eligible orders for refund.</div>
      ) : (
        <div className="space-y-6">
          {eligibleOrders.map(order => (
            <div key={order._id} className="border rounded-lg p-4 bg-white shadow flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div><span className="font-semibold">Order #:</span> {order.orderNumber}</div>
                <div><span className="font-semibold">Customer:</span> {order.customerDetails?.name} ({order.customerDetails?.email})</div>
                <div><span className="font-semibold">Total:</span> ₹{order.total}</div>
                <div><span className="font-semibold">Status:</span> {order.status}</div>
                <div><span className="font-semibold">Refund Status:</span> {order.refundStatus || 'not_requested'}</div>
                {order.refundDetails && (
                  <div className="mt-2 text-sm text-gray-700 space-y-1">
                    {order.refundDetails.upiId && (
                      <div><span className="font-semibold">UPI ID:</span> {order.refundDetails.upiId}</div>
                    )}
                    {order.refundDetails.bankDetails && (
                      <div><span className="font-semibold">Bank Details:</span> {order.refundDetails.bankDetails}</div>
                    )}
                  </div>
                )}
              </div>
              <div className="mt-4 md:mt-0 flex flex-col items-end">
                <button
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
                  disabled={refundLoading[order._id] || order.refundStatus === 'refunded'}
                  onClick={() => handleRefund(order._id)}
                >
                  {refundLoading[order._id] ? 'Processing...' : 'Refund'}
                </button>
                {refundMessage[order._id] && (
                  <div className="mt-2 text-sm text-green-600">{refundMessage[order._id]}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RefundPage; 