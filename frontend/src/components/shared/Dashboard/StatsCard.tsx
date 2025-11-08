import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card";
import { Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import React from "react";
import CountUp from "react-countup";

export type StatCardProps = {
  key?: string | number;
  title: string;
  icon: LucideIcon;
  count: number;
  iconStyles: string;
  description: string;
  currency?: boolean 
};

const StatsCard = ({
//   key,
  title,
  icon: Icon,
  iconStyles,
  count,
  description,
  currency
}: StatCardProps) => {

  const fmt = new Intl.NumberFormat("en-Uk", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <Card
      className="transition-all duration-300 border-gray-200 bg-white hover:shadow-md"
      //   key={key}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-gray-700 text-sm font-medium">
          {title}
        </CardTitle>
        <CardAction>
          <Icon className={iconStyles} />
        </CardAction>
      </CardHeader>
      <CardContent>
        {currency && (
          <span className="text-sm italic text-gray-500  align-top leading-none  font-medium mr-0.5">
            KES
          </span>
        )}
        <CountUp
          start={0}
          end={count}
          className="text-2xl font-bold  tabular-nums text-gray-700"
          duration={2}
          separator=","
          decimals={currency? 2 : 0}
        />
        <p className="text-sm text-gray-400">{description}</p>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
