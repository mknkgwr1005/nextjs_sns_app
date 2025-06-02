import { cookies } from "next/headers";
import apiClient from "@/src/lib/apiClient";
import { Profile } from "@/src/types/Profile";
import React from "react";

type Params = {
  userId: string;
};

export default async function UserProfilePage({ params }: { params: Params }) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  let profile: Profile | null = null;

  try {
    const res = await apiClient.get(`/users/profile/${params.userId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    profile = res.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    // エラー時は 404 を表示させる方法もあるが、ここでは `null` にして表示側で制御
  }

  if (!profile) {
    return (
      <div className="text-center mt-10">プロフィールが見つかりません。</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6 mb-4">
          <div className="flex items-center">
            <img
              src="/default-avatar.png"
              className="w-20 h-20 rounded-full mr-4"
              alt="User Avatar"
            />
            <div>
              <h2 className="text-2xl font-semibold mb-1">
                {profile.user.username}
              </h2>
              <p className="text-gray-600">{profile.bio}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded p-4 mb-4">
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <img
                src={profile.profileImageUrl}
                className="w-10 h-10 rounded-full mr-2"
                alt="User Avatar"
              />
              <div>
                <h2 className="font-semibold text-md">shincode</h2>
                <p className="text-gray-500 text-sm">2023/05/08</p>
              </div>
            </div>
            <p className="text-gray-700">はじめての投稿です。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
