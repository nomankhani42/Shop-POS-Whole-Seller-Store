"use client";

import ShopLayout from "@/Layout/shopkeeper/ShopLayout";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import axios from "axios";

// ----------------- Types ------------------
interface CashEntry {
    collectedAt: string;
    cashAmount: number;
    status: "Received" | "Pending";
}

interface CashHistoryItem {
    id: number;
    date: string;
    received: number;
    settled: number;
    status: "Received" | "Pending";
}

interface CashRecordResponse {
    availableCash: number;
    cashCollectedHistory: CashEntry[];
}

// ----------------- Component ------------------
const CashSettlement = () => {
    const { data: session } = useSession();
    const [cashHistory, setCashHistory] = useState<CashHistoryItem[]>([]);
    const [availableCash, setAvailableCash] = useState<number>(0);
    const [cashToOwner, setCashToOwner] = useState<string>("");

    // Reusable fetch function
    const fetchCashRecord = async () => {
        try {
            const { data }: { data: CashRecordResponse } = await axios.get("/api/get-cash-record");

            setAvailableCash(data.availableCash);

            const formattedHistory: CashHistoryItem[] = data.cashCollectedHistory.map((entry, index) => ({
                id: index + 1,
                date: new Date(entry.collectedAt).toISOString().split("T")[0],
                received: entry.status === "Received" ? entry.cashAmount : 0,
                settled: entry.status === "Pending" ? entry.cashAmount : 0,
                status: entry.status,
            }));

            setCashHistory(formattedHistory);
        } catch (error) {
            toast.error("Failed to load cash data.");
        }
    };

    // useEffect to fetch data initially
    useEffect(() => {
        if (session?.user?.id) {
            fetchCashRecord();
        }
    }, [session]);

    // Handler to submit cash to owner
    const handleGiveCash = async () => {
        const amount = parseFloat(cashToOwner);

        if (!cashToOwner.trim()) {
            toast.error("Please enter an amount.");
            return;
        }

        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid positive number.");
            return;
        }

        if (amount > availableCash) {
            toast.error("You don't have enough available cash.");
            return;
        }

        try {
            const response = await axios.post("/api/get-cash-record/give-cash-to-owner", {
                amount,
                date: new Date().toISOString(),
            });

            toast.success(response.data.message || "Cash submitted successfully.");
            setCashToOwner("");

            await fetchCashRecord();
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || "Something went wrong while submitting.";
            toast.error(`Failed: ${errorMsg}`);
        }
    };

    const totalReceived = cashHistory.reduce((sum, item) => sum + item.received, 0);
    const totalSettled = cashHistory.reduce((sum, item) => sum + item.settled, 0);

    return (
        <ShopLayout>
            <div className="px-10 py-5">
                <h2 className="text-2xl font-semibold mb-4">Cash Settlement</h2>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-blue-500 text-white p-5 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold">Total Sales In 30 Days</h3>
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
                            <tr className="bg-gray-200 text-center">
                                <th className="border p-3">Date</th>
                                <th className="border p-3">Cash Received</th>
                                <th className="border p-3">Cash Settled</th>
                                <th className="border p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cashHistory.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center text-gray-500 p-4">
                                        No cash records yet.
                                    </td>
                                </tr>
                            ) : (
                                cashHistory.map((entry) => (
                                    <tr key={entry.id} className="text-center">
                                        <td className="border p-3">{entry.date}</td>
                                        <td className="border p-3">Rs. {entry.received}</td>
                                        <td className="border p-3 text-red-500">Rs. {entry.settled}</td>
                                        <td className="border p-3">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-md font-semibold ${
                                                    entry.status === "Received"
                                                        ? "bg-green-200 text-green-800"
                                                        : "bg-yellow-200 text-yellow-800"
                                                }`}
                                            >
                                                {entry.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </ShopLayout>
    );
};

export default CashSettlement;
