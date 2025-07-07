import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";
import { ContextProvider } from "./context/ContextProvider.tsx";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import { DataProvider } from "./context/DataContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
      <ContextProvider>
        <DataProvider>
          <RouterProvider router={router} />
        </DataProvider>
      </ContextProvider>
    </AuthContextProvider>
  </StrictMode>
);

// Entry point so connect my router to the app
