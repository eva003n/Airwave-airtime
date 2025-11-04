import React from "react";
import { Wallet, Star, Shield, Zap } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Controller, type Control } from "react-hook-form";

export type WalletType = "Basic" | "Plus" | "Premium" | "Max";

interface WalletTypeSelectProps {
  control: Control<any>; 
  name: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

const LABELS: Record<WalletType, string> = {
  Basic: "Basic",
  Plus: "Plus",
  Premium: "Premium",
  Max: "Max",
};

function IconFor(type: WalletType) {
  switch (type) {
    case "Basic":
      return <Wallet className="h-4 w-4" />;
    case "Plus":
      return <Star className="h-4 w-4" />;
    case "Premium":
      return <Shield className="h-4 w-4" />;
    case "Max":
      return <Zap className="h-4 w-4" />;
  }
}

export default function WalletTypeSelect({
  control,
  name,
//   label = "Wallet Type",
  className = "",
  disabled = false,
}: WalletTypeSelectProps) {
  const options: WalletType[] = ["Basic", "Plus", "Premium", "Max"];

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label> */}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={(value) => field.onChange(value as WalletType)}
            disabled={disabled}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder={field.value} />
            </SelectTrigger>

            <SelectContent className="bg-white">
              {options.map((opt) => (
                <SelectItem
                  key={opt}
                  value={opt}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="opacity-80 text-purple-500">{IconFor(opt)}</span>
                    <span className="capitalize">{LABELS[opt]}</span>
                  </div>

                  <Badge variant="outline" className="text-xs">
                    {opt === "Max"
                      ? "Recommended"
                      : opt === "Premium"
                      ? "Popular"
                      : ""}
                  </Badge>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
