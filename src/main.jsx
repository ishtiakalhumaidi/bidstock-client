import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Tooltip } from "react-tooltip";
import AOS from "aos";
import "aos/dist/aos.css";
import { router } from "./router/router";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

document.documentElement.setAttribute("data-theme", "light");
AOS.init();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />

        <Tooltip id="my-tooltip" />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
