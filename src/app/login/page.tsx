"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import apiClient from "../../lib/apiClient";
import { useAuth } from "../../context/auth";
import Cookies from "js-cookie";
import styles from "../../styles/components.module.scss";
import SpinningIcon from "@/src/components/icons/SpinningIcon";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errormsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (email === "" || password === "") {
      return setErrorMsg("メールアドレスまたはパスワードを入力してください。");
    }
    if (email === "" || password === "") {
      return setErrorMsg("メールアドレスまたはパスワードを入力してください。");
    }
    try {
      setLoading(true);
      const response = await apiClient.post(
        "/auth/login",
        {
          email,
          password,
        },
        {
          withCredentials: true, // クッキーを送信するために必要
        }
      );
      const token = response.data.token;

      Cookies.set("token", token, { expires: 7 });
      login(token);
      setLoading(false);
      router.push("/");
    } catch (error: any) {
      setLoading(false);
      const message = error.response.data.error;
      if (message === "your email address or password is not registered") {
        setErrorMsg("メールアドレスまたはパスワードが間違っています");
      } else {
        setErrorMsg("サーバーエラー：" + message);
      }
    }
  };
  return (
    <div
      style={{ height: "88vh" }}
      className="flex flex-col justify-center py-12 sm:px-6 lg:px-8"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          アカウントにログイン
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {errormsg ? (
            <p className="text-red-400 font-bold" data-testid="errorMsg">
              {errormsg}
            </p>
          ) : null}
          <form>
            <div>
              <label
                htmlFor="email"
                aria-label="email"
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
                aria-label="password"
                className="block text-sm font-medium text-gray-700"
              >
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="mt-6">
              <button
                type="submit"
                aria-label="login"
                className={styles.buttonPrimary}
                onClick={(e) => {
                  handleSubmit(e);
                }}
              >
                {loading ? (
                  <div className="flex" data-testid="loading-icon">
                    <SpinningIcon className="size-6 animate-spin" />
                    ログイン中・・・
                  </div>
                ) : (
                  <div className="flex" data-testid="finished-loading">
                    ログイン
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
