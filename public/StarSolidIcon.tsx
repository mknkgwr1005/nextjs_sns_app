// components/icons/StarSolidIcon.tsx
type Props = {
  className?: string;
};

const StarSolidIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor" // 塗りに色がつく
      className={className}
    >
      <path d="M12 2.25c.29 0 .56.167.676.435l2.135 4.923 5.259.42a.75.75 0 0 1 .429 1.31l-3.998 3.426 1.225 5.134a.75.75 0 0 1-1.123.82l-4.47-2.727-4.47 2.727a.75.75 0 0 1-1.123-.82l1.224-5.133-3.998-3.426a.75.75 0 0 1 .429-1.31l5.26-.42L11.324 2.685A.75.75 0 0 1 12 2.25Z" />
    </svg>
  );
};

export default StarSolidIcon;
