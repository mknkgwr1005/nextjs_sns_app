import { cookies } from "next/headers";
import { Profile } from "@/src/types/Profile";
import { Post } from "@/src/types/Post";
import Image from "next/image";
import apiClient from "@/src/lib/apiClient";
import FollowButtons from "@/src/components/FollowButtons";
import { getLoginUserId } from "@/src/app/next/headers";

type Params = {
  userId: string;
};

export const dynamic = "force-dynamic"; // SSR強制（オプション）

export default async function UserProfilePage({ params }: { params: Params }) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value; // 🔑 ここで取得

  let profile: Profile | null = null;
  let posts: Post[] = [];

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/";

  try {
    /**
     * プロフィール情報を取得
     */
    const profileRes = await fetch(
      `${baseUrl}/users/profile/${params.userId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // SSRで毎回取得
      }
    );

    if (!profileRes.ok) throw new Error("プロフィール取得失敗");
    profile = await profileRes.json();

    /**
     * 投稿一覧を取得
     */
    const postRes = await fetch(`${baseUrl}/posts/${params.userId}`, {
      cache: "no-store", // SSRで毎回取得
    });

    if (!postRes.ok) throw new Error("投稿取得失敗");
    posts = await postRes.json();
  } catch (error) {
    console.error("データ取得エラー:", error);
    return (
      <div className="text-center mt-10">プロフィールが見つかりません。</div>
    );
  }

  // ここでログインユーザーIDを取得
  const loginUserId = token ? await getLoginUserId(baseUrl, token) : null;

  // --- フォローボタン表示判定 ---
  const showFollowButton = () => {
    if (loginUserId === null || !profile) return false;
    return String(loginUserId) !== String(profile.userId);
  };

  /**
   * フォロー中かどうかの判定
   */
  let isFollowing = false;
  // 🔧 tokenを引数として渡すように修正
  const checkFollowing = async (token: string) => {
    if (!loginUserId || !profile) return false;
    try {
      const res = await apiClient.get(
        `/users/is-following/${loginUserId}/${profile.userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const followRes = res.data.isFollowing;
      isFollowing = followRes;
    } catch (error) {
      console.error("フォロー状態取得エラー:", error);
      return false;
    }
  };

  if (token) {
    await checkFollowing(token); // 🔧 ここで渡す
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full max-w-xl mx-auto">
        {/* プロフィール */}
        {profile && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-4">
            <div className="flex items-center">
              <Image
                width={80}
                height={80}
                src={profile.profileImageUrl ?? "/default-profile.png"}
                alt="User Avatar"
                className="rounded-full"
                unoptimized
              />
              <div className="ml-4">
                <h2 className="text-2xl font-semibold mb-1">
                  {profile.user.username}
                </h2>
                <p className="text-gray-600">{profile.bio}</p>
              </div>
            </div>
            {/* フォローボタン表示判定 */}
            {showFollowButton() && (
              <FollowButtons
                profileUserId={profile.userId}
                isFollowing={isFollowing}
              />
            )}
          </div>
        )}
        {/* 投稿一覧 */}
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="bg-white shadow-md rounded p-4 mb-4">
              <div className="flex items-center mb-2">
                {profile && (
                  <Image
                    width={40}
                    height={40}
                    src={profile.profileImageUrl ?? "/default-profile.png"}
                    alt="User Avatar"
                    className="rounded-full mr-2"
                    unoptimized
                  />
                )}
                <div>
                  <h2 className="font-semibold text-md">
                    {post.author.username}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-700">{post.content}</p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-4">
            投稿がまだありません。
          </div>
        )}
      </div>
    </div>
  );
}
