import { render, screen } from "@testing-library/react";
import { PostFooter } from "../components/PostFooter";
describe("PostFooter", () => {
  it("コメントボタンが表示される", () => {
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

    // 各ボタンが存在するか（aria-labelで判定）
    expect(
      screen.getByRole("button", { name: /replies/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /likes/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reposts/i })
    ).toBeInTheDocument();
  });
});
