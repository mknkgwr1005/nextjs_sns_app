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

  /**
   * ポストの取得
   */
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

  /**
   * ポストのいいね、リプライ、リポスト数の表示
   * 無限にAPIを呼ぶのを避けるため、useCallbackを使ってキャッシュに残しています
   */
  const fetchPostStatus = useCallback(async () => {
    const res = await apiClient.post("/posts/get_post_status", {
      postIds: postIds,
      userId: user?.id,
    });
    setPostStatuses(res.data);
  }, [postIds, user?.id]);

  //ポストのいいね数やリプライ数、リポスト数を取得するためにpostIdsをセットする
  useEffect(() => {
    if (user && latestPosts.length > 0) {
      const ids = latestPosts.map((post) => post.post.id);
      setPostIds(ids);
    }
  }, [user, latestPosts]);

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
  }, [user, latestPosts]);

  useEffect(() => {
    if (authLoading) return;
    fetchLatestPost();
  }, [showAllUsers, user, authLoading]);

  /**
   * 投稿機能
   * @param 投稿ボタンのイベント
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await post();
  };

  const post = async () => {
    try {
      let mediaUrl = "";
      const formData = new FormData();
      if (imageFile) {
        // ファイルをFormDataに追加
        formData.append("file", imageFile);

        const id = crypto.randomUUID();
        const fileExt = imageFile.name.split(".").pop();
        const filePath = `${id}.${fileExt}`;

        // Supabaseにファイルをアップロード
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

      // 投稿内容をAPIに送信
      const newPost = await apiClient.post("/posts/post", {
        content: postText,
        mediaUrl: mediaUrl,
      });

      setLatestPosts((prevPosts) => [newPost.data, ...prevPosts]);
      setPostIds((prevPostIds) => [newPost.data.post.id, ...prevPostIds]);

      setPostText("");
      setImageFile(null);
      setImagePreviewUrl("");
    } catch (error) {
      console.error(error);
      alert("投稿に失敗しました");
    }
  };
  /**
   * 画像の投稿機能
   * @param e 画像投稿ボタンのイベント
   */
  const postImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  return (
    <div data-testid="timeline">
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
                      id="allUsers"
                      aria-label="all-users"
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
                      id="following"
                      aria-label="following-only"
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
                        data-testid="image-file"
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
              {latestPosts && latestPosts.length > 0 ? (
                latestPosts.map((postData: PostDataType) => (
                  <Post
                    key={`${postData.type}-${postData.post.id}-${postData.createdAt}`}
                    postData={postData}
                    loginUserId={user?.id}
                    fetchLatestPost={fetchLatestPost}
                    postIds={postIds}
                    postStatuses={postStatuses}
                  />
                ))
              ) : (
                <div className="bg-white shadow-md rounded p-4 mb-4">
                  <div>投稿がありません</div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Timeline;
