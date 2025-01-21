"use client";
import React, { useState, useEffect } from "react";
import { Axios } from "@/utils/intercepters";
import { showSuccessToast } from "@/utils/toastNotifications";
import ProductForm from "./ProductForm";
import useUser from "@/utils/customHook";

const Products = () => {
  const user = useUser();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  // Fetch Products Data
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await Axios.get("/products");
      setProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  // Delete Product Handler
  const handleDelete = async (id) => {
    try {
      const res = await Axios.delete(`/products/${id}`);
      if (res.status === 200) {
        setProducts(products.filter((product) => product._id !== id));
        showSuccessToast("Product deleted successfully");
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
        <h1 className="text-2xl font-bold text-[#85A98F]">Products</h1>
        {user.role === "Admin" && (
          <button
            className="bg-[#85A98F] text-white px-4 py-2 rounded hover:bg-[#6C907A]"
            onClick={() => setShowForm(true)}
          >
            Add Product
          </button>
        )}
      </div>

      {showForm && (
        <ProductForm
          setShowForm={setShowForm}
          fetchProducts={fetchProducts}
          selectedProduct={selectedProduct}
        />
      )}

      {/* Product Table */}
      {!showForm && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-[#85A98F] text-white">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Stock</th>
                <th className="p-4 text-left">Description</th>
                {user.role === "Admin" && (
                  <th className="p-4 text-left">Actions</th>
                )}{" "}
              </tr>
            </thead>
            <tbody>
              {products?.length > 0 ? (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-[#D3F1DF] border-b border-gray-200"
                  >
                    <td className="p-4">{product.name}</td>
                    <td className="p-4">{product.category.name}</td>
                    <td className="p-4">${product.price.toFixed(2)}</td>
                    <td className="p-4">{product.stock}</td>

                    <td className="p-4">{product.description}</td>
                    {user.role === "Admin" && (
                      <td className="p-4 flex items-center gap-2">
                        <button
                          className="text-[#85A98F] underline hover:text-[#6C907A]"
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowForm(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-500 underline hover:text-red-700"
                          onClick={() => handleDelete(product._id)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
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

export default Products;
