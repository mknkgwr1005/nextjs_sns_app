import { useRouter } from "next/navigation";
import React from "react";

const Home = () => {
  const router = useRouter();
  return (
    <div>
      <div className="flex h-screen">
        <div className="w-1/2 bg-blue-500 text-white flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold">
            いま、起きていることを見つけよう
          </h1>
        </div>
        <div className="w-1/2 bg-blue-500 text-white flex flex-col justify-center items-center">
          <button
            type="button"
            className="mt-2 bg-gray-700 hover:bg-green-700 duration-200 text-white font-semibold py-2 px-4 w-[200px] rounded"
            onClick={() => router.push("/signup")}
          >
            新規登録はこちら
          </button>
          <button
            type="button"
            className="mt-2 bg-gray-700 hover:bg-green-700 duration-200 text-white font-semibold py-2 px-4 w-[200px] rounded"
            onClick={() => router.push("/login")}
          >
            すでにユーザーの方はこちら
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
