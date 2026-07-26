import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [pendingUser, setPendingUser] = useState(null);

  const signIn = async (email, pass) => {
    setUser({
      firstName: email.split("@")[0] || "User",
      lastName: "",
      emailAddress: email,
    });
    setIsSignedIn(true);
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
    if (pendingUser) {
      setUser(pendingUser);
      setPendingUser(null);
    } else {
      setUser({
        firstName: "User",
        lastName: "",
        emailAddress: "user@example.com",
      });
    }
    setIsSignedIn(true);
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
