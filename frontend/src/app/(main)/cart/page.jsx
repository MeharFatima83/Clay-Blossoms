'use client';

import React from "react";
import Link from "next/link";
import { useCart } from "../../../components/CartContext";

export default function CartPage() {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    clearCart 
  } = useCart();

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 50 : 0; // Free shipping over $50
  const total = subtotal + shipping;

  return (
    <div className="bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white/90 rounded-2xl shadow-xl p-8 border-2 border-orange-100">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-orange-700">Your Cart</h1>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="px-4 py-2 text-red-600 hover:text-red-700 font-semibold transition-colors duration-200"
            >
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-orange-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link 
              href="/collection" 
              className="inline-block px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="divide-y divide-orange-100 mb-8">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row items-center gap-6 py-6">
                  <img 
                    src={item.image || "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"} 
                    alt={item.title} 
                    className="w-24 h-24 object-cover rounded-xl border-4 border-orange-100" 
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-orange-700 truncate">{item.title}</h2>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-gray-700 font-semibold">₹{item.price}</span>
                      <span className="text-sm text-gray-500">Stock: {item.stock}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 bg-orange-100 rounded-full text-orange-700 font-bold text-lg hover:bg-orange-200 transition disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-3 text-gray-800 font-semibold min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 bg-orange-100 rounded-full text-orange-700 font-bold text-lg hover:bg-orange-200 transition disabled:opacity-50"
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right min-w-[6rem]">
                      <div className="font-bold text-orange-700">₹{item.price * item.quantity}</div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      className="p-2 rounded-full bg-pink-100 hover:bg-pink-200 transition" 
                      aria-label="Remove item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#E07A5F" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-100">
              <h3 className="text-xl font-bold text-orange-700 mb-4">Order Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
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
                  <div className="text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                    🎉 Add ₹{50 - subtotal} more for free shipping!
                  </div>
                )}
                <div className="border-t border-orange-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-orange-700">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/collection" 
                  className="flex-1 px-6 py-3 bg-orange-100 text-orange-700 font-semibold rounded-full text-center hover:bg-orange-200 transition"
                >
                  Continue Shopping
                </Link>
                <Link 
                  href="/place-order" 
                  className="flex-1 px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 text-center"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}