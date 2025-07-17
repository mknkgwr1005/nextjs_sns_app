import { render, screen, waitFor } from "@testing-library/react";
import Timeline from "../components/Timeline";
import { AuthContext } from "../context/auth";

// モックファイルを適用
jest.mock("../lib/apiClient", () => require("../__mocks__/apiClient"));

describe("タイムライン表示", () => {
  // テストを行う前に、認証APIを実行する
  beforeEach(() => {
    render(
      <AuthContext.Provider
        value={{
          user: { id: 1, username: "test", email: "test@test.com" },
          login: jest.fn(),
          logout: jest.fn(),
          authLoading: false,
        }}
      >
        <Timeline />
      </AuthContext.Provider>
    );
  });
  it("必要なボタンがすべて表示される", async () => {
    // 読み込みが消えるまで待つ
    await waitFor(() => {
      expect(screen.queryByText(/読み込み中.../i)).not.toBeInTheDocument();
    });

    // 投稿ボタンが表示されていることを確認（ラベルに応じて調整）
    expect(
      screen.getByRole("button", { name: /all-users/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /following-only/i })
    ).toBeInTheDocument();
    expect(screen.getByText("投稿")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /replies/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /repost/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /like/i })).toBeInTheDocument();
  });
});
