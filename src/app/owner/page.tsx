'use client';

import { useState, useEffect } from 'react';
import OwnerLayout from '@/Layout/owner/OwnerLayout';
import { FaChartLine, FaBox, FaExclamationTriangle, FaClipboardList, FaShoppingCart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';

const OwnerDashboard = () => {
  const [salesData, setSalesData] = useState({ daily: 1200, weekly: 8500, monthly: 32000, yearly: 400000 });
  const [mostSoldProducts, setMostSoldProducts] = useState([
    { name: 'Solar Panel 100W', quantity: 45 },
    { name: 'Battery 12V', quantity: 30 },
    { name: 'Inverter 5kW', quantity: 25 },
  ]);
  const [lowStockProducts, setLowStockProducts] = useState([
    { name: 'Solar Cable 10m', stock: 5 },
    { name: 'Battery 200AH', stock: 3 },
  ]);

  const salesChartData = {
    labels: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
    datasets: [
      {
        label: 'Sales in PKR',
        data: [salesData.daily, salesData.weekly, salesData.monthly, salesData.yearly],
        backgroundColor: ['#facc15', '#fb923c', '#f87171', '#6b7280'],
      },
    ],
  };

  return (
    <OwnerLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Owner Dashboard</h1>

        {/* Sales Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(salesData).map(([key, value]) => (
            <motion.div key={key} className="bg-white p-4 rounded-lg shadow-md text-center"
              whileHover={{ scale: 1.05 }}>
              <h3 className="text-lg font-semibold capitalize">{key} Sales</h3>
              <p className="text-xl font-bold text-yellow-600">Rs {value.toLocaleString()}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3">📈 Sales Trends</h2>
            <Bar data={salesChartData} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3">📊 Sales Growth</h2>
            <Line data={salesChartData} />
          </div>
        </div>

        {/* Most Sold & Low Stock Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3">🔥 Most Sold Products</h2>
            <ul>
              {mostSoldProducts.map((product, index) => (
                <li key={index} className="flex justify-between p-2 border-b">
                  {product.name} <span className="text-yellow-600 font-bold">{product.quantity} sold</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3">⚠️ Low Stock Products</h2>
            <ul>
              {lowStockProducts.map((product, index) => (
                <li key={index} className="flex justify-between p-2 border-b">
                  {product.name} <span className="text-red-600 font-bold">{product.stock} left</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default OwnerDashboard;