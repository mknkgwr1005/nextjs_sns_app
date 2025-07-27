import Image from "next/image";
import FollowStatusInfo from "@/src/components/FollowStatusInfo";
import ProfileHeader from "../app/next/headers";

// NavBarでhref化したuserIdを取得する
type Params = {
  profile: any;
  posts: any;
  token: string;
};

export const UserProfileContent = ({ params }: { params: Params }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full max-w-xl mx-auto">
        {/* プロフィール */}
        {params.profile && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-4">
            <div className="flex items-center w-full">
              <div>
                <ProfileHeader
                  username={params.profile.user.username}
                  userId={params.profile.userId}
                  bio={params.profile.bio ?? ""}
                  profileImageUrl={
                    params.profile.profileImageUrl ??
                    "/default-params.profile.png"
                  }
                />
              </div>
            </div>
            {/* フォロー状態の表示 */}
            <FollowStatusInfo
              profileUserId={params.profile.userId}
              token={params.token || ""}
            />
          </div>
        )}
        {/* 投稿一覧 */}
        {params.posts.length > 0 ? (
          params.posts.map((post) => (
            <div key={post.id} className="bg-white shadow-md rounded p-4 mb-4">
              <div className="flex items-center mb-2">
                {params.profile && (
                  <Image
                    width={40}
                    height={40}
                    src={
                      params.profile.profileImageUrl ??
                      "/default-params.profile.png"
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
