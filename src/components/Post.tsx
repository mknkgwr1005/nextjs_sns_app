import { Post as PostType } from "../types/Post";
import Link from "next/link";
import PostFooter from "./PostFooter";
import { PostDataType } from "../types/PostDataType";
import { PostStatusesData } from "../types/PostStatusesData";
import ProfileIcon from "./icons/ProfileIcon";

type Props = {
  postData: PostDataType;
  loginUserId: number | undefined;
  fetchLatestPost: () => void;
  postIds: number[];
  postStatuses: PostStatusesData;
};

const Post = (props: Props) => {
  const { postData, loginUserId, fetchLatestPost, postIds, postStatuses } =
    props;

  return (
    <div className="space-y-6 ">
      <div className="bg-white shadow-md rounded p-4 mb-4">
        {postData.type === "repost" ? (
          <header className="mb-4 text-gray-500">
            {" "}
            reposted by {postData.repostedBy.username}
          </header>
        ) : null}
        <div className="user-post mb-4">
          <div className="flex items-center mb-2">
            <Link href={`/profile/${postData.post.authorId}`}>
              <ProfileIcon
                profileImageUrl={postData.post.author.profile?.profileImageUrl}
                size={64}
              />
            </Link>
            <div className="w-[100%]">
              <h2 className="font-semibold text-md">
                {postData.post.author.username}
              </h2>
              <div className="text-gray-500 text-xs text-right">
                {new Date(postData.post.createdAt).toLocaleString("ja-JP")}
              </div>
            </div>
          </div>
          <div>
            <p className="text-gray-700 m-[10px]">{postData.post.content}</p>
            {loginUserId !== undefined && (
              <PostFooter
                postId={postData.post.id}
                loginUserId={loginUserId}
                fetchLatestPost={fetchLatestPost}
                postIds={postIds}
                postStatuses={postStatuses}
              />
            )}
          </div>
        </div>
        <div>
          {postData.post.replies?.map((reply: PostType) => {
            return (
              <Post
                postData={{
                  type: "post",
                  createdAt: reply.createdAt,
                  post: reply,
                }}
                key={reply.id}
                loginUserId={loginUserId}
                fetchLatestPost={fetchLatestPost}
                postIds={postIds}
                postStatuses={postStatuses}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Post;
