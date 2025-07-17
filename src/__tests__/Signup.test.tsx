import { render, screen } from "@testing-library/react";
import Signup from "../app/signup/page";

// useRouter をモックする
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

test("新規登録に必要なボタンがすべて表示される", () => {
  render(<Signup />);

  const buttons = screen.getAllByRole("button");
  expect(buttons).toHaveLength(1);

  const headers = screen.getAllByRole("heading");
  expect(headers).toHaveLength(1);

  expect(screen.getByRole("button", { name: /signup/i })).toBeInTheDocument();

  expect(screen.getByLabelText("お名前")).toBeInTheDocument();
  expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
  expect(screen.getByLabelText("パスワード")).toBeInTheDocument();
});
