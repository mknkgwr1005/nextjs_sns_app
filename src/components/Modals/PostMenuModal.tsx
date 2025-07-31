import apiClient from "@/lib/apiClient";
import TrashIcon from "../icons/TrashIcon";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
  authorId: number;
  content: string;
  loginUserId: number | undefined;
  fetchLatestPost: () => void;
};

const PostMenuModal = ({
  isOpen,
  onClose,
  postId,
  authorId,
  content,
  loginUserId,
  fetchLatestPost,
}: Props) => {
  const deletePost = async () => {
    try {
      await apiClient
        .delete("/posts/delete_post", {
          params: {
            postId: postId,
            authorId: authorId,
            content: content,
          },
        })
        .then(() => {
          onClose();
          fetchLatestPost();
          window.alert("ポストを削除しました");
        });
    } catch (error) {
      window.alert(error);
    }
  };
  if (!isOpen) {
    return null;
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-1 rounded shadow-lg w-96">
        <main className="container mx-auto m-[10px] ">
          <button
            aria-label="close-button"
            onClick={onClose}
            className="text-right px-4 py-2 bg-gray-200 text-gray-800 rounded"
          >
            ×
          </button>
          <div className="flex text-left w-[100%]">
            <ul>
              {loginUserId === authorId && (
                <li
                  className="w-full flex items-center gap-2 text-red-400"
                  id="delete-post"
                  onClick={deletePost}
                >
                  <TrashIcon className="size-6 " />
                  <label htmlFor="delete-post">ポストを削除する</label>
                </li>
              )}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PostMenuModal;
