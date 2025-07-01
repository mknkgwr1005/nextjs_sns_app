export type PostStatus = {
  id: number;
  likes: any[];
  replies: any[];
  reposts: any[];
};

export type PostStatusesData = {
  statuses: PostStatus[];
  likes: { postId: number }[];
  reposts: { postId: number }[];
};
