import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Axios } from "@/utils/intercepters";
import { showSuccessToast } from "@/utils/toastNotifications";

const ProductForm = ({ setShowForm, fetchProducts, selectedProduct }) => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await Axios.get("/categories");

        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  // Validation Schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be a positive number"),
    stock: Yup.number()
      .required("Stock is required")
      .integer("Stock must be an integer")
      .min(0, "Stock cannot be negative"),
    category: Yup.string().required("Category is required"),
  });

  // Handle Form Submission
  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (selectedProduct) {
        const response = await Axios.put(
          `/products/${selectedProduct._id}`,
          values
        );

        if (response.status === 200) {
          showSuccessToast("Product updated successfully");
          resetForm();
          setShowForm(false);
          fetchProducts();
        }
      } else {
        const response = await Axios.post("/products", values);

        if (response.status === 201) {
          showSuccessToast("Product added successfully");
          resetForm();
          setShowForm(false);
          fetchProducts();
        }
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow mb-6">
      <h2 className="text-xl font-bold mb-2">{selectedProduct ? "Update":"Add"} Product</h2>
      <Formik
        initialValues={{
          name: selectedProduct ? selectedProduct.name : "",
          description: selectedProduct ? selectedProduct.description : "",
          price: selectedProduct ? selectedProduct.price : "",
          stock: selectedProduct ? selectedProduct.stock : "",
          category: selectedProduct ? selectedProduct.category._id : "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-2">
              <label htmlFor="name" className="block font-medium mb-2">
                Name
              </label>
              <Field
                type="text"
                name="name"
                id="name"
                className="w-full border rounded px-3 py-2"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-2">
              <label htmlFor="description" className="block font-medium mb-2">
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                id="description"
                className="w-full border rounded px-3 py-2"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-2">
              <label htmlFor="price" className="block font-medium mb-2">
                Price
              </label>
              <Field
                type="number"
                name="price"
                id="price"
                className="w-full border rounded px-3 py-2"
              />
              <ErrorMessage
                name="price"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-2">
              <label htmlFor="stock" className="block font-medium mb-2">
                Stock
              </label>
              <Field
                type="number"
                name="stock"
                id="stock"
                className="w-full border rounded px-3 py-2"
              />
              <ErrorMessage
                name="stock"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-2">
              <label htmlFor="category" className="block font-medium mb-2">
                Category
              </label>
              <Field
                as="select"
                name="category"
                id="category"
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="category"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-4"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#85A98F] text-white px-4 py-2 rounded hover:bg-[#6C907A]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." :selectedProduct? "Update Product": "Add Product"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProductForm;
