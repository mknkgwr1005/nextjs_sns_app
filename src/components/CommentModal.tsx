import React, { useState } from "react";
import apiClient from "../lib/apiClient";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  parentId: number;
};

export const CommentModal = ({ isOpen, onClose, parentId }: Props) => {
  const [postText, setPostText] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    await apiClient.post(`/posts/reply/${parentId}`, {
      content: postText,
    });
    onClose();
    router.refresh();
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* 親ポストを表示する */}
      <div className="bg-white p-1 rounded shadow-lg w-96">
        <main className="container mx-auto">
          <div className="text-right">
            <button
              onClick={onClose}
              className="text-right px-4 py-2 bg-gray-200 text-gray-800 rounded"
            >
              ×
            </button>
          </div>

          <div className="bg-white shadow-md rounded mb-4">
            <form>
              <textarea
                className="w-full h-24 p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="What's on your mind?"
                value={postText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setPostText(e.target.value);
                }}
              ></textarea>
              <button
                type="submit"
                className="mt-2 bg-gray-700 hover:bg-green-700 duration-200 text-white font-semibold py-2 px-4 rounded"
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
