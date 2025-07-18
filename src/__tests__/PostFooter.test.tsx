import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PostFooter } from "../components/PostFooter";
import apiClient from "@/lib/apiClient";

jest.mock("@/lib/apiClient", () => ({
  __esModule: true,
  default: require("@/__mocks__/apiClient").default,
}));

describe("ポストのフッターのボタン表示確認", () => {
  beforeEach(() => {
    render(
      <PostFooter
        postId={1}
        loginUserId={1}
        fetchLatestPost={() => {}}
        postIds={[]}
        postStatuses={{ statuses: [], likes: [], reposts: [] }}
      />
    );
  });

  it("リポスト、コメント、いいねボタンが表示される", () => {
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
    expect(
      screen.getByRole("button", { name: /replies/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /like/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /repost/i })).toBeInTheDocument();
  });
});

describe("ボタンの動作確認", () => {
  beforeEach(() => {
    render(
      <PostFooter
        postId={1}
        loginUserId={1}
        fetchLatestPost={() => {}}
        postIds={[]}
        postStatuses={{ statuses: [], likes: [], reposts: [] }}
      />
    );
  });

  it("いいねができるか", async () => {
    (apiClient.post as jest.Mock)
      .mockResolvedValueOnce({ data: { isLiked: true } }) // いいね
      .mockResolvedValueOnce({ data: { isLiked: false } }); // 解除

    const likeBtn = screen.getByRole("button", { name: /like/i });
    await userEvent.click(likeBtn);
    // mockを引数つきで呼び出す
    expect(apiClient.post).toHaveBeenCalledWith("/posts/add_like", {
      postId: 1,
      userId: 1,
    });
    // 色がついているか確認する
    const likeIcon = screen.getByTestId("like-icon");
    await waitFor(() => {
      expect(likeIcon).toHaveClass("text-yellow-400");
    });
    // いいねの解除ができるか
    await userEvent.click(likeBtn);
    expect(apiClient.post).toHaveBeenCalledTimes(2);
    expect(apiClient.post).toHaveBeenCalledWith("/posts/add_like", {
      postId: 1,
      userId: 1,
    });
    await waitFor(() => {
      expect(likeIcon).toHaveClass("text-gray-500 hover:text-gray-700");
    });
  });

  it("リポストができるか", async () => {
    (apiClient.post as jest.Mock)
      .mockResolvedValueOnce({ data: { isReposted: true } })
      .mockResolvedValueOnce({ data: { isReposted: false } });

    const repostBtn = screen.getByRole("button", { name: /repost/i });
    await userEvent.click(repostBtn);
    // mockを引数つきで呼び出す
    expect(apiClient.post).toHaveBeenCalledWith("/posts/add_repost", {
      postId: 1,
      userId: 1,
    });
    // 色がついているか確認する
    const repostIcon = screen.getByTestId("repost-icon");
    await waitFor(() => {
      expect(repostIcon).toHaveClass("text-green-400");
    });
    // いいねの解除ができるか
    await userEvent.click(repostBtn);
    expect(apiClient.post).toHaveBeenCalledTimes(4);
    expect(apiClient.post).toHaveBeenCalledWith("/posts/add_repost", {
      postId: 1,
      userId: 1,
    });
    await waitFor(() => {
      expect(repostIcon).toHaveClass("text-gray-500 hover:text-gray-700");
    });
  });

  it("いいね数が正しく表示される", async () => {
    const likeBtn = screen.getByRole("button", { name: /like/i });

    // 最初のいいね数が 0 で表示されていることを確認
    expect(within(likeBtn).getByText("0")).toBeInTheDocument();

    // モックのレスポンスで likeCount を増加させる
    (apiClient.post as jest.Mock).mockResolvedValueOnce({
      data: { isLiked: true },
    });

    await userEvent.click(likeBtn);

    // いいね数が1に変化するのを待つ
    await waitFor(() => {
      expect(within(likeBtn).getByText("1")).toBeInTheDocument();
    });

    // 次のクリックで取り消し → 0 に戻る想定
    (apiClient.post as jest.Mock).mockResolvedValueOnce({
      data: { isLiked: false },
    });

    await userEvent.click(likeBtn);

    await waitFor(() => {
      expect(within(likeBtn).getByText("0")).toBeInTheDocument();
    });
  });

  it("リポスト数が正しく表示される", async () => {
    const repostBtn = screen.getByRole("button", { name: /repost/i });
    const repostCount = screen.getByTestId("repost-count");

    // 最初のいいね数が 0 で表示されていることを確認
    expect(repostCount).toHaveTextContent("0");

    // モックのレスポンスで likeCount を増加させる
    (apiClient.post as jest.Mock).mockResolvedValueOnce({
      data: { isReposted: true },
    });

    await userEvent.click(repostBtn);

    // いいね数が1に変化するのを待つ
    await waitFor(() => {
      expect(repostCount).toHaveTextContent("1");
    });

    // 次のクリックで取り消し → 0 に戻る想定
    (apiClient.post as jest.Mock).mockResolvedValueOnce({
      data: { isReposted: false },
    });

    await userEvent.click(repostBtn);

    await waitFor(() => {
      expect(repostCount).toHaveTextContent("0");
    });
  });
});
