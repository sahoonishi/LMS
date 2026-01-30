"use client";
import { styles } from "@/app/styles/style";
import React, { SetStateAction, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";
type Props = {
  setRoute: React.Dispatch<SetStateAction<string>>;
};
type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};

const Verification = ({ setRoute }: Props) => {
  const [invalidErrorrrr, setInvalidError] = useState<boolean>(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const [VerifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: "",
    1: "",
    2: "",
    3: "",
  });

  const verificationHandler = async () => {
    console.log("test");
  };
  const handleInputChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    setInvalidError(false);
    const newVerifyNumber = { ...VerifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);

    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  return (
    <div>
      <h1 className={styles.title}>Verify your acccount</h1>
      <div className="w-full flex items-center justify-center mt-2">
        <div className="w-[80px] h-[80px] rounded-full bg-green-500 flex items-center justify-center">
          <VscWorkspaceTrusted width={100} />
        </div>
      </div>
      <div className="w-full mx-auto flex justify-around items-center">
          {
            Object.keys(VerifyNumber)?.map((key:string,index:number)=>(
              <input type="text" />
            ))
          }
      </div>
    </div>
  );
};

export default Verification;
