"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  FiUpload,
  FiImage,
  FiDollarSign,
  FiTag,
  FiLayers,
  FiBox,
  FiStar,
} from "react-icons/fi";

const categories = [
  "Dinning", "Pots", "Jugs", "Mugs", "Plates", "Home Decor", "Vases", "Others"
];

const validationSchema = Yup.object({
  title: Yup.string().min(3).max(100).required("Title is required"),
  description: Yup.string().min(10).required("Description is required"),
  price: Yup.number().min(0).required("Price is required"),
  category: Yup.string().oneOf(categories).required("Category is required"),
  stock: Yup.number().min(0).required("Stock is required"),
  rating: Yup.number().min(0).max(5),
  images: Yup.array().min(1, "At least one image is required"),
});

const CLOUDINARY_UPLOAD_PRESET = "ecommerce";
const CLOUDINARY_CLOUD_NAME = "dxio8y3t5";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API + '/api/products';

export default function EditProduct() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id;
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/get/${productId}`);
        const p = res.data;
        setInitialValues({
          title: p.title || "",
          description: p.description || "",
          price: p.price || 0,
          category: p.category || "",
          stock: p.stock || 0,
          rating: p.rating || 0,
          images: p.image || [],
        });
        setError("");
      } catch (err) {
        setError("Failed to fetch product.");
      }
      setLoading(false);
    };
    fetchProduct();
  }, [productId]);

  const handleImageUpload = async (files, setFieldValue, values) => {
    setUploading(true);
    const uploadedImages = [...values.images];
    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      try {
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );
        uploadedImages.push(res.data.secure_url);
      } catch (err) {
        alert("Image upload failed");
      }
    }
    setFieldValue("images", uploadedImages);
    setUploading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50">
        <div className="text-lg text-orange-700 font-semibold">Loading product...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50">
        <div className="text-lg text-red-600 font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 py-10">
      <div className="w-full max-w-2xl p-8 bg-white/95 rounded-2xl shadow-2xl border-2 border-orange-100">
        <h2 className="text-3xl font-extrabold mb-8 flex items-center gap-3 text-orange-700 drop-shadow">
          <FiBox className="text-orange-500" /> Edit Product
        </h2>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await axios.put(`${API_URL}/update/${productId}`, {
                ...values,
                image: values.images,
              });
              alert("Product updated successfully!");
              router.push("/admin/manage-product");
            } catch (err) {
              alert("Failed to update product");
            }
            setSubmitting(false);
          }}
        >
          {({ setFieldValue, isSubmitting, values }) => (
            <Form className="space-y-6">
              {/* Title */}
              <div>
                <label className="block font-semibold mb-2 flex items-center gap-2 text-orange-700">
                  <FiTag className="text-orange-500" /> Title
                </label>
                <Field
                  name="title"
                  className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none bg-white text-orange-900 placeholder:text-orange-400"
                  placeholder="Enter product title"
                />
                <ErrorMessage name="title" component="div" className="text-pink-600 text-xs mt-1" />
              </div>
              {/* Images */}
              <div>
                <label className="block font-semibold mb-2 flex items-center gap-2 text-orange-700">
                  <FiImage className="text-orange-500" /> Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  id="image-upload"
                  className="hidden"
                  onChange={e => handleImageUpload(e.target.files, setFieldValue, values)}
                  disabled={uploading}
                />
                <label
                  htmlFor="image-upload"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition
                    ${uploading ? 'bg-orange-300' : 'bg-orange-500 hover:bg-orange-600'} text-white font-medium`}
                >
                  <FiUpload />
                  {uploading ? 'Uploading...' : 'Upload Images'}
                </label>
                <ErrorMessage name="images" component="div" className="text-pink-600 text-xs mt-1" />
                <div className="flex gap-3 mt-3 flex-wrap">
                  {values.images &&
                    values.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt="preview"
                          className="w-20 h-20 object-cover rounded-lg border border-orange-200 shadow"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-pink-500 text-white rounded-full p-1 text-xs opacity-80 group-hover:opacity-100 transition"
                          onClick={() => setFieldValue("images", values.images.filter((_, i) => i !== idx))}
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                </div>
              </div>
              {/* Description */}
              <div>
                <label className="block font-semibold mb-2 flex items-center gap-2 text-orange-700">
                  <FiLayers className="text-orange-500" /> Description
                </label>
                <Field
                  as="textarea"
                  name="description"
                  className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none resize-none bg-white text-orange-900 placeholder:text-orange-400"
                  placeholder="Enter product description"
                  rows={4}
                />
                <ErrorMessage name="description" component="div" className="text-pink-600 text-xs mt-1" />
              </div>
              {/* Price, Stock, Rating */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-2 flex items-center gap-2 text-orange-700">
                    <FiDollarSign className="text-orange-500" /> Price
                  </label>
                  <Field
                    name="price"
                    type="number"
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none bg-white text-orange-900 placeholder:text-orange-400"
                    placeholder="0"
                    min="0"
                  />
                  <ErrorMessage name="price" component="div" className="text-pink-600 text-xs mt-1" />
                </div>
                <div>
                  <label className="block font-semibold mb-2 flex items-center gap-2 text-orange-700">
                    <FiBox className="text-orange-500" /> Stock
                  </label>
                  <Field
                    name="stock"
                    type="number"
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none bg-white text-orange-900 placeholder:text-orange-400"
                    placeholder="0"
                    min="0"
                  />
                  <ErrorMessage name="stock" component="div" className="text-pink-600 text-xs mt-1" />
                </div>
                <div>
                  <label className="block font-semibold mb-2 flex items-center gap-2 text-orange-700">
                    <FiStar className="text-orange-500" /> Rating
                  </label>
                  <Field
                    name="rating"
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none bg-white text-orange-900 placeholder:text-orange-400"
                    placeholder="0-5"
                    min="0"
                    max="5"
                  />
                  <ErrorMessage name="rating" component="div" className="text-pink-600 text-xs mt-1" />
                </div>
              </div>
              {/* Category */}
              <div>
                <label className="block font-semibold mb-2 flex items-center gap-2 text-orange-700">
                  <FiLayers className="text-orange-500" /> Category
                </label>
                <Field
                  as="select"
                  name="category"
                  className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none bg-white text-orange-900"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="category" component="div" className="text-pink-600 text-xs mt-1" />
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-600 to-orange-800 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:from-orange-700 hover:to-orange-900 transition"
                disabled={isSubmitting || uploading}
              >
                <FiUpload />
                {isSubmitting ? 'Updating...' : 'Update Product'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
} 