import React, { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getItem } from "@/utils";
import type { UserData } from "@/validation/validators";
import { db } from "@/db/db";
import { useLiveQuery } from "dexie-react-hooks";
import { TopUpService } from "@/db/topup.service";
import { TopUpDataTable } from "./Datatable";
import topUpColumns from "./Columns";
import { apiClient } from "@/api/apiclient";
import { useEventConsumer } from "@/context/event.context";
import { startBulkTopUps } from "@/api";
import { toast } from "react-toastify";

// Mock job queue data
const jobQueue = [
  {
    phone: "+254712345678",
    branch: "Head Office",
    operator: "Safaricom",
    amount: 100,
    status: "completed",
    time: "2 minutes ago",
  },
  {
    phone: "+254742345678",
    branch: "Kagwe",
    operator: "Safaricom",
    amount: 100,
    status: "processing",
    time: "2 minutes ago",
  },
  {
    phone: "+254722334455",
    branch: "Kiriita",
    operator: "Airtel",
    amount: 200,
    status: "processing",
    time: "just now",
  },
  {
    phone: "+254733112233",
    branch: "Limuru",
    operator: "Airtel",
    amount: 500,
    status: "failed",
    time: "5 minutes ago",
  },
  {
    phone: "+254716723344",
    branch: "Kiambu",
    operator: "Safaricom",
    amount: 150,
    status: "queued",
    time: "1 minute ago",
  },
  {
    phone: "+254713333344",
    branch: "Suswa",
    operator: "Safaricom",
    amount: 150,
    status: "queued",
    time: "1 minute ago",
  },
  {
    phone: "+254750223344",
    branch: "Mai mahiu",
    operator: "Safaricom",
    amount: 150,
    status: "queued",
    time: "1 minute ago",
  },
  {
    phone: "+254750223451",
    branch: "Githunguri",
    operator: "Safaricom",
    amount: 150,
    status: "failed",
    time: "1 minute ago",
  },
];

type TopUp = {
  id: string; // unique ID from backend
  name: string;
  phone: string;
  amount: number;
  branch: string;
  operator: string;
  status: "Pending" | "Success" | "Failed" | "Processing";
  createdAt: Date;
  updatedAt?: Date;
};

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
    case "pending":
    default:
      return (
        <Badge className="bg-gray-100 text-gray-700 border-gray-300">
          Pending
        </Badge>
      );
  }
};

export default function BulkTopUpQueue() {
  // const [topups, setTopups] = useState(
  //   useLiveQuery(() => db.topups.orderBy("createdAt").reverse().toArray(), []) || []
  // )
  const { topups, isConnected, reconnecting } = useEventConsumer();
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [token, setToken] = useState("");

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this airtime topup?")) return;
    TopUpService.delete(id);
  };

  const handleStart = async () => {
    const response = await startBulkTopUps();
    toast.success(response.data.message);
  };

  return (
    <div className="p-4 ">
      <Card className="shadow-sm border-gray-200">
        <CardHeader>
          {/* <CardTitle className="text-gray-700 flex justify-between">
            Current Top up job status
            <Link to={"/top-ups/make-topup"}>
              <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
                Make topup
              </Button>
            </Link>
          </CardTitle> */}
          <div className="flex items-center justify-between ">
            <p className="text-2xl font-semibold text-gray-700 flex gap-3">
              {/* <Phone size={24} className="" /> */}
              Job Queue
            </p>
            <div className="flex gap-4">
              {/* <Button
                variant={"outline"}
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
                onClick={handleStart}
              >
                Start bulk top
              </Button> */}
              <Link to={"/top-ups/make-topup"}>
                <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
                  Make topup
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <TopUpDataTable
              columns={topUpColumns(handleDelete)}
              data={topups}
              page={page}
              setPage={setPage}
              pages={pages}
              // topUps={}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
