"use client";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import axios from "axios";
import { FiSearch, FiFilter, FiHeart, FiShoppingCart, FiChevronDown, FiChevronUp, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useCart } from "../../../components/CartContext";
import { useWishlist } from "../../../components/WishlistContext";
import { useSearchParams } from "next/navigation";

const categories = ["All", "Dinning", "Pots", "Jugs", "Mugs", "Plates", "Home Decor", "Vases", "Others"];

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API + '/api/products';

// Category normalization map
const CATEGORY_MAP = {
  mugs: "Mugs",
  mug: "Mugs",
  jugs: "Jugs",
  jug: "Jugs",
  vases: "Vases",
  vase: "Vases",
  plates: "Plates",
  plate: "Plates",
  decor: "Decor",
  "home decor": "Decor",
  pots: "Pots",
  pot: "Pots",
  dinning: "Dinning",
  dining: "Dinning",
  others: "Others"
};

// Sorting options
const sortOptions = [
  { value: "default", label: "Default" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest First" }
];

function normalizeCategory(cat) {
  if (!cat) return "All";
  const key = cat.toString().trim().toLowerCase();
  return CATEGORY_MAP[key] || cat;
}

function CollectionPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState({});
  const [addingToWishlist, setAddingToWishlist] = useState({});

  // New state variables for advanced features
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedSort, setSelectedSort] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [filterLoading, setFilterLoading] = useState(false);

  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const urlSearchTerm = searchParams.get("searchTerm") || "";
    setSearchTerm(urlSearchTerm);
  }, [searchParams]);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/getall`);
        setProducts(response.data);
        setFilteredProducts(response.data);
        setError("");
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Update selectedCategory if the URL query changes
  useEffect(() => {
    const urlCategory = searchParams.get("category") || "All";
    setSelectedCategory(normalizeCategory(urlCategory));
  }, [searchParams]);

  // Enhanced filter and sort products
  useEffect(() => {
    let filtered = products;
    
    // Filter by category (robust normalization)
    if (selectedCategory !== "All") {
      filtered = filtered.filter(product => {
        const prodCat = normalizeCategory(product.category);
        return prodCat === selectedCategory;
      });
    }
    
    // Enhanced search - search in title, description, and category
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    }

    // Filter by price range
    if (priceRange.min !== "" || priceRange.max !== "") {
      filtered = filtered.filter(product => {
        const price = product.price;
        const min = priceRange.min !== "" ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max !== "" ? parseFloat(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Filter by rating
    if (ratingFilter > 0) {
      filtered = filtered.filter(product => 
        (product.rating || 0) >= ratingFilter
      );
    }
    
    // Sort products
    switch (selectedSort) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        // Keep original order
        break;
    }
    
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, debouncedSearchTerm, selectedCategory, priceRange, selectedSort, ratingFilter]);

  const handleAddToCart = async (productId) => {
    const product = products.find(p => p._id === productId);
    if (!product) return;

    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    
    try {
      addToCart(product, 1);
      // Show success feedback
      setTimeout(() => {
        setAddingToCart(prev => ({ ...prev, [productId]: false }));
      }, 1000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleWishlist = async (productId) => {
    const product = products.find(p => p._id === productId);
    if (!product) return;

    setAddingToWishlist(prev => ({ ...prev, [productId]: true }));
    
    try {
      if (isInWishlist(productId)) {
        removeFromWishlist(productId);
      } else {
        addToWishlist(product);
      }
      
      // Show success feedback
      setTimeout(() => {
        setAddingToWishlist(prev => ({ ...prev, [productId]: false }));
      }, 500);
    } catch (error) {
      console.error('Error updating wishlist:', error);
      setAddingToWishlist(prev => ({ ...prev, [productId]: false }));
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Helper functions
  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setPriceRange({ min: "", max: "" });
    setSelectedSort("default");
    setRatingFilter(0);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPriceRange = () => {
    if (products.length === 0) return { min: 0, max: 0 };
    const prices = products.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  };

  const priceRangeData = getPriceRange();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-700 mb-4">Our Collection</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover handcrafted pottery pieces that bring warmth and beauty to your home. 
            Each piece is unique, made with love by our skilled artisans.
          </p>
        </div>

        {/* Enhanced Search and Filter */}
        <div className="bg-white/80 rounded-2xl shadow-lg p-6 mb-8 border border-orange-100">
          {/* Basic Search and Category */}
          <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400" />
              <input
                type="text"
                placeholder="Search products by name, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white/70"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <FiFilter className="text-orange-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white/70"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Sort:</span>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="px-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white/70"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="px-4 py-3 bg-orange-100 text-orange-700 rounded-xl hover:bg-orange-200 transition flex items-center gap-2"
            >
              {showAdvancedFilters ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
              Advanced Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="border-t border-orange-200 pt-4 space-y-4">
              {/* Price Range Filter */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (₹)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder={`Min: ${priceRangeData.min}`}
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="flex-1 px-3 py-2 border-2 border-orange-200 rounded-lg focus:border-orange-500 outline-none bg-white/70"
                    />
                    <span className="flex items-center text-gray-500">to</span>
                    <input
                      type="number"
                      placeholder={`Max: ${priceRangeData.max}`}
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="flex-1 px-3 py-2 border-2 border-orange-200 rounded-lg focus:border-orange-500 outline-none bg-white/70"
                    />
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border-2 border-orange-200 rounded-lg focus:border-orange-500 outline-none bg-white/70"
                  >
                    <option value={0}>Any Rating</option>
                    <option value={4}>4+ Stars</option>
                    <option value={3}>3+ Stars</option>
                    <option value={2}>2+ Stars</option>
                    <option value={1}>1+ Star</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="flex justify-end">
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Active Filters Summary */}
        {(searchTerm || selectedCategory !== "All" || priceRange.min || priceRange.max || ratingFilter > 0) && (
          <div className="mb-6 bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-orange-700">Active Filters:</span>
              
              {searchTerm && (
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-2 text-orange-500 hover:text-orange-700"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {selectedCategory !== "All" && (
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  Category: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className="ml-2 text-orange-500 hover:text-orange-700"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {(priceRange.min || priceRange.max) && (
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  Price: ₹{priceRange.min || "0"} - ₹{priceRange.max || "∞"}
                  <button
                    onClick={() => setPriceRange({ min: "", max: "" })}
                    className="ml-2 text-orange-500 hover:text-orange-700"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {ratingFilter > 0 && (
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  Rating: {ratingFilter}+ stars
                  <button
                    onClick={() => setRatingFilter(0)}
                    className="ml-2 text-orange-500 hover:text-orange-700"
                  >
                    ×
                  </button>
                </span>
              )}
              
              <button
                onClick={clearAllFilters}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 transition"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Results Count */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-gray-600">
            <div className="flex items-center gap-2">
              <p>
                Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
                {filteredProducts.length !== products.length && ` (filtered from ${products.length} total)`}
              </p>
              {filterLoading && (
                <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
          </div>
          
          {/* Items per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Items per page:</span>
            <span className="text-sm font-medium text-orange-700">{itemsPerPage}</span>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="text-lg text-orange-700">Loading products...</div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-lg text-red-600 mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Try Again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-orange-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">No products found</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || selectedCategory !== "All" || priceRange.min || priceRange.max || ratingFilter > 0
                ? "Try adjusting your filters or search terms to find what you're looking for."
                : "We couldn't find any products matching your criteria."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={clearAllFilters}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                Clear All Filters
              </button>
              <Link
                href="/collection"
                className="px-6 py-3 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition"
              >
                View All Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white/90 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-orange-100 hover:border-orange-300 group"
              >
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-2xl">
                  <img
                    src={product.image && product.image.length > 0 ? product.image[0] : "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"}
                    alt={product.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => handleWishlist(product._id)}
                      className={`p-2 rounded-full shadow-lg transition ${
                        isInWishlist(product._id)
                          ? 'bg-pink-500 text-white'
                          : 'bg-white/80 text-gray-600 hover:bg-pink-100'
                      }`}
                    >
                      <FiHeart size={16} />
                    </button>
                  </div>
                  {product.stock < 10 && (
                    <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Low Stock
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                    <div className="flex items-center">
                      {renderStars(product.rating || 0)}
                      <span className="text-xs text-gray-500 ml-1">({product.rating || 0})</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-orange-800 mb-2 group-hover:text-orange-600 transition">
                    {product.title}
                  </h3>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-pink-600">₹{product.price}</span>
                    <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/view-product?id=${product._id}`}
                      className="flex-1 py-2 px-4 bg-orange-100 text-orange-700 font-semibold rounded-lg hover:bg-orange-200 transition text-center"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      disabled={addingToCart[product._id] || product.stock === 0}
                      className={`py-2 px-4 rounded-lg transition flex items-center justify-center ${
                        isInCart(product._id)
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : addingToCart[product._id]
                            ? 'bg-orange-400 text-white cursor-not-allowed'
                            : product.stock === 0
                              ? 'bg-gray-400 text-white cursor-not-allowed'
                              : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      {addingToCart[product._id] ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : isInCart(product._id) ? (
                        <span className="text-sm">✓ Added</span>
                      ) : (
                        <FiShoppingCart size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2 bg-white/90 rounded-2xl shadow-lg p-4 border-2 border-orange-100">
              {/* Previous Page */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-orange-600 hover:bg-orange-100'
                }`}
              >
                <FiChevronLeft size={20} />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {/* First page */}
                {currentPage > 3 && (
                  <>
                    <button
                      onClick={() => handlePageChange(1)}
                      className="px-3 py-2 rounded-lg text-orange-600 hover:bg-orange-100 transition"
                    >
                      1
                    </button>
                    {currentPage > 4 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                  </>
                )}

                {/* Current page and neighbors */}
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  const page = currentPage - 1 + i;
                  if (page < 1 || page > totalPages) return null;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-lg transition ${
                        page === currentPage
                          ? 'bg-orange-500 text-white'
                          : 'text-orange-600 hover:bg-orange-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                {/* Last page */}
                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className="px-3 py-2 rounded-lg text-orange-600 hover:bg-orange-100 transition"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              {/* Next Page */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-orange-600 hover:bg-orange-100'
                }`}
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Wrap CollectionPage in Suspense for useSearchParams
export default function CollectionPageWithSuspense() {
  return (
    <Suspense fallback={<div>Loading collection...</div>}>
      <CollectionPage />
    </Suspense>
  );
}