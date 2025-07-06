import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Signup from "./components/signup";
import Signin from "./components/signin";
import Dashboard from "./pages/dashboard";
import PrivateRoute from "./components/PrivateRoute";
import ResetPassword from "./components/resetPassword";
import { AuthContextProvider } from "./context/AuthContext";
import { TrueLayerCallback } from "./components/TrueLayerCallback";
import { DataProvider } from "./context/DataContext.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    ),
  },
  { path: "/signup", element: <Signup /> },
  { path: "/signin", element: <Signin /> },
  { path: "/resetpassword", element: <ResetPassword /> },
  {
    path: "/truelayercallback",
    element: <TrueLayerCallback />,
  },
  {
    path: "/dashboard",
    element: (
      <DataProvider>
        <PrivateRoute>
          {" "}
          <Dashboard />{" "}
        </PrivateRoute>
      </DataProvider>
    ),
  },
]);

// Notes for me to remember

// Setting up client side routing
// I use react components as pages I am mapping different URLs to different React components
// Gives the user the feel of naviagting pages but this all happens client side

// Entire app is downloaded once and we do not need a trip to the server for a new HTML page
