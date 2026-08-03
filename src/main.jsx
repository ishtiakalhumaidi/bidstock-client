import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { Tooltip } from "react-tooltip";
import AOS from "aos";
import "aos/dist/aos.css";

import { router } from "./routes/router";
import { AuthProvider } from "./contexts/AuthProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

document.documentElement.setAttribute("data-theme", "light");
AOS.init({ once: true, duration: 500, easing: "ease-out-cubic" });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Tooltip id="my-tooltip" />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#14181F",
              color: "#FAFAF8",
              fontSize: "13px",
              borderRadius: "10px",
            },
          }}
        />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);