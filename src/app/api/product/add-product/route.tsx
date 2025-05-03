import { NextResponse, NextRequest } from "next/server";
import Product from "@/models/product";
import QRCode from "qrcode";
import { createCanvas } from "canvas";
import JsBarcode from "jsbarcode";
import { imagekit } from "../../file/route";
import dbConnect from "@/lib/DB";

// Handle Product Creation (POST)
export async function POST(req: NextRequest) {
  try {
    await dbConnect(); // Ensure MongoDB connection

    const body = await req.json();
    const { name, sku, category, brand, purchasePrice, sellingPrice, stock, minStock, discount, ownerNotes, imageUrl } =
      body;

    // Check if SKU is unique
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return NextResponse.json({ error: "SKU already exists" }, { status: 400 });
    }

    // ✅ Generate Barcode & QR Code Buffers
    const barcodeBuffer = await generateBarcodeBuffer(sku);
    const qrCodeBuffer = await generateQRCodeBuffer(sku);

    // ✅ Convert Buffers to Base64
    const barcodeBase64 = `data:image/png;base64,${barcodeBuffer.toString("base64")}`;
    const qrCodeBase64 = `data:image/png;base64,${qrCodeBuffer.toString("base64")}`;

    // ✅ Upload Barcode to ImageKit
    const barcodeUpload = await imagekit.upload({
      file: barcodeBase64,
      fileName: `${sku}-barcode.png`,
      folder: "/POS/Barcodes",
    });

    // ✅ Upload QR Code to ImageKit
    const qrCodeUpload = await imagekit.upload({
      file: qrCodeBase64,
      fileName: `${sku}-qrcode.png`,
      folder: "/POS/QRcodes",
    });

    // ✅ Save product to database (use frontend-provided image URL)
    const product = new Product({
      name,
      sku,
      category,
      brand,
      purchasePrice,
      sellingPrice,
      stock,
      minStock,
      barcode: barcodeUpload.url, // ImageKit URL
      qrCodeUrl: qrCodeUpload.url, // ImageKit URL
      image:imageUrl, // ✅ Directly storing the image URL from frontend
      discount,
      ownerNotes,
    });

    await product.save();

    return NextResponse.json({ message: "Product added successfully", product }, { status: 201 });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Function to generate Barcode Image as Buffer
const generateBarcodeBuffer = async (sku: string): Promise<Buffer> => {
  const canvas = createCanvas(300, 100);
  

  JsBarcode(canvas, sku, { format: "CODE128", displayValue: true });

  return canvas.toBuffer("image/png");
};

// Function to generate QR Code Image as Buffer
const generateQRCodeBuffer = async (sku: string): Promise<Buffer> => {
  return await QRCode.toBuffer(sku, { width: 300, errorCorrectionLevel: "H" });
};
