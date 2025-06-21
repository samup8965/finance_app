import {
  createContext,
  useEffect,
  useState,
  useContext,
  type ReactNode,
} from "react";

import { supabase } from "../supabaseClient";

interface AuthContextType {
  session: any;
}

// Create a new contect called AuthContext - empty container that can hold and share data
const AuthContext = createContext<AuthContextType>({ session: undefined });

// Create a new component and the children parameter indicates that compnent will be wrapped around other compnents the children
export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  // Here we track the users session login status
  const [session, setSession] = useState(undefined);

  // We return the component that actually shares the data and we are sharing the session object

  return (
    <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>
  );
};

// Usecontext lets us tune into the same channel to recieve that data

export const UserAuth = () => {
  return useContext(AuthContext);
};

// Similiar to a Producer-Consumer analogy. One producer many consumers
