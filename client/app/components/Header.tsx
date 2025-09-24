"use client";
import Link from "next/link";
import React, { FC, SetStateAction, useEffect, useState } from "react";
import NavItems from "../utils/NavItems";
type props = {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  activeItem: number;
};

const Header: FC<props> = ({activeItem}) => {
  const [active, setActive] = useState<boolean>(false);
  const [opensidebar, setOpensidebar] = useState<boolean>(false);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 80) {
        setActive(true);
      } else {
        setActive(false);
      }
    });
  }

  return (
    <div className="w-full relative">
      <div
        className={`
        ${
          active
            ? "fixed w-full top-0 left-0 h-[80px] z-[80]"
            : "w-full bg-amber-700 border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"
        }
      `}
      >
        <div className="w-[100%] m-auto p-2 h-full">
            <div className="w-full h-full flex items-center justify-between px-3">
                <div className="w-fit">
                    <Link href={"/"} className="text-[25px] font-[500] text-black">LOGO</Link>
                </div>
                <div className="flex w-full justify-end  items-center">
                    <NavItems activeItem={activeItem} isMobile={false} />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
