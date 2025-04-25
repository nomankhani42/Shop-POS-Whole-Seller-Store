"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, Search, LayoutGrid, Loader } from "lucide-react";
import OwnerLayout from "@/Layout/owner/OwnerLayout";
import AddCategoryModal from "@/Components/owner/Modal/AddCategory";
import DeleteCategoryModal from "@/Components/owner/Modal/DeleteCategory";
import EditCategoryModal from "@/Components/owner/Modal/EditCategoryModal";

interface Category {
  _id: string;
  title: string;
  img: string;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [deleteCategoryModalOpen, setDeleteCategoryModalOpen] = useState(false);
  const [editCategoryModalOpen, setEditCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get("/api/category/get-category");
      setCategories(data.categories || []);
    } catch (err) {
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [addCategoryModalOpen, deleteCategoryModalOpen, editCategoryModalOpen]);

  const openDeleteModal = (id: string) => {
    setSelectedCategory({ _id: id, title: "", img: "" });
    setDeleteCategoryModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setEditCategoryModalOpen(true);
  };

  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <OwnerLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <LayoutGrid className="text-yellow-500 w-6 h-6" />
            <h1 className="text-3xl font-bold text-black">Manage Categories</h1>
          </div>
          <button
            onClick={() => setAddCategoryModalOpen(true)}
            className="flex items-center bg-yellow-500 hover:bg-yellow-600 transition text-white px-4 py-2 rounded-md shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Category
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6 mx-auto md:mx-3 w-4/5 md:w-4/5 lg:w-1/2">
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400 text-gray-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" />
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ?(
  <div className="col-span-full flex justify-center items-center py-12">
    <Loader className="w-8 h-8 text-yellow-500 animate-spin" />
  </div>
) : error ? (
            <p className="text-center col-span-full text-red-600">{error}</p>
          ) : filteredCategories.length === 0 ? (
            <p className="text-center col-span-full text-gray-500">No categories found.</p>
          ) : (
            filteredCategories.map((category) => (
              <div
                key={category._id}
                className="bg-white border shadow-sm rounded-lg p-4 flex flex-col items-center"
              >
                <div className="h-24  overflow-hidden mb-3  hover:scale-105 transition-transform duration-200">
                  {category.img ? (
                    <img
                      src={category.img}
                      alt={category.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-xs text-center px-2">
                      No Image
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-lg text-center text-gray-800 mb-3">
                  {category.title}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(category)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded shadow text-sm flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(category._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded shadow text-sm flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modals */}
        <AddCategoryModal
          isOpen={addCategoryModalOpen}
          onClose={() => setAddCategoryModalOpen(false)}
        />
        <DeleteCategoryModal
          id={selectedCategory?._id || ""}
          isOpen={deleteCategoryModalOpen}
          onClose={() => setDeleteCategoryModalOpen(false)}
          onCategoryDeleted={fetchCategories}
        />
        {selectedCategory && (
          <EditCategoryModal
            isOpen={editCategoryModalOpen}
            onClose={() => setEditCategoryModalOpen(false)}
            category={selectedCategory}
            onCategoryUpdated={fetchCategories}
          />
        )}
      </div>
    </OwnerLayout>
  );
};

export default CategoriesPage;
