"use client";
import React, { useEffect, useState } from "react";
import SidebarLayout from "../Sidebar";
import { Axios } from "@/utils/intercepters"; // Adjust based on your utils path
import { Pie } from "react-chartjs-2"; // Chart.js for graphs
import "chart.js/auto"; // Required for Chart.js auto registration

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalStock, setTotalStock] = useState(0);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data for dashboard
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsRes, stockRes, categoryRes] = await Promise.all([
          Axios.get("/recent-transactions"),
          Axios.get("/total-products-stock"),
          Axios.get("/category-distribution"),
        ]);

        setTransactions(transactionsRes.data.transactions);
        setTotalStock(stockRes.data.totalStock);
        setCategoryDistribution(categoryRes.data.distribution);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare data for the pie chart
  const categoryChartData = {
    labels: categoryDistribution.map((item) => item._id || "Unknown"),
    datasets: [
      {
        label: "Category Distribution",
        data: categoryDistribution.map((item) => item.count),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#FF5722",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#FF5722",
        ],
      },
    ],
  };

  return (
    <SidebarLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {loading ? (
          <p className="text-center text-lg">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 justify-center">
            {/* Total Products in Stock */}
            <div className="bg-white p-6 shadow rounded">
              <h2 className="text-lg font-semibold mb-4 text-center">
                Total Products in Stock
              </h2>
              <p className="text-4xl font-bold text-center">{totalStock}</p>
            </div>

            {/* Category Distribution */}
            <div className="bg-white p-6 shadow rounded text-center">
              <h2 className="text-lg font-semibold mb-4">Category Distribution</h2>
              <div className="mt-4 text-center">
                <Pie data={categoryChartData} />
              </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="col-span-1 lg:col-span-3 bg-white p-6 shadow rounded">
              <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">
                        Transaction ID
                      </th>
                      <th className="border border-gray-300 px-4 py-2">Type</th>
                      <th className="border border-gray-300 px-4 py-2">
                        Amount
                      </th>
                      <th className="border border-gray-300 px-4 py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => (
                      <tr
                        key={transaction._id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="border border-gray-300 px-4 py-2">
                          {transaction._id}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {transaction.type}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          ₹{transaction.amount}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default Dashboard;
