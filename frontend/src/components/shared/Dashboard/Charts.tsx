import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import React from 'react'
import { ResponsiveContainer, CartesianGrid, XAxis, LineChart, YAxis, Tooltip, Line } from 'recharts';
import type { ComponentType, ReactNode } from 'react';
// import type {LineChartProps, Bar} from "recharts"

type RechartChart = ComponentType<any>;

type ChartProps = {
    title: string,
    data: any[],
    chart: RechartChart 
    children: ReactNode
}
const ChartComponent = ({title, data, chart: Chart, children}: ChartProps) => {
  return (
    <Card className="transition-all duration-300 border-gray-200 bg-white hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-gray-700 text-base font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <Chart data={data}>
           {children}
          </Chart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default ChartComponent