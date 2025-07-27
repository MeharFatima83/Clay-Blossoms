'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useAuth } from "@/context/Authcontext";

export default function NavBar() {
  const { getCartItemCount } = useCart();
  const { getWishlistItemCount } = useWishlist();
  const { isLoggedIn, username, email, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userInitial = (username || email || "U").charAt(0).toUpperCase();
  const userDropdownRef = useRef(null);

  const cartItemCount = getCartItemCount();
  const wishlistItemCount = getWishlistItemCount();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!showSearch || !searchTerm.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const delayDebounce = setTimeout(() => {
      setLoadingSuggestions(true);
      fetch(`/api/products/search?q=${encodeURIComponent(searchTerm.trim())}`)
        .then(res => res.json())
        .then(data => {
          setSuggestions(Array.isArray(data) ? data : []);
          setShowSuggestions(true);
          console.log('Suggestions:', data); // Debug log
        })
        .catch(() => setSuggestions([]))
        .finally(() => setLoadingSuggestions(false));
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, showSearch]);

  useEffect(() => {
    if (!showUserDropdown) return;
    function handleClickOutside(event) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserDropdown]);

  // Add this function to handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/collection?searchTerm=${encodeURIComponent(searchTerm.trim())}`);
      setShowSearch(false);
      setSearchTerm("");
    }
  };

  // Don't render user-specific content until client-side
  if (!isClient) {
    return (
      <nav className="bg-gradient-to-r from-orange-50 via-pink-50 to-purple-50 shadow-lg sticky top-0 z-50 border-b border-orange-200 rounded-b-2xl">
        {/* Promo Banner */}
        <div className="w-full bg-gradient-to-r from-orange-600 to-pink-600 text-white text-center py-2 text-sm font-medium tracking-wide">
          🎨 Free delivery on orders over $50 | Handcrafted with love
        </div>
        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
          {/* Logo */}
          <Link href="/home-page" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 border-4 border-yellow-100">
                <span className="text-white font-bold text-lg">CB</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse border-2 border-white"></div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                ClayBlossoms
              </span>
              <p className="text-xs text-gray-600 -mt-1">Handcrafted Pottery</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex gap-8 text-base font-medium">
            <Link href="/home-page" className="text-gray-700 hover:text-orange-600 transition-colors duration-200 font-semibold relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/collection" className="text-gray-700 hover:text-orange-600 transition-colors duration-200 font-semibold relative group">
              Collection
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-orange-600 transition-colors duration-200 font-semibold relative group">
              About Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-orange-600 transition-colors duration-200 font-semibold relative group">
              Contact Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Search Icon and Input */}
            <div className="relative">
              <button
                className="p-2 rounded-full hover:bg-orange-100 transition-all duration-200 group"
                aria-label="Search"
                onClick={() => setShowSearch((prev) => !prev)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gray-700 group-hover:text-orange-600 transition-colors duration-200">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                </svg>
              </button>
              {showSearch && (
                <form
                  onSubmit={handleSearchSubmit}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-orange-200 flex z-50"
                >
                  <input
                    type="text"
                    autoFocus
                    ref={inputRef}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onBlur={() => setTimeout(() => { setShowSearch(false); setShowSuggestions(false); }, 200)}
                    placeholder="Search products..."
                    className="flex-1 px-4 py-2 rounded-l-xl outline-none"
                    onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 text-white rounded-r-xl hover:bg-orange-600"
                  >
                    Go
                  </button>
                  {/* Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute left-0 right-0 top-full bg-white border border-orange-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto mt-1">
                      {suggestions.map(product => (
                        <li
                          key={product._id}
                          className="px-4 py-2 hover:bg-orange-50 cursor-pointer"
                          onMouseDown={() => {
                            setShowSuggestions(false);
                            setShowSearch(false);
                            setSearchTerm("");
                            router.push(`/view-product?id=${product._id}`);
                          }}
                        >
                          {product.name || product.title}
                        </li>
                      ))}
                    </ul>
                  )}
                  {loadingSuggestions && (
                    <div className="absolute left-0 right-0 top-full bg-white border border-orange-200 rounded-xl shadow-lg z-50 px-4 py-2 text-gray-500 mt-1">
                      Loading...
                    </div>
                  )}
                </form>
              )}
            </div>
            {/* Wishlist Icon */}
            <Link href="/user/wishlist" className="p-2 rounded-full hover:bg-pink-100 transition-all duration-200 group relative" aria-label="Wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-7 h-7 text-pink-400 group-hover:text-pink-600 transition-colors duration-200">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                0
              </span>
            </Link>

            {/* Shopping Bag Icon */}
            <Link href="/cart" className="p-2 rounded-full hover:bg-orange-100 transition-all duration-200 group relative" aria-label="Shopping Bag">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gray-700 group-hover:text-orange-600 transition-colors duration-200">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                0
              </span>
            </Link>

            {/* Login/Signup Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/user-login" className="px-4 py-2 text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-200">
                Log In
              </Link>
              <Link href="/user-signup" className="px-5 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-md border-2 border-orange-200">
                Sign Up
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-full hover:bg-orange-100 transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gray-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gradient-to-r from-orange-50 via-pink-50 to-purple-50 shadow-lg sticky top-0 z-50 border-b border-orange-200 rounded-b-2xl">
      {/* Promo Banner */}
      <div className="w-full bg-gradient-to-r from-orange-600 to-pink-600 text-white text-center py-2 text-sm font-medium tracking-wide">
        🎨 Free delivery on orders over $50 | Handcrafted with love
      </div>
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/home-page" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 border-4 border-yellow-100">
              <span className="text-white font-bold text-lg">CB</span>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse border-2 border-white"></div>
          </div>
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              ClayBlossoms
            </span>
            <p className="text-xs text-gray-600 -mt-1">Handcrafted Pottery</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-8 text-base font-medium">
          <Link href="/home-page" className="text-gray-700 hover:text-orange-600 transition-colors duration-200 font-semibold relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/collection" className="text-gray-700 hover:text-orange-600 transition-colors duration-200 font-semibold relative group">
            Collection
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-orange-600 transition-colors duration-200 font-semibold relative group">
            About Us
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-orange-600 transition-colors duration-200 font-semibold relative group">
            Contact Us
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          {/* Search Icon and Input */}
          <div className="relative">
            <button
              className="p-2 rounded-full hover:bg-orange-100 transition-all duration-200 group"
              aria-label="Search"
              onClick={() => setShowSearch((prev) => !prev)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gray-700 group-hover:text-orange-600 transition-colors duration-200">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
              </svg>
            </button>
            {showSearch && (
              <form
                onSubmit={handleSearchSubmit}
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-orange-200 flex z-50"
              >
                <input
                  type="text"
                  autoFocus
                  ref={inputRef}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onBlur={() => setTimeout(() => { setShowSearch(false); setShowSuggestions(false); }, 200)}
                  placeholder="Search products..."
                  className="flex-1 px-4 py-2 rounded-l-xl outline-none"
                  onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-r-xl hover:bg-orange-600"
                >
                  Go
                </button>
                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 top-full bg-white border border-orange-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto mt-1">
                    {suggestions.map(product => (
                      <li
                        key={product._id}
                        className="px-4 py-2 hover:bg-orange-50 cursor-pointer"
                        onMouseDown={() => {
                          setShowSuggestions(false);
                          setShowSearch(false);
                          setSearchTerm("");
                          router.push(`/view-product?id=${product._id}`);
                        }}
                      >
                        {product.name || product.title}
                      </li>
                    ))}
                  </ul>
                )}
                {loadingSuggestions && (
                  <div className="absolute left-0 right-0 top-full bg-white border border-orange-200 rounded-xl shadow-lg z-50 px-4 py-2 text-gray-500 mt-1">
                    Loading...
                  </div>
                )}
              </form>
            )}
          </div>
          {/* Wishlist Icon */}
          <Link href="/user/wishlist" className="p-2 rounded-full hover:bg-pink-100 transition-all duration-200 group relative" aria-label="Wishlist">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-7 h-7 text-pink-400 group-hover:text-pink-600 transition-colors duration-200">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span className={`absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold transition-all duration-200 ${
              wishlistItemCount > 0 ? 'w-5 h-5 scale-100' : 'w-5 h-5 scale-0'
            }`}>
              {wishlistItemCount > 0 ? (wishlistItemCount > 99 ? '99+' : wishlistItemCount) : ''}
            </span>
          </Link>

          {/* Shopping Bag Icon */}
          <Link href="/cart" className="p-2 rounded-full hover:bg-orange-100 transition-all duration-200 group relative" aria-label="Shopping Bag">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gray-700 group-hover:text-orange-600 transition-colors duration-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span className={`absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold transition-all duration-200 ${
              cartItemCount > 0 ? 'w-5 h-5 scale-100' : 'w-5 h-5 scale-0'
            }`}>
              {cartItemCount > 0 ? (cartItemCount > 99 ? '99+' : cartItemCount) : ''}
            </span>
          </Link>

          {/* Login/Signup or User Info/Logout */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <div className="relative" ref={userDropdownRef}>
                  <button
                    className="flex items-center gap-2 px-3 py-2 bg-orange-100 hover:bg-orange-200 rounded-full font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                    onClick={() => setShowUserDropdown((prev) => !prev)}
                  >
                    <span className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full text-lg font-bold">
                      {userInitial}
                    </span>
                    <span className="hidden lg:inline">{username || email}</span>
                    <svg className={`w-4 h-4 ml-1 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-orange-200 rounded-xl shadow-lg z-50 py-2 animate-fade-in">
                      <Link href="/user/orders" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 transition-colors">My Orders</Link>
                      <Link href="/user/profile" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 transition-colors">Profile</Link>
                      <button
                        onClick={() => { setShowUserDropdown(false); logout(); router.push("/home-page"); }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-orange-50 transition-colors border-t border-orange-100 mt-1"
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/user-login" className="px-4 py-2 text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-200">
                  Log In
                </Link>
                <Link href="/user-signup" className="px-5 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-md border-2 border-orange-200">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-full hover:bg-orange-100 transition-all duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gray-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}