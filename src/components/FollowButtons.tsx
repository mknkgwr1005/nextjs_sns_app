"use client";
import React from "react";
import apiClient from "@/lib/apiClient";

type Props = {
  isFollowing: boolean;
  profileUserId: number;
};

/**
 * フォロー機能
 */
const handleFollow = async (profileUserId: number) => {
  const token = localStorage.getItem("auth_token");
  try {
    await apiClient.post(
      "/users/follow", // ← URLを固定
      { followingUserId: profileUserId }, // ← body に渡す
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
    window.location.reload(); // 状態更新のためリロード（必要に応じて）
  } catch (error) {
    console.error("フォローエラー:", error);
    alert("フォローに失敗しました。");
  }
};

/**
 * フォロー解除機能
 */
const handleUnfollow = async (profileUserId: number) => {
  const token = localStorage.getItem("auth_token");
  try {
    await apiClient.post(
      "/users/unfollow",
      { followingUserId: profileUserId }, // ✅ ボディに直接渡す
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    window.location.reload(); // 状態更新のためリロード（必要に応じて）
  } catch (error) {
    console.error("フォロー解除エラー:", error);
    alert("フォロー解除に失敗しました。");
  }
};

export default function FollowButtons({ isFollowing, profileUserId }: Props) {
  return (
    <div className="flex gap-2 mt-4">
      {isFollowing ? (
        <button
          type="button"
          onClick={() => handleUnfollow(profileUserId)}
          className="group relative px-4 py-1.5 border border-gray-300 text-gray-800 text-sm font-semibold rounded-full bg-white hover:border-red-500 hover:text-red-500 transition-colors duration-200"
        >
          <span className="group-hover:hidden">フォロー中</span>
          <span className="hidden group-hover:inline">フォロー解除</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => handleFollow(profileUserId)}
          className="px-4 py-1.5 text-sm font-semibold rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
        >
          フォローする
        </button>
      )}
    </div>
  );
}
