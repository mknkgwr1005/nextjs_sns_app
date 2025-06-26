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
};

export const PostFooter = ({ postId, loginUserId }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [replyCount, setReplyCount] = useState(0);

  useEffect(() => {
    const getPostStatus = async () => {
      const res = await apiClient.post("/posts/get_post_status", {
        postId: postId,
        userId: loginUserId,
      });
      return res;
    };
    getPostStatus().then((res) => {
      const isLiked = res.data.isLiked;
      setIsDisabled(isLiked);
      setLikeCount(res.data.status.likes.length);
      setReplyCount(res.data.status.replies.length);
    });
  }, [likeCount, isModalOpen]);

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
          <button id="repost">
            <div className="flex">
              <RepostIcon className="size-6" />
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
      />
    </>
  );
};

export default PostFooter;
