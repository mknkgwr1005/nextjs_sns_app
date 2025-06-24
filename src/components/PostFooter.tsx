import React, { useState } from "react";
import Image from "next/image";
import CommentModal from "./CommentModal";
import apiClient from "../lib/apiClient";

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

  const addLike = async () => {
    await apiClient.post("/posts/add_like", {
      postId: postId,
      userId: loginUserId,
    });
  };

  return (
    <>
      <div>
        <footer className="flex justify-around">
          <button>
            <div className="flex">
              <Image
                src="/comment.png"
                alt="Comment"
                width={38}
                height={38}
                onClick={() => {
                  setIsModalOpen(true);
                }}
              />
              <div className="m-[10px]">{commentCount}</div>
            </div>
          </button>
          <button>
            <div className="flex">
              <Image src="/repost.png" alt="Repost" width={38} height={38} />
            </div>
          </button>
          <button>
            <div className="flex">
              <Image
                src="/star.png"
                alt="Like"
                width={38}
                height={38}
                onClick={addLike}
              />
              <div className="m-[10px]">{likeCount}</div>
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
