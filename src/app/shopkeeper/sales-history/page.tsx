"use client";

import ShopLayout from "@/Layout/shopkeeper/ShopLayout";
import { useState } from "react";
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
import autoTable from "jspdf-autotable"; // ✅ Correct import

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#E63946"];

const SalesHistory = () => {
  const [salesHistory] = useState([
    {
      id: 1,
      customerName: "Ali Khan",
      customerPhone: "0301-2345678",
      date: "2025-04-17 12:45 PM",
      products: [
        { name: "Solar Panel", quantity: 2, price: 12000 },
        { name: "Battery", quantity: 1, price: 15000 },
      ],
    },
    {
      id: 2,
      customerName: "Sara Malik",
      customerPhone: "0321-9876543",
      date: "2025-04-16 3:30 PM",
      products: [
        { name: "Inverter", quantity: 1, price: 40000 },
        { name: "Wire Roll", quantity: 3, price: 1000 },
      ],
    },
  ]);

  const totalSales = salesHistory.reduce(
    (sum, sale) =>
      sum + sale.products.reduce((s, p) => s + p.price * p.quantity, 0),
    0
  );
  const weeklySales = totalSales;
  const monthlySales = totalSales;

  const productSalesCount: { [key: string]: number } = {};
  salesHistory.forEach((sale) => {
    sale.products.forEach((product) => {
      productSalesCount[product.name] =
        (productSalesCount[product.name] || 0) + product.quantity;
    });
  });

  const mostSoldProducts = Object.entries(productSalesCount).map(
    ([product, quantity]) => ({
      name: product,
      value: quantity,
    })
  );

  const salesData = [
    { name: "Today", sales: totalSales },
    { name: "Weekly", sales: weeklySales },
    { name: "Monthly", sales: monthlySales },
  ];

  const generatePDF = (sale: (typeof salesHistory)[0]) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Invoice", 90, 10);
    doc.text(`Sale ID: ${sale.id}`, 10, 20);
    doc.text(`Customer Name: ${sale.customerName}`, 10, 28);
    doc.text(`Phone: ${sale.customerPhone}`, 10, 36);
    doc.text(`Date: ${sale.date}`, 10, 44);

    const tableData = sale.products.map((item, index) => [
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
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const finalY = (doc as any).lastAutoTable.finalY || 70;
    doc.text(`Total: Rs. ${total}`, 140, finalY + 10);

    doc.save(`Invoice_${sale.customerName}_${sale.id}.pdf`);
  };

  return (
    <ShopLayout>
      <div className="px-10 py-5">
        <h2 className="text-2xl font-semibold mb-4">Sales History</h2>

        {/* Sales Overview */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-500 text-white p-5 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Today's Sales</h3>
            <p className="text-2xl font-bold mt-2">Rs. {totalSales}</p>
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
              <BarChart data={salesData}>
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
                  dataKey="value"
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

        {/* Sales Transactions Table */}
        <div className="bg-white p-5 rounded-lg shadow-md mt-6">
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
              {salesHistory.map((sale) => {
                const total = sale.products.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                );
                return (
                  <tr key={sale.id} className="border text-center">
                    <td className="border p-3">{sale.id}</td>
                    <td className="border p-3">{sale.customerName}</td>
                    <td className="border p-3">{sale.customerPhone}</td>
                    <td className="border p-3">{sale.date}</td>
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
      </div>
    </ShopLayout>
  );
};

export default SalesHistory;
