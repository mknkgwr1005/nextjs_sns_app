// src/__tests__/Home.test.tsx
import { render, screen } from "@testing-library/react";
import Home from "@/src/components/Home";

// useRouter をモックする
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

test("renders heading", () => {
  render(<Home />);
  expect(screen.getByRole("heading")).toBeInTheDocument();
});
