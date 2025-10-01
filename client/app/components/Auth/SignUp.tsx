"use client";
import { SignUpFormSchema, SignUpFormValidationType } from "../../zod/validation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  AiFillGithub,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { styles } from "../../styles/style";

type SignUpProps = {
  setRoute: React.Dispatch<React.SetStateAction<string>>;
};

const SignUp: React.FC<SignUpProps> = ({ setRoute }) => {
  const [show, setShow] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValidationType>({
    resolver: zodResolver(SignUpFormSchema),
  });

  const onSubmit: SubmitHandler<SignUpFormValidationType> = (data) =>{
    setRoute("Verification");
  }
    

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create your account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* Username Field */}
        <div className={styles.inputWrapper}>
          <input
            type="text"
            id="username"
            {...register("username")}
            placeholder=" "
            className={`${styles.input} ${errors.username ? styles.inputError : ""}`}
          />
          <label htmlFor="username" className={styles.label}>
            Username
          </label>
          {errors.username && (
            <span className={styles.errorText}>{errors.username.message}</span>
          )}
        </div>

        {/* Email Field */}
        <div className={styles.inputWrapper}>
          <input
            type="email"
            id="email"
            {...register("email")}
            placeholder=" "
            className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
          />
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          {errors.email && (
            <span className={styles.errorText}>{errors.email.message}</span>
          )}
        </div>

        {/* Password Field */}
        <div className={styles.inputWrapper}>
          <input
            type={!show ? "password" : "text"}
            id="password"
            {...register("password")}
            placeholder=" "
            className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
          />
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          {show ? (
            <AiOutlineEye
              className={styles.passwordToggle}
              size={20}
              onClick={() => setShow(false)}
            />
          ) : (
            <AiOutlineEyeInvisible
              className={styles.passwordToggle}
              size={20}
              onClick={() => setShow(true)}
            />
          )}
          {errors.password && (
            <span className={styles.errorText}>{errors.password.message}</span>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className={styles.inputWrapper}>
          <input
            type={!show ? "password" : "text"}
            id="confirmPassword"
            {...register("confirmPassword")}
            onPaste={(e)=>e.preventDefault()}                // to prevent user from copy and paste
            placeholder=" "
            className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
          />
          <label htmlFor="confirmPassword" className={styles.label}>
            Confirm Password
          </label>
          {errors.confirmPassword && (
            <span className={styles.errorText}>{errors.confirmPassword.message}</span>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className={styles.button}>
          Sign Up
        </button>

        <h5 className="text-center text-white text-[14px] my-2">Or join with</h5>
        <div className="flex items-center justify-center my-2">
          <FcGoogle size={30} className="cursor-pointer mr-2" />
          <AiFillGithub size={30} className="cursor-pointer mr-2" />
        </div>

        <h5 className="text-center text-[14px]">
          Already have an account?
          <span
            onClick={() => setRoute("Login")}
            className="text-[#2190ff] cursor-pointer ml-1"
          >
            Login
          </span>
        </h5>
      </form>
    </div>
  );
};

export default SignUp;
