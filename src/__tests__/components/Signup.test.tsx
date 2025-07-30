import { render, screen, waitFor } from "@testing-library/react";
import Signup from "../../app/signup/page";
import userEvent from "@testing-library/user-event";
import apiClient from "@/lib/apiClient";

jest.mock("@/lib/apiClient", () => ({
  __esModule: true,
  default: require("@/__mocks__/apiClient").default,
}));

// useRouter をモックする
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe("新規登録ページ", () => {
  beforeEach(() => {
    render(<Signup />);
  });
  it("新規登録に必要なボタンがすべて表示される", () => {
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);

    const headers = screen.getAllByRole("heading");
    expect(headers).toHaveLength(1);

    expect(screen.getByRole("button", { name: /signup/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /go-back/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText("お名前")).toBeInTheDocument();
    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード")).toBeInTheDocument();
  });

  it("新規登録が実行できる", async () => {
    const signupBtn = screen.getByRole("button", { name: /signup/i });

    await userEvent.click(signupBtn);

    waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith("/auth/register", {
        username: "Taro",
        email: "test@example.com",
        password: "password",
      });
    });

    waitFor(() => {
      expect(signupBtn).not.toBeInTheDocument();
    });
  });

  it("空欄を入力したとき、エラーメッセージが表示される", async () => {
    const signupBtn = screen.getByRole("button", { name: /signup/i });

    await userEvent.click(signupBtn);

    waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith("/auth/register", {
        username: "",
        email: "",
        password: "",
      });
    });

    waitFor(() => {
      expect(screen.getAllByTestId("errorMsg")).toMatch(
        "正しい値を入力してください。"
      );
    });
  });

  it("正しくないメールアドレスを入力したとき、エラーメッセージが表示される", async () => {
    const signupBtn = screen.getByRole("button", { name: /signup/i });

    await userEvent.click(signupBtn);

    waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith("/auth/register", {
        username: "testuser",
        email: "test.com",
        password: "testcom",
      });
    });

    waitFor(() => {
      expect(screen.getAllByTestId("errorMsg")).toMatch(
        "入力されたメールアドレスの形式が正しくありません。"
      );
    });
  });

  it("正しくないパスワードを入力したとき、エラーメッセージが表示される", async () => {
    const signupBtn = screen.getByRole("button", { name: /signup/i });

    await userEvent.click(signupBtn);

    waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith("/auth/register", {
        username: "testuser",
        email: "test@user.com",
        password: "test",
      });
    });

    waitFor(() => {
      expect(screen.getAllByTestId("errorMsg")).toMatch(
        "入力されたパスワードの形式が正しくありません。"
      );
    });
  });
});
