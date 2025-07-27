'use client';

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

// Wishlist item structure
// {
//   id: product._id,
//   title: product.title,
//   price: product.price,
//   image: product.image[0],
//   stock: product.stock
// }

const WishlistContext = createContext();

// Wishlist reducer for state management
const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST':
      // Check if item already exists
      if (state.items.some(item => item.id === action.payload.id)) {
        return state; // Item already exists, don't add again
      }
      return {
        ...state,
        items: [...state.items, action.payload]
      };

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'CLEAR_WISHLIST':
      return {
        ...state,
        items: []
      };

    case 'LOAD_WISHLIST':
      return {
        ...state,
        items: action.payload || []
      };

    default:
      return state;
  }
};

export function WishlistProvider({ children }) {
  const [state, dispatch] = useReducer(wishlistReducer, {
    items: []
  });
  const [isClient, setIsClient] = useState(false);

  // Set client flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load wishlist from localStorage on mount (only on client)
  useEffect(() => {
    if (!isClient) return;
    
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        const wishlistData = JSON.parse(savedWishlist);
        dispatch({ type: 'LOAD_WISHLIST', payload: wishlistData });
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }, [isClient]);

  // Save wishlist to localStorage whenever it changes (only on client)
  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem('wishlist', JSON.stringify(state.items));
  }, [state.items, isClient]);

  // Add item to wishlist
  const addToWishlist = (product) => {
    const wishlistItem = {
      id: product._id,
      title: product.title,
      price: product.price,
      image: product.image && product.image.length > 0 ? product.image[0] : '',
      stock: product.stock
    };
    
    dispatch({ type: 'ADD_TO_WISHLIST', payload: wishlistItem });
  };

  // Remove item from wishlist
  const removeFromWishlist = (productId) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
  };

  // Clear entire wishlist
  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  };

  // Get wishlist total items count
  const getWishlistItemCount = () => {
    return state.items.length;
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  // Get wishlist total value
  const getWishlistTotal = () => {
    return state.items.reduce((total, item) => total + item.price, 0);
  };

  const value = {
    items: state.items,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    getWishlistItemCount,
    isInWishlist,
    getWishlistTotal,
    isClient
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
} 