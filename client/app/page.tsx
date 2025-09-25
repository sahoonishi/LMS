"use client";
import React, { FC, useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Course from "./components/Course";
interface props {}
const Page: FC<props> = (props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [route, setRoute] = useState<string>("Login");
  const [activeItem, setActiveitem] = useState<number>(0);
  return (
    <div className="relative text-amber-200">
      <Heading title="hh" desc="rr" keyword="ll" />
      <Header open={open} setOpen={setOpen} activeItem={activeItem} setRoute={setRoute} route={route} />
      <Hero/>
      {/* <Course/> */}
    </div>
  );
};

export default Page;
