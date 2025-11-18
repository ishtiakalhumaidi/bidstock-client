import { Outlet, Link } from "react-router-dom";
import {
  FaHome,
  FaWarehouse,
  FaShoppingCart,
  FaUser,
  FaChartLine,
  FaShieldAlt,
} from "react-icons/fa"; // React Icons example
import Swal from "sweetalert2"; // For toasts (we'll use later)
import { FaGavel } from "react-icons/fa6";

const Layout = () => {
  // Mock user role (change based on login later)
  const userRole = "Admin"; // Or 'Supplier', 'Warehouse Provider', 'Admin'

  const showToast = (message) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      icon: "success",
      title: message,
    });
  };

  return (
    <div className="min-h-screen bg-base-100">
      <nav className="navbar bg-primary text-primary-content shadow-lg">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">
            BidStock
          </Link>
        </div>
        <div className="flex-none gap-4">
          <Link to="/dashboard" className="btn btn-ghost">
            <FaHome /> Dashboard
          </Link>
          {["Business", "Supplier"].includes(userRole) && (
            <Link to="/warehouse-rental" className="btn btn-ghost">
              <FaWarehouse /> Warehouse Rental
            </Link>
          )}
          {userRole === "Admin" && (
            <Link to="/admin" className="btn btn-ghost">
              <FaShieldAlt /> Admin
            </Link>
          )}
          {userRole === "Supplier" && (
            <>
              <Link to="/bids" className="btn btn-ghost">
                <FaShoppingCart /> Bids
              </Link>
              <Link to="/marketplace" className="btn btn-ghost">
                <FaGavel /> Marketplace
              </Link>
              <Link to="/supplier-performance" className="btn btn-ghost">
                <FaChartLine /> Performance
              </Link>
              <Link to="/my-bids" className="btn btn-ghost">
                My Bids
              </Link>
            </>
          )}
          {userRole === "Business" && (
            <>
              <Link to="/inventory" className="btn btn-ghost">
                <FaWarehouse /> Inventory
              </Link>
              <Link to="/purchase-requests" className="btn btn-ghost">
                Purchase Requests
              </Link>
            </>
          )}
          {/* Add more role-based links */}
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img
                src="https://api.dicebear.com/9.x/avataaars/svg?seed=JohnDoe"
                alt="Avatar"
              />
            </div>
          </div>
          <button
            onClick={() => showToast("Logged out!")}
            className="btn btn-secondary"
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <Outlet /> {/* Renders child routes */}
      </main>
      <footer className="footer p-4 bg-neutral text-neutral-content text-center">
        © 2025 BidStock - All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
