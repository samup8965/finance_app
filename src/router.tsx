import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Signup from "./components/signup";
import Signin from "./components/signin";
import Dashboard from "./components/Dashboard/dashboard";
import PrivateRoute from "./components/PrivateRoute";
import ResetPassword from "./components/resetPassword";
import { TrueLayerCallback } from "./components/TrueLayerCallback";
import Transactions from "./components/Transactions";
import { SavingGoals } from "./components/saving/savingGoals";
import { RecurringPayments } from "./components/RecurringPayments";
import { SpendingTrends } from "./components/SpendingTrends";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  { path: "/signup", element: <Signup /> },
  { path: "/signin", element: <Signin /> },
  { path: "/resetpassword", element: <ResetPassword /> },
  {
    path: "/truelayercallback",
    element: <TrueLayerCallback />,
  },
  { path: "/savingGoals", element: <SavingGoals /> },
  { path: "/transactions", element: <Transactions /> },
  { path: "/recurringPayments", element: <RecurringPayments /> },
  { path: "/spendingTrends", element: <SpendingTrends /> },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
]);

// Notes for me to remember

// Setting up client side routing
// I use react components as pages I am mapping different URLs to different React components
// Gives the user the feel of naviagting pages but this all happens client side

// Entire app is downloaded once and we do not need a trip to the server for a new HTML page
