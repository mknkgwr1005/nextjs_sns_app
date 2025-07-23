import { render, screen, waitFor } from "@testing-library/react";
import Login from "../../app/login/page";
import userEvent from "@testing-library/user-event";
import apiClient from "@/lib/apiClient";

jest.mock("@/lib/apiClient", () => ({
  __esModule: true,
  default: require("@/__mocks__/apiClient").default,
}));

// useRouter をモックする
const mockpush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockpush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    refresh: jest.fn(), // ← これが必要
  }),
}));

describe("ログインページ", () => {
  beforeEach(() => {
    render(<Login />);
  });
  it("ボタンがすべて表示される", () => {
    const loginButton = screen.getByRole("button", { name: /login/i });
    expect(screen.getByRole("heading")).toBeInTheDocument();

    expect(screen.getByLabelText(`メールアドレス`)).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード")).toBeInTheDocument();

    expect(loginButton).toBeInTheDocument();
  });

  it("ログインできるか", async () => {
    const loadingMessage = "ログイン中・・・";
    const loginButton = screen.getByRole("button", { name: /login/i });
    const inputEmail = screen.getByLabelText(`メールアドレス`);
    const inputPassword = screen.getByLabelText(`パスワード`);
    const testEmail = "test@abc.com";
    const testPasswrd = "testabc";

    await userEvent.type(inputEmail, testEmail);
    await userEvent.type(inputPassword, testPasswrd);
    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith(
        "/auth/login",
        {
          email: testEmail,
          password: testPasswrd,
        },
        {
          withCredentials: true,
        }
      );
    });
  });

  it("誤ったメールアドレスとパスワードでログインすると、エラーが表示されるか", async () => {
    const loginButton = screen.getByRole("button", { name: /login/i });
    const inputEmail = screen.getByLabelText(`メールアドレス`);
    const inputPassword = screen.getByLabelText(`パスワード`);
    const testEmail = "fail@example.com";
    const testPasswrd = "failpass";

    await userEvent.type(inputEmail, testEmail);
    await userEvent.type(inputPassword, testPasswrd);
    await userEvent.click(loginButton);

    await waitFor(() => {
      const errorMsg = screen.getByTestId("errorMsg");
      expect(errorMsg).toBeInTheDocument();
      expect(errorMsg).toHaveTextContent(
        "メールアドレスまたはパスワードが間違っています"
      );
    });
  });
});
