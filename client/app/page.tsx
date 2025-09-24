'use client'
import React ,{FC,useState} from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
interface props{}
const Page:FC<props>=(props)=>{
  const [open,setOpen] = useState<boolean>(false);
  const [activeItem,setActiveitem] = useState<number>(0);
  return (
    <div className=" text-amber-200">
    <Heading
     title='hh'
     desc='rr'
     keyword="ll"
    />
    <Header
      open={open}
      setOpen={setOpen}
      activeItem={activeItem}
    />
    </div>
  )
}

export default Page; 