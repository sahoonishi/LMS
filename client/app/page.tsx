"use client"
import React , {FC,useState} from 'react'
import Heading from './utils/Heading';
import Header from './Components/Header';
interface props{
  
}
const Page:FC<props> =(props)=> {
  const [open,setOpen] = useState<boolean>(false);
  const [activeItem,setActiveItem] = useState<number>(0);
  return (
    <div>
      <Heading
      title='Sass'
      description='Hey gyus what about today , uhh?'
      keywords='coding,lms,udemy,learningmanagement'
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