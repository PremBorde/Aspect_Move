// @ts-nocheck
import React, { createContext, useContext, useState } from "react";
import { syncUserToSupabase } from "../hooks/useSupabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [pendingUser, setPendingUser] = useState(null);

  const signIn = async (email, pass) => {
    const newUser = {
      firstName: email.split("@")[0] || "User",
      lastName: "",
      emailAddress: email,
    };
    setUser(newUser);
    setIsSignedIn(true);
    syncUserToSupabase(newUser);
    return true;
  };

  const signUp = async (firstName, lastName, email, pass) => {
    setPendingUser({
      firstName,
      lastName,
      emailAddress: email,
    });
    return true;
  };

  const verifyOtp = async (code) => {
    const newUser = pendingUser || {
      firstName: "User",
      lastName: "",
      emailAddress: "user@example.com",
    };

    setUser(newUser);
    setPendingUser(null);
    setIsSignedIn(true);
    syncUserToSupabase(newUser);
    return true;
  };

  const signOut = () => {
    setUser(null);
    setPendingUser(null);
    setIsSignedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, user, signIn, signUp, verifyOtp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
