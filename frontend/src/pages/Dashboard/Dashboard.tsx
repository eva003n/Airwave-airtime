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
import type { Analytics } from "@/validation/validators";
import CountUp from "react-countup";
import { getMonth } from "@/utils/formatdate";
import { MONTHS_SHORT } from "@/constants";

const recipientData = [
  { month: "May", recipients: 600 },
  { month: "Jun", recipients: 800 },
  { month: "Jul", recipients: 1200 },
  { month: "Aug", recipients: 1450 },
  { month: "Sep", recipients: 1650 },
];

const topUpData = [
  { month: "May", topups: 2000 },
  { month: "Jun", topups: 2400 },
  { month: "Jul", topups: 3000 },
  { month: "Aug", topups: 3500 },
  { month: "Sep", topups: 3900 },
];

export default function Dashboard() {
const [analytics, setAnalytics] = useState<Analytics>()
useEffect(() => {
  const fetchAnalytics = async () => {
    const response = await getAnalyticsData()
    setAnalytics(response.data)
  }
fetchAnalytics()
}, [])

const topUpTrendsData = useMemo(() => {
  if (!analytics?.data.topUpTrends) return topUpData;
  return analytics.data.topUpTrends.map((t: any) => ({
    month: MONTHS_SHORT[getMonth(t.month)],
    totalTopups: Number(t.totalTopups ?? t.topups ?? 0),
  }));
}, [analytics]);

const recipientGrowthData = useMemo(() => {
  if (!analytics?.data.recipientGrowth) return recipientData; // fallback sample
  return analytics.data.recipientGrowth.map((r: any) => ({
    month: MONTHS_SHORT[getMonth(r.month)],
    recipients: Number(r.recipients ?? r.count ?? 0), // tolerate different keys
  }));
}, [analytics]);
  return (
    <div className="p-6 space-y-6 bg-sidebar min-h-screen">
      <h1 className="md:text-2xl font-semibold text-gray-700">
        Dashboard Overview
      </h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Recipients */}
        <Card className="transition-all duration-300 border-gray-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-700 text-sm font-medium">
              Total Recipients
            </CardTitle>
            <Users className="text-gray-500 w-5 h-5" />
          </CardHeader>
          <CardContent>
            <CountUp
              start={0}
              end={analytics?.data.totalRecipients || 0}
              className="text-2xl font-bold text-gray-700"
              duration={2}
              separator=","
            />
            <p className="text-sm text-gray-500">Active recipients</p>
          </CardContent>
        </Card>

        {/* Total Top-Ups */}
        <Card className="transition-all duration-300 border-gray-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-700 text-sm font-medium">
              Total Top-Ups
            </CardTitle>
            <Phone className="text-gray-500 w-5 h-5" />
          </CardHeader>
          <CardContent>
            <CountUp
              start={0}
              end={analytics?.data.totalTopUps || 0}
              className="text-2xl font-bold text-gray-700"
              duration={2}
              separator=","
            />
            <p className="text-sm text-gray-500">All-time distributions</p>
          </CardContent>
        </Card>

        {/* Wallet Balance */}
        <Card className="transition-all duration-300 border-gray-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-700 text-sm font-medium">
              Wallet Balance
            </CardTitle>
            <Wallet className="text-gray-500 w-5 h-5" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-700 flex gap-2 items-center">
              <span>KES</span>
              <CountUp
                start={0}
                end={analytics?.data.walletBalance || 0}
                className="text-2xl font-bold text-gray-700"
                duration={2}
                separator=","
              />
            </p>
            <p className="text-sm text-gray-500">Float balance</p>
          </CardContent>
        </Card>

        {/* Supported Operators */}
        <Card className="transition-all duration-300 border-gray-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-700 text-sm font-medium">
              Operators
            </CardTitle>
            <Signal className="text-gray-500 w-5 h-5" />
          </CardHeader>
          <CardContent className="space-y-2">
            <CountUp
              start={0}
              end={2}
              className="text-2xl font-bold text-gray-700"
              duration={2}
            />
            <ListContainer className="flex gap-4 items-center">
              <List className="flex gap-1 items-center">
                <CardSim size={16} className="text-green-400" />
                Safaricom
              </List>
              <List className="flex gap-1 items-center">
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
        <Card className="transition-all duration-300 border-gray-200 hover:shadow-md">
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
        <Card className="transition-all duration-300 border-gray-200 hover:shadow-md">
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
