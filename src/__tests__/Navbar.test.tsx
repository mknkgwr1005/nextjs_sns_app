import { render, screen } from "@testing-library/react";
import NavBar from "@/components/NavBar";

jest.mock("@/context/auth", () => ({
  useAuth: () => ({
    user: { id: 1, username: "test", email: "test@test.com" },
    login: jest.fn(),
    logout: jest.fn(),
    authLoading: false,
  }),
}));
test("logout ボタンが表示される", () => {
  render(<NavBar />);

  // ボタンが 1 個あるか確認
  const buttons = screen.getAllByRole("button");
  expect(buttons).toHaveLength(1);

  // aria-label="logout" が付いたボタンを確認
  expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
});
