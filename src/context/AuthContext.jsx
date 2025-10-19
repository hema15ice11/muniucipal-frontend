import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
const AuthContext = createContext();

// Axios instance with credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // -------------------- LOGIN --------------------
  const loginUser = async (email, password, role = "user") => {
    try {
      const url = role === "admin" ? "/api/auth/admin-login" : "/api/auth/login";
      const res = await api.post(url, { email, password });

      if (res.data?.user) {
        setUser(res.data.user);
        setIsAdmin(res.data.user.role === "admin");
        return { success: true, user: res.data.user };
      }
      return { success: false, msg: "Login failed" };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, msg: err.response?.data?.msg || "Login failed" };
    }
  };

  // -------------------- LOGOUT --------------------
  const logoutUser = async () => {
    try {
      if (!user) return;
      const url = user.role === "admin" ? "/api/auth/admin-logout" : "/api/auth/logout";
      await api.post(url);
      setUser(null);
      setIsAdmin(false);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // -------------------- CHECK SESSION --------------------
  const checkSession = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/auth/me");
      if (res.data?.user) {
        setUser(res.data.user);
        setIsAdmin(res.data.user.role === "admin");
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    } catch (err) {
      console.error("Session check error:", err);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
      <AuthContext.Provider value={{ user, isAdmin, loading, loginUser, logoutUser, checkSession }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
