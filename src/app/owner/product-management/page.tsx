"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import OwnerLayout from "@/Layout/owner/OwnerLayout";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import Link from "next/link";
import DeleteProductModal from "@/Components/owner/Modal/DeleteProduct";

const API_URL = "/api/product/get-products";
const CATEGORY_API = "/api/category/get-category";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({}); // Store categories as an object
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch Categories and map _id to title
  const fetchCategories = async () => {
    try {
      const res = await axios.get(CATEGORY_API);
      const categoryMap = { All: "All" }; // Include "All" option
      res.data.categories.forEach((cat) => {
        categoryMap[cat._id] = cat.title; // Store category _id as key and title as value
      });
      setCategories(categoryMap);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Open Delete Modal
  const openDeleteModal = (id: string, name: string) => {
    setSelectedProduct({ id, name });
    setIsDeleteModalOpen(true);
  };

  // Close Delete Modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  // Refresh Product List
  const refreshProducts = () => {
    fetchProducts();
  };

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === "All" || product.category === categoryFilter)
    );
  });

  return (
    <OwnerLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">📦 Product Management</h1>

        {/* Top Bar: Search and Add Product */}
        <div className="flex items-center gap-4 mb-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-yellow-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-500" />
          </div>

          {/* Category Filter */}
          <select
            className="p-2 border rounded-lg bg-white cursor-pointer"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {Object.entries(categories).map(([id, title]) => (
              <option key={id} value={id}>
                {title}
              </option>
            ))}
          </select>

          {/* Add Product Button */}
          <Link href={"/owner/product-management/add-product"} className="bg-yellow-500 text-white px-5 py-2 rounded-lg flex items-center hover:bg-yellow-600 transition">
            <FaPlus className="mr-2" /> Add New Product
          </Link>
        </div>

        {/* Product Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-yellow-500 text-white">
              <tr className=" sticky top-0">
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">SKU</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Brand</th>
                <th className="p-3 text-left">Purchase Price</th>
                <th className="p-3 text-left">Selling Price</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Min Stock</th>
                <th className="p-3 text-left">Tax Rate</th>
                <th className="p-3 text-left">Discount</th>
                <th className="p-3 text-left">QR Code</th>
                <th className="p-3 text-center w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-100">
                  {/* Product Image */}
                  <td className="p-3">
                    <img
                      src={product.image || "/default-image.png"}
                      alt={product.name}
                      className="w-14 h-14 object-contain rounded-lg"
                      onError={(e) => (e.target.src = "/default-image.png")}
                    />
                  </td>

                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.sku}</td>

                  {/* Show Category Name instead of ID */}
                  <td className="p-3 capitalize">{categories[product.category] || "Unknown"}</td>

                  <td className="p-3">{product.brand}</td>
                  <td className="p-3">{product.purchasePrice}</td>
                  <td className="p-3">{product.sellingPrice}</td>
                  <td className="p-3">{product.stock}</td>
                  <td className="p-3">{product.minStock}</td>
                  <td className="p-3">{product.taxRate}%</td>
                  <td className="p-3">{product.discount}%</td>

                  {/* QR Code */}
                  <td className="p-3">
                    <img
                      src={product.qrCodeUrl || "/default-qr.png"}
                      alt="QR Code"
                      className="w-10 h-10 object-contain"
                      onError={(e) => (e.target.src = "/default-qr.png")}
                    />
                  </td>

                  {/* Actions */}
                  <td className="p-3 text-center w-40">
                    <div className="flex justify-center gap-2">
                      <Link href={`/owner/product-management/edit-product/${product._id}`} className="bg-blue-500 text-white px-2 py-1 rounded-lg flex items-center hover:bg-blue-600">
                        <FaEdit className="mr-1" /> Edit
                      </Link>
                      <button
                        onClick={() => openDeleteModal(product._id, product.name)}
                        className="bg-red-500 text-white px-2 py-1 rounded-lg flex items-center hover:bg-red-600"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="13" className="p-4 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Product Modal */}
      {selectedProduct && (
        <DeleteProductModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          onDeleteSuccess={refreshProducts}
        />
      )}
    </OwnerLayout>
  );
};

export default ProductManagement;
