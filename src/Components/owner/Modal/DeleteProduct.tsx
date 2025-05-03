import React, { useState } from "react";
import axios from "axios";

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  onDeleteSuccess: () => void;
}

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
  onDeleteSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`/api/product/delete-product/${productId}`);
      alert("Product deleted successfully!");
      onDeleteSuccess(); // Refresh product list or update UI
      onClose();
    } catch (error) {
      
      alert("Failed to delete product." + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold text-red-600">Confirm Deletion</h2>
        <p className="mt-2">
          Are you sure you want to delete <strong>{productName}</strong>?
        </p>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded flex items-center justify-center hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal;
