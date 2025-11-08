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
export type UserColumn = {
    id: string
    username: string,
    email: string,
    role: "admin" | "user",
    is_MFA_enabled: boolean,
    createdAt: string,
    updatedAt: string
}
import { Link, useNavigate } from "react-router-dom";
import type { UserData } from "@/validation/validators";
import { getDateByDay } from "@/utils/formatdate";


const userColumns = (
  handleDelete: (id: string) => void
): ColumnDef<UserData>[] => [
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
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          title="Sort by name"
          className="text-left"
        >
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    // cell: ({ row }) => {
    //   const phone = row.getValue<string>("phone_number");

    //   return <div className=" font-medium">+{phone}</div>;
    // },
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "is_MFA_enabled",
    header: "MFA enabled",
    cell: ({ row }) => {
      const enabled = row.getValue<boolean>("is_MFA_enabled");
      const color =
        !enabled
          ? "bg-blue-100 text-blue-700"
          : "bg-green-100 text-green-700"
      return (
        <Badge className={`${color} px-3 py-1 rounded-full`}>
          {String(enabled)}
        </Badge>
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
      const user = row.original;

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
              <Link to={`/admin/users/user/${user.id}`} className="flex gap-2">
                <Pen /> Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <button
                className="flex gap-2 items-center"
                onClick={() => handleDelete(user?.id as string)}
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
export default userColumns