"use client";
import { LoginFormSchema, LoginFormValidationType } from "../../zod/validation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  AiFillGithub,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { styles } from "../../styles/style";
import { FcGoogle } from "react-icons/fc";

type LoginProps = {
  setRoute: React.Dispatch<React.SetStateAction<string>>;
};

const Login: React.FC<LoginProps> = ({ setRoute }) => {
  const [show, setShow] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValidationType>({
    resolver: zodResolver(LoginFormSchema),
  });

  const onSubmit: SubmitHandler<LoginFormValidationType> = (data) =>{

  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Start your learning</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* Email Field */}
        <div className={styles.inputWrapper}>
          <input
            type="email"
            id="email"
            {...register("email")}
            placeholder=" "
            className={`${styles.input} ${
              errors.email ? styles.inputError : ""
            }`}
          />
          <label htmlFor="email" className={styles.label}>
            Enter your email
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
            className={`${styles.input} ${
              errors.password ? styles.inputError : ""
            }`}
          />
          <label htmlFor="password" className={styles.label}>
            Enter your password
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

        {/* Submit Button */}
        <button type="submit" className={styles.button}>
          Login
        </button>
        <h5 className="text-center text-white text-[14px] ">Or join with</h5>
        <div className="flex items-center justify-center my-2">
          <FcGoogle size={30} className="cursor-pointer mr-2" />
          <AiFillGithub size={30} className="cursor-pointer mr-2" />
        </div>
        <h5 className="text-center  text-[14px]">
          Don't have any acccount ?
          <span
            onClick={() => setRoute("SignUp")}
            className=" text-[#2190ff] cursor-pointer  "
          >
            {" "}
            SignUp
          </span>
        </h5> 
      </form>
    </div>
  );
};

export default Login;
