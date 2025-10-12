import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Phone, Clock } from "lucide-react";

// Mock job queue data
const jobQueue = [
  {
    phone: "+254712345678",
    branch: "Nairobi HQ",
    operator: "Safaricom",
    amount: 100,
    status: "completed",
    time: "2 minutes ago",
  },
  {
    phone: "+254722334455",
    branch: "Kisumu",
    operator: "Airtel",
    amount: 200,
    status: "processing",
    time: "just now",
  },
  {
    phone: "+254733112233",
    branch: "Mombasa",
    operator: "Telkom",
    amount: 50,
    status: "failed",
    time: "5 minutes ago",
  },
  {
    phone: "+254711223344",
    branch: "Nakuru",
    operator: "Safaricom",
    amount: 150,
    status: "queued",
    time: "1 minute ago",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-green-100 text-green-700 border-green-300">
          Completed
        </Badge>
      );
    case "failed":
      return (
        <Badge className="bg-red-100 text-red-700 border-red-300">Failed</Badge>
      );
    case "processing":
      return (
        <Badge className="bg-blue-100 text-blue-700 border-blue-300">
          Processing
        </Badge>
      );
    case "queued":
      return (
        <Badge className="bg-gray-100 text-gray-700 border-gray-300">
          Queued
        </Badge>
      );
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

export default function BulkTopUpQueue() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-700 flex items-center gap-2">
          <Phone className="w-6 h-6 text-gray-500" />
          Bulk Top-Up Queue
        </h1>
      </div>

      <Card className="shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-700">
            Current Top-Up Job Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-gray-600 font-medium">
                    Phone Number
                  </TableHead>
                  <TableHead className="text-gray-600 font-medium">
                    Branch
                  </TableHead>
                  <TableHead className="text-gray-600 font-medium">
                    Operator
                  </TableHead>
                  <TableHead className="text-gray-600 font-medium">
                    Amount (KES)
                  </TableHead>
                  <TableHead className="text-gray-600 font-medium">
                    Status
                  </TableHead>
                  <TableHead className="text-gray-600 font-medium flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-500" /> Time
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {jobQueue.map((job, i) => (
                  <TableRow
                    key={i}
                    className="hover:bg-gray-50 transition-all duration-150"
                  >
                    <TableCell className="text-gray-700 font-medium">
                      {job.phone}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {job.branch}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {job.operator}
                    </TableCell>
                    <TableCell className="text-gray-700 font-semibold">
                      {job.amount}
                    </TableCell>
                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {job.time}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
