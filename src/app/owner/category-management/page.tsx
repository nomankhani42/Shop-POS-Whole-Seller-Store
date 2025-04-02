"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, Search } from "lucide-react";
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
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState<boolean>(false);
  const [deleteCategoryModalOpen, setDeleteCategoryModalOpen] = useState<boolean>(false);
  const [editCategoryModalOpen, setEditCategoryModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from API
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

  // Open delete modal and set selected category
  const openDeleteModal = (id: string) => {
    setSelectedCategory({ _id: id, title: "", img: "" });
    setDeleteCategoryModalOpen(true);
  };

  // Open edit modal and set selected category
  const openEditModal = (category: Category) => {
    setSelectedCategory(category);

    setEditCategoryModalOpen(true);
  };

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <OwnerLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-red-700">Categories</h1>
          <button
            onClick={() => setAddCategoryModalOpen(true)}
            className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded-lg shadow"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Category
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full p-3 pl-10 border rounded-lg shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute top-3 left-3 text-gray-500 w-5 h-5" />
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-yellow-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Image</th>
                <th className="px-6 py-3 text-left font-semibold">Category Name</th>
                <th className="px-6 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-600">
                    Loading categories...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-red-600">{error}</td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                    No categories found.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category._id} className="border-b">
                    {/* Image Column */}
                    <td className="px-6 py-4 text-left">
                      <div className="h-14 w-14 bg-gray-300 rounded-md overflow-hidden flex justify-center items-center">
                        {category.img ? (
                          <img
                            src={category.img}
                            alt={category.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-500 text-sm">No Image</span>
                        )}
                      </div>
                    </td>

                    {/* Category Name Column */}
                    <td className="px-6 py-4 text-left text-gray-800 font-medium">
                      {category.title}
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => openEditModal(category)}
                          className="px-3 py-1 text-white bg-yellow-500 rounded-lg shadow flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(category._id)}
                          className="px-3 py-1 text-white bg-red-600 rounded-lg shadow flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
      <AddCategoryModal isOpen={addCategoryModalOpen} onClose={() => setAddCategoryModalOpen(false)} />

      {/* Delete Category Modal */}
      <DeleteCategoryModal
        id={selectedCategory?._id || ""}
        isOpen={deleteCategoryModalOpen}
        onClose={() => setDeleteCategoryModalOpen(false)}
        onCategoryDeleted={fetchCategories}
      />

      {/* Edit Category Modal */}
      {selectedCategory && (
        <EditCategoryModal
          isOpen={editCategoryModalOpen}
          onClose={() => setEditCategoryModalOpen(false)}
          category={selectedCategory}
          onCategoryUpdated={fetchCategories}
        />
      )}
    </OwnerLayout>
  );
};

export default CategoriesPage;
