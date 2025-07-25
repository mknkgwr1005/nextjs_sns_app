"use client";
import { useState } from "react";
import EditProfileModal from "../../components/EditProfileModal";
import Image from "next/image";
import { useAuth } from "@/context/auth";
import { profile } from "console";
import ProfileIcon from "@/components/icons/ProfileIcon";

type Props = {
  username: string;
  userId: number;
  bio: string;
  profileImageUrl: string;
};

export default function ProfileHeader({
  username,
  userId,
  bio,
  profileImageUrl,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  return (
    <>
      <div className="flex items-start justify-between w-full">
        {/* 左側：プロフィール画像とテキスト */}
        <div className="flex items-center">
          <ProfileIcon profileImageUrl={profileImageUrl} size={80} />
          <div className="ml-4 min-w-[300px]">
            <h2 className="text-2xl font-semibold mb-1">{username}</h2>
            <p className="text-gray-600">{bio}</p>
          </div>
        </div>

        {/* 右側：編集ボタン */}
        {user?.id === userId ? (
          <div className="min-w-[auto] text-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-blue-500 hover:underline"
            >
              プロフィール編集
            </button>
          </div>
        ) : (
          <div></div>
        )}
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentProfileImageUrl={profileImageUrl}
        currentUsername={username}
        currentBio={bio}
      />
    </>
  );
}
