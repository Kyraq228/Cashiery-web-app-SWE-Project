import React from "react";
import ProductManagement from "../components/ProductManagement";
import InventoryAlerts from "../components/InventoryAlerts";
import SalesSummary from "../components/SalesSummary";
import TransactionLog from "../components/TransactionLog";
import UserRegistration from "../components/UserRegistration";

function AdminDashboard() {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <InventoryAlerts />
      <SalesSummary />
      <ProductManagement />
      <TransactionLog />
      <UserRegistration />
    </div>
  );
}

export default AdminDashboard;