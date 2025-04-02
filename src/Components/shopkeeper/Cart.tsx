'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiX, FiPlus, FiMinus, FiUser, FiClock, FiTrash, FiPhone } from 'react-icons/fi';

const CartSidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
    
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const [cartItems, setCartItems] = useState([
        { id: 1, name: "Solar Panel", price: 5000, quantity: 2 },
        { id: 2, name: "Battery Pack", price: 8000, quantity: 1 },
        { id: 3, name: "Wire Bundle", price: 2000, quantity: 3 },
    ]);

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const updateQuantity = (id, change) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
        ));
    };

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    return (
        <div className="flex sticky top-0 justify-end w-full h-screen ">
            <motion.div
                initial={{ opacity: 0, x: "100%" }}
                animate={{ width: isOpen ? "280px" : "0px", opacity: isOpen ? 1 : 0, x: isOpen ? "0%" : "100%" }}
                transition={{ duration: 0.4 }}
                className="h-full bg-white text-gray-900 shadow-lg p-4 flex flex-col border-l rounded-l-xl"
            >
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3 border-gray-300">
                    <h2 className="text-lg font-semibold">🛒 Cart</h2>
                    <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-gray-900">
                        <FiX size={22} />
                    </button>
                </div>
                
                {/* Customer Info */}
                <div className="mt-3 space-y-2">
                    <div className="flex items-center bg-gray-100 rounded-md p-2">
                        <FiUser className="text-gray-600 mr-2" />
                        <input
                            type="text"
                            placeholder="Customer Name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-sm"
                        />
                    </div>
                    <div className="flex items-center bg-gray-100 rounded-md p-2">
                        <FiPhone className="text-gray-600 mr-2" />
                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-sm"
                        />
                    </div>
                    <div className="flex items-center bg-gray-100 rounded-md p-2 text-sm">
                        <FiClock className="text-gray-600 mr-2" />
                        <span>{currentTime}</span>
                    </div>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto mt-4 space-y-3">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow border">
                            <div className="flex flex-col">
                                <p className="font-medium text-gray-800">{item.name}</p>
                                <p className="text-xs text-gray-600">Rs {item.price} x {item.quantity}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => updateQuantity(item.id, -1)}
                                    className="p-1 bg-gray-200 rounded-full hover:bg-red-500 hover:text-white transition"
                                >
                                    <FiMinus size={14} />
                                </button>
                                <span className="mx-2 font-semibold">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, 1)}
                                    className="p-1 bg-gray-200 rounded-full hover:bg-green-500 hover:text-white transition"
                                >
                                    <FiPlus size={14} />
                                </button>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="p-1 bg-gray-200 rounded-full hover:bg-gray-700 hover:text-white transition"
                                >
                                    <FiTrash size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Footer */}
                <div className="border-t border-gray-300 pt-3">
                    <p className="text-lg font-semibold">Total: Rs {totalPrice}</p>
                    <button className="w-full bg-yellow-500 text-white mt-2 py-2 rounded-lg font-bold hover:bg-yellow-600 transition">
                        Checkout
                    </button>
                </div>
            </motion.div>
            
            {/* Open Cart Button */}
            {!isOpen && (
                <button 
                    className="fixed top-5 right-5 bg-yellow-600 p-3 rounded-full text-white shadow-lg hover:bg-yellow-700 transition"
                    onClick={() => setIsOpen(true)}
                >
                    <FiShoppingCart size={24} />
                </button>
            )}
        </div>
    );
};

export default CartSidebar;
