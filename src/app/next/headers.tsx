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
  const [localUsername, setLocalUsername] = useState(username);
  const [localBio, setLocalBio] = useState(bio);
  const [localImageUrl, setLocalImageUrl] = useState(profileImageUrl);

  const { user } = useAuth();

  return (
    <>
      <div
        className="flex items-start justify-between w-full"
        data-testid="profile-header"
      >
        <div className="flex items-center">
          <ProfileIcon
            profileImageUrl={localImageUrl}
            size={80}
            dataTestid="profile-image"
          />
          <div className="ml-4 min-w-[300px]">
            <h2
              className="text-2xl font-semibold mb-1"
              data-testid="profile-username"
            >
              {localUsername}
            </h2>
            <p className="text-gray-600" data-testid="profile-bio">
              {localBio}
            </p>
          </div>
        </div>

        {user?.id === userId && (
          <div className="min-w-[auto] text-center">
            <button
              data-testid="edit-profile"
              onClick={() => setIsModalOpen(true)}
              className="text-blue-500 hover:underline"
              aria-label="edit-profile"
            >
              プロフィール編集
            </button>
          </div>
        )}
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentProfileImageUrl={localImageUrl}
        currentUsername={localUsername}
        currentBio={localBio}
        onSave={({
          username: username,
          bio: bio,
          profileImageUrl: profileImageUrl,
        }: {
          username: string;
          bio: string;
          profileImageUrl: string;
        }) => {
          setLocalUsername(username);
          setLocalBio(bio);
          setLocalImageUrl(profileImageUrl);
          setIsModalOpen(false);
        }}
      />
    </>
  );
}
