import { createBrowserRouter } from "react-router";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Auth & Protection
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../components/error/NotFound";

// Public Pages
import Home from "../pages/public/Home";
import Pricing from "../pages/public/Pricing";
import About from "../pages/public/About";
import ActiveAuctions from "../pages/auctions/ActiveAuctions";
import BidDetails from "../pages/auctions/BidDetails";

// Auth Pages
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";

// Dashboard Core
import Overview from "../components/dashboard/Overview";
import MyProfile from "../pages/dashboard/profile/MyProfile";
import Notifications from "../pages/dashboard/notifications/Notifications";
import MyTransactions from "../pages/dashboard/transactions/MyTransactions";

// Seller Pages
import AddProduct from "../pages/dashboard/seller/AddProduct";
import MyProducts from "../pages/dashboard/seller/MyProducts";
import LaunchAuction from "../pages/dashboard/seller/LaunchAuction"; // New
import MyAuctions from "../pages/dashboard/auctions/MyAuctions";
import BidOffers from "../pages/dashboard/seller/BidOffers"; // New
import TransactionRequests from "../pages/dashboard/transactions/TransactionRequests";
import MyRents from "../pages/dashboard/rents/MyRents";
import MyInventory from "../pages/dashboard/inventory/MyInventory";

// Buyer Pages
import MyOffers from "../pages/dashboard/buyer/MyOffers";
import Checkout from "../pages/dashboard/transactions/Checkout";

// Warehouse Pages
import AddWarehouse from "../pages/dashboard/warehouse/AddWarehouse";
import MyWarehouses from "../pages/dashboard/warehouse/MyWarehouses";
import AllWarehouses from "../pages/dashboard/warehouse/AllWarehouses";
import RentWarehouse from "../pages/dashboard/warehouse/RentWarehouse"; // New
import WarehouseOwnerInventory from "../pages/dashboard/inventory/WarehouseOwnerInventory";

// Admin Pages
import UsersList from "../pages/dashboard/admin/UsersList";
import AllTransactions from "../pages/dashboard/admin/AllTransactions";
import AdminAuctions from "../pages/dashboard/admin/AdminAuctions"; // New
import AdminWarehouses from "../pages/dashboard/admin/AdminWarehouses"; // New
import AdminProducts from "../pages/dashboard/admin/AdminProducts"; // New

// Shared Pages
import AddInventory from "../pages/dashboard/inventory/AddInventory";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/pricing", element: <Pricing /> },
      { path: "/about", element: <About /> },
      { path: "/auctions", element: <ActiveAuctions /> },
      { path: "/auctions/:id", element: <BidDetails /> },
      { path: "/warehouses", element: <AllWarehouses /> },
    ],
  },
  {
    element: <AuthLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "/auth/signin", element: <SignIn /> },
      { path: "/auth/signup", element: <SignUp /> },
    ],
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute />, // Outer guard: must have a valid token
    errorElement: <NotFound />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          // Universal — any authenticated role
          { index: true, element: <Overview /> },
          { path: "my-profile", element: <MyProfile /> },
          { path: "notifications", element: <Notifications /> },
          { path: "my-transactions", element: <MyTransactions /> },

          // Buyer-only
          {
            element: <ProtectedRoute allowedRoles={["buyer"]} />,
            children: [
              { path: "my-offers", element: <MyOffers /> },
              { path: "checkout/:transaction_id", element: <Checkout /> },
            ],
          },

          // Seller-only
          {
            element: <ProtectedRoute allowedRoles={["seller"]} />,
            children: [
              { path: "add-product", element: <AddProduct /> },
              { path: "my-products", element: <MyProducts /> },
              { path: "my-products/launch-auction/:product_id", element: <LaunchAuction /> },
              { path: "my-auctions", element: <MyAuctions /> },
              { path: "my-auctions/:bid_id/offers", element: <BidOffers /> },
              { path: "my-rents", element: <MyRents /> },
              { path: "my-inventory", element: <MyInventory /> },
              { path: "add-inventory", element: <AddInventory /> },
              { path: "warehouse/rent/:warehouse_id", element: <RentWarehouse /> },
              { path: "transaction-requests", element: <TransactionRequests /> },
            ],
          },

          // Warehouse owner-only
          {
            element: <ProtectedRoute allowedRoles={["warehouse_owner"]} />,
            children: [
              { path: "add-warehouse", element: <AddWarehouse /> },
              { path: "my-warehouses", element: <MyWarehouses /> },
              { path: "stored-inventory", element: <WarehouseOwnerInventory /> },
            ],
          },

          // Admin-only
          {
            element: <ProtectedRoute allowedRoles={["admin"]} />,
            children: [
              { path: "users", element: <UsersList /> },
              { path: "all-transactions", element: <AllTransactions /> },
              { path: "all-auctions", element: <AdminAuctions /> },
              { path: "all-warehouses", element: <AdminWarehouses /> },
              { path: "all-products", element: <AdminProducts /> },
            ],
          },
        ],
      },
    ],
  },
  // Catch-all
  { path: "*", element: <NotFound /> },
]);