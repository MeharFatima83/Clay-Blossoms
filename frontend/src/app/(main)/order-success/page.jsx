'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrderSuccessPage() {
  const router = useRouter();
  const [orderNumber] = useState(`ORD${Date.now()}`);

  useEffect(() => {
    // If user directly visits this page without placing an order, redirect to home
    const hasPlacedOrder = sessionStorage.getItem('orderPlaced');
    if (!hasPlacedOrder) {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="bg-gradient-to-br from-green-50 via-orange-50 to-yellow-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="bg-white/90 rounded-2xl shadow-xl p-8 border-2 border-green-100 text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-700 mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 text-lg mb-6">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="text-lg font-bold text-green-700">{orderNumber}</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* What's Next */}
          <div className="bg-white/90 rounded-2xl shadow-xl p-6 border-2 border-orange-100">
            <h2 className="text-xl font-bold text-orange-700 mb-4">What's Next?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-orange-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Order Confirmation</h3>
                  <p className="text-sm text-gray-600">You'll receive an email confirmation with order details</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-orange-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Processing</h3>
                  <p className="text-sm text-gray-600">We'll prepare your order and update you on the status</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-orange-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Shipping</h3>
                  <p className="text-sm text-gray-600">Your order will be shipped within 2-3 business days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-orange-600 font-bold text-sm">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Delivery</h3>
                  <p className="text-sm text-gray-600">You'll receive your order within 5-7 business days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Support */}
          <div className="bg-white/90 rounded-2xl shadow-xl p-6 border-2 border-orange-100">
            <h2 className="text-xl font-bold text-orange-700 mb-4">Need Help?</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Email Support</h3>
                  <p className="text-sm text-gray-600">support@yourstore.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Phone Support</h3>
                  <p className="text-sm text-gray-600">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Live Chat</h3>
                  <p className="text-sm text-gray-600">Available 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/collection"
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 text-center"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="px-8 py-3 bg-orange-100 text-orange-700 font-semibold rounded-full hover:bg-orange-200 transition-all duration-200 text-center"
          >
            Back to Home
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-white/90 rounded-2xl shadow-xl p-6 border-2 border-orange-100">
          <h2 className="text-xl font-bold text-orange-700 mb-4">Important Information</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Payment</h3>
              <ul className="space-y-1">
                <li>• Cash on Delivery: Pay when you receive</li>
                <li>• Online Payment: Processed securely</li>
                <li>• No hidden charges or fees</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Returns & Refunds</h3>
              <ul className="space-y-1">
                <li>• 7-day return policy</li>
                <li>• Free returns for damaged items</li>
                <li>• Refund processed within 3-5 days</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 