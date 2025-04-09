"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Loader2, CheckCircle } from "lucide-react";
import axios from "axios";
import FileUpload from "@/Components/FileUpload";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: {
    _id: string;
    title: string;
    img: string;
  } | null;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  isOpen,
  onClose,
  category,
}) => {
  const [title, setTitle] = useState(category?.title || "");
  const [imageUrl, setImageUrl] = useState<string | null>(category?.img || null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titleChanged, setTitleChanged] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);

  useEffect(() => {
    if (isOpen && category) {
      setTitle(category.title || "");
      setImageUrl(category.img || null);
      setTitleChanged(false);
      setImageChanged(false);
    }
  }, [category, isOpen]);

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
    setIsUploading(true);
  };

  const handleUploadSuccess = (data: { url: string }) => {
    setImageUrl(data.url);
    setUploadProgress(100);
    setIsUploading(false);
    setImageChanged(true); // ✅ Mark image as changed
  };

  const handleUploadError = () => {
    setIsUploading(false);
    toast.error("Image upload failed.");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setTitleChanged(true); // ✅ Mark title as changed
  };

  const handleSubmit = async () => {
    if (!category?._id) {
      toast.error("Category ID is required.");
      return;
    }

    // ✅ Only send changed fields
    const updatedData: Record<string, string> = {};
    if (titleChanged) updatedData.title = title;
    if (imageChanged) updatedData.img = imageUrl!;

    if (Object.keys(updatedData).length === 0) {
      toast.warning("No changes detected.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.put(`/api/category/update-category/${category._id}`, {
        title,
        img: imageUrl
      });
      toast.success("Category updated successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update category");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !category) return null;

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

        <h2 className="text-2xl font-bold text-red-600 text-center">Edit Category</h2>

        <div className="mt-6">
          <label className="block text-yellow-600 text-sm font-medium mb-2">
            Category Title
          </label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter category name"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div className="mt-4">
          <label className="block text-yellow-600 text-sm font-medium mb-2">
            Upload New Image
          </label>
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

        <div className="mt-4">
          <p className="text-sm text-gray-500">Current Image:</p>
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
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="max-h-full max-w-full object-contain"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <CheckCircle className="text-green-500 w-10 h-10" />
                  <span className="text-white font-semibold ml-2">
                    Image uploaded successfully!
                  </span>
                </div>
              </motion.div>
            ) : (
              <span className="text-gray-500">No image available</span>
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || (!titleChanged && !imageChanged)}
          className={`w-full mt-6 py-3 text-white rounded-lg font-medium transition flex items-center justify-center gap-2 ${isSubmitting || (!titleChanged && !imageChanged)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
            }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              Updating Category...
            </>
          ) : (
            "Update Category"
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default EditCategoryModal;
