import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Users, Phone, Network, Signal, CardSim } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import ListContainer from "@/components/ListContainer";
import List from "@/components/List";
import { getAnalyticsData } from "@/api";
import type { Analytics, UserData } from "@/validation/validators";
import CountUp from "react-countup";
import { getMonth } from "@/utils/formatdate";
import { MONTHS_SHORT } from "@/constants";
import { getItem } from "@/utils";
import { id } from "zod/v4/locales";
import StatsCard from "@/components/shared/Dashboard/StatsCard";
import { useEnv } from "@/context/Environment/env.context";

// const recipientData = [
//   { month: "May", recipients: 600 },
//   { month: "Jun", recipients: 800 },
//   { month: "Jul", recipients: 1200 },
//   { month: "Aug", recipients: 1450 },
//   { month: "Sep", recipients: 1650 },
// ];

// const topUpData = [
//   { month: "May", topups: 2000 },
//   { month: "Jun", topups: 2400 },
//   { month: "Jul", topups: 3000 },
//   { month: "Aug", topups: 3500 },
//   { month: "Sep", topups: 3900 },
// ];

export default function Dashboard() {
const [analytics, setAnalytics] = useState<Analytics>()
  const { enabled } = useEnv();

useEffect(() => {
  const fetchAnalytics = async () => {
      const user = getItem<UserData>("user")
    
    
    const response = await getAnalyticsData(user.id as string)
    setAnalytics(response.data)
  }
fetchAnalytics()
}, [enabled])

const topUpTrendsData = useMemo(() => {
  if (!analytics?.data?.topUpTrends) return ;
  return analytics.data?.topUpTrends.map((t: any) => ({
    month: MONTHS_SHORT[getMonth(t.month)],
    totalTopups: Number(t.totalTopups ?? t.topups ?? 0),
  }));
}, [analytics]);

const recipientGrowthData = useMemo(() => {
  if (!analytics?.data?.recipientGrowth) return ; // fallback sample
  return analytics.data?.recipientGrowth.map((r: any) => ({
    month: MONTHS_SHORT[getMonth(r.month)],
    recipients: Number(r.count ?? r.recipients ?? 0), // tolerate different keys
  }));
}, [analytics]);
  return (
    <div className="p-6 space-y-6 text-color min-h-screen">
      <h1 className="md:text-2xl font-semibold text-gray-700">
        Dashboard Overview
      </h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Recipients */}

        <StatsCard
          key={"Total Recipients"}
          title={"Total Recipients"}
          icon={Users}
          iconStyles={"text-blue-500 w-8 h-8 bg-blue-100 p-2 rounded-full"}
          count={analytics?.data?.totalRecipients || 0}
          description={"Active users"}
        />

        {/* Total Top-Ups */}
        <StatsCard
          key={"Total Top ups"}
          title={"Total Top ups"}
          icon={Phone}
          iconStyles={"text-green-500  w-8 h-8 bg-green-100 p-2 rounded-full"}
          count={analytics?.data?.totalTopUps || 0}
          description={"Airtime top ups"}
        />

        {/* Wallet Balance */}
        <StatsCard
          key={"Wallet balance"}
          title={"Wallet balance"}
          icon={Wallet}
          iconStyles={
            "text-indigo-500  w-8 h-8  bg-indigo-100 p-2 rounded-full"
          }
          count={analytics?.data?.walletBalance || 0}
          description={"Float balance"}
          currency={true}
        />

        {/* Supported Operators */}
        <Card className="transition-all duration-300 border-gray-200 bg-white hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-700 text-sm font-medium">
              Mobile operators
            </CardTitle>
            <Signal className="text-orange-500  w-8 h-8 bg-orange-100 p-2 rounded-full" />
          </CardHeader>
          <CardContent className="space-y-2">
            <CountUp
              start={0}
              end={2}
              className="text-2xl font-bold text-gray-700"
              duration={2}
              separator=","
            />
            <ListContainer className="flex gap-4 items-center">
              <List className="flex gap-1 text-sm text-gray-400 items-center">
                <CardSim size={16} className="text-green-400" />
                Safaricom
              </List>
              <List className="flex gap-1 text-sm text-gray-400 items-center">
                <CardSim size={16} className="text-red-400" />
                Airtel
              </List>
            </ListContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recipient Growth */}
        <Card className="transition-all duration-300 border-gray-200 bg-white hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-gray-700 text-base font-medium">
              Recipient Growth (Last 5 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={recipientGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  formatter={(value) =>
                    Intl.NumberFormat().format(Number(value))
                  }
                />
                <Line
                  type="monotone"
                  dataKey="recipients"
                  stroke="#6b7280" // gray-500
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#6b7280" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Top-Up Trends */}
        <Card className="transition-all duration-300 border-gray-200 bg-white hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-gray-700 text-base font-medium">
              Monthly Top-Up Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topUpTrendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar
                  dataKey="totalTopups"
                  fill="#6b7280" // gray-500
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
