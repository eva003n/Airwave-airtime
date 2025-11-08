import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Button as button } from "@/components/ui/button";
import { ChevronLeft, Loader, TypeIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { recipientSchema, userSchema, type RecipientForm, type UserData, type UserForm } from "@/validation/validators";
import { getItem, handleValidationError,  } from "@/utils";
import { createRecipient, createUser } from "@/api";
import { toast } from "react-toastify";
import { MFA_MODES, USERROLES } from "@/constants";

const CreateUserPage = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: "user",
      is_MFA_enabled: false
    },
    //validation using zod schema
  });

  const onSubmit: SubmitHandler<UserForm> = async (data) => {
    try {
      const response = await createUser(data);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message || error.message);
    } finally {
      reset();
    }
  };

  return (
    <div className="grid gap-4">
      <Link to={"/admin/users"}>
        <Button className="">
          <ChevronLeft size={30} strokeWidth={2} /> Back
        </Button>
      </Link>
      <Card className="w-full max-w-[65rem] mx-auto   border-0 rounded-2xl backdrop-blur-sm bg-white">
        <CardHeader className="text-center pb-2">
          <CardTitle className="md:text-2xl font-semibold text-gray-700">
            Add User
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details below to add a new user
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
              <div className="flex flex-col gap-4 justify-center">
                {/* Name */}
                <div className="grid gap-4">
                  <Label htmlFor="name" className="text-gray-700 font-medium">
                    Username
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g. John Doe Mwangi"
                    {...register("username", {
                      required: "Username is required",
                    })}
                    minLength={3}
                    maxLength={100}
                    // className="focus:ring-2 focus:ring-green-500 focus-visible:ring-green-500"
                  />
                  {errors.username && (
                    <div className="text-rose-500  text-[.8rem]">
                      {errors.username.message}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="grid gap-4">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Rmail
                  </Label>
                  <Input
                    id="email"
                    placeholder="janedoe@gmail.com"
                    {...register("email", {
                      required: "User email is required",
                    })}

                    // className="focus:ring-2 focus:ring-green-500"
                  />
                  {errors.email && (
                    <div className="text-rose-500  text-[.8rem]">
                      {errors.email.message}
                    </div>
                  )}
                </div>
                {/* Role */}
                <Controller
                  name="role"
                  control={control}
                  rules={{ required: "Role is required" }}
                  render={({ field }) => (
                    <div className="grid gap-4">
                      <Label
                        htmlFor="role"
                        className="text-gray-700 font-medium"
                      >
                        Role
                      </Label>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full focus:ring-2 focus:ring-gray-500">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {USERROLES.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.role && (
                        <div className="text-rose-500 text-[.8rem]">
                          {errors.role.message}
                        </div>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="flex flex-col gap-4 justify-center">
                {/* MFA enables */}

                <Controller
                  name="is_MFA_enabled"
                  control={control}
                  rules={{ required: "MFA is required" }}
                  render={({ field }) => (
                    <div className="grid gap-4">
                      <Label
                        htmlFor="is_MFA_enabled"
                        className="text-gray-700 font-medium"
                      >
                        MFA enabled
                      </Label>

                      <Select
                        onValueChange={(val) => field.onChange(val === "true")} // ✅ Convert string → boolean
                        value={String(field.value)} // ✅ Convert boolean → string for UI
                      >
                        <SelectTrigger className="w-full focus:ring-2 focus:ring-gray-500">
                          <SelectValue placeholder="Select MFA" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="true">true</SelectItem>
                          <SelectItem value="false">false</SelectItem>
                        </SelectContent>
                      </Select>

                      {errors.is_MFA_enabled && (
                        <div className="text-rose-500 text-[.8rem]">
                          {errors.is_MFA_enabled.message}
                        </div>
                      )}
                    </div>
                  )}
                />

                {/* Password */}
                <div className="grid gap-4">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 font-medium"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password", {
                      required: "Passowrd is required",
                    })}
                    min={5}
                    maxLength={20}
                    // className="focus:ring-2 focus:ring-green-500"
                  />
                  {errors.password && (
                    <div className="text-rose-500  text-[.8rem]">
                      {errors.password.message}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-10">
              {/* Submit */}
              <Button
                disabled={isSubmitting}
                onClick={() => handleValidationError(errors)}
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
              >
                {isSubmitting ? "Saving" : "Save user"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateUserPage;
