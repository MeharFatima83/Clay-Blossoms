"use client";

import React, { useState } from 'react';

const Contact = () => {
  const [contactNumber, setContactNumber] = useState('');

  const handleContactChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setContactNumber(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-12 px-4">
      <div className="mt-7 max-w-lg mx-auto bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl shadow-xl">
        <div className="p-6 sm:p-8">
          <div className="text-center">
            <h1 className="block text-3xl font-bold text-gray-800 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Contact Us
            </h1>
            <p className="mt-3 text-sm text-gray-600">
              Feel free to reach out by filling the form below.
            </p>
          </div>

          <div className="mt-6">
            <form>
              <div className="grid gap-y-5">

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="py-3 px-4 block w-full border-2 border-orange-200 rounded-xl text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="py-3 px-4 block w-full border-2 border-orange-200 rounded-xl text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    id="contact"
                    name="contact"
                    value={contactNumber}
                    onChange={handleContactChange}
                    className="py-3 px-4 block w-full border-2 border-orange-200 rounded-xl text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    required
                  />
                  <p className="text-xs text-orange-600 mt-1 font-medium">
                    Enter 10 digits only
                  </p>
                </div>

                {/* Queries */}
                <div>
                  <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Query
                  </label>
                  <textarea
                    id="query"
                    name="query"
                    rows="4"
                    className="py-3 px-4 block w-full border-2 border-orange-200 rounded-xl text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                    placeholder="Write your query here..."
                    required
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-xl border border-transparent bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Submit
                </button>

              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;