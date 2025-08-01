// src/__tests__/Home.test.tsx
import { render, screen } from "@testing-library/react";
import Home from "@/components/Home";

// useRouter をモックする
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

test("ランディングページに必要なボタンがすべて表示される", () => {
  render(<Home />);
  expect(screen.getByRole("heading")).toBeInTheDocument();

  const buttons = screen.getAllByRole("button");
  expect(buttons).toHaveLength(2);

  expect(screen.getByRole("button", { name: /signup/ })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /login/ })).toBeInTheDocument();
});
