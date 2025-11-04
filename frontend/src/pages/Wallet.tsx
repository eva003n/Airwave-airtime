import React, { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import Button from '../components/Button';
import {Bell, ChevronDown, Plus } from "lucide-react";
import ToggleSwitch from "@/components/ToggleSwitch";
import { getWalletBalance, updateWallet } from "@/api";
import { Badge } from "@/components/ui/badge";
import CountUp from "react-countup";
import { getItem } from "@/utils";
import type { UserData, WalletData, WalletForm } from "@/validation/validators";
import { WALLET_TYPES } from "@/constants";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Label,
} from "@radix-ui/react-select";
import type { type } from "os";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import type { WalletType } from "./Wallet/WalletType";
import WalletTypeSelect from "./Wallet/WalletType";
import { toast } from "react-toastify";
import { Checkbox } from "@/components/ui/checkbox";
import PaymentMethods from "./Wallet/Paymentmethods";
import PaymentInstructions from "./Wallet/Payments-instructions";

const paymentOptions = [
  {
    id: "mpesa",
    name: "M-PESA",
    icon: "/icons/mpesa.png",
    description: "Safaricom mobile money",
  },

  // {
  //   id: "paypal",
  //   name: "PayPal",
  //   icon: "/icons/paypal.png",
  // },
  // {
  //   id: "paypal",
  //   name: "PayPal",
  //   icon: "/icons/paypal.png",
  // },


];

const WalletPage = () => {
  const [submit, setSubmit] = useState(false);
  const [wallet, setWallet] = useState<WalletData>();
  const [type, setType] = React.useState<WalletType | "">("Basic");
  const [selected, setSelected] = useState<string>("");
  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<WalletForm>({
    defaultValues: {
      // lower_threshold: 1,
      // upper_threshold: 1
    },
  });
  const user = getItem<UserData>("user");

  useEffect(() => {
    (async () => {
      const response = await getWalletBalance(user.id);

      setWallet(response.data);
      setValue("wallet_type", response.data.data.wallet_type);
      setValue("upper_threshold", response.data.data.upper_threshold);
      setValue("lower_threshold", response.data.data.lower_threshold);
    })();
  }, []);

  const onSubmit: SubmitHandler<WalletForm> = async (data) => {
    try {
      const formData = Object.assign({ userId: user.id }, data);
      const response = await updateWallet(formData);

      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <section className="text-color p-4">
      <h1 className="md:text-2xl font-semibold text-gray-700 py-2">
        My Wallet
      </h1>
      {/* <div className="flex flex-col md:flex-row gap-4"> */}
      <div className="grid  grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
        <Card className="bg-white">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <CardHeader className="flex flex-col gap-2">
              <CardAction className="w-full">
                <WalletTypeSelect
                  control={control}
                  name={"wallet_type"}
                  // value={type}
                  // onChange={(v) => handleWalletChange(v)}
                />
              </CardAction>
              <CardTitle className="text-color text-2xl font-bold tabular-nums @[250px]/card:text-3xl flex gap-2">
                <span>Ksh</span>
                <CountUp
                  start={0}
                  end={Number(wallet?.data.balance || 0)}
                  duration={2}
                  separator=","
                />
              </CardTitle>
            </CardHeader>
            <CardDescription className="text-[1.3rem] flex gap-3 text-gray-500 px-6 items-center">
              {/* <Checkbox
                className=" checked:bg-violet-400 checked:text-white"
                id="notify"
              />
              <label className="text-[.7rem]" htmlFor="notify">
                Notify me when balance runs below threshold
              </label> */}
              <Badge className="bg-slate-200 py-1 px-4">
                Account Number
                <strong className="tracking-wider">
                  {wallet?.data.account_number}
                </strong>
              </Badge>
            </CardDescription>
            <CardContent>
              {/* <div className="flex flex-col gap-1">
                <label className="text-color" htmlFor="upper">
                  Upper threshold{" "}
                </label>
                <p className="text-[.8rem] text-color">
                  Set a maximum amount of money in wallet
                </p>
                <Input
                  id="upper"
                  type="number"
                  placeholder={String(Number(wallet?.data.upper_threshold))}
                  {...register("upper_threshold", {})}
                  className="focus:ring-2 focus:ring-gray-500"
                />
              </div> */}
              <div className="flex flex-col gap-1">
                <label className="text-color" htmlFor="lower">
                  Lower threshold{" "}
                </label>
                <p className="text-[.8rem] text-color">
                  Set a minimum amount of money in wallet
                </p>
                <Input
                  id="lower"
                  type="number"
                  placeholder={String(Number(wallet?.data.lower_threshold))}
                  // placeholder="2547XXXXXXXX"
                  {...register("lower_threshold")}
                  className="focus:ring-2 focus:ring-gray-500"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full text-white"
                onClick={() => setSubmit(true)}
              >
                Update wallet
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className=" grow-1 p-4 bg-white">
          <CardTitle>Payment Methods</CardTitle>
          <CardContent>
            <PaymentMethods
              methods={paymentOptions}
              selected={selected}
              onSelect={setSelected}
            />
          </CardContent>
        </Card>
        <PaymentInstructions />

        {/* 
    
        <Card className=" relative min-h-48  bg-gray-100 overflow-hidden">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
            <CardAction>Card Action</CardAction> 
          </CardHeader>
          <CardContent className="absolute inset-0 bg-white/20 backdrop-blur-lg flex flex-col justify-center items-center  border border-white/30 z-10 ">
            <div className="flex flex-col items-center gap-2">
              <Button className="bg-gray-200 rounded-full w-15 h-15 aspect-square">
                <Plus
                  size={100}
                  strokeWidth={4}
                  height={100}
                  className="text-color "
                />
              </Button>
              <p className="text-color">Add new card</p>
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-[1.3rem] font-semibold">
              Auto recharge
            </CardTitle>
            <CardDescription className="text-[.9rem]">
              Automate wallet recharges
            </CardDescription>

            <CardAction>
              <ToggleSwitch />
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-[.8rem]">Recharge my account: 129152 - 6450</p>
            <Input type="number" className="w-30" max={129152} min={6450} />
            <Input type="range" max={129152} min={6450} />
            <p className="text-[.8rem]">
              When my balance goes below: 12916 - 646:
            </p>
            <Input type="number" className="w-30" max={12916} min={646} />

            <Input type="range" max={12916} min={646} />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
    */}
      </div>
    </section>
  );
};

export default WalletPage;
