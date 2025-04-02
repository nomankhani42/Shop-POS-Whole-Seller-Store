"use client";
import ShopLayout from "@/Layout/shopkeeper/ShopLayout";
import { motion } from "framer-motion";
import { useState } from "react";

// Sample Stock Data
const stockData = [
  { id: 1, name: "Solar Panel 500W", quantity: 20, status: "Pending", date: "March 10, 2025", time: "10:30 AM" },
  { id: 2, name: "Battery 200Ah", quantity: 15, status: "Verified", date: "March 9, 2025", time: "02:45 PM" },
  { id: 3, name: "Wire 10mm", quantity: 50, status: "Pending", date: "March 8, 2025", time: "05:10 PM" },
];

const StockVerification = () => {
  const [stocks, setStocks] = useState(stockData);

  // Count Status
  const totalItems = stocks.length;
  const verifiedCount = stocks.filter(stock => stock.status === "Verified").length;
  const pendingCount = stocks.filter(stock => stock.status === "Pending").length;

  // Update Stock Status
  const handleVerification = (id: number, status: "Verified" | "Rejected") => {
    setStocks(stocks.map(stock => stock.id === id ? { ...stock, status } : stock));
  };

  return (
    <ShopLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.h2 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          className="text-2xl font-semibold text-gray-800"
        >
          Stock Verification
        </motion.h2>

        {/* Stock Overview Cards */}
        <div className="grid grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="bg-blue-500 text-white p-5 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-medium">Total Items</h3>
            <p className="text-3xl font-bold">{totalItems}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="bg-green-500 text-white p-5 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-medium">Verified</h3>
            <p className="text-3xl font-bold">{verifiedCount}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7 }}
            className="bg-yellow-500 text-white p-5 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-medium">Pending</h3>
            <p className="text-3xl font-bold">{pendingCount}</p>
          </motion.div>
        </div>

        {/* Stock Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-4 text-left">Product</th>
                <th className="p-4 text-left">Quantity</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Time</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {stocks.map((stock) => (
                <motion.tr 
                  key={stock.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: stock.id * 0.1 }}
                  className="border-b"
                >
                  <td className="p-4">{stock.name}</td>
                  <td className="p-4">{stock.quantity}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold 
                      ${stock.status === "Verified" ? "bg-green-100 text-green-700" : 
                      stock.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}
                    >
                      {stock.status}
                    </span>
                  </td>
                  <td className="p-4">{stock.date}</td>
                  <td className="p-4">{stock.time}</td>
                  <td className="p-4 flex gap-2">
                    {stock.status === "Pending" && (
                      <>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition"
                          onClick={() => handleVerification(stock.id, "Verified")}
                        >
                          Approve
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition"
                          onClick={() => handleVerification(stock.id, "Rejected")}
                        >
                          Reject
                        </motion.button>
                      </>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ShopLayout>
  );
};

export default StockVerification;
