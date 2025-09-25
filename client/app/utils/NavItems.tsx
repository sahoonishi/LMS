import React from "react";
import { NavItemData } from "../constants/NavItemData";
import Link from "next/link";

type Props = {
  activeItem: number;
  isMobile: boolean;
};

const NavItems = ({ activeItem, isMobile }: Props) => {
  return (
    <div className="w-full">
      <div className="hidden w-full md:flex justify-end gap-20 px-20 ">
        {NavItemData &&
          NavItemData?.map((item, index) => (
            <Link key={`${index}+${item}`} passHref href={item?.url}>
              <span
                className={`${
                  activeItem === index
                    ? "text-black shadow-sm rounded-md shadow-black/60 px-4 py-2"
                    : "text-black"
                }`}
              >
                {item.name}
              </span>
            </Link>
          ))}
      </div>
      {isMobile && (
        <div className="mt-5 flex flex-col gap-6 justify-center px-3 h-full sm:hidden">
          {NavItemData &&
            NavItemData?.map((item, index) => (
              <Link
                key={`${index}+${item}`}
                className={`${
                  activeItem === index ? "text-black shadow-sm rounded-md shadow-black/60 px-2 py-1" : "text-black"
                }`}
                passHref
                href={item?.url}
              >
                {item.name}
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default NavItems;
