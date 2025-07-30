"use client";
import Link from "next/link";
import { useAuth } from "../context/auth";
import LogoutIcon from "./icons/LogoutIcon";
import apiClient from "../lib/apiClient";
import { useEffect, useState } from "react";
import ProfileIcon from "./icons/ProfileIcon";

const NavBar = () => {
  const { user, logout } = useAuth();
  const [imageUrl, setImageUrl] = useState("");

  const getProfileInfo = async () => {
    if (!user) return;
    try {
      const res = await apiClient.get(`/users/profile/${user.id}`);
      setImageUrl(res.data.profileImageUrl);
    } catch (error) {
      console.error("プロフィール画像の取得に失敗しました", error);
    }
  };

  useEffect(() => {
    getProfileInfo();
  }, [user]);

  if (!user) return null;

  return (
    <aside className="h-screen w-[200px] bg-white border-r shadow-sm flex flex-col justify-between p-4">
      <div className="space-y-6" data-testid="nav-bar">
        <h1 className="flex flex-row text-2xl font-bold text-center">
          <Link href="/" aria-label="go_home">
            Twittor!
          </Link>
        </h1>
        <div className="flex justify-center">
          <Link href={`/profile/${user.id}`} aria-label="profile_image">
            <ProfileIcon
              profileImageUrl={imageUrl}
              size={100}
              dataTestid="profile-image"
            />
          </Link>
        </div>
      </div>

      <div className="text-center">
        <button
          aria-label="logout"
          onClick={logout}
          className="text-gray-600 hover:text-red-500 flex items-center justify-center gap-2"
        >
          <LogoutIcon className="w-5 h-5" />
          <span className="text-sm">ログアウト</span>
        </button>
      </div>
    </aside>
  );
};

export default NavBar;
