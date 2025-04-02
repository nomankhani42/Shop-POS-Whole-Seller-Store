"use client"
import ShopLayout from "@/Layout/shopkeeper/ShopLayout";
import { useState } from "react";

const CashSettlement = () => {
    // Dummy data for cash history
    const [cashHistory, setCashHistory] = useState([
        { id: 1, date: "2025-03-10", received: 5000, settled: 2000 },
        { id: 2, date: "2025-03-09", received: 3000, settled: 1000 },
        { id: 3, date: "2025-03-08", received: 7000, settled: 4000 },
    ]);

    const totalReceived = cashHistory.reduce((sum, item) => sum + item.received, 0);
    const totalSettled = cashHistory.reduce((sum, item) => sum + item.settled, 0);
    const availableCash = totalReceived - totalSettled;

    // State for cash transfer to owner
    const [cashToOwner, setCashToOwner] = useState("");

    // Handle cash transfer
    const handleGiveCash = () => {
        const amount = parseFloat(cashToOwner);
        if (!amount || amount <= 0 || amount > availableCash) {
            alert("Invalid amount or insufficient cash.");
            return;
        }

        // Update cash history
        setCashHistory((prev) => [
            { id: prev.length + 1, date: new Date().toISOString().split("T")[0], received: 0, settled: amount },
            ...prev,
        ]);

        // Clear input field
        setCashToOwner("");
    };

    return (
        <ShopLayout>
            <div className="px-10 py-5">
                <h2 className="text-2xl font-semibold mb-4">Cash Settlement</h2>

                {/* Cash Overview */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="bg-blue-500 text-white p-5 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold">Total Cash Received</h3>
                        <p className="text-2xl font-bold mt-2">Rs. {totalReceived}</p>
                    </div>
                    <div className="bg-green-500 text-white p-5 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold">Cash Collected by Owner</h3>
                        <p className="text-2xl font-bold mt-2">Rs. {totalSettled}</p>
                    </div>
                    <div className="bg-yellow-500 text-white p-5 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold">Current Available Cash</h3>
                        <p className="text-2xl font-bold mt-2">Rs. {availableCash}</p>
                    </div>
                </div>

                {/* Give Cash to Owner */}
                <div className="bg-white p-5 rounded-lg shadow-md flex items-center gap-x-4">
                    <input
                        type="number"
                        className="border p-3 flex-1 rounded-md outline-none"
                        placeholder="Enter amount to give"
                        value={cashToOwner}
                        onChange={(e) => setCashToOwner(e.target.value)}
                    />
                    <button
                        className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition"
                        onClick={handleGiveCash}
                    >
                        Give Cash to Owner
                    </button>
                </div>

                {/* Cash History Table */}
                <div className="mt-6 bg-white p-5 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-3">Cash History</h3>
                    <table className="w-full border-collapse border">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-3">Date</th>
                                <th className="border p-3">Cash Received</th>
                                <th className="border p-3">Cash Settled</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cashHistory.map((entry) => (
                                <tr key={entry.id} className="text-center">
                                    <td className="border p-3">{entry.date}</td>
                                    <td className="border p-3">Rs. {entry.received}</td>
                                    <td className="border p-3 text-red-500">Rs. {entry.settled}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </ShopLayout>
    );
};

export default CashSettlement;
