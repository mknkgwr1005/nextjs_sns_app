"use client";
import Link from "next/link";
import { useAuth } from "../context/auth";

const NavBar = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <header className="bg-gray-700 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="font-semibold text-xl">
            <Link href="/">Twittor!</Link>
          </h1>
          <nav>
            <ul className="flex space-x-4">
              {user ? (
                <>
                  <Link
                    href={`/profile/${user.id}`}
                    className="bg-white text-gray-900 py-2 px-3 rounded-lg font-medium"
                  >
                    プロフィール
                  </Link>
                  <button
                    className="bg-white text-gray-900 py-2 px-3 rounded-lg font-medium"
                    onClick={logout}
                  >
                    ログアウト
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="bg-white text-gray-900 py-2 px-3 rounded-lg font-medium"
                  >
                    ログイン
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-white text-gray-900 py-2 px-3 rounded-lg font-medium"
                  >
                    サインアップ
                  </Link>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default NavBar;
