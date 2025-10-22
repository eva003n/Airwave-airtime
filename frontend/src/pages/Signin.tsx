// import { Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import { Input } from "../components/ui/input";
import Logo from "../components/Logo";
import { useAuth } from "../context/authcontext";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import  { signInSchema, type SignInAuth } from "../validation/validators";
import { Loader } from "lucide-react";
import { handleValidationError } from "../utils";
import { toast } from "react-toastify";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";



const SignIn = () => {
  
  //  global authentication state mangement
  const { logIn} = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignInAuth>({
    //validation using zod schema
    resolver: zodResolver(signInSchema)
  });

  
  
  //Api communication
  const onSubmit: SubmitHandler<SignInAuth> = async (data) => {
  try {

      await logIn(data);

  } catch (error) {
    console.log(error.response.data.message || error.message)
    
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
      <CardDescription>
        <p className="font-semibold text-xl text-gray-500 mb-2 text-center">
          Log in to your account
        </p>
      </CardDescription>
      <CardContent>
        <form
          className=" w-[90%] flex max-w-[20rem] flex-col mx-auto gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="text-center mt-5  grid gap-7">
            {errors && <div className="text-red-300"></div>}
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
            value="Log in"
            icon={isSubmitting ? Loader : null}
            isLoading={isSubmitting}
            className="mt-4"
            onClick={() => handleValidationError(errors)}
          />
          <div className="text-center rounded-sm">
            <p className=" text-[.9rem] text-gray-500">
              Don't have an account?
            </p>
            <Link
              to={"/sign-up"}
              className="text-violet-500 hover:underline font-medium"
            >
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignIn;
