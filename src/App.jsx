import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login"; // We'll create this next
import Dashboard from "./pages/Dashboard"; // Placeholder for now
import Inventory from "./pages/Inventory";
import PurchaseRequests from "./pages/PurchaseRequests";
import Marketplace from "./pages/Marketplace";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/purchase-requests" element={<PurchaseRequests />} />
        <Route path="/marketplace" element={<Marketplace />} />
      </Route>
    </Routes>
  );
};

export default App;
