'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OwnerLayout from '@/Layout/owner/OwnerLayout';
import { Plus, X, Trash2, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Image from 'next/image';

// Interfaces
interface Product {
  _id: string;
  name: string;
  stock: number;
  sellingPrice: number;
  image?: string;
}

interface Stock {
  _id: string;
  createdAt: string;
  stockStatus: 'Received' | 'Pending';
  products: {
    productId: string;
    productName: string;
    quantity: number;
  }[];
}

interface StockHistoryItem {
  stockId: string;
  date: string;
  totalProducts: number;
  totalQuantities: number;
  status: 'Received' | 'Pending';
  products: { productId: string; productName: string; quantity: number }[];
}

const StockPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockHistory, setStockHistory] = useState<StockHistoryItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addList, setAddList] = useState<{ id: string; quantity: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addStockLoading, setAddStockLoading] = useState<boolean>(false);
  const router = useRouter();

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/product/get-products');
      if (res.data?.success && Array.isArray(res.data.products)) {
        setProducts(res.data.products);
        setError(null);
      } else {
        setError('Failed to fetch products: Invalid response structure.');
      }
    } catch (err) {
      console.error('Error fetching products:', err); // Log the error for debugging
      setError('Error fetching products.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch stock history
  const fetchStaticStockHistory = async () => {
    try {
      const res = await axios.get('/api/stock/get-complete-stock');
      if (res.data.success && Array.isArray(res.data.stocks)) {
        const history = res.data.stocks.map((stock: Stock) => ({
          stockId: stock._id,
          date: new Date(stock.createdAt).toLocaleString(),
          totalProducts: stock.products.length,
          totalQuantities: stock.products.reduce(
            (sum: number, product) => sum + product.quantity,
            0
          ),
          status: stock.stockStatus,
          products: stock.products.map((product) => ({
            productId: product.productId,
            productName: product.productName,
            quantity: product.quantity,
          })),
        }));
        setStockHistory(history);
      }
    } catch (err) {
      console.error('Error fetching stock history:', err); // Log the error for debugging
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchStaticStockHistory();
  }, []);

  const handleConfirmAdd = async () => {
    if (addList.length === 0) {
      toast.warn('Please add at least one product to the list.');
      return;
    }

    try {
      setAddStockLoading(true);
      const result = await axios.post('/api/stock/add-stock', {
        products: addList.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });

      if (result.data.success) {
        toast.success('Stock added successfully!');
        setAddStockLoading(false);
        setAddList([]); // Clear the add list
        fetchProducts(); // Refresh the product list
        fetchStaticStockHistory();
        setIsAddModalOpen(false); // Close the modal
      } else {
        toast.error('Failed to add stock.');
        setAddStockLoading(false);
      }
    } catch (err) {
      console.error('Error adding stock:', err); // Log the error for debugging
      toast.error('An error occurred while adding stock.');
    }
  };

  return (
    <OwnerLayout>
      <div className="p-6 space-y-10 bg-gray-50 min-h-screen">
        <Header onAddStock={() => setIsAddModalOpen(true)} />

        {loading ? (
          <LoaderComponent />
        ) : error ? (
          <ErrorComponent error={error} />
        ) : (
          <>
            <StockSection title="✅ Available Stock" products={products.filter((p) => p.stock > 10)} borderColor="border-green-500" />
            <StockSection title="⚠️ Low Stock (less than 10)" products={products.filter((p) => p.stock > 0 && p.stock <= 10)} borderColor="border-yellow-500" />
            <StockSection title="🟥 Out of Stock" products={products.filter((p) => p.stock === 0)} borderColor="border-red-500" />
            <StockHistorySection
              stockHistory={stockHistory}
              onViewDetails={(id) => router.push(`/owner/stock-management/details?id=${id}`)}
            />
          </>
        )}

        {isAddModalOpen && (
          <AddStockModal
            addStockLoading={addStockLoading}
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            products={products}
            addList={addList}
            onAddProduct={(id) => setAddList((prev) => [...prev, { id, quantity: 1 }])}
            onQuantityChange={(id, quantity) =>
              setAddList((prev) =>
                prev.map((item) => (item.id === id ? { ...item, quantity } : item))
              )
            }
            onRemoveProduct={(id) => setAddList((prev) => prev.filter((item) => item.id !== id))}
            onConfirm={handleConfirmAdd}
          />
        )}
      </div>
    </OwnerLayout>
  );
};

export default StockPage;

/* ---------------- Reusable Components ---------------- */

const Header = ({ onAddStock }: { onAddStock: () => void }) => (
  <div className="flex justify-between items-center">
    <h1 className="text-3xl font-bold text-yellow-600">Stock Management</h1>
    <button
      onClick={onAddStock}
      className="bg-yellow-600 hover:bg-yellow-700 transition-colors text-white px-4 py-2 rounded flex items-center gap-2"
    >
      <Plus className="w-4 h-4" /> Add Stock
    </button>
  </div>
);

const LoaderComponent = () => (
  <div className="flex justify-center items-center py-12">
    <Loader className="w-8 h-8 text-yellow-500 animate-spin" />
  </div>
);

const ErrorComponent = ({ error }: { error: string }) => (
  <p className="text-red-600">{error}</p>
);

const StockSection = ({
  title,
  products,
  borderColor,
}: {
  title: string;
  products: Product[];
  borderColor: string;
}) => (
  <section className="space-y-4">
    <h2 className="text-xl font-semibold">{title}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.length > 0 ? (
        products.map((product) => (
          <div
            key={product._id}
            className={`border-l-4 ${borderColor} bg-white shadow p-4 rounded flex items-center gap-4`}
          >
            {product.image && (
              <Image src={product.image} height={56} width={56} alt={product.name} className="rounded object-cover" />
            )}
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600">Stock: {product.stock}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No products here.</p>
      )}
    </div>
  </section>
);

const StockHistorySection = ({
  stockHistory,
  onViewDetails,
}: {
  stockHistory: StockHistoryItem[];
  onViewDetails: (stockId: string) => void;
}) => (
  <section className="mt-10">
    <h2 className="text-xl font-semibold mb-4">🕘 Stock History</h2>
    {stockHistory.length > 0 ? (
      <div className="bg-white rounded-md shadow p-4 overflow-x-auto">
        <table className="w-full table-auto border text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-3">Date & Time</th>
              <th className="border p-3">Stock ID</th>
              <th className="border p-3">Total Products</th>
              <th className="border p-3">Total Quantities</th>
              <th className="border p-3">Status</th>
              <th className="border p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stockHistory.map((entry) => (
              <tr key={entry.stockId} className="hover:bg-gray-50">
                <td className="border p-3">{entry.date}</td>
                <td className="border p-3">{entry.stockId}</td>
                <td className="border p-3">{entry.totalProducts}</td>
                <td className="border p-3">{entry.totalQuantities}</td>
                <td className={`border p-3 font-semibold ${entry.status === 'Received' ? 'text-green-500' : 'text-red-500'}`}>
                  {entry.status}
                </td>
                <td className="border p-3 text-center">
                  <button
                    onClick={() => onViewDetails(entry.stockId)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-gray-500">No stock history available.</p>
    )}
  </section>
);

// Add Stock Modal Component
const AddStockModal = ({
  isOpen,
  addStockLoading,
  onClose,
  products,
  addList,
  onAddProduct,
  onQuantityChange,
  onRemoveProduct,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  addStockLoading: boolean;
  addList: { id: string; quantity: number }[];
  onAddProduct: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemoveProduct: (id: string) => void;
  onConfirm: () => void;
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const availableProductsForDropdown = products.filter(
    (product) => !addList.some((item) => item.id === product._id)
  );
  const filteredProductsForDropdown = availableProductsForDropdown.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <div
        className="bg-white p-6 rounded-lg w-full max-w-xl shadow-xl relative overflow-y-auto"
        style={{ maxHeight: '80vh', minHeight: '500px' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
        >
          <X />
        </button>

        {/* Modal title */}
        <h3 className="text-lg font-semibold mb-6 text-center">Add Stock</h3>

        {/* Dropdown */}
        <div className="relative mb-6">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="bg-yellow-600 text-white px-4 py-2 rounded w-full flex justify-between items-center"
          >
            Select Product
            <span>{dropdownOpen ? '▲' : '▼'}</span>
          </button>
          {dropdownOpen && (
            <div className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto bg-white shadow-lg rounded border p-2 space-y-2">
              {/* Search Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-3 py-2 mb-2 border rounded focus:outline-none focus:ring focus:ring-yellow-300"
              />
              {/* Filtered Products */}
              {filteredProductsForDropdown.length > 0 ? (
                filteredProductsForDropdown.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => {
                      onAddProduct(product._id); // Add product to the list
                      setDropdownOpen(false); // Close dropdown
                    }}
                    className="flex items-center gap-2 p-2 hover:bg-yellow-100 cursor-pointer rounded"
                  >
                    {product.image && (
                      <Image src={product.image} height={40} width={40} alt={product.name} className=" rounded object-cover" />
                    )}
                    <span className="flex-1">{product.name}</span>
                    {/* Display Available Stock in Dropdown */}
                    <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No products found.</p>
              )}
            </div>
          )}
        </div>

        {/* Selected products with quantity */}
        <div className="mb-6 space-y-4">
          {addList.length > 0 ? (
            addList.map((item) => {
              const product = products.find((p) => p._id === item.id);
              return (
                product && (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 border p-4 rounded shadow"
                  >
                    <div className="flex items-center gap-4">
                      {product.image && (
                        <Image
                        width={48}
                        height={48}
                          src={product.image}
                          alt={product.name}
                          className=" rounded object-cover"
                        />
                      )}
                      <div>
                        <h4 className="font-semibold">{product.name}</h4>
                        <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button disabled={addStockLoading}
                        onClick={() => onRemoveProduct(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <input
                        type="number"
                        disabled={addStockLoading}
                        value={item.quantity}
                        onChange={(e) =>
                          onQuantityChange(item.id, parseInt(e.target.value) || 0)
                        }
                        min="1"
                        max={product.stock} // Ensure that the input doesn't exceed available stock
                        className="w-16 text-center border p-2 rounded"
                      />
                    </div>
                  </div>
                )
              );
            })
          ) : (
            <p className="text-gray-500">No products added yet.</p>
          )}
        </div>

        {/* Confirm button */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded"
          >
            Cancel
          </button>
          <button
           disabled={addStockLoading}
            onClick={onConfirm}
            className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700"
          >
            {addStockLoading ? (
              <Loader className="w-8 h-8 animate-spin" />
            ) : (
              'Confirm Add'
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
