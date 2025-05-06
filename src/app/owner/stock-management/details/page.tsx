"use client";

import OwnerLayout from "@/Layout/owner/OwnerLayout";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { format } from "date-fns";
import { Loader } from "lucide-react";

const StockDetailsPage = () => {
  const [stockData, setStockData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const getStockData = async (id: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/stock/get-single-stock?id=${id}`);
      if (response.data.success) {
        setStockData(response.data.stock);
        setError(null);
      } else {
        setError("Failed to fetch stock data.");
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
      setError("An error occurred while fetching stock data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) getStockData(id);
  }, [id]);

  return (
    <OwnerLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Stock Details</h1>

        {loading ? (
          <div className="flex items-center justify-center h-[80vh]">
                   <Loader className="animate-spin text-yellow-500" size={40} />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : stockData ? (
          <>
            {/* Stock Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">Stock ID: <span className="text-gray-600">{stockData._id}</span></h2>
                  <p className="text-sm text-gray-500">
                    Created At: {format(new Date(stockData.createdAt), "dd MMM yyyy hh:mm a")}
                  </p>
                </div>
                <div className="text-sm text-gray-700">
                  <p>Status: <span className="capitalize font-medium">{stockData.stockStatus}</span></p>
                  <p>Total Products: <span className="font-medium">{stockData.products?.length}</span></p>
                </div>
              </div>
            </div>

            {/* Product List */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Image</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Brand</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">SKU</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Quantity</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Barcode</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">QR Code</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {stockData.products.map((productItem: any, index: number) => {
                    const product = productItem.productId;
                    return (
                      <tr key={product._id || index} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={60}
                            height={60}
                            className="rounded-md object-cover w-14 h-14 border"
                          />
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{product.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{product.brand}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{productItem.quantity}</td>
                        <td className="px-6 py-4 text-sm capitalize font-medium text-gray-700">
                          {productItem.status}
                        </td>
                        <td className="px-6 py-4">
                          <Image
                            src={product.barcode}
                            alt="Barcode"
                            width={100}
                            height={40}
                            className="h-10 object-contain border bg-white rounded"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Image
                            src={product.qrCodeUrl}
                            alt="QR Code"
                            width={60}
                            height={60}
                            className="h-14 w-14 object-contain border bg-white rounded"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-gray-500">No stock data found.</p>
        )}
      </div>
    </OwnerLayout>
  );
};

export default StockDetailsPage;
