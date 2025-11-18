import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login"; // We'll create this next
import Dashboard from "./pages/Dashboard"; // Placeholder for now
import Inventory from "./pages/Inventory";
import PurchaseRequests from "./pages/PurchaseRequests";
import Marketplace from "./pages/Marketplace";
import SupplierPerformance from "./pages/SupplierPerformance";
import WarehouseRental from "./pages/WarehouseRental";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/purchase-requests" element={<PurchaseRequests />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/supplier-performance" element={<SupplierPerformance />} />
        <Route path="/warehouse-rental" element={<WarehouseRental />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
};

export default App;
