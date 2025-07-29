import EditProfileModal from "@/components/EditProfileModal";
import FollowStatusInfo from "@/components/FollowStatusInfo";
import apiClient from "@/lib/apiClient";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Image from "next/image";
import { before } from "node:test";
import { useState } from "react";

jest.mock("@/lib/apiClient", () => ({
  __esModule: true,
  default: require("@/__mocks__/apiClient").default,
}));

var mockFetchFollowStatus = jest.fn(() => apiClient.get("/users/follow_count"));

jest.mock("@/context/fetchFollowStatus", () => ({
  __esModule: true,
  default: mockFetchFollowStatus,
}));

const Wrapper = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [profile, setProfile] = useState({
    username: "testuser",
    bio: "これは自己紹介です",
    profileImageUrl: "/icon.png",
  });

  return (
    <>
      <div data-testid="profile-content">
        <p>{profile.username}</p>
        <p>{profile.bio}</p>
        <Image
          src={profile.profileImageUrl}
          alt="User Avatar"
          width={80}
          height={80}
        />
      </div>

      {isOpen && (
        <EditProfileModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          currentUsername={profile.username}
          currentBio={profile.bio}
          currentProfileImageUrl={profile.profileImageUrl}
          onSave={({ username, bio, profileImageUrl }) => {
            setProfile({ username, bio, profileImageUrl });
            setIsOpen(false);
          }}
        />
      )}
    </>
  );
};

const mockpush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockpush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    refresh: jest.fn(),
  }),
}));

describe("プロフィールが表示されるか", () => {
  beforeEach(() => {
    waitFor(() => {
      render(<FollowStatusInfo profileUserId={1} token="testtoken" />);
    });
  });
  beforeEach(() => {
    render(<Wrapper />);
  });
  it("ボタンが表示されているか", () => {
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);

    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("プロフィール項目が表示されているか", () => {
    expect(
      screen.getByRole("textbox", { name: /user-name/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /profile-bio/i })
    ).toBeInTheDocument();
    const profileImage = screen.getByRole("img", { name: /profile-image/i });
    expect(profileImage).toBeInTheDocument();
  });
});

describe("プロフィール編集が実行できるか", () => {
  beforeEach(() => {
    render(<FollowStatusInfo profileUserId={1} token="testtoken" />);
  });
  beforeEach(() => {
    render(<Wrapper />);
  });

  const defaultuser = "testuser";
  const defaultbio = "これは自己紹介です";
  const defaultImg = "/icon.png";

  const callEditApi = async (
    newImageUrl?: string | undefined,
    newBio?: string | undefined,
    newUsername?: string | undefined
  ) => {
    const savebutton = screen.getByRole("button", { name: /save/i });
    await userEvent.click(savebutton);

    await waitFor(() => {
      expect(apiClient.put).toHaveBeenCalledWith("/users/profile/edit", {
        username: newUsername || defaultuser,
        bio: newBio || defaultbio,
        profileImageUrl: newImageUrl,
      });
    });
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  it("プロフィール画像を編集できるか", async () => {
    const fileInput = screen.getByTestId("profile-image-upload");
    const file = new File(["dummy image content"], "test-image.png", {
      type: "image/png",
    });
    await userEvent.upload(fileInput, file);

    expect((fileInput as HTMLInputElement).files?.[0]).toStrictEqual(file);
    expect((fileInput as HTMLInputElement).files).toHaveLength(1);

    // imageurlを、base64にする処理をテストでも実装する
    const newImageUrl = await readFileAsDataURL(file);

    await callEditApi(newImageUrl); // await をつけないと、空のまま渡される

    const profileImage = screen.getByAltText("User Avatar");

    expect(profileImage).toHaveAttribute("src", newImageUrl);
  });

  it("プロフィール文が編集・反映される", async () => {
    const bioInput = screen.getByRole("textbox", { name: "profile-bio" });
    await userEvent.clear(bioInput);
    await userEvent.type(bioInput, "プロフィールを編集しました");

    const saveButton = screen.getByRole("button", { name: /save/i });
    await userEvent.click(saveButton);
    // ✅ モーダルが閉じたことを確認
    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /save/i })
      ).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText("プロフィールを編集しました")
      ).toBeInTheDocument();
    });
  });
  it("ユーザー名が編集・反映される", async () => {
    const usernameInput = screen.getByRole("textbox", { name: "user-name" });
    await userEvent.clear(usernameInput);
    await userEvent.type(usernameInput, "newUser");

    const saveButton = screen.getByRole("button", { name: /save/i });
    await userEvent.click(saveButton);
    // ✅ モーダルが閉じたことを確認
    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /save/i })
      ).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("newUser")).toBeInTheDocument();
    });
  });
});
