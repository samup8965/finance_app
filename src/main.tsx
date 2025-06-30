import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";
import { ContextProvider } from "./context/ContextProvider.tsx";
import { AuthContextProvider } from "./context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
      <ContextProvider>
        <RouterProvider router={router} />
      </ContextProvider>
    </AuthContextProvider>
  </StrictMode>
);

// Entry point so connect my router to the app
