"use client";
import { useEffect, useState } from "react";
import FollowButtons from "./FollowButtons";
import Loader from "./Loader";
import { fetchFollowStatus } from "../context/fetchFollowStatus";

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
    const fetchStatus = async () => {
      try {
        const value = await fetchFollowStatus({ profileUserId, token });
        if (value) {
          setIsFollowing(value.isFollowing);
          setIsFollowed(value.isFollowed);
          setIsOwnProfile(value.isOwnProfile);
          setFollowingCount(value.followersCount);
          setFollowersCount(value.followingCount);
        }
      } catch (error) {
        console.error("フォロー状態の取得に失敗しました", error);
      }
    };
    fetchStatus();
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
