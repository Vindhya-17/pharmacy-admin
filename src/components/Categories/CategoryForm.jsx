import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Axios } from "@/utils/intercepters";
import { showSuccessToast } from "@/utils/toastNotifications";

const CategoryForm = ({ setShowForm, fetchCategories, selectedCategory }) => {
  // Validation Schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
  });

  // Handle Form Submission
  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (selectedCategory) {
        const response = await Axios.put(
          `/categories/${selectedCategory._id}`,
          values
        );

        if (response.status === 200) {
          showSuccessToast("Category updated successfully");
          resetForm();
          setShowForm(false);
          fetchCategories();
        }
      } else {
        const response = await Axios.post("/categories", values);

        if (response.status === 201) {
          showSuccessToast("Category added successfully");
          resetForm();
          setShowForm(false);
          fetchCategories();
        }
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow mb-6">
      <h2 className="text-xl font-bold mb-2">{selectedCategory ?"Update Category" :"Add Category"} </h2>
      <Formik
        initialValues={{
          name: selectedCategory ? selectedCategory.name : "",
          description: selectedCategory ? selectedCategory.description : "",
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
                {isSubmitting ? "Adding..." : selectedCategory ? "Update Category": "Add Category"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CategoryForm;
