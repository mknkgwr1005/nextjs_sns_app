"use client";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import apiClient from "../lib/apiClient";

type AuthContextTypes = {
  user: null | { id: number; username: string; email: string };
  login: (token: string) => void;
  logout: () => void;
  authLoading: boolean; // ← 追加
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = React.createContext<AuthContextTypes>({
  user: null,
  login: () => {},
  logout: () => {},
  authLoading: true, // ← 追加
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<null | {
    id: number;
    email: string;
    username: string;
  }>(null);

  const [authLoading, setAuthLoading] = useState(true); // ← 追加

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;
      apiClient
        .get("/users/find")
        .then((res) => {
          setUser(res.data.user);
        })
        .catch((error) => {
          window.alert("User authentication failed: " + error);
          localStorage.removeItem("auth_token");
          setUser(null);
        })
        .finally(() => {
          setAuthLoading(false); // ← 必ず最後にfalseに
        });
    } else {
      setAuthLoading(false); // トークンがなければすぐ終了
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("auth_token", token);
    apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;
    apiClient
      .get("/users/find")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((error) => {
        window.alert("ログイン認証に失敗しました:" + error);
        setUser(null);
      });
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    delete apiClient.defaults.headers["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
