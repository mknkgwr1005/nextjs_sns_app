import Image from "next/image";
import FollowStatusInfo from "@/components/FollowStatusInfo";
import ProfileHeader from "../app/next/headers";
import { Post } from "@/types/Post";

// NavBarでhref化したuserIdを取得する
type Params = {
  profile: any;
  posts: any;
  token?: string;
};

export const UserProfileContent = ({ profile, posts, token }: Params) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full max-w-xl mx-auto">
        {/* プロフィール */}
        {profile && (
          <div
            className="bg-white shadow-md rounded-lg p-6 mb-4"
            data-testid="user-profile"
          >
            <div className="flex items-center w-full">
              <div>
                <ProfileHeader
                  username={profile.user.username}
                  userId={profile.userId}
                  bio={profile.bio ?? ""}
                  profileImageUrl={
                    profile.profileImageUrl ?? "/default-params.profile.png"
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
          posts.map((post: Post) => (
            <div key={post.id} className="bg-white shadow-md rounded p-4 mb-4">
              <div className="flex items-center mb-2">
                {profile && (
                  <Image
                    width={40}
                    height={40}
                    src={
                      profile.profileImageUrl ?? "/default-params.profile.png"
                    }
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
};
