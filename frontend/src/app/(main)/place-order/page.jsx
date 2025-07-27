'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../../../components/CartContext";
import { useRouter } from "next/navigation";
import Head from 'next/head';
import { useAuth } from "../../../context/Authcontext";

export default function PlaceOrderPage() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCart();
  const { isLoggedIn, userId } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  const subtotal = getCartTotal();
  const shipping = subtotal >= 50 ? 0 : 50; // Free shipping over ₹50
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.state || !form.pincode) {
      setError('Please fill in all required fields');
      return false;
    }
    if (form.phone.length < 10) {
      setError('Please enter a valid phone number');
      return false;
    }
    if (form.pincode.length !== 6) {
      setError('Please enter a valid 6-digit pincode');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Prepare customerDetails with userId if logged in
      const customerDetailsWithUserId = isLoggedIn ? { ...form, userId } : { ...form };
      if (form.paymentMethod === 'online') {
        // Create order for online payment
        const orderRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/orders/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: items.map(item => ({ productId: item.id, title: item.title, price: item.price, quantity: item.quantity, image: item.image })),
            customerDetails: customerDetailsWithUserId,
            paymentMethod: 'online',
            subtotal,
            shipping,
            total
          })
        });

        if (!orderRes.ok) throw new Error('Failed to create Razorpay order');

        const { razorpayOrder, order } = await orderRes.json();

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_zIcp2q8Ubf993V',
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'Your E-commerce',
          description: 'Test Transaction',
          order_id: razorpayOrder.id,
          handler: async function (response) {
            // Verify payment
            const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/orders/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (verifyRes.ok) {
              clearCart();
              setSuccess(true);
              sessionStorage.setItem('orderPlaced', 'true');
              router.push('/order-success');
            } else {
              setError('Payment verification failed.');
            }
          },
          prefill: {
            name: form.name,
            email: form.email,
            contact: form.phone,
          },
          theme: {
            color: '#F97316',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        
        rzp.on('payment.failed', function (response){
            setError(`Payment failed: ${response.error.description}`);
            console.error(response.error);
        });

      } else { // COD
        const orderData = {
          items: items.map(item => ({ productId: item.id, title: item.title, price: item.price, quantity: item.quantity, image: item.image })),
          customerDetails: isLoggedIn ? { ...form, userId } : { ...form },
          paymentMethod: 'cod',
          subtotal,
          shipping,
          total
        };
        // Send order to backend
        const orderRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/orders/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });
        if (!orderRes.ok) throw new Error('Failed to place order');
        setSuccess(true);
        clearCart();
        router.push('/order-success');

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/orders/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });

        if (!response.ok) throw new Error('Failed to create COD order');

        clearCart();
        setSuccess(true);
        sessionStorage.setItem('orderPlaced', 'true');
        setTimeout(() => router.push('/order-success'), 3000);
      }
    } catch (error) {
      setError('Failed to place order. Please try again.');
      console.error('Order placement error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white/90 rounded-2xl shadow-xl p-8 border-2 border-orange-100 text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Please add some items to your cart before proceeding to checkout.</p>
          <Link href="/collection" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full shadow hover:from-orange-600 hover:to-pink-600 transition-all duration-200">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-700 mb-8 text-center">Checkout</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 rounded-2xl shadow-xl p-6 border-2 border-orange-100 sticky top-4">
              <h2 className="text-xl font-bold text-orange-700 mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg">
                    <img 
                      src={item.image || "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"} 
                      alt={item.title} 
                      className="w-16 h-16 object-cover rounded-lg border-2 border-orange-200" 
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-orange-700 truncate">{item.title}</h3>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-orange-700">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-orange-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                    🎉 Add ₹{50 - subtotal} more for free shipping!
                  </div>
                )}
                <div className="border-t border-orange-200 pt-2">
                  <div className="flex justify-between text-lg font-bold text-orange-700">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 rounded-2xl shadow-xl p-8 border-2 border-orange-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <div>
                  <h2 className="text-xl font-bold text-orange-700 mb-4">Customer Information</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name *"
                      value={form.name}
                      onChange={handleChange}
                      className="px-4 py-3 rounded-lg border-2 border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white/70 text-gray-700"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address *"
                      value={form.email}
                      onChange={handleChange}
                      className="px-4 py-3 rounded-lg border-2 border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white/70 text-gray-700"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number *"
                      value={form.phone}
                      onChange={handleChange}
                      className="px-4 py-3 rounded-lg border-2 border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white/70 text-gray-700"
                      required
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h2 className="text-xl font-bold text-orange-700 mb-4">Shipping Address</h2>
                  <div className="space-y-4">
                    <textarea
                      name="address"
                      placeholder="Full Address *"
                      value={form.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border-2 border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white/70 text-gray-700 resize-none"
                      required
                    />
                    <div className="grid md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        name="city"
                        placeholder="City *"
                        value={form.city}
                        onChange={handleChange}
                        className="px-4 py-3 rounded-lg border-2 border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white/70 text-gray-700"
                        required
                      />
                      <input
                        type="text"
                        name="state"
                        placeholder="State *"
                        value={form.state}
                        onChange={handleChange}
                        className="px-4 py-3 rounded-lg border-2 border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white/70 text-gray-700"
                        required
                      />
                      <input
                        type="text"
                        name="pincode"
                        placeholder="Pincode *"
                        value={form.pincode}
                        onChange={handleChange}
                        maxLength={6}
                        className="px-4 py-3 rounded-lg border-2 border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white/70 text-gray-700"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h2 className="text-xl font-bold text-orange-700 mb-4">Payment Method</h2>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 border-orange-200 rounded-lg cursor-pointer hover:bg-orange-50 transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={form.paymentMethod === 'cod'}
                        onChange={handleChange}
                        className="mr-3 text-orange-600"
                      />
                      <div>
                        <div className="font-semibold text-gray-700">Cash on Delivery</div>
                        <div className="text-sm text-gray-600">Pay when you receive your order</div>
                      </div>
                    </label>
                    <label className="flex items-center p-4 border-2 border-orange-200 rounded-lg cursor-pointer hover:bg-orange-50 transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={form.paymentMethod === 'online'}
                        onChange={handleChange}
                        className="mr-3 text-orange-600"
                      />
                      <div>
                        <div className="font-semibold text-gray-700">Online Payment</div>
                        <div className="text-sm text-gray-600">Pay securely with card or UPI</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Error and Success Messages */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    ✅ Order placed successfully! Redirecting to order confirmation...
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link
                    href="/cart"
                    className="flex-1 px-6 py-3 bg-orange-100 text-orange-700 font-semibold rounded-full text-center hover:bg-orange-200 transition"
                  >
                    Back to Cart
                  </Link>
                  <button
                    type="submit"
                    disabled={loading || success}
                    className="flex-1 px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Placing Order...
                      </span>
                    ) : success ? (
                      'Order Placed!'
                    ) : (
                      `Place Order - ₹${total}`
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}