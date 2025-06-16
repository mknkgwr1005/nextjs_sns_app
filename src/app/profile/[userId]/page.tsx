import { cookies } from "next/headers";
import { Profile } from "@/src/types/Profile";
import { Post } from "@/src/types/Post";
import Image from "next/image";
import FollowStatusInfo from "@/src/components/FollowStatusInfo";
import ProfileHeader from "../../next/headers";

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full max-w-xl mx-auto">
        {/* プロフィール */}
        {profile && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-4">
            <div className="flex items-center w-full">
              <div>
                <ProfileHeader
                  username={profile.user.username}
                  bio={profile.bio ?? ""}
                  profileImageUrl={
                    profile.profileImageUrl ?? "/default-profile.png"
                  }
                />
              </div>
            </div>
            {/* フォロー状態の表示 */}
            <FollowStatusInfo
              profileUserId={profile.userId}
              token={token || ""}
            />
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
