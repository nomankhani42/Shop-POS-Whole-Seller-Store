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
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import OwnerLayout from "@/Layout/owner/OwnerLayout";

const COLORS = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#9D4EDD"];

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
    doc.setFontSize(14);
    doc.text("POS Invoice", 90, 15);
    doc.setFontSize(11);
    doc.text(`Invoice ID: ${sale.id}`, 10, 25);
    doc.text(`Customer: ${sale.customerName}`, 10, 32);
    doc.text(`Phone: ${sale.customerPhone}`, 10, 39);
    doc.text(`Date: ${sale.date}`, 10, 46);

    const tableData = sale.products.map((item, index) => [
      index + 1,
      item.name,
      item.quantity,
      `Rs. ${item.price}`,
      `Rs. ${item.quantity * item.price}`,
    ]);

    autoTable(doc, {
      startY: 55,
      head: [["#", "Product", "Qty", "Unit Price", "Subtotal"]],
      body: tableData,
    });

    const total = sale.products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    doc.text(`Total: Rs. ${total}`, 140, (doc as any).lastAutoTable.finalY + 10);
    doc.save(`Invoice_${sale.customerName}_${sale.id}.pdf`);
  };

  const viewInvoice = (sale: (typeof salesHistory)[0]) => {
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>Invoice - ${sale.customerName}</title></head>
          <body style="font-family: sans-serif;">
            <h1>Invoice</h1>
            <p><strong>Customer:</strong> ${sale.customerName}</p>
            <p><strong>Phone:</strong> ${sale.customerPhone}</p>
            <p><strong>Date:</strong> ${sale.date}</p>
            <table border="1" cellspacing="0" cellpadding="5">
              <thead>
                <tr><th>#</th><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
              </thead>
              <tbody>
                ${sale.products
          .map(
            (item, i) =>
              `<tr>
                        <td>${i + 1}</td>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>Rs. ${item.price}</td>
                        <td>Rs. ${item.quantity * item.price}</td>
                      </tr>`
          )
          .join("")}
              </tbody>
            </table>
            <h3>Total: Rs. ${sale.products.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0
          )}</h3>
          </body>
        </html>
      `);
    }
  };

  return (
    <OwnerLayout>
      <div className="p-6 space-y-6">
        <h2 className="text-3xl font-semibold text-gray-700">All Sales</h2>

        {/* Sales Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-yellow-400 text-white p-5 rounded-xl shadow">
            <h3 className="text-lg font-semibold">Today's Sales</h3>
            <p className="text-2xl font-bold mt-2">Rs. {totalSales}</p>
          </div>
          <div className="bg-green-500 text-white p-5 rounded-xl shadow">
            <h3 className="text-lg font-semibold">Weekly Sales</h3>
            <p className="text-2xl font-bold mt-2">Rs. {weeklySales}</p>
          </div>
          <div className="bg-red-500 text-white p-5 rounded-xl shadow">
            <h3 className="text-lg font-semibold">Monthly Sales</h3>
            <p className="text-2xl font-bold mt-2">Rs. {monthlySales}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Sales Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#4D96FF" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Most Sold Products</h3>
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

        {/* Transaction Table */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">Sales Transactions</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border">
              <thead className="bg-gray-100 text-left text-sm font-medium text-gray-600">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">Customer</th>
                  <th className="p-2">Phone</th>
                  <th className="p-2">Date</th>

                  <th className="p-2">Total</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {salesHistory.map((sale) => (
                  <tr key={sale.id} className="border-t">
                    <td className="p-2">{sale.id}</td>
                    <td className="p-2">{sale.customerName}</td>
                    <td className="p-2">{sale.customerPhone}</td>
                    <td className="p-2">{sale.date}</td>

                    <td className="p-2 font-semibold">
                      Rs.{" "}
                      {sale.products.reduce(
                        (sum, item) => sum + item.quantity * item.price,
                        0
                      )}
                    </td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => viewInvoice(sale)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => generatePDF(sale)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default SalesHistory;
