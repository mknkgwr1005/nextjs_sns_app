"use client";
import React, { useEffect, useState } from "react";
import CommentModal from "./CommentModal";
import apiClient from "../lib/apiClient";
import StarSolidIcon from "@/src/components/icons/StarSolidIcon";
import CommentIcon from "@/src/components/icons/CommentIcon";
import RepostIcon from "./icons/RepostIcon";

type Props = {
  postId: number;
  loginUserId: number;
  fetchLatestPost: () => void;
};

export const PostFooter = ({ postId, loginUserId, fetchLatestPost }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isReposted, setIsReposted] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [replyCount, setReplyCount] = useState(0);
  const [repostCount, setRepostCount] = useState(0);

  useEffect(() => {
    const getPostStatus = async () => {
      const res = await apiClient.post("/posts/get_post_status", {
        postId: postId,
        userId: loginUserId,
      });
      return res;
    };
    getPostStatus().then((res) => {
      // いいねとリポストのボタン無効化
      const isLiked = res.data.isLiked;
      setIsDisabled(isLiked);
      const isReposted = res.data.isReposted;
      setIsReposted(isReposted);
      // いいね数、RT数、リプライ数の初期値の設定
      setLikeCount(res.data.status.likes.length);
      setReplyCount(res.data.status.replies.length);
      setRepostCount(res.data.status.reposts.length);
    });
  }, [replyCount, repostCount, likeCount, isModalOpen, loginUserId, postId]);

  const addLike = async () => {
    await apiClient.post("/posts/add_like", {
      postId: postId,
      userId: loginUserId,
    });
    // 最新のいいね数を取得
    const res = await apiClient.post("posts/get_post_status", {
      postId: postId,
      userId: loginUserId,
    });
    setLikeCount(res.data.status.likes.length);
  };

  const repost = async () => {
    await apiClient.post("posts/add_repost", {
      postId: postId,
      userId: loginUserId,
    });
    const res = await apiClient.post("posts/get_post_status", {
      postId: postId,
      userId: loginUserId,
    });
    setRepostCount(res.data.status.reposts.length);
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
      />
    </>
  );
};

export default PostFooter;
