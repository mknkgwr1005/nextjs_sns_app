import { render, screen } from "@testing-library/react";
import Login from "../../app/login/page";

// useRouter をモックする
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    refresh: jest.fn(), // ← これが必要
  }),
}));

test("ログインページのボタンがすべて表示される", () => {
  render(<Login />);
  expect(screen.getByRole("heading")).toBeInTheDocument();

  expect(screen.getByLabelText(`メールアドレス`)).toBeInTheDocument();
  expect(screen.getByLabelText("パスワード")).toBeInTheDocument();

  expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
});
