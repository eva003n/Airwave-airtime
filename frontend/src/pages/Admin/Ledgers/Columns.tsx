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


import { Link, useNavigate } from "react-router-dom";
import type { LedgerData, RecipientData, RecipientForm, TopUpData, TransactionData, TransactionDataApi } from "@/validation/validators";
import type { AxiosResponse } from "axios";
import { getDateByDay } from "@/utils/formatdate";
import { deleteRecipient } from "@/api";
import { toast } from "react-toastify";


const ledgerColumns = (): // handleDelete: (id: string) => void
ColumnDef<LedgerData>[] => [
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
    accessorKey: "accountInfo.account_number",
    accessorFn: (row) => row.accountInfo?.account_number, // this makes it work for nested objects
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          title="Sort by recipient"
          className="text-left"
        >
          Account No
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const account = getValue<string>();
      return (
        <div className="text-gray-400 tracking-widest italic">{account}</div>
      );
    },
  },
  {
    accessorKey: "accountInfo.wallet_type",
    accessorFn: (row) => row.accountInfo?.wallet_type, // this makes it work for nested objects
    header: "Account type",
    cell: ({ getValue }) => {
      const type = getValue<string>();
      const color =
        type === "Max"
          ? "bg-orange-100 text-orange-700"
          : type === "Premium"
          ? "bg-green-100 text-green-700"
          : type === "Plus"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-blue-100 text-blue-700";
      return (
        <Badge className={`${color} px-3 py-1 rounded-full`}>{type}</Badge>
      );
    },
  },
  {
    accessorKey: "transInfo.transaction_type",
    accessorFn: (row) => row.transInfo.transaction_type, // this makes it work for nested objects
    header: "Type",
    cell: ({ getValue }) => {
      const type = getValue<string>();
      const color =
        type === "Debit"
          ? "bg-blue-100 text-blue-700"
          : type === "Credit"
          ? "bg-green-100 text-green-700"
          : "";
      return (
        <Badge className={`${color} px-3 py-1 rounded-full`}>{type}</Badge>
      );
    },
  },
  {
    accessorKey: "balance_before",
    header: () => <div className="text-right">Balance before</div>,
    cell: ({ row }) => {
      const type = row.getValue("transInfo.transaction_type") as string;

      const amount = parseFloat(row.getValue("balance_before"));

      const formatted = new Intl.NumberFormat("en-UK", {
        style: "currency",
        currency: "KES",
      }).format(amount);

      return <div className="text-right  text-blue-500">{formatted}</div>;
    },
  },
  {
    accessorKey: "balance_after",
    header: () => <div className="text-right">Balance after</div>,
    cell: ({ row }) => {
      const type = row.original.transInfo.transaction_type

      const amount = parseFloat(row.getValue("balance_after"));

      const diff =
        type === "Credit"
          ? `+${
              parseFloat(row.getValue("balance_after")) -
              parseFloat(row.getValue("balance_before"))
            }`
          : `${
              parseFloat(row.getValue("balance_after")) -
              parseFloat(row.getValue("balance_before"))
            }`;

      const formatted = new Intl.NumberFormat("en-UK", {
        style: "currency",
        currency: "KES",
      }).format(amount);

      return (
        <div className="text-right  text-green-500">
          {formatted}
          <sup className={`${type === "Credit"? "text-green-400": "text-rose-400"} align-top`}>{diff}</sup>
        </div>
      );
    },
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
    accessorKey: "deletedAt",
    header: "Deleted at",
    cell: ({ row }) => {
      const formattedDate = row.getValue("deletedAt")
        ? getDateByDay(row.getValue("deletedAt"))
        : "-";
      return <div className="">{formattedDate}</div>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const transaction = row.original;

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
            {/* <DropdownMenuItem>
              <button
                className="flex gap-2 items-center"
                onClick={() => {
                  handleDelete(transaction.id);
                }}
              >
                <Trash2 /> Delete
              </button>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
export default ledgerColumns