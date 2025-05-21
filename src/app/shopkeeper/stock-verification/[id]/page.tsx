"use client";

import ShopLayout from '@/Layout/shopkeeper/ShopLayout';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { IProduct } from '@/models/product';
import Dropdown from "@/Components/shopkeeper/Dropdown";
import { toast } from 'react-toastify';
import { Loader, Loader2 } from 'lucide-react';

interface IStockProduct {
  productId: IProduct;
  quantity: number;
  status: "pending" | "received" | "not_received";
}

interface IStockDetails {
  _id: string;
  products: IStockProduct[];
  stockStatus: "pending" | "received" | "not_received" | "received_partially";
  createdAt: string;
}

const StockDetailsPage = () => {
  const { id } = useParams();
  const [stockDetails, setStockDetails] = useState<IStockDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [stockLoading, setStockLoading] = useState<boolean>(false);
  const [productStockLoading, setProductStockLoading] = useState<boolean>(false);
  const [stockProductData, setStockProductData] = useState<IStockProduct | null>(null);

  // Handler for verifying all stock
  const HandleAllStock = async (status: string, item: IStockDetails) => {
    setStockProductData(item)
    setStockLoading(true);
    try {
      if (status === "Received") {
        const response = await axios.put(`/api/stock/verify-complete-stock?id=${item._id}`);
        if (response.data.success) {
          toast.success("Stock verified successfully");
          setStockDetails(response.data.stock);
          setStockLoading(false);
        }
      }

      if (status == "Not Received") {
        setStockLoading(true)
        const response = await axios.patch(`/api/stock/decline-complete-stock?stock_id=${item._id}`) // API endpoint to verify stock
        if (response.data.success) {
          setStockDetails(response.data.stock);
          toast.success("Stock Declined Successfully")
          setStockLoading(false)

        }
      }



    } catch (error) {
      toast.error("Failed to verify stock");
    } finally {
      setStockLoading(false);
    }
  };

  // Handler for verifying a single product in the stock
  const StockProductHandle = async (status: string, item: IStockProduct) => {
    setStockProductData(item)
    console.log(item)
    setProductStockLoading(true);
    try {
      if (status === "Received") {
        const response = await axios.patch(
          `/api/stock/receive-single-item-stock?p_id=${item.productId._id}&stock_id=${id}`
        );
        if (response.data.success) {
          toast.success("Product stock verified successfully");
          setProductStockLoading(false);
          setStockDetails(response.data.stock);

        }
      }

      // if not received 
      if (status === "Not Received") {
        const response = await axios.patch(
          `/api/stock/decline-single-item-stock?p_id=${item.productId._id}&stock_id=${id}`
        );
        if (response.data.success) {
          toast.success("Product stock verified successfully");
          setProductStockLoading(false);
          setStockDetails(response.data.stock);

        }
      }
    }

    catch (error) {
      toast.error("Failed to verify product stock");
    } finally {
      setProductStockLoading(false);
    }
  };

  const fetchStockDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/stock/get-single-stock?id=${id}`);
      if (response.data.success) {
        setStockDetails(response.data.stock);
      }
    } catch (error) {
      console.error("Error fetching stock details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchStockDetails();
    }
    // eslint-disable-next-line
  }, [id]);

  if (loading) {
    return (
      <ShopLayout>
        <div className="flex items-center justify-center h-screen">
         <Loader className="w-12 h-12 text-yellow-500 animate-spin" /> {/* Lucide Loader */}
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
          <div className="flex items-center justify-between">
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
              <span
                className={`text-lg font-semibold ${stockDetails.stockStatus === "received"
                  ? "text-green-500"
                  : stockDetails.stockStatus === "pending"
                    ? "text-yellow-500"
                    :stockDetails.stockStatus==="received_partially"? "text-orange-500" : "text-red-500"
                  }`}
              >
                {stockLoading ? (
                  <Loader2 className="animate-spin text-xl text-yellow-500 inline" />
                ) : stockDetails.stockStatus === "received" ? (
                  "Received"
                ) : stockDetails.stockStatus === "pending" ? (
                  <Dropdown
                    label={stockDetails.stockStatus}
                    handleSelect={(status: string) => HandleAllStock(status, stockDetails)}
                    data={stockDetails}
                    dropdownList={["Received", "Not Received"]}
                    disabled={stockLoading || productStockLoading}
                  />
                ) : stockDetails?.stockStatus === "received_partially" ? "Received Partially" : (
                  "Not Received"
                )}
              </span>
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
                      {(stockProductData?.productId?._id === product._id) && (productStockLoading) ? (
                        <div >
                          <Loader2 className="animate-spin block m-auto text-xl text-yellow-500 " />
                        </div>
                      ) : productItem.status === "received" ? (
                        "Received"
                      ) : productItem.status === "pending" ? (
                        <Dropdown
                          handleSelect={(status: string) => StockProductHandle(status, productItem)}
                          data={product}
                          dropdownList={["Received", "Not Received"]}
                          disabled={productStockLoading || stockLoading}
                        />
                      ) : (
                        "Not Received"
                      )}
                    </td>
                    <td className="border p-3">
                      {product.barcode ? <Image
                        src={product.barcode}
                        alt="QR Code"
                        width={98}
                        height={50}
                        className="w-24 h-12 object-cover rounded-md border"
                      /> : "N/A"}
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






