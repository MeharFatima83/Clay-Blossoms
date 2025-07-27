"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { FiEdit, FiTrash2, FiImage } from "react-icons/fi";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API + '/api/products';

export default function ManageProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/getall`);
      setProducts(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch products");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setDeleting(id);
    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete product");
    }
    setDeleting("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 p-6 rounded-2xl shadow-xl border-2 border-orange-100">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-orange-700">Manage Products</h1>
        <Link href="/admin/add-product" className="px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg shadow hover:from-orange-600 hover:to-pink-600 transition-all duration-200">
          + Add Product
        </Link>
      </div>
      {loading ? (
        <div className="text-center py-16 text-lg text-gray-700">Loading products...</div>
      ) : error ? (
        <div className="text-center py-16 text-red-600">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-lg text-gray-700">No products found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white/90 rounded-xl shadow border border-orange-100">
            <thead>
              <tr className="bg-orange-100 text-orange-700">
                <th className="py-3 px-4 text-left">Image</th>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Stock</th>
                <th className="py-3 px-4 text-left">Rating</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-orange-50 hover:bg-orange-50/40 transition">
                  <td className="py-2 px-4">
                    {product.image && product.image.length > 0 ? (
                      <img src={product.image[0]} alt={product.title} className="w-16 h-16 object-cover rounded-lg border-2 border-orange-200" />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-orange-100 rounded-lg text-orange-400">
                        <FiImage size={28} />
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-4 font-semibold text-orange-800">{product.title}</td>
                  <td className="py-2 px-4 font-medium text-pink-600">₹{product.price}</td>
                  <td className="py-2 px-4">{product.category}</td>
                  <td className="py-2 px-4">{product.stock}</td>
                  <td className="py-2 px-4">{product.rating}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <Link
                      href={`/admin/edit-product/${product._id}`}
                      className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                      title="Edit"
                    >
                      <FiEdit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className={`p-2 rounded-lg bg-pink-100 text-pink-700 hover:bg-pink-200 transition ${deleting === product._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title="Delete"
                      disabled={deleting === product._id}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}