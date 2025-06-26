import Image from "next/image";
import { Post as PostType } from "../types/Post";
import Link from "next/link";
import PostFooter from "./PostFooter";

type Props = {
  post: PostType;
  loginUserId: number | undefined;
};

const Post = (props: Props) => {
  const { post, loginUserId } = props;

  return (
    <div>
      <div className="bg-white shadow-md rounded p-4 mb-4">
        <div className="user-post mb-4">
          <div className="flex items-center mb-2">
            <Link href={`/profile/${post.author.id}`}>
              <Image
                className="w-10 h-10 rounded-full mr-2"
                src={
                  post.author.profile?.profileImageUrl ?? "/default-avatar.png"
                }
                alt="User Avatar"
                width={64} // ここでは適切な幅と高さを指定
                height={64} // ここでは適切な幅と高さを指定
              />
            </Link>
            <div>
              <h2 className="font-semibold text-md">{post.author?.username}</h2>
              <p className="text-gray-500 text-sm">
                {new Date(post.createdAt).toLocaleString("ja-JP")}
              </p>
            </div>
          </div>
          <p className="text-gray-700">{post.content}</p>
          {loginUserId !== undefined && (
            <PostFooter postId={post.id} loginUserId={loginUserId} />
          )}
        </div>
        <div>
          {post.replies?.map((reply: PostType) => {
            return (
              <Post post={reply} key={reply.id} loginUserId={loginUserId} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Post;
