"use client";
import Link from "next/link";
import React, { FC, SetStateAction, useEffect, useState } from "react";
import NavItems from "../utils/NavItems";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { HiOutlineUserCircle } from "react-icons/hi2";
import CustomModel from "../utils/CustomModel";
import Login from "../components/Auth/Login"
import SignUp from "../components/Auth/SignUp"
type props = {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  setRoute: React.Dispatch<SetStateAction<string>>;
  activeItem: number;
  route:string;
};

const Header: FC<props> = ({open, activeItem, setOpen , route , setRoute}) => {
  const [active, setActive] = useState<boolean>(false);
 const [opensidebar, setOpensidebar] = useState(false); // controls animation
const [isVisible, setIsVisible] = useState(false);     // keeps it in DOM

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
    if (target.id === "screen") {
      setOpensidebar(false);
      setTimeout(()=>
        setIsVisible(false)
      ,300)
    }
  };
  const openSidebar=()=>{
    setIsVisible(true);
    setOpensidebar(true);
  }

  return (
    <div className="w-full">
      <div
        className={`
        ${
          active
            ? "sticky w-full top-0 left-0 h-[80px] z-[80]"
            : "w-full bg-[#2b5377] px-4 py-3"
        }
      `}
      >
        <div className="w-[100%] m-auto p-2 h-full">
          <div className="w-full h-full flex items-center justify-between px-3">
            <div className="w-fit">
              <Link href={"/"} className="text-[25px] font-[500] text-black">
                LOGO
              </Link>
            </div>
            <div className="flex w-full justify-end  items-center">
              <NavItems activeItem={activeItem} isMobile={false} />
              <HiOutlineMenuAlt3
                size={25}
                className="cursor-pointer md:hidden transition-all duration-300 text-black "
                onClick={openSidebar}
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
            className={`fixed w-full h-screen top-0 left-0 z-[99] bg-black/40 transition-opacity duration-300 ${
              opensidebar
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            onClick={handleClose}
            id="screen"
          >
            <div
              className={`w-[70%] flex flex-col gap-9 py-2 fixed z-[999] h-screen bg-sky-700 top-0 right-0 transform transition-transform duration-300 ${
                opensidebar ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <NavItems activeItem={activeItem} isMobile={true} />
              <HiOutlineUserCircle
                size={25}
                className="cursor-pointer ml-3 text-black"
                onClick={() => setOpen(true)}
              />
            </div>
          </div>
        )}
      </div>
      {
        route === "Login" && (
          <>
          {
            open && (
              <CustomModel
                open={open}
                setOpen={setOpen}
                setRoute={setRoute}
                activeItem={activeItem}
                component={Login}
              />
            )
          }
          </>
        )
      }
       {
        route === "SignUp" && (
          <>
          {
            open && (
              <CustomModel
                open={open}
                setOpen={setOpen}
                setRoute={setRoute}
                activeItem={activeItem}
                component={SignUp}
              />
            )
          }
          </>
        )
      }

    </div>
  );
};

export default Header;
