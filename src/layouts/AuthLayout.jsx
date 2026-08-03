import { Outlet } from "react-router";
import ScrollToTop from "../components/common/ScrollToTop";

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full bg-paper">
      <Outlet />
      <ScrollToTop />
    </div>
  );
}