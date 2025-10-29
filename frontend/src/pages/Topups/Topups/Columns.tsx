import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Pen, Trash2 } from "lucide-react";

export type TopupStatus = "Pending" | "Processing" | "Success" | "Failed";
export type TopUpColumn = {
  name: string;
  phone_number: string;
  airtime_amount: number;
  operator: string;
  branch: string;
  status: TopupStatus;
  createdAt: string;
};
import { Link, useNavigate } from "react-router-dom";
import type { RecipientData, RecipientForm, TopUpData } from "@/validation/validators";
import type { AxiosResponse } from "axios";
import { getDateByDay } from "@/utils/formatdate";
import { deleteRecipient } from "@/api";
import { toast } from "react-toastify";


const topUpColumns = (
  handleDelete: (id: string) => void
): ColumnDef<TopUpData>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        // className="bg-violet-400 text-white"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className={"border-[1.5px] border-gray-400"}
        title="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        // className="bg-violet-400 text-white"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className={`${
          row.getIsSelected() ? "border-[1.5px] border-gray-400" : ""
        }`}
        title="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "recipient.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          title="Sort by recipient"
          className="text-left"
        >
          Recipient
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "recipient.phone_number",
    header: "Phone",
  },
  {
    accessorKey: "recipient.operator",
    header: "Operator",
  },
  {
    accessorKey: "airtime_amount",
    header: () => <div className="text-right">Airtime </div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("airtime_amount"));
      const formatted = new Intl.NumberFormat("en-UK", {
        style: "currency",
        currency: "KES",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },

  {
    accessorKey: "recipient.branch",
    header: "Branch",
  },
  {
    accessorKey: "recipient.department",
    header: "Department",
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row }) => {
      const formattedDate = getDateByDay(row.getValue("createdAt"));
      return <div className="">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const color =
        status === "Success"
          ? "bg-green-100 text-green-700"
          : status === "Pending"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-red-100 text-red-700";
      return (
        <Badge className={`${color} px-3 py-1 rounded-full`}>{status}</Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const topUp = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0" title="Open menu">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <button
                className="flex gap-2 items-center"
                onClick={() => {
                  handleDelete(topUp.id);
                }}
              >
                <Trash2 /> Delete
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
export default topUpColumns