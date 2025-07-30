import { cookies } from "next/headers";
import { Profile } from "@/types/Profile";
import { Post } from "@/types/Post";
import { UserProfileContent } from "@/components/UserProfileContent";

// NavBarでhref化したuserIdを取得する
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
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_API_URL
      : process.env.NEXT_PUBLIC_API_FOR_LOCAL;

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
    <div>
      <UserProfileContent profile={profile} posts={posts} token={token} />
    </div>
  );
}
