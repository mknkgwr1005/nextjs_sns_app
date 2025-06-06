"use client";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import apiClient from "../lib/apiClient";

/**
 * 状態管理
 */

type AuthContextTypes = {
  user: null | { id: number; username: string; email: string };
  login: (token: string) => void;
  logout: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = React.createContext<AuthContextTypes>({
  user: null,
  login: () => {},
  logout: () => {},
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

  // クライアント側でのみlocalStorageからトークンを取得
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
          console.error("User authentication failed:", error);
          // 必要ならlocalStorageからトークン削除
          localStorage.removeItem("auth_token");
          setUser(null);
        });
    }
  }, []);

  // ログイン時
  const login = (token: string) => {
    localStorage.setItem("auth_token", token);
    apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;
    apiClient
      .get("/users/find")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((error) => {
        window.alert("ログイン認証に失敗しました");
        setUser(null);
      });
  };

  // ログアウト時
  const logout = () => {
    localStorage.removeItem("auth_token");
    delete apiClient.defaults.headers["Authorization"];
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
  };

  //   すべてのcomponentsで使えるようにする
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
