"use client";
import Link from "next/link";
import React, { FC, SetStateAction, useEffect, useState } from "react";
import NavItems from "../utils/NavItems";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { HiOutlineUserCircle } from "react-icons/hi2";
type props = {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  activeItem: number;
};

const Header: FC<props> = ({ activeItem, setOpen }) => {
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

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if(target.id === "screen"){
      setOpensidebar(false);
    }
  };

  return (
    <div className="w-full relative">
      <div
        className={`
        ${
          active
            ? "fixed w-full top-0 left-0 h-[80px] z-[80]"
            : "w-full bg-pink-900 border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"
        }
      `}
      >
        <div className="w-[100%] m-auto p-2 h-full">
          <div className="w-full h-full flex items-center justify-between px-3">
            <div className="w-fit">
              <Link href={"/"} className="text-[25px] font-[500] text-black">
                LOG
              </Link>
            </div>
            <div className="flex w-full justify-end  items-center">
              <NavItems activeItem={activeItem} isMobile={false} />
              <HiOutlineMenuAlt3
                size={25}
                className="cursor-pointer md:hidden text-black"
                onClick={() => setOpensidebar(true)}
              />
              <HiOutlineUserCircle
                size={25}
                className="cursor-pointer hidden md:block text-black"
                onClick={() => setOpen(true)}
              />
            </div>
          </div>
        </div>

        {opensidebar && (
          <div
            className="fixed w-full h-screen top-0 left-0 z-[99] bg-black"
            onClick={handleClose}
            id="screen"
          >
            <div className="w-[70%] fixed z-[999] h-screen bg-white top-0 right-0">
               <NavItems activeItem={activeItem} isMobile={true} />
                <HiOutlineUserCircle
                size={25}
                className="cursor-pointer text-black"
                onClick={() => setOpen(true)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
