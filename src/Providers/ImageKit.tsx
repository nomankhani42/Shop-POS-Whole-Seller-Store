"use client"; // Ensure this runs only on the client side

import React from "react";
import { ImageKitProvider, IKImage } from "imagekitio-next";

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL as string;
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string;

const authenticator = async () => {
  try {
    const response = await fetch("/api/file");

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return {
      signature: data.signature,
      expire: data.expire,
      token: data.token,
    };
  } catch (error: any) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

export default function ImageProvider({ children }: { children: React.ReactNode }) {
  if (!urlEndpoint || !publicKey) {
    console.error("Missing ImageKit configuration in environment variables.");
    return <div>Error: ImageKit is not configured properly.</div>;
  }

  return (
    <ImageKitProvider urlEndpoint={urlEndpoint} publicKey={publicKey} authenticator={authenticator}>
      {children}
    </ImageKitProvider>
  );
}
