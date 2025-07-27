"use client";
import React from "react";
import { FiBox, FiShoppingCart, FiUsers, FiDollarSign, FiCheckCircle, FiAlertCircle, FiServer } from "react-icons/fi";

const summary = [
  { label: "Products", value: 128, icon: <FiBox />, color: "from-blue-500 to-blue-700" },
  { label: "Orders", value: 312, icon: <FiShoppingCart />, color: "from-orange-500 to-pink-500" },
  { label: "Users", value: 87, icon: <FiUsers />, color: "from-green-500 to-green-700" },
  { label: "Revenue", value: "₹1,23,400", icon: <FiDollarSign />, color: "from-yellow-400 to-orange-500" },
];

const orderStatus = [
  { label: "Pending", count: 12, color: "bg-yellow-100 text-yellow-700" },
  { label: "Shipped", count: 8, color: "bg-blue-100 text-blue-700" },
  { label: "Delivered", count: 25, color: "bg-green-100 text-green-700" },
  { label: "Cancelled", count: 2, color: "bg-pink-100 text-pink-700" },
];

const systemHealth = [
  { label: "API Server", status: "Online", icon: <FiServer />, color: "text-green-600" },
  { label: "Database", status: "Online", icon: <FiCheckCircle />, color: "text-green-600" },
  { label: "Payment Gateway", status: "Offline", icon: <FiAlertCircle />, color: "text-red-500" },
];

export default function Status() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 p-6 rounded-2xl shadow-xl border-2 border-orange-100">
      <h1 className="text-3xl font-bold text-orange-700 mb-8">Admin Status Dashboard</h1>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {summary.map((item) => (
          <div key={item.label} className={`flex flex-col items-center justify-center p-6 rounded-2xl shadow-lg bg-gradient-to-br ${item.color} text-white`}>
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className="text-2xl font-bold">{item.value}</div>
            <div className="text-lg font-medium mt-1">{item.label}</div>
          </div>
        ))}
      </div>
      {/* Order Status Overview */}
      <div className="bg-white/90 rounded-2xl shadow p-6 mb-10 border border-orange-100">
        <h2 className="text-xl font-bold text-orange-700 mb-4">Order Status Overview</h2>
        <div className="flex flex-wrap gap-6">
          {orderStatus.map((status) => (
            <div key={status.label} className={`flex flex-col items-center px-8 py-4 rounded-xl shadow ${status.color} min-w-[120px]`}>
              <span className="text-2xl font-bold">{status.count}</span>
              <span className="text-md font-medium mt-1">{status.label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* System Health */}
      <div className="bg-white/90 rounded-2xl shadow p-6 border border-orange-100">
        <h2 className="text-xl font-bold text-orange-700 mb-4">System Health</h2>
        <div className="flex flex-col gap-4">
          {systemHealth.map((sys) => (
            <div key={sys.label} className="flex items-center gap-4">
              <span className={`text-2xl ${sys.color}`}>{sys.icon}</span>
              <span className="font-semibold w-40">{sys.label}</span>
              <span className={`font-bold ${sys.status === "Online" ? "text-green-600" : "text-red-500"}`}>{sys.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}