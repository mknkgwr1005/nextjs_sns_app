"use client";
import { useEffect, useState } from "react";
import apiClient from "../lib/apiClient";
import Post from "./Post";
import { useAuth } from "../context/auth";
import { PostDataType } from "../types/PostDataType";

const Timeline = () => {
  const [postText, setPostText] = useState<string>("");
  const [latestPosts, setLatestPosts] = useState<PostDataType[]>([]);
  const [showAllUsers, setShowAllUsers] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLatestPost = async () => {
      try {
        if (!user) return;

        if (!showAllUsers) {
          const response = await apiClient.get(`/posts/get_following_post`);
          setLatestPosts(response.data);
        } else {
          const response = await apiClient.get("/posts/get_latest_post");
          setLatestPosts(response.data);
        }
      } catch (error) {
        window.alert("ログインしてください");
      }
    };
    fetchLatestPost();
  }, [showAllUsers, user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const newPost = await apiClient.post("/posts/post", {
        content: postText,
      });
      // 過去のポストの上に追加していく
      setLatestPosts((prevPosts) => [newPost.data, ...prevPosts]);
      setPostText("");
    } catch (error) {
      console.error(error);
      alert("投稿に失敗しました");
    }
  };
  return (
    <div>
      <div className="min-h-screen bg-gray-100">
        <main className="container mx-auto py-4 ">
          <div className="bg-white">
            <header className="flex justify-around ">
              <div className="text-center">
                <button
                  className={showAllUsers ? `font-bold` : undefined}
                  id="allUsers"
                  onClick={() => setShowAllUsers(true)}
                >
                  すべて
                </button>
              </div>
              <div className="text-center">
                <button
                  className={!showAllUsers ? `font-bold` : undefined}
                  id="following"
                  onClick={() => setShowAllUsers(false)}
                >
                  フォロー
                </button>
              </div>
            </header>
          </div>
          <div className="bg-white shadow-md rounded p-4 mb-4">
            <form onSubmit={handleSubmit}>
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
              >
                投稿
              </button>
            </form>
          </div>
          {latestPosts.map((postData: PostDataType) => {
            return (
              <Post
                key={`${postData.type}-${postData.post.id}-${postData.createdAt}`}
                postData={postData}
                loginUserId={user?.id}
              />
            );
          })}
        </main>
      </div>
    </div>
  );
};

export default Timeline;
