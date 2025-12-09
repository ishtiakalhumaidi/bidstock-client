import { Outlet } from "react-router";
import ScrollToTop from "../components/common/ScrollToTop";


const AuthLayout = () => {
  return (
    <div>
     
      <main >
        <Outlet />
      </main>

      <ScrollToTop />
    </div>
  );
};

export default AuthLayout;
