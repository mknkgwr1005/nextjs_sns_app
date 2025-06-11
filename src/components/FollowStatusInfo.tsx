// 📁 src/components/FollowStatusInfo.tsx
"use client";

import { useEffect, useState } from "react";
import apiClient from "@/src/lib/apiClient";
import FollowButtons from "./FollowButtons";
import Loader from "./Loader";

type Props = {
  profileUserId: number;
  token: string;
};

export default function FollowStatusInfo({ profileUserId, token }: Props) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState<boolean | null>(null);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const res = await apiClient.get(
          `/users/follow_count/${profileUserId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsFollowing(res.data.isFollowing);
        setIsFollowed(res.data.isFollowed);
        setIsOwnProfile(res.data.isOwnProfile);

        setFollowingCount(res.data.followersCount);
        setFollowersCount(res.data.followingCount);
        // }
      } catch (error) {
        console.error("フォロー状態の取得に失敗しました", error);
      }
    };

    fetchFollowStatus();
  }, [profileUserId, token]);

  if (isOwnProfile === null) {
    return <Loader />; // ローディング中はローダーを表示
  }
  return (
    <div className="mt-4">
      {/* フォロー状態表示 */}
      {!isOwnProfile && isFollowing !== null && (
        <>
          {/* フォローボタンの表示 */}
          <FollowButtons
            profileUserId={profileUserId}
            isFollowing={isFollowing}
          />
        </>
      )}
      {/* フォロー数表示 */}
      <div className="mt-4">
        <span className="font-semibold">フォロー中: {followingCount}人</span>
        <span className="ml-4 font-semibold">
          フォロワー: {followersCount}人
        </span>
      </div>
    </div>
  );
}
