"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import CommentModal from "./CommentModal";
import apiClient from "../lib/apiClient";
import StarSolidIcon from "@/src/components/icons/StarSolidIcon";
import CommentIcon from "@/src/components/icons/CommentIcon";
import RepostIcon from "./icons/RepostIcon";
import type { PostStatusesData } from "../types/PostStatusesData"; // Adjust the path as needed

type Props = {
  postId: number;
  loginUserId: number;
  fetchLatestPost: () => void;
  postIds: number[];
  postStatuses: PostStatusesData;
};

export const PostFooter = ({
  postId,
  loginUserId,
  fetchLatestPost,
  postIds,
  postStatuses,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isReposted, setIsReposted] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [replyCount, setReplyCount] = useState(0);
  const [repostCount, setRepostCount] = useState(0);

  useEffect(() => {
    if (!postStatuses.statuses || !postStatuses.likes || !postStatuses.reposts)
      return;
    const getPostStatus = async () => {
      // ポストのステータス（いいね、リポスト、コメントの数）
      const statuses = postStatuses.statuses;
      // すでにいいねされているポスト
      const likes = postStatuses.likes;
      // すでにリポストされているポスト
      const reposts = postStatuses.reposts;

      // 現在のポストIDに絞って値を取得する
      const status = statuses.find((s: any) => s.id === postId);
      const isLiked = likes.some((like: any) => like.postId === postId);
      const isReposted = reposts.some((rp: any) => rp.postId === postId);
      const likesCount = status?.likes.length ?? 0;
      const repliesCount = status?.replies.length ?? 0;
      const repostsCount = status?.reposts.length ?? 0;

      return { isLiked, isReposted, likesCount, repliesCount, repostsCount };
    };
    getPostStatus().then(
      ({ isLiked, isReposted, likesCount, repliesCount, repostsCount }) => {
        setIsDisabled(isLiked);
        setIsReposted(isReposted);
        setLikeCount(likesCount);
        setReplyCount(repliesCount);
        setRepostCount(repostsCount);
      }
    );
  }, [
    replyCount,
    repostCount,
    likeCount,
    isModalOpen,
    loginUserId,
    postId,
    postIds,
    postStatuses,
  ]);

  const addLike = async () => {
    await apiClient.post("/posts/add_like", {
      postId: postId,
      userId: loginUserId,
    });
    setLikeCount((prev) => prev + 1);
  };

  const repost = async () => {
    await apiClient.post("posts/add_repost", {
      postId: postId,
      userId: loginUserId,
    });
    setRepostCount((prev) => prev + 1);
  };

  return (
    <>
      <div>
        <footer className="flex justify-around">
          <button id="replies" onClick={() => setIsModalOpen(true)}>
            <div className="flex">
              <CommentIcon className="size-6" />
              <div>{replyCount}</div>
            </div>
          </button>
          <button id="repost" disabled={isReposted} onClick={repost}>
            <div className="flex">
              <RepostIcon
                className={isReposted ? "size-6 text-green-400" : "size-6"}
              />
              <div>{repostCount}</div>
            </div>
          </button>
          <button id="like" disabled={isDisabled} onClick={addLike}>
            <div className="flex">
              <StarSolidIcon
                className={isDisabled ? "size-6 text-yellow-400" : "size-6"}
              />
              <div>{likeCount}</div>
            </div>
          </button>
        </footer>
      </div>
      <CommentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        parentId={postId}
        fetchLatestPost={fetchLatestPost}
        loginUserId={loginUserId}
        postStatuses={postStatuses}
        postIds={postIds}
      />
    </>
  );
};

export default PostFooter;
