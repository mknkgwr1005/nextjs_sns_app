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
  it("ボタンとフォームがすべて表示される", () => {
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);

    const headers = screen.getAllByRole("heading");
    expect(headers).toHaveLength(1);

    expect(screen.getByLabelText(`メールアドレス`)).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード")).toBeInTheDocument();

    const loginButton = screen.getByRole("button", { name: /login/i });
    const goBackButton = screen.getByRole("button", { name: /go-back/i });
    expect(loginButton).toBeInTheDocument();
    expect(goBackButton).toBeInTheDocument();
  });

  it("ログインできるか", async () => {
    const loginButton = screen.getByRole("button", { name: /login/i });
    const inputEmail = screen.getByLabelText(`メールアドレス`);
    const inputPassword = screen.getByLabelText(`パスワード`);
    const testEmail = "test@abc.com";
    const testPasswrd = "testabc";

    await userEvent.type(inputEmail, testEmail);
    await userEvent.type(inputPassword, testPasswrd);
    await userEvent.click(loginButton);

    await waitFor(async () => {
      const loading = await screen.findByTestId("loading-icon");
      expect(loading).toBeInTheDocument();
    });

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

    await waitFor(async () => {
      const notLoading = await screen.findByTestId("finished-loading");
      expect(notLoading).toBeInTheDocument();
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

    await waitFor(async () => {
      const loading = await screen.findByTestId("loading-icon");
      expect(loading).toBeInTheDocument();
    });

    await waitFor(() => {
      const errorMsg = screen.getByTestId("errorMsg");
      expect(errorMsg).toBeInTheDocument();
      expect(errorMsg).toHaveTextContent(
        "メールアドレスまたはパスワードが間違っています"
      );
    });

    await waitFor(async () => {
      const notLoading = await screen.findByTestId("finished-loading");
      expect(notLoading).toBeInTheDocument();
    });
  });
});
