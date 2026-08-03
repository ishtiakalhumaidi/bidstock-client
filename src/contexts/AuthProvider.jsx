// contexts/AuthProvider.jsx
import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { signUp as signUpApi } from "../api/auth.api";
import toast from "react-hot-toast";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    } finally {
      setIsLoading(false);
    }
  }, []);


  const login = useCallback((loggedInUser, token, refreshToken) => {
    localStorage.setItem("token", token);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  }, []);

  const signup = useCallback(async (payload) => {
    const res = await signUpApi(payload);
    return res.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Signed out");
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};