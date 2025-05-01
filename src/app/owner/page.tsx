'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import OwnerLayout from '@/Layout/owner/OwnerLayout';
import { motion } from 'framer-motion';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';

interface MostSoldProduct {
  productId: string;
  name: string;
  quantitySold: number;
}

const OwnerDashboard = () => {
  const [salesData, setSalesData] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
  });
  const [mostSoldProducts, setMostSoldProducts] = useState<MostSoldProduct[]>([]);
  const [lowStockProducts] = useState([
    { name: 'Solar Cable 10m', stock: 5 },
    { name: 'Battery 200AH', stock: 3 },
  ]);

  // Fetch sales data
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const res = await axios.get('/api/sales/get-complete-record');
        const data = res.data;

        if (data.success) {
          setSalesData({
            daily: data.todaySales,
            weekly: data.weeklySales,
            monthly: data.monthlySales,
          });
          setMostSoldProducts(data.mostSoldProducts.slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to fetch sales data:', error);
      }
    };

    fetchSalesData();
  }, []);

  const salesChartData = {
    labels: ['Daily', 'Weekly', 'Monthly'],
    datasets: [
      {
        label: 'Sales in PKR',
        data: [salesData.daily, salesData.weekly, salesData.monthly],
        backgroundColor: ['#facc15', '#fb923c', '#f87171'],
      },
    ],
  };

  return (
    <OwnerLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Owner Dashboard</h1>

        {/* Sales Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                  {product.name}
                  <span className="text-yellow-600 font-bold">{product.quantitySold} sold</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3">⚠️ Low Stock Products</h2>
            <ul>
              {lowStockProducts.map((product, index) => (
                <li key={index} className="flex justify-between p-2 border-b">
                  {product.name}
                  <span className="text-red-600 font-bold">{product.stock} left</span>
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