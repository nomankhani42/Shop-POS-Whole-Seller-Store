'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OwnerLayout from '@/Layout/owner/OwnerLayout';
import { Plus, X, Trash2, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';


// Interfaces
interface Product {
  _id: string;
  name: string;
  stock: number;
  sellingPrice: number;
  image?: string;
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
      setError('Error fetching products.');
    } finally {
      setLoading(false);
    }
  };

  // Static stock history
  const fetchStaticStockHistory = () => {
    const staticHistory: StockHistoryItem[] = [
      {
        stockId: 'STK001',
        date: new Date().toLocaleString(),
        totalProducts: 2,
        totalQuantities: 30,
        status: 'Received',
        products: [
          { productId: 'p1', productName: 'Battery A', quantity: 10 },
          { productId: 'p2', productName: 'Solar Panel B', quantity: 20 },
        ],
      },
    ];
    setStockHistory(staticHistory);
  };

  useEffect(() => {
    fetchProducts();
    fetchStaticStockHistory();
  }, []);

  // Stock filters
  const available = products.filter((p) => p.stock > 10);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10);
  const outOfStock = products.filter((p) => p.stock === 0);

  const handleAddProductToList = (id: string) => {
    if (!addList.some((item) => item.id === id)) {
      setAddList((prev) => [...prev, { id, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 0) quantity = 0;
    setAddList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveFromList = (id: string) => {
    setAddList((prev) => prev.filter((item) => item.id !== id));
  };

  // Confirm add stock (static)
  const handleConfirmAdd = () => {
    const updatedProducts = products.map((product) => {
      const match = addList.find((item) => item.id === product._id);
      if (match) {
        return { ...product, stock: product.stock + match.quantity };
      }
      return product;
    });

    const newEntry: StockHistoryItem = {
      stockId: `STK${Date.now()}`,
      date: new Date().toLocaleString(),
      totalProducts: addList.length,
      totalQuantities: addList.reduce((sum, item) => sum + item.quantity, 0),
      status: 'Received',
      products: addList.map((item) => {
        const p = products.find((p) => p._id === item.id)!;
        return {
          productId: item.id,
          productName: p.name,
          quantity: item.quantity,
        };
      }),
    };

    setProducts(updatedProducts);
    setStockHistory((prev) => [newEntry, ...prev]);
    setAddList([]);
    setIsAddModalOpen(false);
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
            <StockSection title="✅ Available Stock" products={available} borderColor="border-green-500" />
            <StockSection title="⚠️ Low Stock (less than 10)" products={lowStock} borderColor="border-yellow-500" />
            <StockSection title="🟥 Out of Stock" products={outOfStock} borderColor="border-red-500" />
            <StockHistorySection
              stockHistory={stockHistory}
              onViewDetails={(id) => router.push(`/owner/stock-management/details?id=${id}`)}
            />
          </>
        )}

        {isAddModalOpen && (
          <AddStockModal
            products={products}
            addList={addList}
            onAddProduct={handleAddProductToList}
            onQuantityChange={handleQuantityChange}
            onRemoveProduct={handleRemoveFromList}
            onConfirm={handleConfirmAdd}
            isOpen={()=>setIsAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
          />
        )}
      </div>
    </OwnerLayout>
  );
};

export default StockPage;

/* Reuse components like Header, LoaderComponent, ErrorComponent, StockSection, StockHistorySection, AddStockModal from your previous implementation as-is */


/* Components */

// Header Component
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

// Loader Component
const LoaderComponent = () => (
  <div className="col-span-full flex justify-center items-center py-12">
    <Loader className="w-8 h-8 text-yellow-500 animate-spin" />
  </div>
);

// Error Component
const ErrorComponent = ({ error }: { error: string }) => (
  <p className="text-red-600">{error}</p>
);

// Stock Section Component
const StockSection = ({ title, products, borderColor }: { title: string; products: Product[]; borderColor: string }) => (
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
              <img src={product.image} alt={product.name} className="w-16 h-16 rounded object-cover" />
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

// Stock History Section Component
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
                <td
                  className={`border p-3 font-semibold ${
                    entry.status === 'Received' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
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
                      <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
                    )}
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400">No products found</p>
              )}
            </div>
          )}
        </div>

        {/* Selected Items */}
        <div className="space-y-4">
          {addList.length > 0 ? (
            addList.map((item) => {
              const product = products.find((p) => p._id === item.id);
              if (!product) return null;
              return (
                <div key={item.id} className="flex items-center justify-between border rounded p-2 shadow-sm">
                  <div className="flex items-center gap-3">
                    {product.image && (
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover" />
                    )}
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <input
                        type="number"
                        min={0}
                        value={item.quantity}
                        onChange={(e) => onQuantityChange(item.id, parseInt(e.target.value))}
                        className="border mt-1 rounded px-2 py-1 w-24"
                        placeholder="Quantity"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveProduct(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 />
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">No products added yet.</p>
          )}
        </div>

        {/* Confirm Button */}
        {addList.length > 0 && (
          <button
            onClick={onConfirm}
            className="mt-6 bg-green-600 hover:bg-green-700 w-full text-white py-2 rounded"
          >
            Confirm Add
          </button>
        )}
      </div>
    </motion.div>
  );
};