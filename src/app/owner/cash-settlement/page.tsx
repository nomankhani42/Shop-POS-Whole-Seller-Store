"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import OwnerLayout from "@/Layout/owner/OwnerLayout";

interface CashEntry {
  id: string;
  date: string;
  received: number;
  settled: number;
  status: "Received" | "Pending" | "Not Received";
}

interface CashCollectedHistoryEntry {
  _id: string;
  collectedAt: string;
  cashAmount: number;
  status: "Received" | "Pending" | "Not Received";
}

const CashSettlementOwner = () => {
  const [cashHistory, setCashHistory] = useState<CashEntry[]>([]);
  const [availableCash, setAvailableCash] = useState<number>(0);
  const [loadingRow, setLoadingRow] = useState<string | null>(null); // For per-row loader

  const fetchCashData = async () => {
    try {
      const { data } = await axios.get("/api/get-cash-record");
      setAvailableCash(data.availableCash);

      const formattedHistory: CashEntry[] = data.cashCollectedHistory.map(
        (entry: CashCollectedHistoryEntry) => ({
          id: entry._id,
          date: new Date(entry.collectedAt).toISOString().split("T")[0],
          received: entry.status === "Received" ? entry.cashAmount : 0,
          settled: entry.status === "Pending" ? entry.cashAmount : 0,
          status: entry.status,
        })
      );

      setCashHistory(formattedHistory);
    } catch (error: unknown) {
      console.error("Error fetching cash data:", error); // Log the error for debugging
      toast.error("Failed to load cash data.");
    }
  };

  const handleStatusChange = async (id: string, status: "Received" | "Not Received") => {
    setLoadingRow(id); // Set loading state for the specific row
    try {
      const response = await axios.post("/api/get-cash-record/handle-cash-action", { id, status });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchCashData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error: unknown) {
      console.error("Error updating cash status:", error); // Log the error for debugging
      toast.error("Something went wrong.");
    } finally {
      setLoadingRow(null); // Clear loading state
    }
  };

  useEffect(() => {
    fetchCashData();
  }, []);

  const totalReceived = cashHistory.reduce((sum, item) => sum + item.received, 0);
  const totalSettled = cashHistory.reduce((sum, item) => sum + item.settled, 0);

  return (
    <OwnerLayout>
      <div className="px-10 py-5">
        <h2 className="text-2xl font-semibold mb-4">Cash Settlement</h2>

        {/* Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-500 text-white p-5 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Total Sales in 30 Days</h3>
            <p className="text-2xl font-bold mt-2">Rs. {totalReceived}</p>
          </div>
          <div className="bg-green-500 text-white p-5 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Cash Collected</h3>
            <p className="text-2xl font-bold mt-2">Rs. {totalSettled}</p>
          </div>
          <div className="bg-yellow-500 text-white p-5 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Available Cash</h3>
            <p className="text-2xl font-bold mt-2">Rs. {availableCash}</p>
          </div>
        </div>

        {/* Cash History */}
        <div className="bg-white p-5 rounded-lg shadow-md">
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
                      {entry.status === "Pending" ? (
                        loadingRow === entry.id ? (
                          <div className="flex justify-center">
                            <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-500 animate-spin rounded-full"></div>
                          </div>
                        ) : (
                          <div className="flex justify-center gap-2">
                            <button
                              className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition text-sm"
                              onClick={() => handleStatusChange(entry.id, "Received")}
                            >
                              Received
                            </button>
                            <button
                              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition text-sm"
                              onClick={() => handleStatusChange(entry.id, "Not Received")}
                            >
                              Reject
                            </button>
                          </div>
                        )
                      ) : (
                        <span
                          className={`px-2 py-1 text-xs rounded-md font-semibold ${
                            entry.status === "Received"
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }`}
                        >
                          {entry.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default CashSettlementOwner;
