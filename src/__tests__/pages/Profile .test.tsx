// __tests__/UserProfileContent.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { UserProfileContent } from "@/components/UserProfileContent";
import ProfileHeader from "@/app/next/headers";
import userEvent from "@testing-library/user-event";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock("@/context/auth", () => ({
  useAuth: () => ({
    user: {
      id: "1",
      username: "testuser",
    },
  }),
}));

describe("プロフィールと投稿が表示される", () => {
  beforeEach(async () => {
    render(
      <UserProfileContent
        profile={{
          userId: "1",
          bio: "これは自己紹介です",
          profileImageUrl: "/icon.png",
          user: { username: "testuser" },
        }}
        posts={[
          {
            id: 1,
            content: "最初の投稿",
            author: { username: "testuser" },
            createdAt: "2023-01-01",
          },
        ]}
        token="test"
      />
    );
  });

  it("プロフィールが正常に表示される", () => {
    expect(screen.getByTestId("profile-username")).toBeInTheDocument();
    expect(screen.getByText("これは自己紹介です")).toBeInTheDocument();
    expect(screen.getByText("最初の投稿")).toBeInTheDocument();
    expect(screen.getByTestId("profile-image")).toBeInTheDocument();
  });

  it("プロフィール編集ボタンが表示される", async () => {
    await waitFor(() => {
      render(
        <ProfileHeader
          username={"testuser"}
          userId={1}
          bio={"これは自己紹介です"}
          profileImageUrl="/icon.png"
        />
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("edit-profile")).toBeInTheDocument();
    });
  });

  it("プロフィール編集モーダルが表示されるか", async () => {
    await waitFor(() => {
      render(
        <ProfileHeader
          username={"testuser"}
          userId={1}
          bio={"これは自己紹介です"}
          profileImageUrl="/icon.png"
        />
      );
    });

    const editButton = screen.getByTestId("edit-profile");

    userEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByTestId("edit-profile-modal")).toBeInTheDocument();
    });
  });
});

describe("他人のプロフィールだと編集ができないようになっているか", () => {
  it("編集ボタンが表示されない", async () => {
    waitFor(() => {
      render(
        <UserProfileContent
          profile={{
            userId: "3",
            bio: "これは他のユーザーです",
            profileImageUrl: "/icon12.png",
            user: { username: "otheruser" },
          }}
          posts={[
            {
              id: 1,
              content: "最初の投稿",
              author: { username: "otheruser" },
              createdAt: "2023-01-01",
            },
          ]}
          token="otheruser"
        />
      );
    });

    expect(screen.getByTestId("profile-username")).toHaveTextContent(
      "otheruser"
    );

    expect(screen.queryByTestId("edit-profile")).not.toBeInTheDocument();
  });
});
