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
export type RecipientColumn = {
    id: string
    name: string,
    phone: string,
    branch: string,
    operator: string,
    airtime_amount: number,
    createdAt: string,
    updatedAt: string
}
import { Link, useNavigate } from "react-router-dom";
import type { RecipientData } from "@/validation/validators";
import type { AxiosResponse } from "axios";
import { getDateByDay } from "@/utils/formatdate";
import { deleteRecipient } from "@/api";
import { toast } from "react-toastify";

const recipientColumns = (
   handleDelete: (id: string) => void,

): ColumnDef<RecipientData>[] => [
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
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        // className="bg-violet-400 text-white"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          title="Sort by name"
          className="text-left"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "phone_number",
    header: "Phone",
  },
  {
    accessorKey: "operator",
    header: "Operator",
  },
  {
    accessorKey: "airtime_amount",
    header: () => <div className="text-right">Airtime amount</div>,
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
    accessorKey: "branch",
    header: "Branch",
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
    accessorKey: "updatedAt",
    header: "Updated at",
    cell: ({ row }) => {
      const formattedDate = getDateByDay(row.getValue("updatedAt"));
      return <div className="">{formattedDate}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const recipient = row.original;
      

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
            <DropdownMenuItem
            // onClick={() => navigator.clipboard.writeText(recipient?.id)}
            >
              <Link to={`/recipients/${recipient.id}`} className="flex gap-2">
                <Pen /> Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <button
              className="flex gap-2 items-center"
              onClick={() => handleDelete(recipient.id)}
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
export default recipientColumns