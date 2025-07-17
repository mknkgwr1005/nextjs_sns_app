"use client";
import { useEffect, useState } from "react";
import apiClient from "../lib/apiClient";
import Post from "./Post";
import { useAuth } from "../context/auth";
import { PostDataType } from "../types/PostDataType";
import Loader from "./Loader";
import Home from "./Home";
import { useCallback } from "react";
import { PostStatusesData } from "../types/PostStatusesData";
import ImageIcon from "./icons/ImageIcon";
import Image from "next/image";
import styles from "../styles/components.module.scss";
import { supabase } from "../lib/supabaseClient";

const Timeline = () => {
  const [postText, setPostText] = useState<string>("");
  const [latestPosts, setLatestPosts] = useState<PostDataType[]>([]);
  const [showAllUsers, setShowAllUsers] = useState(true);
  const [loading, setLoading] = useState(true);
  const [postIds, setPostIds] = useState<number[]>([]);
  const [postLength, setPostLength] = useState(10);
  const [postStatuses, setPostStatuses] = useState<PostStatusesData>({
    statuses: [],
    likes: [],
    reposts: [],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const { user, authLoading } = useAuth();

  const fetchLatestPost = async () => {
    setLoading(true);
    try {
      if (!user) {
        return setLoading(false);
      }

      if (!showAllUsers) {
        await apiClient
          .get(`/posts/get_following_post`, {
            params: { postLength: postLength },
          })
          .then((res) => {
            setLatestPosts(res.data);
            setLoading(false);
          });
      } else {
        const res = await apiClient.get("/posts/get_latest_post", {
          params: {
            postLength: postLength,
          },
        });
        setLatestPosts(res.data);
        setLoading(false);
      }
    } catch (error) {
      window.alert("ログインしてください");
    }
  };

  // 値が更新されない限り、レンダリングしないようuseCallback
  const fetchPostStatus = useCallback(async () => {
    const res = await apiClient.post("/posts/get_post_status", {
      postIds: postIds,
      userId: user?.id,
    });
    setPostStatuses(res.data);
  }, [postIds, user?.id]);

  useEffect(() => {
    setPostIds(latestPosts.map((post) => post.post.id));
  }, [latestPosts]);

  useEffect(() => {
    // 条件①: userが存在する
    // 条件②: latestPostsが空じゃない
    // 条件③: postIds.lengthが期待通り
    if (
      user &&
      latestPosts.length > 0 &&
      postIds.length === latestPosts.length
    ) {
      // すべてそろったときだけ実行
      fetchPostStatus();
    }
  }, [user, latestPosts, postIds]);

  useEffect(() => {
    if (authLoading) return;
    fetchLatestPost();
  }, [showAllUsers, user, authLoading]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await post();
  };

  const post = async () => {
    try {
      let mediaUrl = "";
      if (imageFile) {
        const id = crypto.randomUUID();
        const fileExt = imageFile.name.split(".").pop();
        const filePath = `${id}.${fileExt}`;
        const { error } = await supabase.storage
          .from("post-images")
          .upload(filePath, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });
        if (error) throw error;

        // 公開URLを取得
        const { data: publicUrlData } = supabase.storage
          .from("post-images")
          .getPublicUrl(filePath);

        mediaUrl = publicUrlData.publicUrl;
      }

      const newPost = await apiClient.post("/posts/post", {
        content: postText,
        mediaUrl: mediaUrl,
      });

      setLatestPosts((prevPosts) => [newPost.data, ...prevPosts]);
      setPostText("");
      setImageFile(null);
      setImagePreviewUrl("");
    } catch (error) {
      console.error(error);
      alert("投稿に失敗しました");
    }
  };

  const postImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  return (
    <div>
      <div className="min-h-screen bg-sky-300">
        <main className="container mx-auto py-4 ">
          {authLoading ? (
            <Loader />
          ) : !user ? (
            <Home />
          ) : loading ? (
            <Loader />
          ) : (
            <>
              <div className="bg-white">
                <header className="flex justify-around ">
                  <div className="text-center">
                    <button
                      className={
                        showAllUsers
                          ? `font-bold`
                          : "text-gray-300 hover:text-gray-600"
                      }
                      aria-label="all-users"
                      id="allUsers"
                      onClick={() => setShowAllUsers(true)}
                    >
                      すべて
                    </button>
                  </div>
                  <div className="text-center">
                    <button
                      className={
                        !showAllUsers
                          ? `font-bold`
                          : "text-gray-300 hover:text-gray-600"
                      }
                      aria-label="following-only"
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
                    onChange={(e) => setPostText(e.target.value)}
                  />
                  {/* 画像プレビュー */}
                  {imagePreviewUrl && (
                    <div className="my-2">
                      <Image
                        alt="投稿する画像"
                        src={imagePreviewUrl}
                        width={64}
                        height={64}
                        className="rounded"
                      />
                    </div>
                  )}
                  <div className="flex flex-row items-center">
                    {/* 画像アイコン＋ファイル選択 */}
                    <label className="cursor-pointer flex items-center">
                      <ImageIcon className="size-6 text-sky-400" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={postImage}
                      />
                    </label>
                    <div className="w-full text-right">
                      <button
                        type="submit"
                        aria-label="post"
                        className={styles.buttonPrimary}
                      >
                        投稿
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {latestPosts.map((postData: PostDataType) => (
                <Post
                  key={`${postData.type}-${postData.post.id}-${postData.createdAt}`}
                  postData={postData}
                  loginUserId={user?.id}
                  fetchLatestPost={fetchLatestPost}
                  postIds={postIds}
                  postStatuses={postStatuses}
                />
              ))}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Timeline;
