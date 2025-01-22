"use client";
import React, { useState, useEffect } from "react";
import { Axios } from "@/utils/intercepters";
import { showSuccessToast } from "@/utils/toastNotifications";
import TransactionForm from "./TransactionForm";
import useUser from "@/utils/customHook";

const Transactions = () => {
  const user = useUser();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  // Fetch Products Data
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await Axios.get("/transactions");
      console.log(response.data);

      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  // Delete Product Handler
  const handleDelete = async (id) => {
    try {
      const res = await Axios.delete(`/transactions/${id}`);
      if (res.status === 200) {
        setTransactions(
          transactions.filter((transaction) => transaction._id !== id)
        );
        showSuccessToast("Transaction deleted successfully");
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
        <h1 className="text-2xl font-bold text-[#85A98F]">Transactions</h1>
        {user.role === "Admin" && (
          <button
            className="bg-[#85A98F] text-white px-4 py-2 rounded hover:bg-[#6C907A]"
            onClick={() => setShowForm(true)}
          >
            Add Transaction
          </button>
        )}
      </div>

      {showForm && (
        <TransactionForm
          setShowForm={setShowForm}
          fetchTransactions={fetchTransactions}
          selectedTransaction={selectedTransaction}
        />
      )}

      {/* Product Table */}
      {!showForm && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-[#85A98F] text-white">
              <tr>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Products</th>
                {user.role === "Admin" && (
                  <th className="p-4 text-left">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {transactions?.length > 0 ? (
                transactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="hover:bg-[#D3F1DF] border-b border-gray-200"
                  >
                    <td className="p-4">{transaction.amount}</td>
                    <td className="p-4">{transaction.type}</td>
                    <td className="p-4">
                      <ol>
                        {transaction.products.map((product) => {
                          return (
                            <li key={product._id}>{product.product.name}</li>
                          );
                        })}
                      </ol>
                    </td>

                    {user.role === "Admin" && (
                      <td className="p-4 flex items-center gap-2">
                        <button
                          className="text-[#85A98F] underline hover:text-[#6C907A]"
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowForm(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-500 underline hover:text-red-700"
                          onClick={() => handleDelete(transaction._id)}
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

export default Transactions;
