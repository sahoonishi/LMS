"use client"
import React , {FC,useState} from 'react'
import Heading from './utils/Heading';
interface props{
  
}
const Page:FC<props> =(props)=> {
  return (
    <div>
      <Heading
      title='Sass'
      description='Hey gyus what about today , uhh?'
      keywords='coding,lms,udemy,learningmanagement'
      />
    </div>
  )
}

export default Page;