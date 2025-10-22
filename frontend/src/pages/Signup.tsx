import { Loader, Mail, User, Lock } from "lucide-react";
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../components/Button";
import { Input } from "../components/ui/input";
import Logo from "../components/Logo";
import { useAuth } from "../context/authcontext";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import  { signUpSchema, type SignUpAuth } from "../validation/validators";
import { signUpUser } from "../api/index";
import { handleValidationError } from "../utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


const Signup = () => {
  //form state management
  const [data, setData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  //  global authentication state mangement
  const { signUp} = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpAuth>({
    //validation using zod schema
    resolver: zodResolver(signUpSchema)
  });

  //Api communication
  const onSubmit: SubmitHandler<SignUpAuth> = async (data) => {
    try {
     await signUp(data);
    // toast.success(response.data.message)
    } catch (error) {
      // toast.error(error.message)
      
    }finally{
      reset()
    }
  };

  return (
    <Card className="w-[90%] max-w-[25rem]">
      <CardHeader>
        <CardTitle>
          <div className="flex justify-center mt-5">
            <Logo />
          </div>
        </CardTitle>
      </CardHeader>
      <CardDescription className="flex justify-center">
        <p className="font-semibold text-[.9rem] text-gray-400 text-center  max-w-[17rem] ">
          Sign up and make airtime distribution at scale a breeze
        </p>
      </CardDescription>
      <CardContent>
        <form
          className="w-[90%] flex max-w-[20rem] flex-col mx-auto gap-4 "
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="text-center mt-5 grid gap-7"></div>

          <div>
            <Input
              type="email"
              // name="email"
              placeholder="Email"
              // value={data.email}
              // onChange={handleChange}
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <div className="text-red-500  text-[.8rem]">
                {errors.email.message}
              </div>
            )}
          </div>

          <div>
            <Input
              type="text"
              // name="userName"
              placeholder="Username"
              // value={data.userName}
              // onChange={handleChange}
              {...register("userName", { required: "Username is required" })}
            />
            {errors.userName && (
              <div className="text-red-500 text-[.8rem]">
                {errors.userName.message}
              </div>
            )}
          </div>

          <div>
            {" "}
            <Input
              type="password"
              // name="password"
              placeholder="Password"
              // value={data.password}
              {...register("password", { required: "Password is required" })}
              // onChange={handleChange}
            />
            {errors.password && (
              <div className="text-red-500 text-[.8rem]">
                {errors.password.message}
              </div>
            )}
          </div>

          <Button
            value="Sign up"
            icon={isSubmitting ? Loader : null}
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="mt-4"
            onClick={() => handleValidationError(errors)}
          />
          <div className="text-center dark:border-[1.5px] dark:border-gray-600 border-none py-1.5 rounded-sm">
            <p className=" text-[.9rem] text-gray-500">Have an account?</p>
            <Link
              to={"/"}
              className="text-violet-500 hover:underline font-medium"
            >
              Log in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default Signup;
