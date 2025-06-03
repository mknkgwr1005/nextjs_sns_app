import Image from "next/image";
import { Post as PostType } from "../types/Post";
import Link from "next/link";

type Props = {
  post: PostType;
};

const Post = (props: Props) => {
  const { post } = props;
  return (
    <div>
      <div className="bg-white shadow-md rounded p-4 mb-4">
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Link href={`/profile/${post.author.id}`}>
              <Image
                className="w-10 h-10 rounded-full mr-2"
                src={post.author.profile?.profileImageUrl}
                alt="User Avatar"
                width={64} // ここでは適切な幅と高さを指定
                height={64} // ここでは適切な幅と高さを指定
              />
            </Link>
            <div>
              <h2 className="font-semibold text-md">{post.author?.username}</h2>
              <p className="text-gray-500 text-sm">
                {post.createdAt.toLocaleString()}
              </p>
            </div>
          </div>
          <p className="text-gray-700">{post.content}</p>
        </div>
      </div>
    </div>
  );
};

export default Post;
