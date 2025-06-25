import {
  createContext,
  useEffect,
  useState,
  useContext,
  type ReactNode,
} from "react";

import { supabase } from "../supabaseClient";
import { type Session, type AuthResponse } from "@supabase/supabase-js";

type SignUpResult =
  | {
      success: true;
      data: AuthResponse["data"];
    }
  | {
      success: false;
      error: AuthResponse["error"];
    };

type SignInResult =
  | {
      success: true;
      data: AuthResponse["data"];
    }
  | {
      success: false;
      error: string;
    };
type ResetPasswordResult = // Makes the types according to documentation and responses

    | {
        success: true;
        data: {};
      }
    | {
        success: false;
        error: string;
      };

interface AuthContextType {
  session: Session | null;
  signUpNewUser: (email: string, password: string) => Promise<SignUpResult>;
  signInUser: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => void;
  resetPassword: (email: string) => Promise<ResetPasswordResult>;
}

// Create a new contect called AuthContext - empty container that can hold and share data - like signup signin and other global states
const AuthContext = createContext<AuthContextType>({
  session: null,
  signUpNewUser: async () => ({ success: false, error: null }), // dummy function as default
  signInUser: async () => ({ success: false, error: "Some error" }),
  signOut: async () => {},
  resetPassword: async () => ({ success: false, error: "Some error" }),
});

// Create a new component and the children parameter indicates that compnent will be wrapped around other compnents the children
export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  // Here we track the users session login status
  const [session, setSession] = useState<Session | null>(null);

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

  // Sign in
  const signInUser = async (
    email: string,
    password: string
  ): Promise<SignInResult> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        console.error("sign in error occurred: ", error);
        return { success: false, error: error.message };
      }
      console.log("sign-in success: ", data);
      return { success: true, data };
    } catch (error) {
      console.error("An error occurred", error);
      return {
        success: false,
        error: "Unknown error",
      };
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    // Set up a listener that triggers every time a user logs in or out
    // _event tells us what happened and session contains the data
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      // Handle different auth events
      if (_event === "SIGNED_IN") {
        console.log("✅ User signed in.");
      } else if (_event === "SIGNED_OUT") {
        console.log("🚪 User signed out.");
      } else if (_event === "TOKEN_REFRESHED") {
        console.log("🔁 Session token was refreshed.");
      } else if (_event === "USER_UPDATED") {
        console.log("📝 User information was updated.");
      } else if (_event === "PASSWORD_RECOVERY") {
        console.log("🔒 Password recovery flow started.");
      } else {
        console.log("ℹ️ Other event:", event);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Since we are data fetching we use useeffect. The [] means it runs once known as a dependency array

  // .then() to destructure the returned object and get the session so we can set it

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("there was an error:", error);
    }
  };

  const resetPassword = async (email: string): Promise<ResetPasswordResult> => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/resetpassword",
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data,
    };
  };

  return (
    <AuthContext.Provider
      value={{ session, signUpNewUser, signInUser, signOut, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Usecontext lets us tune into the same channel to recieve that data

export const UserAuth = () => {
  return useContext(AuthContext);
};

// Similiar to a Producer-Consumer analogy. One producer many consumers
