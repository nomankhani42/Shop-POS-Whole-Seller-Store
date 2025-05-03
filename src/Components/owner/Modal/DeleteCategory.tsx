import React, { useState } from "react";
import axios from "axios";
import { Loader2, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";

interface DeleteCategoryModalProps {
  id: string | null;
  isOpen: boolean;
  onClose: () => void;
  onCategoryDeleted: () => void;
}

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  id,
  isOpen,
  onClose,
  onCategoryDeleted,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!id) return;
    setLoading(true);

    try {
      await axios.delete(`/api/category/delete-category/${id}`);
      toast.success("Category deleted successfully!", { autoClose: 2000 });
      onCategoryDeleted(); // Refresh category list after deletion
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error deleting category:", error); // Log the error for debugging
      toast.error("Failed to delete category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold text-red-700">Delete Category</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        <p className="text-gray-700 text-center text-lg">
          Are you sure you want to delete this category? This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-1/2 px-4 py-2 text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="w-1/2 px-4 py-2 flex items-center justify-center bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Trash2 className="w-5 h-5 mr-2" />}
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryModal;
