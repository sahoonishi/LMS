"use client"
import React, { SetStateAction, useRef, useState } from 'react'
import {toast} from "react-hot-toast";
import { VscWorkspaceTrusted } from 'react-icons/vsc';
type Props = {
    setRoute:React.Dispatch<SetStateAction<string>>;
}
type VerifyNumber = {
    "0":string;
    "1":string;
    "2":string;
    "3":string;
}

const Verification = ({setRoute}: Props) => {
    const [invalidErrorrrr , setInvalidError] = useState<boolean>(false);
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    const verificationHandler=async()=>{
            console.log('test');
    }
    
  return (
    <div>Verification</div>
  )
}

export default Verification