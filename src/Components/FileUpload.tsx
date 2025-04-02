"use client";

import React, { useRef } from "react";
import { IKUpload } from "imagekitio-next";

interface FileUploadProps {
    fileName: string;
    folder?: string;
    onUploadProgress?: (progress: number) => void;
    onUploadStart?: () => void;
    onError?: (error: unknown) => void;
    onSuccess?: (response: { url: string }) => void;
    onNewUpload?: () => void;
    className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
    fileName,
    folder = "Categories",
    onUploadProgress,
    onUploadStart,
    onError,
    onSuccess,
    onNewUpload,
    className = "w-full px-3 py-2 border rounded focus:outline-none focus:border-none",
}) => {
    const ikUploadRef = useRef<HTMLInputElement | null>(null);

    // Function to convert image to PNG
    const convertToPNG = (file: File): Promise<File> => {
        return new Promise((resolve, reject) => {
            if (file.type === "image/png") {
                resolve(file); // Already PNG, no conversion needed
            } else {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    const img = new Image();
                    img.src = reader.result as string;
                    img.onload = () => {
                        const canvas = document.createElement("canvas");
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext("2d");
                        if (ctx) {
                            ctx.drawImage(img, 0, 0);
                            canvas.toBlob(
                                (blob) => {
                                    if (blob) {
                                        resolve(new File([blob], `${file.name.split(".")[0]}.png`, { type: "image/png" }));
                                    } else {
                                        reject(new Error("Failed to convert image to PNG"));
                                    }
                                },
                                "image/png",
                                1
                            );
                        } else {
                            reject(new Error("Failed to get canvas context"));
                        }
                    };
                };
                reader.onerror = (error) => reject(error);
            }
        });
    };

    const handleUploadStart = () => {
        onNewUpload?.();
        onUploadStart?.();
    };

    const handleUploadSuccess = (res: { url: string }) => {
        onSuccess?.(res);
    };

    const handleUploadError = (err: unknown) => {
        onError?.(err);
    };

    // Function to handle file selection
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];

            try {
                const pngFile = await convertToPNG(file); // Convert to PNG
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(pngFile);
                if (ikUploadRef.current) {
                    ikUploadRef.current.files = dataTransfer.files; // Set converted file in input
                    ikUploadRef.current.dispatchEvent(new Event("change", { bubbles: true })); // Trigger upload
                }
            } catch (error) {
                onError?.(error);
            }
        }
    };

    return (
        <>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={className}
                ref={ikUploadRef}
            />
            <IKUpload
                fileName={fileName}
                useUniqueFileName={true}
                validateFile={(file: File) => file.size < 2_000_000}
                folder={`/${folder}`}
                onError={handleUploadError}
                onSuccess={handleUploadSuccess}
                onUploadProgress={(progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onUploadProgress?.(percentCompleted);
                }}
                onUploadStart={handleUploadStart}
                ref={ikUploadRef}
                style={{ display: "none" }} // Hide IKUpload, use input instead
            />
        </>
    );
};

export default FileUpload;
