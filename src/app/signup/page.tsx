"use client";
import React from "react";
import Head from "next/head";
import { useState } from "react";
import apiClient from "../../lib/apiClient";
import { useRouter } from "next/navigation";
import styles from "../../styles/components.module.scss";
import SpinningIcon from "@/components/icons/SpinningIcon";

const Signup = () => {
  const [username, setusername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const submit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);
      await apiClient.post("/auth/register", {
        username,
        email,
        password,
      });
      setLoading(false);

      router.push("/login");
    } catch (error: any) {
      setLoading(false);
      const message = error.response.data.error;
      if (message === "Invalid email address") {
        setErrorMsg("入力されたメールアドレスの形式が正しくありません。");
      } else if (message === "Invalid password") {
        setErrorMsg("入力されたパスワードの形式が正しくありません。");
      } else if (message === "You are already registered") {
        setErrorMsg("すでに登録されています。");
      } else if (message === "Invalid Value") {
        setErrorMsg("正しい値を入力してください。");
      } else {
        setErrorMsg(message);
      }
    }
  };
  return (
    <div
      style={{ height: "88vh" }}
      className="flex flex-col justify-center py-12 sm:px-6 lg:px-8"
    >
      <Head>
        <title>新規作成</title>
      </Head>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          アカウントを作成
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form>
            <div>
              {errorMsg ? (
                <p className="text-red-400 font-bold" data-testid="errorMsg">
                  {errorMsg}
                </p>
              ) : null}
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                お名前
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setusername(e.target.value);
                }}
              />
            </div>
            <div className="mt-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="mt-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="mt-6">
              <button
                aria-label="signup"
                type="submit"
                disabled={loading}
                className={styles.buttonPrimary}
                onClick={(e) => {
                  submit(e);
                }}
              >
                {loading ? (
                  <div className="flex justify-center">
                    <SpinningIcon className="size-6 animate-spin" />
                    登録中・・・
                  </div>
                ) : (
                  <div>新規登録</div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="flex justify-center m-[10px]">
        <button
          aria-label="go-back"
          className="align-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => router.push("/")}
        >
          戻る
        </button>
      </div>
    </div>
  );
};

export default Signup;
