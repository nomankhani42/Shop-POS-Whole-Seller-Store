"use client";

import ShopLayout from "@/Layout/shopkeeper/ShopLayout";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { Loader } from "lucide-react"; // Import Lucide React Loader

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#E63946"];

const SalesHistory = () => {
  const [salesData, setSalesData] = useState<any>(null); // Will store full API data
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "transactions">("dashboard");

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get("/api/sales/get-complete-record");
        setSalesData(res.data); // store all transactions and stats
      } catch (err) {
        console.error("Failed to fetch sales data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  if (loading || !salesData) {
    return (
      <ShopLayout>
        <div className="flex flex-1 justify-center items-center h-[100vh]">
          <Loader className="w-12 h-12 text-yellow-500 animate-spin" /> {/* Lucide Loader */}
        </div>
      </ShopLayout>
    );
  }

  const { todaySales, weeklySales, monthlySales, mostSoldProducts, allTransactions } = salesData;

  const salesBarData = [
    { name: "Today", sales: todaySales },
    { name: "Weekly", sales: weeklySales },
    { name: "Monthly", sales: monthlySales },
  ];

  const generatePDF = (sale: (typeof allTransactions)[0]) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Invoice", 90, 10);
    doc.text(`Sale ID: ${sale._id}`, 10, 20);
    doc.text(`Customer Name: ${sale.customerName}`, 10, 28);
    doc.text(`Phone: ${sale.customerPhone || "N/A"}`, 10, 36);
    doc.text(`Date: ${new Date(sale.createdAt).toLocaleString()}`, 10, 44);

    const tableData = sale.products.map((item: any, index: number) => [
      index + 1,
      item.name,
      item.quantity,
      `Rs. ${item.price}`,
      `Rs. ${item.quantity * item.price}`,
    ]);

    autoTable(doc, {
      startY: 52,
      head: [["#", "Product", "Qty", "Unit Price", "Subtotal"]],
      body: tableData,
      theme: "striped",
    });

    const total = sale.products.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const finalY = (doc as any).lastAutoTable.finalY || 70;
    doc.text(`Total: Rs. ${total}`, 140, finalY + 10);
    doc.save(`Invoice_${sale.customerName}_${sale._id}.pdf`);
  };

  return (
    <ShopLayout>
      <div className="px-10 py-5">
        <h2 className="text-2xl font-semibold mb-4">Sales History</h2>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === "dashboard"
                ? "bg-yellow-600 text-white shadow-md"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === "transactions"
                ? "bg-yellow-600 text-white shadow-md"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Transactions
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Sales Overview */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-blue-500 text-white p-5 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold">Today's Sales</h3>
                <p className="text-2xl font-bold mt-2">Rs. {todaySales}</p>
              </div>
              <div className="bg-green-500 text-white p-5 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold">Weekly Sales</h3>
                <p className="text-2xl font-bold mt-2">Rs. {weeklySales}</p>
              </div>
              <div className="bg-yellow-500 text-white p-5 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold">Monthly Sales</h3>
                <p className="text-2xl font-bold mt-2">Rs. {monthlySales}</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Sales Performance</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={salesBarData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white p-5 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Most Sold Products</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={mostSoldProducts}
                      dataKey="quantitySold"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                    >
                      {mostSoldProducts.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Sales Transactions</h3>
            <table className="w-full border-collapse border text-sm">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="border p-3">Sale ID</th>
                  <th className="border p-3">Customer Name</th>
                  <th className="border p-3">Phone</th>
                  <th className="border p-3">Date & Time</th>
                  <th className="border p-3">Total Amount</th>
                  <th className="border p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allTransactions.map((sale: any) => {
                  const total = sale.products.reduce(
                    (sum: number, item: any) => sum + item.price * item.quantity,
                    0
                  );
                  return (
                    <tr key={sale._id} className="border text-center">
                      <td className="border p-3">{sale._id}</td>
                      <td className="border p-3">{sale.customerName}</td>
                      <td className="border p-3">{sale.customerPhone}</td>
                      <td className="border p-3">
                        {new Date(sale.createdAt).toLocaleString()}
                      </td>
                      <td className="border p-3 font-semibold text-green-600">
                        Rs. {total}
                      </td>
                      <td className="border p-3 space-x-3">
                        <button
                          onClick={() => alert("Open invoice modal")}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs"
                        >
                          Invoice
                        </button>
                        <button
                          onClick={() => generatePDF(sale)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
                        >
                          Download PDF
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ShopLayout>
  );
};

export default SalesHistory;
