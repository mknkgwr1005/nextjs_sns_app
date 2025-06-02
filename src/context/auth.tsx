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

  // トークンを含むヘッダーを生成
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    // client側から、トークンを取得する
    if (token) {
      // headerの作成
      apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;
      // user認証
      apiClient
        .get("/users/find")
        .then((res) => {
          setUser(res.data.user);
        })
        .catch((error) => {
          console.error("User authentication failed:", error);
          // Optional: You can handle the error here (e.g., clear the token, show an alert, etc.)
        });
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("auth_token", token);
    // headerを前のデータから上書きしないと、ユーザーのトークンが切り替わらないので気を付ける
    apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;

    try {
      // user認証
      apiClient.get("/users/find").then((res) => {
        setUser(res.data.user);
      });
    } catch (error) {
      window.alert(error);
    }
  }; // Closing bracket added here

  const logout = () => {
    localStorage.removeItem("auth_token");
    delete apiClient.defaults.headers["Authorization"];
    setUser(null); // Clear the user state on logout
  };

  const value = {
    user,
    login,
    logout,
  };

  //   すべてのcomponentsで使えるようにする
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
