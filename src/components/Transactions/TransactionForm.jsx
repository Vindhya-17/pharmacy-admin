import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import Select from "react-select";
import * as Yup from "yup";
import { Axios } from "@/utils/intercepters";
import { showSuccessToast } from "@/utils/toastNotifications";

const TransactionForm = ({
  setShowForm,
  fetchTransactions,
  selectedTransaction,
}) => {
  const [products, setProducts] = useState([]);
  const data = localStorage.getItem("user");
  const productOptions = products.map((product) => ({
    value: product._id,
    label: `${product.name} (₹${product.price})`,
    price: product.price,
    stock: product.stock,
  }));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await Axios.get("/products");
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const validationSchema = Yup.object().shape({
    type: Yup.string().required("Type is required"),
    products: Yup.array()
      .of(
        Yup.object().shape({
          product: Yup.object().required("Product is required").nullable(),
          quantity: Yup.number()
            .nullable(true)
            .required("Quantity is required")
            .positive("Quantity must be a positive number")
            .test(
              "stock-check",
              "Quantity exceeds available stock",
              function (value) {
                const { product } = this.parent;
                if (product && product.stock !== undefined) {
                  return value <= product.stock;
                }
                return true; // If product is not selected, skip validation
              }
            ),
        })
      )
      .min(1, "At least one product must be selected"),
  });

  const calculateAmount = (products) =>
    products.reduce(
      (total, item) =>
        total +
        (item.product && item.product.price
          ? item.product.price * item.quantity
          : 0),
      0
    );

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const payload = {
        ...values,
        amount: calculateAmount(values.products),
        products: values.products.map((item) => ({
          product: item.product.value,
          quantity: item.quantity,
        })),
        createdBy: data ? JSON.parse(data)._id : null,
      };

      if (selectedTransaction) {
        const response = await Axios.put(
          `/transactions/${selectedTransaction._id}`,
          payload
        );
        if (response.status === 200) {
          showSuccessToast("Transaction updated successfully");
          resetForm();
          setShowForm(false);
          fetchTransactions();
        }
      } else {
        const response = await Axios.post("/transactions", payload);
        if (response.status === 201) {
          showSuccessToast("Transaction added successfully");
          resetForm();
          setShowForm(false);
          fetchTransactions();
        }
      }
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow mb-6">
      <h2 className="text-xl font-bold mb-2">
        {selectedTransaction ? "Update" : "Add"} Transaction
      </h2>
      <Formik
        initialValues={{
          type: selectedTransaction ? selectedTransaction.type : "",
          products: selectedTransaction
            ? selectedTransaction.products.map((item) => ({
                product: productOptions.find(
                  (opt) => opt.value === item.product._id
                ),
                quantity: item.quantity || 0,
              }))
            : [{ product: null, quantity: "" }],
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div className="mb-2">
              <label htmlFor="type" className="block font-medium mb-2">
                Type
              </label>
              <Field
                as="select"
                name="type"
                id="type"
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select type</option>
                <option value="Sale">Sale</option>
                <option value="Return">Return</option>
                <option value="Purchase">Purchase</option>
              </Field>
              <ErrorMessage
                name="type"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <FieldArray name="products">
              {({ push, remove }) => (
                <>
                  {values.products.map((item, index) => (
                    <div key={index} className="mb-4 border p-3 rounded">
                      <div className="mb-2">
                        <label className="block font-medium mb-2">
                          Product
                        </label>
                        <Select
                          options={productOptions}
                          value={item.product}
                          onChange={(selectedOption) =>
                            setFieldValue(
                              `products.${index}.product`,
                              selectedOption
                            )
                          }
                        />
                        <ErrorMessage
                          name={`products.${index}.product`}
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block font-medium mb-2">
                          Quantity
                        </label>
                        <Field
                          value={values.products[index].quantity || ""}
                          type="number"
                          name={`products.${index}.quantity`}
                          className="w-full border rounded px-3 py-2"
                          onChange={(e) => {
                            const value = e.target.value;
                            setFieldValue(
                              `products.${index}.quantity`,
                              value === "" ? "" : parseInt(value, 10)
                            );
                          }}
                        />
                        <ErrorMessage
                          name={`products.${index}.quantity`}
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => remove(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => push({ product: null, quantity: "" })}
                  >
                    Add Product
                  </button>
                </>
              )}
            </FieldArray>

            <div className="mb-2">
              <label htmlFor="amount" className="block font-medium mb-2">
                Total Amount
              </label>
              <Field
                type="number"
                name="amount"
                id="amount"
                className="w-full border rounded px-3 py-2 bg-gray-100"
                value={calculateAmount(values.products)}
                readOnly
              />
            </div>

            <div className="flex justify-end mt-4">
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
              >
                {selectedTransaction ? "Update Transaction" : "Add Transaction"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TransactionForm;
