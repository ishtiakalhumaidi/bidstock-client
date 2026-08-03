import { Outlet } from "react-router";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ScrollToTop from "../components/common/ScrollToTop";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}