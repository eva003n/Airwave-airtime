import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TRANSACTION_TYPE } from "@/constants";
import { transactionStatus, type TransactStatus, type UserForm } from "@/validation/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";
import { Controller, useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useEnv } from "@/context/Environment/env.context";

export function TransactionStatus() {
    const {enabled} = useEnv()
      const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
      } = useForm<TransactStatus>({
        resolver: zodResolver(transactionStatus),
        defaultValues: {
     
        
        },
        //validation using zod schema
      });
  return (
    <Dialog>
      <form className="">
        <DialogTrigger asChild>
          <Button variant="outline">Check status</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] h-[25rem] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transaction status</DialogTitle>
            <DialogDescription className="text-gray-400">
              Check the transaction status for unrecorded transactions
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="reference">Reference ID</Label>
              <Input
                id="reference"
                {...register("reference")}
                placeholder="TKB07XXXXX"
              />
              {errors.reference && (
                <div className="text-rose-500 text-[.8rem]">
                  {errors.reference.message}
                </div>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="account">Account number</Label>
              <Input
                id="account"
                {...register("accountNumber")}
                placeholder="65XXXXXX"
              />
              {errors.accountNumber && (
                <div className="text-rose-500 text-[.8rem]">
                  {errors.accountNumber.message}
                </div>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="code">Short Code</Label>
              <Input
                id="code"
                {...register("shortCode")}
                placeholder="600XXX"
              />
              {errors.accountNumber && (
                <div className="text-rose-500 text-[.8rem]">
                  {errors.accountNumber.message}
                </div>
              )}
            </div>
            <Controller
              name="type"
              control={control}
              rules={{ required: "Transaction type is required" }}
              render={({ field }) => (
                <div className="grid gap-4">
                  <Label htmlFor="branch" className="text-gray-700 font-medium">
                    Type
                  </Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full focus:ring-2 focus:ring-gray-500">
                      {/* <SelectValue placeholder="Select type" /> */}
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {TRANSACTION_TYPE.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <div className="text-rose-500 text-[.8rem]">
                      {errors.type.message}
                    </div>
                  )}
                </div>
              )}
            />
            {enabled && (
              <div className="grid gap-3">
                <Label htmlFor="credential">Security credential</Label>

                <Textarea
                  id="credential"
                  placeholder="Enter your Security credential here."
                />
                {errors.securityCredential && (
                  <div className="text-rose-500 text-[.8rem]">
                    {errors.securityCredential.message}
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Check</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
