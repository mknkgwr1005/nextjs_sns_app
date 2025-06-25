import React, { useEffect, useState } from "react";
import Image from "next/image";
import CommentModal from "./CommentModal";
import apiClient from "../lib/apiClient";
import StarSolidIcon from "@/src/components/icons/StarSolidIcon";
import CommentIcon from "@/src/components/icons/CommentIcon";
import RepostIcon from "./icons/RepostIcon";

type Props = {
  postId: number;
  loginUserId: number;
  likeCount: number;
  commentCount: number;
};

export const PostFooter = ({
  postId,
  loginUserId,
  likeCount,
  commentCount,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const addLike = async () => {
    await apiClient.post("/posts/add_like", {
      postId: postId,
      userId: loginUserId,
    });
  };

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
    });
  }, []);

  return (
    <>
      <div>
        <footer className="flex justify-around">
          <button id="replies" onClick={() => setIsModalOpen(true)}>
            <div className="flex">
              <CommentIcon className="size-6" />
              <div>{commentCount}</div>
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
