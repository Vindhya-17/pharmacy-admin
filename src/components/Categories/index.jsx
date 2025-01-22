"use client";
import React, { useState, useEffect } from "react";
import { Axios } from "@/utils/intercepters";
import { showSuccessToast } from "@/utils/toastNotifications";
import CategoryForm from "./CategoryForm";
import useUser from "@/utils/customHook";

const Categories = () => {
  const user = useUser();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await Axios.get("/categories");

      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await Axios.delete(`/categories/${id}`);
      if (res.status === 200) {
        setCategories(categories.filter((category) => category._id !== id));
        showSuccessToast("category deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Render Loading State
  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="p-1 mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#85A98F]">Categories</h1>
        {user.role === "Admin" && (
          <button
            className="bg-[#85A98F] text-white px-4 py-2 rounded hover:bg-[#6C907A]"
            onClick={() => setShowForm(true)}
          >
            Add Category
          </button>
        )}
      </div>

      {showForm && (
        <CategoryForm
          setShowForm={setShowForm}
          fetchCategories={fetchCategories}
          selectedCategory={selectedCategory}
        />
      )}

      {/* Product Table */}
      {!showForm && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-[#85A98F] text-white">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Description</th>
                {user.role === "Admin" && (
                  <th className="p-4 text-left"> Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {categories?.length > 0 ? (
                categories.map((category) => (
                  <tr
                    key={category._id}
                    className="hover:bg-[#D3F1DF] border-b border-gray-200"
                  >
                    <td className="p-4">{category.name}</td>
                    <td className="p-4">{category.description}</td>

                    {user.role === "Admin" &&<td className="p-4 flex items-center gap-2">
                      <button
                        className="text-[#85A98F] underline hover:text-[#6C907A]"
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowForm(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 underline hover:text-red-700"
                        onClick={() => handleDelete(category._id)}
                      >
                        Delete
                      </button>
                    </td>}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-500">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Categories;
