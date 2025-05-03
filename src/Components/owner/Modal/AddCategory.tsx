"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, CheckCircle } from "lucide-react";
import axios from "axios";
import FileUpload from "@/Components/FileUpload";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCategoryModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
    setIsUploading(true);
  };

  const handleUploadSuccess = (data: { url: string }) => {
    setImageUrl(data.url);
    setUploadProgress(100);
    setIsUploading(false);
  };

  const handleUploadError = () => {
    setIsUploading(false);
    toast.error("Image upload failed.");
  };

  const handleSubmit = async () => {
    if (!title || !imageUrl) {
      toast.error("Title and Image are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("/api/category/create-category", { title, img: imageUrl });

      toast.success("Category added successfully!");
      onClose(); // Close modal on success
      setTitle("");
      setImageUrl(null);
      setUploadProgress(0);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add category");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white p-8 rounded-xl shadow-xl w-full max-w-lg"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600 p-1 rounded-full transition"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-red-600 text-center">Add Category</h2>

        <div className="mt-6">
          <label className="block text-yellow-600 text-sm font-medium mb-2">Category Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter category name"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div className="mt-4">
          <label className="block text-yellow-600 text-sm font-medium mb-2">Upload Image</label>
          <FileUpload
            fileName="category-image.jpg"
            onUploadProgress={handleUploadProgress}
            onSuccess={handleUploadSuccess}
            onError={handleUploadError}
          />
        </div>

        {uploadProgress > 0 && (
          <div className="w-full bg-gray-300 h-3 rounded-lg mt-3 relative overflow-hidden">
            <motion.div
              className="h-3 bg-yellow-500 rounded-lg"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ ease: "easeOut", duration: 0.3 }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
              {uploadProgress}%
            </span>
          </div>
        )}

        {/* Image Preview Section */}
        <div className="mt-4">
          <p className="text-sm text-gray-500">Image Preview:</p>
          <div className="mt-3 w-full h-48 flex items-center justify-center border rounded-lg shadow-md overflow-hidden bg-gray-100">
            {isUploading ? (
              <Loader2 className="animate-spin w-12 h-12 text-yellow-500" />
            ) : imageUrl ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full flex items-center justify-center"
              >
                <Image layout="responsive" height={100} width={100} src={imageUrl} alt="Preview" className=" object-contain" />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <CheckCircle className="text-green-500 w-10 h-10" />
                  <span className="text-white font-semibold ml-2">Image uploaded successfully!</span>
                </div>
              </motion.div>
            ) : (
              <span className="text-gray-500">No image selected</span>
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!title || !imageUrl || isSubmitting || uploadProgress < 100}
          className={`w-full mt-6 py-3 text-white rounded-lg font-medium transition flex items-center justify-center gap-2 ${
            !title || !imageUrl || isSubmitting || uploadProgress < 100
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              Adding Category...
            </>
          ) : (
            "Add Category"
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default AddCategoryModal;
