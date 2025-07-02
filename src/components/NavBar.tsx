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
    const res = await apiClient.get(`/users/profile/${user?.id}`);
    setImageUrl(res.data.profileImageUrl);
    console.log(res);
  };

  useEffect(() => {
    getProfileInfo();
  }, [user]);

  return (
    <div className="h-[60%]">
      {user ? (
        <header className="bg-white p-4 text-black">
          <div className="container mx-auto flex justify-between items-center flex-col">
            <h1 className="font-semibold text-xl">
              <Link href="/">Twittor!</Link>
            </h1>
            <div>
              <nav>
                <div className="flex flex-col">
                  {user && user.id && (
                    <Link
                      href={`/profile/${user.id}`}
                      className="bg-white text-gray-900 py-2 px-3 rounded-lg font-medium"
                    >
                      <ProfileIcon profileImageUrl={imageUrl} size={128} />
                    </Link>
                  )}
                  <button
                    className="bg-white text-gray-900 py-2 px-3 rounded-lg font-medium"
                    onClick={logout}
                  >
                    <div className="flex">
                      <LogoutIcon className="w-5 h-5 inline-block mr-1" />
                      <div>logout</div>
                    </div>
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </header>
      ) : null}
    </div>
  );
};

export default NavBar;
