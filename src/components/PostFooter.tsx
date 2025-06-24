import React, { useState } from "react";
import Image from "next/image";
import CommentModal from "./CommentModal";
import apiClient from "../lib/apiClient";

type Props = {
  postId: number;
  loginUserId: number;
};

export const PostFooter = ({ postId, loginUserId }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const addLike = async () => {
    await apiClient
      .post("/posts/add_like", {
        postId: postId,
        userId: loginUserId,
      })
      .then(() => {
        setLikeCount(likeCount + 1);
      });
  };

  return (
    <>
      <div>
        <footer className="flex justify-around">
          <button>
            <Image
              src="/comment.png"
              alt="Comment"
              width={38}
              height={38}
              onClick={() => {
                setIsModalOpen(true);
              }}
            />
          </button>
          <button>
            <Image src="/repost.png" alt="Repost" width={38} height={38} />
          </button>
          <button>
            <Image
              src="/star.png"
              alt="Like"
              width={38}
              height={38}
              onClick={addLike}
            />
          </button>
          {likeCount}
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
