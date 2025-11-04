import React from "react";

import {
  Users,
  CreditCard,
  ArrowUpRight,
  Wallet,
  PhoneCall,
} from "lucide-react";
import type { StatCardProps } from "../../../components/shared/Dashboard/StatsCard";
import StatsCard from "../../../components/shared/Dashboard/StatsCard";
import ChartComponent from "@/components/shared/Dashboard/Charts";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const STATSDATA: StatCardProps[] = [
  {
    title: "Total Users",
    icon: Users,
    count: 1245,
    iconStyles: "text-blue-500 w-8 h-8 bg-blue-100 p-2 rounded-full",
    description: "Active users",
  },
  {
    title: "Total Transactions",
    icon: CreditCard,
    count: 8230,
    iconStyles: "text-green-500  w-8 h-8 bg-green-100 p-2 rounded-full",
    description: "Completed payments ",
  },
  //   {
  //     title: "Revenue Growth",
  //     icon: ArrowUpRight,
  //     count: 48,
  //     iconStyles: "text-emerald-500 bg-emerald-100 p-2 rounded-full",
  //     description: "Increase over last week",
  //   },
  {
    title: "Wallet balance",
    icon: Wallet,
    count: 312,
    iconStyles: "text-indigo-500  w-8 h-8  bg-indigo-100 p-2 rounded-full",
    description: "App wallet deposits",
  },
  {
    title: "Airtime Purchases",
    icon: PhoneCall,
    count: 657,
    iconStyles: "text-orange-500  w-8 h-8 bg-orange-100 p-2 rounded-full",
    description: "Airtime distributions",
  },
];

const userData = [
  { month: "May", users: 600 },
  { month: "Jun", users: 800 },
  { month: "Jul", users: 1200 },
  { month: "Aug", users: 1450 },
  { month: "Sep", users: 1650 },
];

const topUpData = [
  { month: "May", topups: 2000 },
  { month: "Jun", topups: 2400 },
  { month: "Jul", topups: 3000 },
  { month: "Aug", topups: 3500 },
  { month: "Sep", topups: 3900 },
];

const DashboardPage = () => {
  return (
    <section className="p-4 space-y-4 text-color min-h-screen">
      <h1 className="md:text-2xl font-semibold text-gray-700">
        Dashboard Overview
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {STATSDATA.map((data) => (
          <StatsCard
            key={data.title}
            title={data.title}
            icon={data.icon}
            iconStyles={data.iconStyles}
            count={data.count}
            description={data.description}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartComponent
          title={"User growth in the last (5 months)"}
          data={userData}
          chart={LineChart}
        >
          <>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              formatter={(value) => Intl.NumberFormat().format(Number(value))}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#6b7280" // gray-500
              strokeWidth={3}
              dot={{ r: 4, fill: "#6b7280" }}
            />
          </>
        </ChartComponent>
        <ChartComponent
          title={"Airtime purchase Trends"}
          data={topUpData}
          chart={BarChart}
        >
          <>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar
                dataKey="topups"
                fill="#6b7280" // gray-500
                radius={[8, 8, 0, 0]}
              />
          </>
        </ChartComponent>
      </div>
    </section>
  );
};

export default DashboardPage;
