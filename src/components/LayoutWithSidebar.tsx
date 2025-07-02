// クライアントコンポーネント
"use client";
import React from "react";
import NavBar from "@/src/components/NavBar";
import { useAuth } from "../context/auth";

const LayoutWithSidebar = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <>{children}</>;
  }
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white border-r">
        <NavBar />
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default LayoutWithSidebar;
