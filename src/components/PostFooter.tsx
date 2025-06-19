import React, { useState } from "react";
import Image from "next/image";
import CommentModal from "./CommentModal";

type Props = {
  parentId: number;
};

export const PostFooter = ({ parentId }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            <Image src="/star.png" alt="Like" width={38} height={38} />
          </button>
        </footer>
      </div>
      <CommentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        parentId={parentId}
      />
    </>
  );
};

export default PostFooter;
