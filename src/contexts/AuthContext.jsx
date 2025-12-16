import { createContext, useState } from "react";
import api from "../api/auth.api"; // adjust path to your axios instance

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored || stored === "undefined") return null;
      return JSON.parse(stored);
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });

  // Login function
  const login = (userData, token) => {
    if (!userData || !token) {
      console.warn("Login called with invalid data");
      return;
    }
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  // Sign up function
  const signup = async (signupData) => {
    try {
      const res = await api.post("/auth/signup", signupData);
      const userData = res.data.data.user;
      const token = res.data.data.token;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      setUser(userData);

      return { user: userData, token }; // optional return for navigation
    } catch (error) {
      console.error("Signup failed", error);
      throw error; // rethrow so components can handle it
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const isAuthenticated = Boolean(user);
  const role = user?.role ?? null;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
