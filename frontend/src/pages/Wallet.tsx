import React from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// import Button from '../components/Button';
import { Bell, Plus } from 'lucide-react';
import ToggleSwitch from '@/components/ToggleSwitch';
const WalletPage = () => {
  return (
    <section className="text-color p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card >
          <CardHeader>
            <CardDescription className="text-[1.3rem] font-semibold">
              My wallet
            </CardDescription>
            <CardTitle className="text-color text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
              Ksh 129,370
            </CardTitle>
            <CardAction>
              <Bell size={24} />
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              <p className="text-color">Upper threshold </p>
              <p className="text-[.8rem] text-color">
                Set a maximum amount of money in wallet
              </p>
              <Input type="number" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-color">Lower threshold </p>
              <p className="text-[.8rem] text-color">
                Set a minimum amount of money in wallet
              </p>

              <Input type="number" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full text-color">
              Recharge wallet
            </Button>
          </CardFooter>
        </Card>
        <Card className=" relative min-h-48  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
          <CardHeader>
            {/* <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
            <CardAction>Card Action</CardAction> */}
          </CardHeader>
          <CardContent className="absolute inset-0 bg-white/20 backdrop-blur-lg flex flex-col justify-center items-center  border border-white/30 z-10 ">
            <div className="flex flex-col items-center gap-2">
              <Button className="bg-gray-100 rounded-full w-15 h-15 aspect-square">
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
        <Card className="">
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
            <p className="text-[.8rem]">When my balance goes below: 12916 - 646:</p>
            <Input type="number" className="w-30" max={12916} min={646} />

            <Input type="range" max={12916} min={646} />
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}

export default WalletPage