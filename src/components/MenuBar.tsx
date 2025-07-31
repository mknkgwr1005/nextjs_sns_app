"use client";
import { useState } from "react";
import MenuBarIcon from "./icons/MenuBarIcon";
import PostMenuModal from "./Modals/PostMenuModal";

type Props = {
  postId: number;
  authorId: number;
  content: string;
  loginUserId: number | undefined;
  fetchLatestPost: () => void;
};

const MenuBar = ({
  postId,
  authorId,
  content,
  loginUserId,
  fetchLatestPost,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setIsOpen(true)}>
        <MenuBarIcon className="size-6" />
      </button>
      <PostMenuModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        postId={postId}
        authorId={authorId}
        content={content}
        loginUserId={loginUserId}
        fetchLatestPost={fetchLatestPost}
      />
    </div>
  );
};

export default MenuBar;
