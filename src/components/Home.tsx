import { useRouter } from "next/navigation";
import React from "react";
import styles from "../styles/components.module.scss";

const Home = () => {
  const router = useRouter();
  return (
    <div
      className={styles.landingPage}
      style={{ backgroundImage: "@/public/racoon_image.png" }}
    >
      <div className="flex h-screen w-full">
        <div className="w-1/2  text-white flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold">
            いま、起きていることを見つけよう
          </h1>
        </div>
        <div className="w-1/2  text-white flex flex-col justify-center items-center">
          <div className="m-[10px]">
            <button
              type="button"
              aria-label="signup"
              className={styles.buttonPrimary}
              onClick={() => router.push("/signup")}
              >
              新規登録はこちら
            </button>
          </div>
          <div>
            <button
              type="button"
              aria-label="login"
              className={styles.buttonSecondary}
              onClick={() => router.push("/login")}
            >
              すでにユーザーの方はこちら
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
