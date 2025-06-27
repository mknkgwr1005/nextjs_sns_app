import { User } from "./User";
import { Post } from "./Post";

export type PostDataType =
  | {
      type: "post";
      createdAt: string;
      post: Post;
    }
  | {
      type: "repost";
      createdAt: string;
      post: Post;
      repostedBy: User;
    };
