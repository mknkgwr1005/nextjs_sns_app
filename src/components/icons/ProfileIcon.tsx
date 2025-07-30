import Image from "next/image";

type ProfileIconProps = {
  profileImageUrl?: string | null;
  size?: number; // オプションでサイズ指定も可能
  dataTestid: string;
};

const ProfileIcon = ({
  profileImageUrl,
  size = 40,
  dataTestid,
}: ProfileIconProps) => {
  return (
    <Image
      className="rounded-full object-cover"
      src={profileImageUrl || "/racoon.png"}
      alt="User Avatar"
      width={size}
      height={size}
      priority
      data-testid={dataTestid}
    />
  );
};

export default ProfileIcon;
