'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OwnerLayout from '@/Layout/owner/OwnerLayout';
import { FaPlus } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';
import FileUpload from '@/Components/FileUpload';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';


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
    stock: 0,
    minStock: 0,
    discount: 0,
    ownerNotes: '',
    imageUrl: null,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [loading,setLoading]=useState<boolean>(false)
  const router=useRouter()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category/get-category');
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch categories.');
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: ['purchasePrice', 'sellingPrice', 'discount', 'stock', 'minStock'].includes(name)
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleImageUploadSuccess = (response: { url: string }) => {
    setProduct((prev) => ({ ...prev, imageUrl: response.url }));
    setIsUploading(false);
    
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.name || !product.sku || !product.category || !product.brand || !product.sellingPrice || !product.imageUrl) {
      toast.warn('Please fill all required fields and upload an image!');
      return;
    }

    try {
      setLoading(true)
      const response = await axios.post('/api/product/add-product', product);
      if(response.data.success){
        setLoading(false)
        toast.success(response.data.message || 'Product added successfully!');
      setProduct({
        name: '',
        sku: '',
        category: '',
        brand: '',
        purchasePrice: 0,
        sellingPrice: 0,
        stock: 0,
        minStock: 0,
        discount: 0,
        ownerNotes: '',
        imageUrl: null,
      });

      router.push("/owner/product-management")

      }

      
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast.error(error.response?.data?.message || 'Failed to add product.');
    }
  };

  return (
    <OwnerLayout>
      <div className="min-h-screen bg-gray-50 px-4 py-6">
        <ToastContainer />
        <div className="max-w-5xl mx-auto bg-white p-5 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4 flex items-center gap-2">
            <FaPlus /> Add New Product
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-y-3">

            {/* Product Info */}
            <section>
              <h3 className="text-base font-semibold text-gray-800 mb-2">🛒 Product Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InputField label="Product Name" name="name" value={product.name} onChange={handleInputChange} placeholder="Apple iPhone 15" />
                <InputField label="SKU" name="sku" value={product.sku} onChange={handleInputChange} placeholder="SKU123456" />
                <InputField label="Brand" name="brand" value={product.brand} onChange={handleInputChange} placeholder="Apple" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={product.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border rounded-md text-sm"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Pricing */}
            <section>
              <h3 className="text-base font-semibold text-gray-800 mb-2">💰 Pricing & Inventory</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InputField type="number" label="Purchase Price" name="purchasePrice" value={product.purchasePrice} onChange={handleInputChange} placeholder="50000" />
                <InputField type="number" label="Selling Price" name="sellingPrice" value={product.sellingPrice} onChange={handleInputChange} placeholder="55000" />
                <InputField type="number" label="Discount (%)" name="discount" value={product.discount} onChange={handleInputChange} placeholder="10%" />
                <InputField type="number" label="Stock" name="stock" value={product.stock} onChange={handleInputChange} placeholder="System managed" disabled />
                <InputField type="number" label="Min Stock" name="minStock" value={product.minStock} onChange={handleInputChange} placeholder="System managed" disabled />
              </div>
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner Notes</label>
                <textarea
                  name="ownerNotes"
                  value={product.ownerNotes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="e.g. High demand expected for Eid season..."
                  className="w-full px-3 py-1.5 border rounded-md resize-none text-sm"
                />
              </div>
            </section>

            {/* Image */}
            <section>
              <h3 className="text-base font-semibold text-gray-800 mb-2">🖼️ Product Image</h3>
              <FileUpload
                fileName="product_image"
                onUploadProgress={setUploadProgress}
                onUploadStart={() => setIsUploading(true)}
                onSuccess={handleImageUploadSuccess}
              />
              {isUploading && (
                <div className="mt-2 flex items-center text-yellow-600 text-sm">
                  <ImSpinner2 className="animate-spin mr-2" /> Uploading...
                </div>
              )}
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt="Uploaded"
                  className="mt-3 w-28 h-28 object-contain border rounded"
                />
              )}
            </section>

            {/* Submit */}
            <div className="text-center pt-2 mr-auto">
              <button disabled={loading}
                type="submit"
                className="  bg-yellow-500 py-2 px-6 text-white  rounded-md"
              >
                {loading ?<Loader className=' h-6 w-6 my-1 mx-3 animate-spin text-white' />:(<span className='flex flex-row items-center gap-x-5 '><FaPlus /> Add Product</span>)}
              </button>
            </div>
          </form>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default AddProduct;

// Reusable InputField
const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
}: {
  label: string;
  name: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-3 py-1.5 border rounded-md text-sm ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
    />
  </div>
);
