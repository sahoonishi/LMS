"use client";
import { useActivationMutation } from "@/app/redux/features/auth/authApi";
import { styles } from "@/app/styles/style";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { useSelector } from "react-redux";

type Props = { setRoute: React.Dispatch<SetStateAction<string>> };
type VerifyNumber = { "0": string; "1": string; "2": string; "3": string };

const Verification = ({ setRoute }: Props) => {
  const [invalidError, setInvalidError] = useState<boolean>(false);
  const {token} = useSelector((state:any)=>state.auth);
  const [activation, {isError, isSuccess, error}] = useActivationMutation();

  const triggerShake = () => {
    setInvalidError(false);
    setTimeout(() => setInvalidError(true), 10);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account activated successfully!");
      setRoute("Login");
    }
    if (isError && error) {
      if ("data" in (error as any)) {
        const errorData = error as any;
        const message = errorData?.data?.message || "Activation failed";
        toast.error(message);
        triggerShake();
      }else{
        toast.error("Activation failed");
        console.log(error);
        triggerShake();
      }
    }
  }, [isError, isSuccess, error, setRoute]);


  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: "",
    1: "",
    2: "",
    3: "",
  });

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    if (invalidError) {
      setInvalidError(false);
    }
    const newVerifyNumber = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);

    if (value !== "" && index < 3) {
      // Small timeout ensures the focus shift happens after the state intent is registered
      setTimeout(() => inputRefs[index + 1].current?.focus(), 10);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (
      e.key === "Backspace" &&
      !verifyNumber[index as unknown as keyof VerifyNumber] &&
      index > 0
    ) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleFocus = (index: number) => {
    const values = Object.values(verifyNumber);
    const firstEmptyIndex = values.findIndex((val) => val === "");

    // If user clicks a later box but the previous ones are empty, redirect them
    if (firstEmptyIndex !== -1 && index > firstEmptyIndex) {
      inputRefs[firstEmptyIndex].current?.focus();
    }
  };

  // Production touch: Allow users to paste the 4-digit code
  const handlePaste = (e: React.ClipboardEvent) => {
    const data = e.clipboardData.getData("text").split("").slice(0, 4);
    const newVerifyNumber = { ...verifyNumber };
    data.forEach((char, index) => {
      if (/^\d$/.test(char)) {
        newVerifyNumber[index as unknown as keyof VerifyNumber] = char;
      }
    });
    setVerifyNumber(newVerifyNumber);
    inputRefs[data.length - 1]?.current?.focus();
  };

  const verficationHandler = async() => {
    const activationCode = Object.values(verifyNumber).join("");
    if(activationCode.length < 4){
      triggerShake();
      return;
    }
    await activation({activationToken:token, activationCode});
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Verify your account</h1>
      <div className="w-full flex items-center justify-center mt-4">
        <div className="w-[80px] h-[80px] rounded-full bg-sky-500 flex items-center justify-center text-white">
          <VscWorkspaceTrusted size={40} />
        </div>
      </div>

      <div
        className="w-full mx-auto py-8 flex justify-between gap-2"
        onPaste={handlePaste}
      >
        {[0, 1, 2, 3].map((index) => (
          <input
            key={index}
            ref={inputRefs[index]}
            type="text"
            maxLength={1}
            value={verifyNumber[index as unknown as keyof VerifyNumber]}
            onFocus={() => handleFocus(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className={`w-16 h-16 border-2 text-center text-2xl font-bold rounded-xl outline-none transition-all
              ${invalidError ? "shake border-red-500" : "border-gray-300 focus:border-sky-500 focus:shadow-[0_0_8px_rgba(14,165,233,0.5)]"}
              dark:text-white text-black bg-transparent`}
          />
        ))}
      </div>

      <button className={styles.button} onClick={verficationHandler}>
        Verify OTP
      </button>
      <h5 className=" flex justify-center pt-7 ">
        Go back to sign in?{" "}
        <span
          className="text-sky-500 ml-2 cursor-pointer"
          onClick={() => setRoute("Login")}
        >
          Sign in
        </span>
      </h5>
    </div>
  );
};

export default Verification;
