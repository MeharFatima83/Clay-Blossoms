'use client';

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "../../../components/CartContext";

function ViewProductPage() {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [wish, setWish] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const { addToCart, isInCart, getItemQuantity } = useCart();

  // Calculate total price based on quantity
  const totalPrice = product ? product.price * qty : 0;

  // Check if product is already in cart
  const isProductInCart = product ? isInCart(product._id) : false;
  const cartQuantity = product ? getItemQuantity(product._id) : 0;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("Product ID is required");
        setLoading(false);
        setLoadingRelated(false);
        return;
      }

      try {
        setLoading(true);
        setLoadingRelated(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/products/get/${productId}`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const productData = await response.json();
        setProduct(productData);

        // Fetch related products (excluding current product)
        try {
          const allProductsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/products/getall`);
          if (allProductsResponse.ok) {
            const allProducts = await allProductsResponse.json();
            const related = allProducts
              .filter(p => p._id !== productId)
              .slice(0, 3); // Get 3 related products
            setRelatedProducts(related);
          }
        } catch (relatedError) {
          console.error('Error fetching related products:', relatedError);
          // Don't show error for related products, just leave empty
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setLoadingRelated(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Keyboard navigation for image gallery
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!product || !product.image || product.image.length <= 1) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedImageIndex(selectedImageIndex === 0 ? product.image.length - 1 : selectedImageIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedImageIndex(selectedImageIndex === product.image.length - 1 ? 0 : selectedImageIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, selectedImageIndex]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  const handleWishlist = () => {
    setWish((w) => !w);
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 min-h-screen py-12 px-4">
        <div className="max-w-5xl mx-auto bg-white/90 rounded-2xl shadow-xl p-8 border-2 border-orange-100">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 min-h-screen py-12 px-4">
        <div className="max-w-5xl mx-auto bg-white/90 rounded-2xl shadow-xl p-8 border-2 border-orange-100 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "The product you're looking for doesn't exist."}</p>
          <Link href="/collection" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full shadow hover:from-orange-600 hover:to-pink-600 transition-all duration-200">
            Back to Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 min-h-screen py-12 px-4">
      {/* Breadcrumb Navigation */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-600 transition">Home</Link>
            <span>/</span>
            <Link href="/collection" className="hover:text-orange-600 transition">Collection</Link>
            <span>/</span>
            <span className="text-orange-600 font-medium">{product.title}</span>
          </nav>
          <Link 
            href="/collection" 
            className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to Collection
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-white/90 rounded-2xl shadow-xl p-8 border-2 border-orange-100 flex flex-col md:flex-row gap-10">
        {/* Product Image */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative mb-6">
            <img
              src={product.image && product.image.length > 0 ? product.image[selectedImageIndex] : "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80"}
              alt={product.title}
              className="w-80 h-80 object-cover rounded-3xl border-4 border-orange-100 shadow-lg"
            />
            
            {/* Navigation Arrows */}
            {product.image && product.image.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex(selectedImageIndex === 0 ? product.image.length - 1 : selectedImageIndex - 1)}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-orange-600 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  aria-label="Previous image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  onClick={() => setSelectedImageIndex(selectedImageIndex === product.image.length - 1 ? 0 : selectedImageIndex + 1)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-orange-600 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  aria-label="Next image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </>
            )}
            
            {product.image && product.image.length > 1 && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-3 py-1 text-xs text-gray-600 border border-orange-200">
                {selectedImageIndex + 1} of {product.image.length}
              </div>
            )}
          </div>
          
          {/* Image Gallery (if multiple images) */}
          {product.image && product.image.length > 1 && (
            <div className="flex gap-2 mb-6 flex-wrap justify-center">
              {product.image.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.title} - Image ${index + 1}`}
                  className={`w-16 h-16 object-cover rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedImageIndex === index 
                      ? 'border-orange-500 shadow-lg scale-105' 
                      : 'border-orange-200 hover:border-orange-400'
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                />
              ))}
            </div>
          )}
          
          <div className="flex gap-4">
            <button
              onClick={handleWishlist}
              className={`p-3 rounded-full border-2 ${wish ? 'bg-pink-100 border-pink-400' : 'bg-white border-orange-100'} shadow hover:bg-pink-200 transition`}
              aria-label="Add to Wishlist"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill={wish ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="#E07A5F" className="w-7 h-7 text-pink-400">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: product.title,
                    text: product.description,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              }}
              className="p-3 rounded-full border-2 bg-white border-orange-100 shadow hover:bg-orange-50 transition"
              aria-label="Share Product"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#E07A5F" className="w-7 h-7 text-orange-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0-3.933-2.185 2.25 2.25 0 0 0 3.933 2.185Z" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-1 bg-orange-100 rounded-full text-orange-700 font-bold text-lg hover:bg-orange-200 transition">-</button>
              <span className="px-3 text-gray-800 font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-1 bg-orange-100 rounded-full text-orange-700 font-bold text-lg hover:bg-orange-200 transition">+</button>
            </div>
          </div>
        </div>
        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-orange-700 mb-2">{product.title}</h1>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-lg ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600">({product.rating || 0} rating)</span>
          </div>
          
          {/* Price Display */}
          <div className="mb-4">
            <span className="text-2xl text-pink-600 font-bold">₹{product.price}</span>
            {qty > 1 && (
              <div className="mt-2">
                <span className="text-sm text-gray-600">Quantity: {qty}</span>
                <div className="text-lg font-bold text-green-600">
                  Total: ₹{totalPrice}
                </div>
              </div>
            )}
          </div>
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">{product.description}</p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 w-20">Category:</span>
              <span className="text-sm font-medium text-orange-600 bg-orange-100 px-3 py-1 rounded-full">{product.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 w-20">Stock:</span>
              <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </span>
            </div>
            {product.stock > 0 && product.stock < 10 && (
              <div className="text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
                ⚠️ Only {product.stock} left in stock!
              </div>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className={`w-full py-3 font-bold rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 mb-4 disabled:opacity-50 disabled:cursor-not-allowed ${
              isProductInCart 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : added 
                  ? 'bg-green-500 text-white' 
                  : product.stock === 0 
                    ? 'bg-gray-400 text-white' 
                    : 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white'
            }`}
            disabled={added || product.stock === 0}
          >
            {added ? 'Added to Cart!' : product.stock === 0 ? 'Out of Stock' : isProductInCart ? `In Cart (${cartQuantity})` : 'Add to Cart'}
          </button>
          <Link href="/cart" className="w-full block text-center py-3 bg-orange-100 text-orange-700 font-semibold rounded-full shadow hover:bg-orange-200 transition mb-2">
            Go to Cart
          </Link>
        </div>
      </div>
      {/* Related Products */}
      <div className="max-w-5xl mx-auto mt-16">
        <h2 className="text-2xl font-bold text-orange-700 mb-6">You may also like</h2>
        
        {loadingRelated ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/90 rounded-2xl shadow-lg p-6 border-2 border-orange-100 flex flex-col items-center">
                <div className="w-32 h-32 bg-gray-200 rounded-2xl mb-4 animate-pulse"></div>
                <div className="w-24 h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="w-16 h-3 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="w-20 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : relatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map((item) => (
              <div key={item._id} className="bg-white/90 rounded-2xl shadow-lg p-6 border-2 border-orange-100 flex flex-col items-center">
                <img src={item.image && item.image.length > 0 ? item.image[0] : "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"} alt={item.title} className="w-32 h-32 object-cover rounded-2xl mb-4 border-4 border-orange-200" />
                <span className="text-lg font-bold text-orange-700 mb-1">{item.title}</span>
                <span className="text-md text-gray-700 mb-2">₹{item.price}</span>
                <Link href={`/view-product?id=${item._id}`} className="px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full shadow hover:from-orange-600 hover:to-pink-600 transition-all duration-200 mt-2">
                  View Product
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No related products found</p>
            <Link href="/collection" className="px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full shadow hover:from-orange-600 hover:to-pink-600 transition-all duration-200">
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Wrap ViewProductPage in Suspense for useSearchParams
export default function ViewProductPageWithSuspense() {
  return (
    <Suspense fallback={<div>Loading product...</div>}>
      <ViewProductPage />
    </Suspense>
  );
}