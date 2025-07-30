import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Timeline from "../../components/Timeline";
import { AuthContext } from "@/context/auth";
import apiClient from "@/lib/apiClient";
import userEvent from "@testing-library/user-event";
("@/lib/apiClient");

jest.mock("@/lib/apiClient", () => ({
  __esModule: true,
  default: require("@/__mocks__/apiClient").default,
}));

jest.mock("@/lib/supabaseClient", () => ({
  supabase: {
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(() => Promise.resolve({ data: {}, error: null })),
        getPublicUrl: jest.fn(() => ({
          data: { publicUrl: "https://mocked-url.com/test-image.png" },
        })),
      })),
    },
  },
}));

beforeAll(() => {
  window.alert = jest.fn(); // alert をモック
  global.URL.createObjectURL = jest.fn(() => "blob:mocked-url");
});

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

  beforeEach(async () => {
    await waitFor(() => {
      expect(screen.queryByText(/読み込み中.../i)).not.toBeInTheDocument();
    });
  });

  it("必要なボタンがすべて表示される", async () => {
    // 投稿ボタンが表示されていることを確認（ラベルに応じて調整）
    expect(
      screen.getByRole("button", { name: /all-users/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /following-only/i })
    ).toBeInTheDocument();
    expect(screen.getByText("投稿")).toBeInTheDocument();
  });

  it("ポストが表示されるか", async () => {
    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith("/posts/get_latest_post", {
        params: { postLength: 10 },
      });
    });

    await waitFor(() => {
      expect(screen.getByText("Hello world")).toBeInTheDocument();
    });
  });

  it("フォロー中のポストが表示されるか", async () => {
    const switchButton = screen.getByRole("button", {
      name: /following-only/i,
    });
    await userEvent.click(switchButton);

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith("/posts/get_following_post", {
        params: {
          postLength: 10,
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByText("I am your follower.")).toBeInTheDocument();
    });
  });

  it("投稿フォームが表示されるか", () => {
    expect(
      screen.getByPlaceholderText("What's on your mind?")
    ).toBeInTheDocument();
  });

  it("正常に投稿できるか", async () => {
    const inputMessage = "this is a test";
    const inputForm = screen.getByPlaceholderText("What's on your mind?");
    await userEvent.type(inputForm, inputMessage);

    const postButton = screen.getByText("投稿");
    await userEvent.click(postButton);

    // 1.ポスト投稿機能のテストを実行
    await waitFor(() => {
      expect((apiClient.post as jest.Mock).mock.calls[0][0]).toBe(
        "/posts/post"
      );
      expect((apiClient.post as jest.Mock).mock.calls[0][1]).toEqual({
        content: inputMessage,
        mediaUrl: "",
      });
    });

    // 2.ポストのステータスを取得するAPIが呼ばれることを確認
    await waitFor(() => {
      expect((apiClient.post as jest.Mock).mock.calls[1][0]).toBe(
        "/posts/get_post_status"
      );
      expect((apiClient.post as jest.Mock).mock.calls[1][1]).toEqual({
        postIds: [],
        userId: 1,
      });
    });

    // 3.ポストがあるかどうかを確認
    expect(screen.getByText(inputMessage)).toBeInTheDocument();
  });

  it("画像付きで投稿できるか", async () => {
    const inputMessage = "this is a test";
    const inputForm = screen.getByPlaceholderText("What's on your mind?");
    await userEvent.type(inputForm, inputMessage);

    const fileInput = screen.getByTestId("image-file");
    const file = new File(["raconn_image"], "racoon.png", {
      type: "image/png",
    });

    // ファイル選択のトリガー
    fireEvent.change(fileInput, { target: { files: [file] } });

    // プレビュー画像が表示されることを確認
    const imagePreview = screen.getByAltText(/投稿する画像/i);
    expect(imagePreview).toBeInTheDocument();
    expect((imagePreview as HTMLImageElement).src).toContain("blob:"); // ファイル選択後のURL（Blob URL）を含むか確認

    const postButton = screen.getByText("投稿");
    await userEvent.click(postButton);

    // 1.ポスト投稿機能のテストを実行
    await waitFor(() => {
      expect((apiClient.post as jest.Mock).mock.calls[0][0]).toBe(
        "/posts/post"
      );
      expect((apiClient.post as jest.Mock).mock.calls[0][1]).toEqual({
        content: inputMessage,
        mediaUrl: "",
      });
    });

    // 2.ポストのステータスを取得するAPIが呼ばれることを確認
    await waitFor(() => {
      expect((apiClient.post as jest.Mock).mock.calls[1][0]).toBe(
        "/posts/get_post_status"
      );
      expect((apiClient.post as jest.Mock).mock.calls[1][1]).toEqual({
        postIds: [],
        userId: 1,
      });
    });

    // 3.ポストがあるかどうかを確認
    expect(screen.getByText(inputMessage)).toBeInTheDocument();
    expect(screen.getByAltText("Post media")).toBeInTheDocument();
  });

  it("投稿がない場合、何も投稿がありませんと表示されるか", async () => {
    // モックデータとしてフォローユーザーがいない状態を作成
    (apiClient.get as jest.Mock).mockResolvedValueOnce({
      data: [], // フォローしているユーザーがいない
    });

    // 読み込みが終わるまで待つ
    await waitFor(() => {
      expect(screen.queryByText(/読み込み中.../i)).not.toBeInTheDocument();
    });

    const switchButton = screen.getByRole("button", {
      name: /following-only/i,
    });
    await waitFor(
      () => {
        expect(switchButton).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
    await userEvent.click(switchButton);

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith("/posts/get_following_post", {
        params: {
          postLength: 10,
        },
      });
    });

    expect(screen.getByText("投稿がありません")).toBeInTheDocument();
  });
});
