import { render, screen } from "@testing-library/react";
import { PostFooter } from "../components/PostFooter";
describe("PostFooter", () => {
  it("リポスト、コメント、いいねボタンが表示される", () => {
    render(
      <PostFooter
        postId={1}
        loginUserId={1}
        fetchLatestPost={() => {}}
        postIds={[]}
        postStatuses={{ statuses: [], likes: [], reposts: [] }}
      />
    );

    // buttonが3つあるか確認
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);

    // 各ボタンが存在するか（aria-labelで判定）i=大文字小文字区別しない
    expect(
      screen.getByRole("button", { name: /replies/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /like/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /repost/i })).toBeInTheDocument();
  });
});
