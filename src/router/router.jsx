import { createBrowserRouter } from "react-router";
import Home from "../pages/landing/Home";
import AuthLayout from "../layouts/AuthLayout";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import NotFound from "../components/error/NotFound";
import Pricing from "../pages/pricing/Pricing";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import AddProduct from "../pages/dashboard/seller/AddProduct";
import MyProducts from "../pages/dashboard/seller/MyProducts";
import AddWarehouse from "../pages/dashboard/warehouse/AddWarehouse";
import MyWarehouses from "../pages/dashboard/warehouse/MyWarehouses";
import AllWarehouses from "../pages/dashboard/common/AllWarehouses";
import MyRents from "../pages/dashboard/seller/MyRents";
import MyInventory from "../pages/dashboard/inventory/MyInventory";
import MyTransactions from "../pages/dashboard/transactions/MyTransactions";
import Profile from "../pages/dashboard/profile/Profile";
import ActiveAuctions from "../pages/auctions/ActiveAuctions";
import MyAuctions from "../pages/dashboard/auctions/MyAuctions";
import TransactionRequests from "../pages/dashboard/transactions/TransactionRequests";
import About from "../components/About";
import Overview from "../pages/dashboard/Overview";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "pricing",
        element: <Pricing />,
      },
      {
        path: "auctions",
        element: <ActiveAuctions />,
      },
      {
        path: "warehouses",
        element: <AllWarehouses />,
      },
      {
        path: "about",
        element: <About />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,

    errorElement: <NotFound />,
    children: [
      {
        path: "signin",
        element: <SignIn></SignIn>,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,

    errorElement: <NotFound />,
    children: [{
        index: true,
        element: <Overview />,
      },
      {
        path: "add-product",
        element: <AddProduct />,
      },
      {
        path: "my-product",
        element: <MyProducts />,
      },
      
      {
        path: "add-warehouse",
        element: <AddWarehouse />,
      },
      {
        path: "my-warehouses",
        element: <MyWarehouses />,
      },
      {
        path: "my-rents",
        element: <MyRents />,
      },
      {
        path: "my-inventories",
        element: <MyInventory />,
      },
      {
        path: "my-transactions",
        element: <MyTransactions />,
      },
      {
        path: "my-profile",
        element: <Profile />,
      },
      {
        path: "my-auctions",
        element: <MyAuctions />,
      },
      {
        path: "transactions-requests",
        element: <TransactionRequests />,
      },
    ],
  },
]);
