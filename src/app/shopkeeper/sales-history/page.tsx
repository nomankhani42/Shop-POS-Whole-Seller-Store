"use client";
import ShopLayout from "@/Layout/shopkeeper/ShopLayout";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Define the sales data type
interface Sale {
    id: number;
    date: string;
    product: string;
    quantity: number;
    totalAmount: number;
}

// Color palette for the pie chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#E63946"];

const SalesHistory = () => {
    // Dummy sales data
    const [salesHistory] = useState<Sale[]>([
        { id: 1, date: "2025-03-10", product: "Solar Panel", quantity: 5, totalAmount: 25000 },
        { id: 2, date: "2025-03-09", product: "Battery", quantity: 3, totalAmount: 15000 },
        { id: 3, date: "2025-03-08", product: "Wire Roll", quantity: 10, totalAmount: 10000 },
        { id: 4, date: "2025-03-07", product: "Inverter", quantity: 2, totalAmount: 40000 },
        { id: 5, date: "2025-03-06", product: "Solar Panel", quantity: 8, totalAmount: 40000 },
    ]);

    // Calculate total sales
    const totalSales = salesHistory.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const weeklySales = salesHistory.slice(0, 7).reduce((sum, sale) => sum + sale.totalAmount, 0);
    const monthlySales = salesHistory.slice(0, 30).reduce((sum, sale) => sum + sale.totalAmount, 0);

    // Find most sold product
    const productSalesCount: { [key: string]: number } = {};
    salesHistory.forEach((sale) => {
        productSalesCount[sale.product] = (productSalesCount[sale.product] || 0) + sale.quantity;
    });

    const mostSoldProducts = Object.entries(productSalesCount).map(([product, quantity]) => ({
        name: product,
        value: quantity,
    }));

    // Sales Data for Bar Chart
    const salesData = [
        { name: "Today", sales: salesHistory[0]?.totalAmount || 0 },
        { name: "Weekly", sales: weeklySales },
        { name: "Monthly", sales: monthlySales },
    ];

    return (
        <ShopLayout>
            <div className="px-10 py-5">
                <h2 className="text-2xl font-semibold mb-4">Sales History</h2>

                {/* Sales Overview */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="bg-blue-500 text-white p-5 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold">Today's Sales</h3>
                        <p className="text-2xl font-bold mt-2">Rs. {salesHistory[0]?.totalAmount || 0}</p>
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

                {/* Sales Charts */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Sales Bar Chart */}
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

                    {/* Most Sold Product Pie Chart */}
                    <div className="bg-white p-5 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-3">Most Sold Products</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={mostSoldProducts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                                    {mostSoldProducts.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sales History Table */}
                <div className="bg-white p-5 rounded-lg shadow-md mt-6">
                    <h3 className="text-xl font-semibold mb-3">Sales Transactions</h3>
                    <table className="w-full border-collapse border">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-3">Date</th>
                                <th className="border p-3">Product</th>
                                <th className="border p-3">Quantity</th>
                                <th className="border p-3">Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salesHistory.map((sale) => (
                                <tr key={sale.id} className="text-center">
                                    <td className="border p-3">{sale.date}</td>
                                    <td className="border p-3">{sale.product}</td>
                                    <td className="border p-3">{sale.quantity}</td>
                                    <td className="border p-3 font-bold text-green-600">Rs. {sale.totalAmount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </ShopLayout>
    );
};

export default SalesHistory;
