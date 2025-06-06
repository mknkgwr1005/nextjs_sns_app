"use client";
import React from "react";
import apiClient from "@/src/lib/apiClient";

type Props = {
  isFollowing: boolean;
  profileUserId: number;
};

/**
 * フォロー機能
 */
const handleFollow = async (profileUserId: number) => {
  const token = localStorage.getItem("auth_token");
  console.error(token); //OK
  try {
    await apiClient.post(
      `/users/follow/${profileUserId}`,
      {},
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
    await apiClient.delete(`/users/unfollow/${profileUserId}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
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
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          フォロー解除
        </button>
      ) : (
        <button
          type="button"
          onClick={() => handleFollow(profileUserId)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          フォローする
        </button>
      )}
    </div>
  );
}
