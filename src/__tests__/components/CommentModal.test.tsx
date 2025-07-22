// ✅ コメントが追加されるか（即時反映）テスト
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommentModal from "@/components/CommentModal";
import apiClient from "@/lib/apiClient";
import { useState } from "react";

jest.mock("@/lib/apiClient", () => ({
  __esModule: true,
  default: require("@/__mocks__/apiClient").default,
}));

const mockFetchLatestPost = jest.fn();

const Wrapper = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <CommentModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      parentId={1}
      loginUserId={1}
      fetchLatestPost={mockFetchLatestPost}
      postIds={[]}
      postStatuses={{ statuses: [], likes: [], reposts: [] }}
    />
  );
};

describe("CommentModal", () => {
  beforeEach(() => {
    mockFetchLatestPost.mockClear();
  });

  it("リプライが即時反映されるか（API呼び出し＋モーダル閉鎖＋fetchLatestPost呼び出し）", async () => {
    render(<Wrapper />);
    const message = "こんにちは";

    const textarea = await screen.findByRole("textbox", {
      name: /reply-content/i,
    });
    await userEvent.type(textarea, message);

    const replyBtn = screen.getByRole("button", { name: /post-reply/i });
    await userEvent.click(replyBtn);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith("/posts/reply/1", {
        content: message,
      });
    });

    expect(mockFetchLatestPost).toHaveBeenCalled();

    await waitFor(() => {
      expect(
        screen.queryByRole("textbox", { name: /reply-content/i })
      ).not.toBeInTheDocument();
    });
  });
});
