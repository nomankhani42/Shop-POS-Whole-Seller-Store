'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OwnerLayout from '@/Layout/owner/OwnerLayout';
import { FaPlus } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';
import FileUpload from '@/Components/FileUpload';

interface Category {
  _id: string;
  title: string;
}

interface Product {
  name: string;
  sku: string;
  category: string;
  brand: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  minStock: number;
  discount: number;
  ownerNotes: string;
  imageUrl: string | null;
}

const AddProduct: React.FC = () => {
  const [product, setProduct] = useState<Product>({
    name: '',
    sku: '',
    category: '',
    brand: '',
    purchasePrice: 0,
    sellingPrice: 0,
    stock: 10,
    minStock: 10,
    discount: 0,
    ownerNotes: '',
    imageUrl: null, // Updated field name
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category/get-category');
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: ['purchasePrice', 'sellingPrice', 'discount', 'stock', 'minStock'].includes(name) ? parseFloat(value) || 0 : value,
    }));
  };

  const handleImageUploadSuccess = (response: { url: string }) => {
    setProduct((prev) => ({ ...prev, imageUrl: response.url })); // Updated to imageUrl
    setIsUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.name || !product.sku || !product.category || !product.brand || !product.sellingPrice || !product.stock || !product.imageUrl) {
      alert('Please fill all required fields and upload an image!');
      return;
    }

    try {
      const response = await axios.post('/api/product/add-product', product);
      alert(response.data.message);
      setProduct({
        name: '',
        sku: '',
        category: '',
        brand: '',
        purchasePrice: 0,
        sellingPrice: 0,
        stock: 10,
        minStock: 10,
        discount: 0,
        ownerNotes: '',
        imageUrl: null, // Reset image URL
      });
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product.');
    }
  };

  return (
    <OwnerLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-red-600 mb-6 text-center">🛒 Add New Product</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-medium text-gray-800">Product Name</label>
              <input type="text" name="name" placeholder="Example: Apple iPhone 15" value={product.name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded focus:outline-none" required />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-800">SKU</label>
              <input type="text" name="sku" placeholder="Example: SKU123456" value={product.sku} onChange={handleInputChange} className="w-full px-3 py-2 border rounded focus:outline-none" required />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-800">Brand</label>
              <input type="text" name="brand" placeholder="Example: Apple" value={product.brand} onChange={handleInputChange} className="w-full px-3 py-2 border rounded focus:outline-none" required />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-800">Purchase Price</label>
              <input type="number" name="purchasePrice" placeholder="Example: 50000" value={product.purchasePrice} onChange={handleInputChange} className="w-full px-3 py-2 border rounded focus:outline-none" required />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-800">Owner Notes</label>
              <textarea name="ownerNotes" placeholder="Example: Limited stock available" value={product.ownerNotes} onChange={handleInputChange} className="w-full px-3 py-2 border rounded focus:outline-none"></textarea>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-medium text-gray-800">Category</label>
              <select name="category" value={product.category} onChange={handleInputChange} className="w-full px-3 py-2 border rounded focus:outline-none" required>
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-800">Stock</label>
              <input type="number" name="stock" placeholder="Example: 100" value={product.stock} onChange={handleInputChange} className="w-full px-3 py-2 border rounded focus:outline-none" required />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-800">Selling Price</label>
              <input type="number" name="sellingPrice" placeholder="Example: 55000" value={product.sellingPrice} onChange={handleInputChange} className="w-full px-3 py-2 border rounded focus:outline-none" required />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-800">Minimum Stock</label>
              <input type="number" name="minStock" placeholder="Example: 10" value={product.minStock} onChange={handleInputChange} className="w-full px-3 py-2 border rounded focus:outline-none" required />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-800">Discount (%)</label>
              <input type="number" name="discount" placeholder="Example: 10" value={product.discount} onChange={handleInputChange} className="w-full px-3 py-2 border rounded focus:outline-none" required />
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="col-span-2 w-[50%]">
            <label className="block text-lg font-medium text-gray-800">Upload Product Image</label>
            <FileUpload fileName="product_image" onUploadProgress={setUploadProgress} onUploadStart={() => setIsUploading(true)} onSuccess={handleImageUploadSuccess} />

            {isUploading && (
              <div className="mt-2 flex items-center">
                <ImSpinner2 className="animate-spin text-red-500 text-xl mr-2" />
                <p className="text-red-600">Uploading...</p>
              </div>
            )}

            {product.imageUrl && <img src={product.imageUrl} alt="Product" className="w-32 h-32 object-contain mt-4 border p-1" />}
          </div>

          <button type="submit" className="col-span-2 bg-red-500 text-white p-3 rounded hover:bg-red-600 transition">Add Product</button>
        </form>
      </div>
    </OwnerLayout>
  );
};

export default AddProduct;
