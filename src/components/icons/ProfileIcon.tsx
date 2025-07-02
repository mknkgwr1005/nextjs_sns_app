import Image from "next/image";

type ProfileIconProps = {
  profileImageUrl?: string | null;
  size?: number; // オプションでサイズ指定も可能
};

const ProfileIcon = ({ profileImageUrl, size = 40 }: ProfileIconProps) => {
  return (
    <Image
      className="rounded-full object-cover"
      src={profileImageUrl || "/racoon.png"}
      alt="User Avatar"
      width={size}
      height={size}
      priority
    />
  );
};

export default ProfileIcon;
