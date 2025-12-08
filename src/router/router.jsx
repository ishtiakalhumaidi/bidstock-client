import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/mainLayout";

export const router = createBrowserRouter([
    {
        path: "/",
    element: <MainLayout />
    }
])