"use client";

import OwnerLayout from "@/Layout/owner/OwnerLayout";
import React from "react";
import { useSearchParams } from "next/navigation";

const StockDetailsPage = () => {
  const searchParams = useSearchParams(); // Get query parameters
  const id = searchParams.get("id"); // Extract the 'id' parameter

  return (
    <OwnerLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Stock Details</h1>
        {/* Add your stock details content here */}
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">Stock ID: {id}</h2>
          {/* Add more details about the stock here */}
          <p>Details about the stock will be displayed here.</p>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default StockDetailsPage;
