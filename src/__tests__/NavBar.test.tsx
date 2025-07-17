import { render, screen } from "@testing-library/react";
import NavBar from "@/src/components/NavBar";

// 🔑 useAuth をモックして user を返す
jest.mock("@/src/context/auth", () => ({
  useAuth: () => ({
    user: { id: 1, name: "mika" }, // これがないと NavBar は null を返す
    logout: jest.fn(),
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
