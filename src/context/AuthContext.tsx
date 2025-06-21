import {
  createContext,
  useEffect,
  useState,
  useContext,
  type ReactNode,
} from "react";

import { supabase } from "../supabaseClient";
import { type AuthResponse } from "@supabase/supabase-js";

type SignUpResult =
  | {
      success: true;
      data: AuthResponse["data"];
    }
  | {
      success: false;
      error: AuthResponse["error"];
    };

interface AuthContextType {
  session: any;
  signUpNewUser: (email: string, password: string) => Promise<SignUpResult>;
}

// Create a new contect called AuthContext - empty container that can hold and share data - like signup signin and other global states
const AuthContext = createContext<AuthContextType>({
  session: undefined,
  signUpNewUser: async () => ({ success: false, error: null }), // dummy function as default
});

// Create a new component and the children parameter indicates that compnent will be wrapped around other compnents the children
export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  // Here we track the users session login status
  const [session, setSession] = useState(undefined);

  // Sign up
  const signUpNewUser = async (
    email: string,
    password: string
  ): Promise<SignUpResult> => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error("there was a problem signing up", error);
      return { success: false, error };
    }
    return { success: true, data };
  };

  // We return the component that actually shares the data and we are sharing the session object

  return (
    <AuthContext.Provider value={{ session, signUpNewUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Usecontext lets us tune into the same channel to recieve that data

export const UserAuth = () => {
  return useContext(AuthContext);
};

// Similiar to a Producer-Consumer analogy. One producer many consumers
