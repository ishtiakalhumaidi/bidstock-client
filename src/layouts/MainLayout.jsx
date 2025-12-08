import { Outlet } from "react-router";
import ScrollToTop from "../components/common/ScrollToTop";
import Navbar from "../components/common/Navbar";

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <main className="pt-18">
        <Outlet />
      </main>

      <ScrollToTop />
    </div>
  );
};

export default MainLayout;
