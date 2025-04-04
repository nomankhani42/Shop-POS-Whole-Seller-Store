'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiMinus, FiPlus, FiTrash2, FiX } from 'react-icons/fi';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const dummyProducts: CartItem[] = [
  { id: 1, name: 'Solar Panel 100W', price: 12000, quantity: 1 },
  { id: 2, name: 'Battery 12V 150Ah', price: 30000, quantity: 1 },
  { id: 3, name: 'Solar Inverter 3kW', price: 45000, quantity: 1 },
  { id: 4, name: 'Mounting Structure', price: 5000, quantity: 1 },
  { id: 5, name: 'MC4 Connectors (Pair)', price: 800, quantity: 1 },
];

const Cart = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [cart, setCart] = useState<CartItem[]>(dummyProducts);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // Update current date and time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDate(now.toLocaleString());
    };
    updateTime();
    const timer = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  // Increase quantity
  const increaseQuantity = (id: number) => {
    setCart(cart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  // Decrease quantity
  const decreaseQuantity = (id: number) => {
    setCart(cart.map(item => item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item));
  };

  // Remove item from cart
  const removeItem = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Calculate total
  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <motion.div
      initial={{ width: isExpanded ? 300 : 80 }}
      animate={{ width: isExpanded ? 300 : 80 }}
      className="sticky top-0 right-0 min-h-screen max-h-screen bg-gray-100 shadow-lg flex flex-col border-l border-gray-300 transition-all duration-300"
    >
      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute left-[-40px] top-4 bg-yellow-500 text-white p-2 rounded-full shadow-md"
      >
        {isExpanded ? <FiX size={24} /> : <FiShoppingCart size={24} />}
      </button>

      {/* Cart Header */}
      {isExpanded && (
        <div className="p-4 bg-yellow-500 text-white text-lg font-semibold flex justify-between">
          <span>Cart</span>
        </div>
      )}

      {/* Customer Info */}
      {isExpanded && (
        <div className="p-4">
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <div className="text-sm text-gray-600">Date: {currentDate}</div>
        </div>
      )}

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto">
        {isExpanded && cart.length > 0 ? (
          cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-3 border-b">
              <div>
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-gray-600">Rs {item.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => decreaseQuantity(item.id)} className="p-1 bg-red-500 text-white rounded">
                  <FiMinus size={16} />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQuantity(item.id)} className="p-1 bg-green-500 text-white rounded">
                  <FiPlus size={16} />
                </button>
                <button onClick={() => removeItem(item.id)} className="p-1 bg-gray-500 text-white rounded">
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : isExpanded ? (
          <p className="p-4 text-center text-gray-500">Cart is empty.</p>
        ) : null}
      </div>

      {/* Cart Footer */}
      {isExpanded && (
        <div className="p-4 bg-white shadow-lg">
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>Rs {totalAmount.toLocaleString()}</span>
          </div>
          <button className="w-full mt-3 bg-red-500 text-white p-2 rounded shadow-md">Checkout</button>
        </div>
      )}
    </motion.div>
  );
};

export default Cart;
