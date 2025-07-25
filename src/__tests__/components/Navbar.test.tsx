import { getByRole, render, screen, waitFor } from "@testing-library/react";
import NavBar from "@/components/NavBar";
import userEvent from "@testing-library/user-event";
import ProfileIcon from "@/components/icons/ProfileIcon";
import { useAuth } from "@/context/auth";
import UserProfilePage from "@/app/profile/[userId]/page";
import { head } from "node_modules/axios/index.cjs";

jest.mock("@/lib/apiClient", () => ({
  __esModule: true,
  default: require("@/__mocks__/apiClient").default,
}));

const mockLogout = jest.fn();
jest.mock("@/context/auth", () => ({
  // jest.fnでラップすることで、後の異常系テストに対応する
  useAuth: jest.fn(() => ({
    user: { id: 1, username: "test", email: "test@test.com" },
    logout: mockLogout,
    authLoading: false,
  })),
}));

describe("ナビゲーションバーの動作確認", () => {
  beforeEach(() => {
    render(<NavBar />);
  });
  it("logout ボタンが表示される", () => {
    // ボタンが 1 個あるか確認
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(1);

    // aria-label="logout" が付いたボタンを確認
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("ログアウトが実行される", async () => {
    const logoutButton = screen.getByRole("button", { name: /logout/i });
    await userEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("プロフィール画像が表示される", () => {
    waitFor(() => {
      render(<ProfileIcon profileImageUrl={"/racoon.png"} size={100} />);
    });
  });

  it("プロフィールページに遷移する", async () => {
    waitFor(() => {
      render(<ProfileIcon profileImageUrl={"/racoon.png"} size={100} />);
    });
    const profileImage = screen.getByRole("link", { name: /profile_image/i });
    await userEvent.click(profileImage);

    waitFor(
      () => {
        expect(screen.getByTestId("profile_page")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("アプリのヘッダーをクリックすると、タイムラインに遷移する", async () => {
    const header = screen.getByRole("link", { name: /go_home/i });
    waitFor(() => {
      expect(header).toBeInTheDocument();
    });
    await userEvent.click(header);

    waitFor(
      () => {
        expect(screen.getByTestId("timeline")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});

// モックされた useAuth を型アサート
const mockUseAuth = useAuth as jest.Mock;

// ログインしていない状態でのテストグループ
describe("ログインしていないとき", () => {
  beforeEach(() => {
    // ログインしていない状態の useAuth モックをセット
    mockUseAuth.mockReturnValue({
      user: null, // user を null に設定
      logout: mockLogout,
      authLoading: false,
    });
    render(<NavBar />); // ここでコンポーネントをレンダリング
  });

  it("ナビゲーションバーは表示されない", () => {
    // getByTestId の代わりに queryByTestId を使用
    const navbar = screen.queryByTestId("nav-bar");
    expect(navbar).not.toBeInTheDocument();
    // もし特定の要素が表示されないことを確認したいなら、それらも追加
    expect(
      screen.queryByRole("button", { name: /logout/i })
    ).not.toBeInTheDocument();
  });
});
