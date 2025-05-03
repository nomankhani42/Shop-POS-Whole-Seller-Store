"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import OwnerLayout from "@/Layout/owner/OwnerLayout";
import { FaSave, FaArrowLeft, FaSpinner } from "react-icons/fa";
import Spinner from "@/Components/Spinner";
import FileUpload from "@/Components/FileUpload";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  minStock: number;
  barcode: string;
  qrCodeUrl: string;
  image: string;
  discount: number;
  ownerNotes: string;
}

interface Category {
  _id: string;
  title: string;
}

const EditProduct = () => {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Product>({
    _id: "",
    name: "",
    sku: "",
    category: "",
    brand: "",
    purchasePrice: 0,
    sellingPrice: 0,
    stock: 0,
    minStock: 0,
    barcode: "",
    qrCodeUrl: "",
    image: "",
    discount: 0,
    ownerNotes: "",
  });

  const [fetching, setFetching] = useState(false); // Fetching product state
  const [updating, setUpdating] = useState(false); // Updating product state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isModified, setIsModified] = useState(false); // Track if changes are made

  useEffect(() => {
    if (id) fetchProduct();
    fetchCategories();
  }, [id]);

  const fetchProduct = async () => {
    setFetching(true);
    try {
      const { data } = await axios.get(`/api/product/get-single-product/${id}`);
      if (data.success) {
        setProduct(data.product);
        setForm(data.product);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setFetching(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/category/get-category");
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setIsModified(true); // Mark form as modified
  };

  const handleImageUpload = async (fileUrl: string) => {
    setForm((prev) => ({ ...prev, image: fileUrl }));
    setUploading(false);
    setUploadProgress(0);
    setIsModified(true);
  };

  const handleUpdate = async () => {
    if (!form.name || !form.sku || !form.sellingPrice) return alert("Please fill in required fields.");
    setUpdating(true);

    try {
      await axios.put(`/api/product/update-product/${id}`, form);
      router.push("/owner/product-management");
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <OwnerLayout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg flex justify-between items-center border-b-4 border-yellow-500">
          <button
            className="text-gray-700 hover:text-gray-900 flex items-center font-semibold transition-all"
            onClick={() => router.back()}
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
          <button
            className={`px-6 py-2 rounded-lg flex items-center shadow-md transition-all ${
              isModified ? "bg-yellow-500 hover:bg-yellow-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleUpdate}
            disabled={!isModified || updating}
          >
            {updating ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />}
            {updating ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {fetching ? (
          <div className="flex justify-center mt-10">
            <Spinner />
          </div>
        ) : product ? (
          <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Details */}
              {[
                { label: "Product Name", name: "name" },
                { label: "SKU", name: "sku" },
                { label: "Brand", name: "brand" },
                { label: "Purchase Price", name: "purchasePrice", type: "number" },
                { label: "Selling Price", name: "sellingPrice", type: "number" },
                { label: "Stock Quantity", name: "stock", type: "number" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-gray-700 font-medium">{field.label}</label>
                  <input
                    disabled={field.name === "sku"}
                    type={field.type || "text"}
                    name={field.name}
                    className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-red-500"
                    value={(form as any)[field.name]}
                    onChange={handleChange}
                  />
                </div>
              ))}

              {/* Category Dropdown */}
              <div>
                <label className="block text-gray-700 font-medium">Category</label>
                <select
                  name="category"
                  className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-red-500"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-gray-700 font-medium">Product Image</label>
                <FileUpload
                  fileName={`product-${id}`}
                  folder="Products"
                  onUploadProgress={(progress) => {
                    setUploading(true);
                    setUploadProgress(progress);
                  }}
                  onUploadStart={() => {
                    setUploading(true);
                    setUploadProgress(10);
                  }}
                  onSuccess={(res) => handleImageUpload(res.url)}
                  onNewUpload={() => {
                    setForm((prev) => ({ ...prev, image: "" }));
                  }}
                />
                {uploading && (
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <FaSpinner className="animate-spin mr-2" />
                    Uploading... {uploadProgress}%
                  </div>
                )}
              </div>

              {/* Image Previews */}
              <div className="col-span-2 grid grid-cols-2 gap-6">
                <div className="flex items-center gap-x-5">
                  {form.barcode && <Image height={80} width={160} src={form.barcode} alt="Barcode" className=" mt-2 rounded-lg border object-contain" />}
                  {form.qrCodeUrl && <Image height={80} width={80} src={form.qrCodeUrl} alt="QR Code" className=" mt-2 rounded-lg border object-contain" />}
                </div>
                <div>
                  {form.image && !uploading && <Image height={160} width={160} src={form.image} alt="Product" className=" mt-2 rounded-lg border object-contain" />}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-10">Product not found.</p>
        )}
      </div>
    </OwnerLayout>
  );
};

export default EditProduct;
