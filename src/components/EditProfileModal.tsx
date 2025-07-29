"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import apiClient from "../lib/apiClient";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  currentUsername: string;
  currentBio: string;
  currentProfileImageUrl: string;
};

export default function EditProfileModal({
  isOpen,
  onClose,
  currentProfileImageUrl,
  currentUsername,
  currentBio,
}: Props) {
  const router = useRouter();
  const [username, setUsername] = useState(currentUsername);
  const [profileImageUrl, setProfileImageUrl] = useState(
    currentProfileImageUrl
  );
  const [bio, setBio] = useState(currentBio);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result as string);
      };
      // base64にして、文字列として画像を扱う
      reader.readAsDataURL(file);
    } else {
      setProfileImageUrl(currentProfileImageUrl); // 元の画像に戻す
    }
  };

  const updateProfile = async () => {
    await apiClient
      .put("/users/profile/edit", {
        bio: bio,
        profileImageUrl: profileImageUrl,
        username: username,
      })
      .then(() => {
        router.refresh();
      });
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="bg-white p-6 rounded shadow-lg w-96"
        data-testid="edit-profile-modal"
      >
        <h2 className="text-lg font-semibold mb-4">プロフィールを編集</h2>
        <div className="flex items-center">
          <label htmlFor="profile-image-upload" className="cursor-pointer">
            <Image
              id="profile-image"
              width={80}
              height={80}
              src={profileImageUrl ?? "/default-profile.png"}
              alt="User Avatar"
              className="rounded-full"
              unoptimized
            />
            <input
              id="profile-image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e)}
            />
          </label>
          <div className="ml-4">
            <textarea
              className="text-xl font-semibold"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <p>
              <textarea
                name="about"
                id="about"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
          >
            キャンセル
          </button>
          <button
            onClick={() => {
              // APIなどで保存処理をここに実装
              updateProfile();
              onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
