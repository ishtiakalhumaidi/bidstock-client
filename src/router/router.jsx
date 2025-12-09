import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/mainLayout";
import Home from "../pages/landing/Home";
import AuthLayout from "../layouts/AuthLayout";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import NotFound from "../components/error/NotFound";
import Pricing from "../pages/pricing/Pricing";

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
        path: 'pricing',
        element:<Pricing/>
      }
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
]);
