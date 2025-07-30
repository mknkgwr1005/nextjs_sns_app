// クライアントコンポーネント
"use client";
import React from "react";
import NavBar from "@/components//NavBar";
import { useAuth } from "../context/auth";

const LayoutWithSidebar = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <>{children}</>;
  }
  return (
    <div className="flex min-h-screen bg-sky-300 ">
      <aside className="w-64">
        <NavBar />
      </aside>
      <main className="flex-1 grow-1">{children}</main>
    </div>
  );
};

export default LayoutWithSidebar;
