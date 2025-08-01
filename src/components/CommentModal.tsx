"use client";
import React, { useEffect, useState } from "react";
import apiClient from "../lib/apiClient";
import { Post as PostType } from "../types/Post";
import Post from "./Post";
import type { PostStatusesData } from "../types/PostStatusesData"; // Adjust the path as needed
import styles from "../styles/components.module.scss";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  parentId: number;
  loginUserId: number;
  fetchLatestPost: () => void;
  postIds: number[];
  postStatuses: PostStatusesData;
};

export const CommentModal = ({
  isOpen,
  onClose,
  parentId,
  loginUserId,
  fetchLatestPost,
  postIds,
  postStatuses,
}: Props) => {
  const [postText, setPostText] = useState<string>("");
  const [parentPost, setParentPost] = useState<PostType>();

  useEffect(() => {
    if (!isOpen || parentId == null) return;
    const fetchParentPost = async () => {
      const res = await apiClient.get(`/posts/get_parent_post/${parentId}`, {});
      setParentPost(res.data);
    };
    fetchParentPost();
  }, [isOpen, parentId]);

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      const res = await apiClient.post(`/posts/reply/${parentId}`, {
        content: postText,
      });
      return res;
    } catch (error) {
      console.error(error);
    } finally {
      fetchLatestPost();
      onClose();
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-1 rounded shadow-lg w-96">
        <div className="text-right">
          <button
            aria-label="close-button"
            onClick={onClose}
            className="text-right px-4 py-2 bg-gray-200 text-gray-800 rounded"
          >
            ×
          </button>
        </div>

        <main className="container mx-auto">
          {parentPost && (
            <Post
              postData={{
                type: "post",
                createdAt: parentPost.createdAt,
                post: parentPost,
              }}
              key={parentPost.id}
              loginUserId={loginUserId}
              fetchLatestPost={fetchLatestPost}
              postIds={postIds} // Pass appropriate postIds if available
              postStatuses={postStatuses} // Pass appropriate postStatuses if available
            />
          )}

          <div className="bg-white shadow-md rounded mb-4">
            <form>
              <textarea
                aria-label="reply-content"
                className="w-full h-24 p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="What's on your mind?"
                value={postText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setPostText(e.target.value);
                }}
              ></textarea>
              <button
                aria-label="post-reply"
                type="submit"
                className={styles.buttonPrimary}
                onClick={handleSubmit}
              >
                リプライ
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CommentModal;
