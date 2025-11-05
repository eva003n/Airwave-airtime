import {
  type ColumnDef,
  type VisibilityState,
  flexRender,
  type SortingState,
  type ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { motion, AnimatePresence } from "motion/react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Funnel,
  Grid,
  ListFilter,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { RecipientData } from "@/validation/validators";
import { deleteRecipient } from "@/api";
import { toast } from "react-toastify";
import { KUNITY_BRANCHES, KUNITY_DEPARTMENTS } from "@/constants";
import { de } from "zod/v4/locales";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import type { set } from "zod";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pages: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setUsers: React.Dispatch<React.SetStateAction<RecipientData[]>>;
  users: RecipientData[];
  name: string;
  loading: boolean,
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  handleSearchParam: (key: string, value: string) => void;
  handleClearFilters: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pages,
  page,
  setPage,
  name,
  loading,
  handleSearchParam,
  handleClearFilters,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="overflow-hidden">
      <div className="flex items-center justify-end gap-2 mb-2">
     
        <div className="flex gap-2 ">
          <Input
            placeholder="Search by name"
            value={
              (table.getColumn("name")?.getFilterValue() as string) ?? ""
              // (table.getColumn("phone")?.getFilterValue() as string)
            }
            onChange={(e) => {
              table.getColumn("name")?.setFilterValue(e.target.value);
              // setSearch(e.target.value);
              // handleSearchParam("name", e.target.value);

              // table.getColumn("phone")?.setFilterValue(e.target.value);
            }}
            className="max-w-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                // handleSearchParam("name", name);
              }
            }}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" title="Format Columns">
                <Grid strokeWidth={2} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Table className="bg-white">
        <TableCaption className="text-gray-400">
          List of users.
        </TableCaption>

        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        {/* <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-gray-400">
                No airtime recipients.
              </TableCell>
            </TableRow>
          )}
        </TableBody> */}
        <AnimatePresence mode="wait">
          <motion.tbody
            key={table.getRowModel().rows.length}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
            }}
            className="overflow-hidden"
          >
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {loading ? "Loading recipients..." : " No user data yet."}
                </TableCell>
              </TableRow>
            )}
          </motion.tbody>
        </AnimatePresence>
      </Table>
      <div className="flex items-center justify-center space-x-2 py-4 m-0 p-9  ">
        <Pagination className="">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className={
                  page === 1
                    ? "pointer-events-none opacity-30"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {[...Array(pages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((prev) => Math.min(pages, prev + 1))}
                className={
                  page === pages
                    ? "pointer-events-none  opacity-30"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
