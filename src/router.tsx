import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Signup from "./components/signup";
import Signin from "./components/signin";
import Dashboard from "./components/dashboard";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/signup", element: <Signup /> },
  { path: "/signin", element: <Signin /> },
  { path: "/dashboard", element: <Dashboard /> },
]);

// Notes for me to remember

// Setting up client side routing
// I use react components as pages I am mapping different URLs to different React components
// Gives the user the feel of naviagting pages but this all happens client side

// Entire app is downloaded once and we do not need a trip to the server for a new HTML page
