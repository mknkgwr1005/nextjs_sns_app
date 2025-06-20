import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/src/components/NavBar";
import Timeline from "@/src/components/Timeline";
import { AuthProvider } from "../context/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Twittor Clone",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      {/* AuthProviderで囲ったコンポーネントで、providerが使えるようになる */}
      <html lang="ja">
        {/* 共通して表示したいコンポーネント */}
        <body className={inter.className}>
          <header>
            <NavBar />
          </header>
          {/* すべてのReactコンポーネント */}
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
