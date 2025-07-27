'use client';
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {
  FiUpload,
  FiImage,
  FiDollarSign,
  FiTag,
  FiLayers,
  FiBox,
  FiStar,
} from 'react-icons/fi';

const categories = [
  'Dinning',
  'Pots',
  'Jugs',
  'Mugs',
  'Plates',
  'Home Decor',
  'Vases',
  'Others',
];

const validationSchema = Yup.object({
  title: Yup.string().min(3).max(100).required('Title is required'),
  description: Yup.string().min(10).required('Description is required'),
  price: Yup.number().min(0).required('Price is required'),
  category: Yup.string().oneOf(categories).required('Category is required'),
  stock: Yup.number().min(0).required('Stock is required'),
  rating: Yup.number().min(0).max(5),
  images: Yup.array().min(1, 'At least one image is required'),
});

const CLOUDINARY_UPLOAD_PRESET = 'ecommerce'; // Replace with your preset
const CLOUDINARY_CLOUD_NAME = 'dxio8y3t5';// Replace with your cloud name

const AddProduct = () => {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (files, setFieldValue) => {
    setUploading(true);
    const uploadedImages = [];
    for (let file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      try {
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );
        uploadedImages.push(res.data.secure_url);
      } catch (err) {
        alert('Image upload failed');
      }
    }
    setFieldValue('images', uploadedImages);
    setUploading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 py-10">
      <div className="w-full max-w-2xl p-8 bg-white/95 rounded-2xl shadow-2xl border-2 border-orange-100">
        <h2 className="text-3xl font-extrabold mb-8 flex items-center gap-3 text-orange-700 drop-shadow">
          <FiBox className="text-orange-500" /> Add New Product
        </h2>
        <Formik
          initialValues={{
            title: '',
            description: '',
            price: '',
            category: '',
            stock: '',
            rating: '',
            images: [],
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            try {
              await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/products/add`, {
                ...values,
                image: values.images, // backend expects 'image' field (array), not 'images'
              });
              alert('Product added successfully!');
              resetForm();
            } catch (err) {
              alert('Failed to add product');
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
                  onChange={e => handleImageUpload(e.target.files, setFieldValue)}
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
                      <img
                        key={idx}
                        src={img}
                        alt="preview"
                        className="w-20 h-20 object-cover rounded-lg border border-orange-200 shadow"
                      />
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
                {isSubmitting ? 'Submitting...' : 'Add Product'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddProduct;