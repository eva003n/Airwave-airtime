import React, { useEffect, useMemo, useState } from "react";

import {
  Users,
  CreditCard,
  ArrowUpRight,
  Wallet,
  PhoneCall,
  BadgeDollarSign,
  TrendingUp,
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
import { getAdminAnalyticsData, getAnalyticsData } from "@/api";
import { getItem } from "@/utils";
import type { AnalyticsAdmin, UserData } from "@/validation/validators";
import { MONTHS_SHORT } from "@/constants";
import { getMonth } from "@/utils/formatdate";
import { useEnv } from "@/context/Environment/env.context";

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
  const [analytics, setAnalytics] = useState<AnalyticsAdmin>();
  const {enabled} = useEnv()

  useEffect(() => {
    const fetchAnalytics = async () => {
      const response = await getAdminAnalyticsData();
      setAnalytics(response.data);
    };
    fetchAnalytics();
  }, [enabled]);

  const transactionGrowthData = useMemo(() => {
    if (!analytics?.data?.transactionGrowth) return; // fallback sample
    return analytics.data?.transactionGrowth.map((r: any) => ({
      month: MONTHS_SHORT[getMonth(r.month)],
      count: Number(r.count ?? r.transaction ?? 0), // tolerate different keys
    }));
  }, [analytics]);

  const airtimePurchases = useMemo(() => {
    if (!analytics?.data?.airtimePurchases) return ;
    return analytics.data?.airtimePurchases.map((t: any) => ({
      month: MONTHS_SHORT[getMonth(t.month)],
      count: Number(t.count ?? t.topups ?? 0),
    }));
  }, [analytics])

  return (
    <section className="p-4 space-y-4 text-color min-h-screen">
      <h1 className="md:text-2xl font-semibold text-gray-700">
        Dashboard Overview
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          key={"Total Users"}
          title={"Total Users"}
          icon={Users}
          iconStyles={"text-blue-500 w-8 h-8 bg-blue-100 p-2 rounded-full"}
          count={analytics?.data?.stats?.totalUsers || 0}
          description={"Active users"}
        />
        <StatsCard
          key={"Total Transactions"}
          title={"Total Transactions"}
          iconStyles={"text-orange-500  w-8 h-8 bg-orange-100 p-2 rounded-full"}
          icon={CreditCard}
          count={analytics?.data?.stats?.totalTransactions || 0}
          description={"Completed payments"}
        />
        <StatsCard
          key={"Wallet balance"}
          title={"Wallet balance"}
          icon={Wallet}
          iconStyles={
            "text-indigo-500  w-8 h-8  bg-indigo-100 p-2 rounded-full"
          }
          count={analytics?.data?.stats?.walletBalance || 0}
          description={"App wallet deposits"}
          currency={true}
        />
        <StatsCard
          key={"Total profit"}
          title={"Total profit"}
          icon={TrendingUp}
          iconStyles={"text-green-500  w-8 h-8 bg-green-100 p-2 rounded-full"}
          count={analytics?.data?.stats?.totalDiscount || 0}
          description={"Business profit"}
          currency={true}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartComponent
          title={"Transaction growth last (5 months)"}
          data={transactionGrowthData || []}
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
              dataKey="count"
              stroke="#6b7280" // gray-500
              strokeWidth={2}
              dot={{ r: 4, fill: "#6b7280" }}
            />
          </>
        </ChartComponent>
        <ChartComponent
          title={"Airtime purchase Trends"}
          data={airtimePurchases || []}
          chart={BarChart}
        >
          <>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Bar
              dataKey="count"
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
