"use client";

import ShopLayout from '@/Layout/shopkeeper/ShopLayout';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { IProduct } from '@/models/product';
import Dropdown from "@/Components/shopkeeper/Dropdown";

interface IStockProduct {
  productId: IProduct;
  quantity: number;
  status: "pending" | "received" | "not_received";
}

interface IStockDetails {
  _id: string;
  products: IStockProduct[];
  stockStatus: "pending" | "received" | "not_received";
  createdAt: string;
}

const StockDetailsPage = () => {
  const { id } = useParams(); // Get the stock ID from the route parameters
  const [stockDetails, setStockDetails] = useState<IStockDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // const [isAllModal,setIsAllModal]=useState<boolean>(false)

  // const toggle=():void=>{
  //      setIsAllModal(!isAllModal)
  // }

  // Fetch stock details by ID
  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/stock/get-single-stock?id=${id}`); // API endpoint to fetch stock details
        if (response.data.success) {
          setStockDetails(response.data.stock);
        }
      } catch (error) {
        console.error("Error fetching stock details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStockDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <ShopLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-600">Loading stock details...</p>
        </div>
      </ShopLayout>
    );
  }

  if (!stockDetails) {
    return (
      <ShopLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-red-500">Failed to load stock details. Please try again later.</p>
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-yellow-700 mb-4">Stock Details</h1>
        {/* Header Section */}
        <div className="bg-white rounded-md shadow p-6 mb-6">

          <div className="flex items-center justify-between  ">
            <div className='flex items-center gap-x-5'>
              <p className="text-gray-600 font-semibold">Stock ID:</p>
              <p className="text-gray-800">{stockDetails._id}</p>
            </div>
            <div className='flex items-center gap-x-5'>
              <p className="text-gray-600 font-semibold">Created At:</p>
              <p className="text-gray-800">{new Date(stockDetails.createdAt).toLocaleString()}</p>
            </div>
            <div className='flex items-center gap-x-5 pr-20'>
              <p className="text-gray-600 font-semibold">Status:</p>
              <p
                className={`text-lg font-semibold ${stockDetails.stockStatus === "received"
                    ? "text-green-500"
                    : stockDetails.stockStatus === "pending"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
              >
                {stockDetails.stockStatus === "received"
                  ? "Received"
                  : stockDetails.stockStatus === "pending"
                    ? <Dropdown
                      dropdownList={["Received", "Not Received"]}
                    />
                    : "Not Received"}
              </p>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-md shadow p-4">
          <table className="w-full table-auto border text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border p-3">Image</th>
                <th className="border p-3">Product Name</th>
                <th className="border p-3">Brand</th>
                <th className="border p-3">SKU</th>
                <th className="border p-3">Quantity</th>
                <th className="border p-3">Status</th>
                <th className="border p-3">Barcode</th>
                <th className="border p-3">QR Code</th>
              </tr>
            </thead>
            <tbody>
              {stockDetails.products.map((productItem: IStockProduct) => {
                const product = productItem.productId;
                return (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="border p-3">
                      <Image
                        src={product.image || '/placeholder.png'}
                        alt={product.name}
                        width={50}
                        height={50}
                        className="w-12 h-12 object-cover rounded-md border"
                      />
                    </td>
                    <td className="border p-3">{product.name}</td>
                    <td className="border p-3">{product.brand}</td>
                    <td className="border p-3">{product.sku}</td>
                    <td className="border p-3">{productItem.quantity}</td>
                    <td
                      className={`border p-3 font-semibold ${productItem.status === "received"
                          ? "text-green-500"
                          : productItem.status === "pending"
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                    >
                      {productItem.status === "received"
                        ? "Received"
                        : productItem.status === "pending"
                          ?
                          <Dropdown

                            dropdownList={["Received", "Not Received"]} />

                          : "Not Received"}
                    </td>
                    <td className="border p-3">
                      <Image
                        src={product.qrCodeUrl}
                        alt="QR Code"
                        width={50}
                        height={50}
                        className="w-12 h-12 object-cover rounded-md border"
                      />
                    </td>
                    <td className="border p-3">
                      {product.qrCodeUrl ? (
                        <Image
                          src={product.qrCodeUrl}
                          alt="QR Code"
                          width={50}
                          height={50}
                          className="w-12 h-12 object-cover rounded-md border"
                        />
                      ) : (
                        "N/A"
                      )}
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

export default StockDetailsPage;






