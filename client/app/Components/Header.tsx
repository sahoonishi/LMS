import React, { FC, useState, useEffect } from "react";

interface HeaderProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeItem: number;
}

const Header: FC<HeaderProps> = ({ open, setOpen, activeItem }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => setActive(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full relative">
      <div
        className={`${
          active
            ? "!bg-red-600 dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] shadow-xl transition duration-500"
            : "!bg-red-600 w-full border-b h-[80px] z-[80] dark:shadow"
        }`}
      >
        hih
      </div>
    </div>
  );
};

export default Header;
