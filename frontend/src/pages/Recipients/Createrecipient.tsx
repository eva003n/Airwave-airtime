import React, { useState } from "react";
import { Button } from "../../components/ui/button";
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
import { KUNITY_BRANCHES, OPERATORS } from "../../constants";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { recipientSchema, type RecipientForm, type UserData } from "@/validation/validators";
import { getItem, handleValidationError } from "@/utils";
import { createRecipient } from "@/api";
import { toast } from "react-toastify";

const CreateRecipientPage = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RecipientForm>({
    resolver: zodResolver(recipientSchema),
    defaultValues: {
      phone_number: "254",
      user_id: getItem<UserData>("user").id
    },
    //validation using zod schema
  });

  const onSubmit: SubmitHandler<RecipientForm> = async (data) => {
    try {
      const response = await createRecipient(data);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      reset();
    }
  };

  return (
    <div className="grid gap-4">
      <Link to={"/recipients"}>
        <Button className="">
          <ChevronLeft size={30} strokeWidth={2} /> Back
        </Button>
      </Link>
      <Card className="w-full max-w-[65rem] mx-auto   border-0 rounded-2xl backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="md:text-2xl font-semibold text-gray-700">
            Add Airtime Recipient
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details below to add a new recipient
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
              <div className="flex flex-col gap-4 justify-center">
                {/* Name */}
                <div className="grid gap-4">
                  <Label htmlFor="name" className="text-gray-700 font-medium">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g. John Doe Mwangi"
                    {...register("name", {
                      required: "Recipient name is required",
                    })}
                    minLength={3}
                    maxLength={100}
                    // className="focus:ring-2 focus:ring-green-500 focus-visible:ring-green-500"
                  />
                  {errors.name && (
                    <div className="text-rose-500  text-[.8rem]">
                      {errors.name.message}
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div className="grid gap-4">
                  <Label htmlFor="phone" className="text-gray-700 font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    placeholder="2547XXXXXXXX"
                    {...register("phone_number", {
                      required: "Recipient  phone number is required",
                    })}
                    maxLength={12}
                    minLength={12}
                    // className="focus:ring-2 focus:ring-green-500"
                  />
                  {errors.phone_number && (
                    <div className="text-rose-500  text-[.8rem]">
                      {errors.phone_number.message}
                    </div>
                  )}
                </div>
                {/* Branch*/}
                <Controller
                  name="branch"
                  control={control}
                  rules={{ required: "Branch is required" }}
                  render={({ field }) => (
                    <div className="grid gap-4">
                      <Label
                        htmlFor="branch"
                        className="text-gray-700 font-medium"
                      >
                        Branch
                      </Label>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full focus:ring-2 focus:ring-gray-500">
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {KUNITY_BRANCHES.map((branch) => (
                            <SelectItem key={branch} value={branch}>
                              {branch}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.branch && (
                        <div className="text-rose-500 text-[.8rem]">
                          {errors.branch.message}
                        </div>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="flex flex-col gap-4 justify-center">
                {/* Operator */}

                <Controller
                  name="operator"
                  control={control}
                  rules={{ required: "Operator is required" }}
                  render={({ field }) => (
                    <div className="grid gap-4">
                      <Label
                        htmlFor="operator"
                        className="text-gray-700 font-medium"
                      >
                        Mobile Operator
                      </Label>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full focus:ring-2 focus:ring-gray-500">
                          <SelectValue placeholder="Select operator" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {OPERATORS.map((operator) => (
                            <SelectItem key={operator} value={operator}>
                              {operator}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.operator && (
                        <div className="text-rose-500 text-[.8rem]">
                          {errors.operator.message}
                        </div>
                      )}
                    </div>
                  )}
                />
                {/* Airtime Amount */}
                <div className="grid gap-4">
                  <Label htmlFor="amount" className="text-gray-700 font-medium">
                    Airtime Amount (KES)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="e.g. 500"
                    {...register("airtime_amount", {
                      required: "Airtime amount name is required",
                    })}
                    min={5}
                    max={10000}
                    // className="focus:ring-2 focus:ring-green-500"
                  />
                  {errors.airtime_amount && (
                    <div className="text-rose-500  text-[.8rem]">
                      {errors.airtime_amount.message}
                    </div>
                  )}
                </div>
                {/* Recipient designation */}
                <div className="grid gap-4">
                  <Label
                    htmlFor="designation"
                    className="text-gray-700 font-medium"
                  >
                    Designation
                  </Label>
                  <Input
                    id="designation"
                    type="text"
                    placeholder="eg Finance manager"
                    {...register("designation", {
                      required: "Recipient designation is required",
                    })}
                    minLength={3}
                    maxLength={50}
                    // className="focus:ring-2 focus:ring-green-500"
                  />
                  {errors.designation && (
                    <div className="text-rose-500  text-[.8rem]">
                      {errors.designation.message}
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
                {isSubmitting ? "Saving" : "Save recipient"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateRecipientPage;
