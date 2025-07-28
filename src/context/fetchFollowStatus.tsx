import apiClient from "@/lib/apiClient";

type Props = {
  profileUserId: number;
  token: string;
};

export const fetchFollowStatus = async ({ profileUserId, token }: Props) => {
  try {
    const res = await apiClient.get(`/users/follow_count/${profileUserId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      isFollowing: res.data.isFollowing,
      isFollowed: res.data.isFollowed,
      isOwnProfile: res.data.isOwnProfile,
      followingCount: res.data.followingCount,
      followersCount: res.data.followersCount,
    };
  } catch (error) {
    console.error("フォロー状態の取得に失敗しました", error);
    return null;
  }
};
