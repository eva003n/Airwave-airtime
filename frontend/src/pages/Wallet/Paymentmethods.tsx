import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Radio } from "lucide-react";
// import Image from "next/image";

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

interface PaymentMethodsProps {
  methods: PaymentMethod[];
  selected?: string;
  onSelect?: (id: string) => void;
  selectable?: boolean;
}

export default function PaymentMethods({
  methods,
  selected,
  onSelect,
  selectable = true,
}: PaymentMethodsProps) {
  return (
    <div className="grid  grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-4">
      {methods.map((method) => {
        const isSelected = selected === method.id;

        return (
          <Card
            key={method.id}
            onClick={() => selectable && onSelect?.(method.id)}
            className={cn(
              "cursor-pointer transition-all duration-200 border border-muted hover:shadow-md flex gap-4 items-center justify-center p-4 rounded-2xl",
              isSelected && "border-primary ring-2 ring-primary/30 shadow-sm"
            )}
          >
            {/* <CardHeader>
                <CardTitle>
                    Choose a payment method
                </CardTitle>
            </CardHeader> */}
            <CardContent className="flex flex-col items-center gap-2 p-0">
              <div className="relative w-10 h-10">
                <img
                  src={method.icon}
                  alt={method.name}
                  className="w-10 h-10 object-contain"
                />
              </div>

              <p className="text-sm font-medium">{method.name}</p>

              {method.description && (
                <p className="text-xs text-muted-foreground text-center">
                  {method.description}
                </p>
              )}

              {selectable && (
                <Radio
                  className={cn(
                    "w-4 h-4 mt-2",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )}
                />
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
