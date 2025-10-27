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
import { ChevronDown, ChevronLeft, ChevronRight, Grid, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import type { RecipientData, RecipientForm, TopUpData } from "@/validation/validators";
import { deleteRecipient } from "@/api";
import { toast } from "react-toastify";
import { KUNITY_BRANCHES, KUNITY_DEPARTMENTS } from "@/constants";
import  { AnimatePresence, motion } from "motion/react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pages: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  branch: string;
  department: string;
  name: string;
  loading: boolean,
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  handleSearchParam: (key: string, value: string) => void;
  handleClearFilters: () => void;
}

export function TopUpDataTable<TData, TValue>({
  columns,
  data,
  pages,
  page,
  setPage,
  branch,
  // setSearch,
  department,
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
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" title="Filter by branch">
                {/* <ListFilter className="w-6 h-6" /> */}
                {branch ? `${branch}` : "Branch"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-white">
              <DropdownMenuLabel>Select branch</DropdownMenuLabel>
              {KUNITY_BRANCHES.map((branch, index) => (
                <DropdownMenuCheckboxItem
                  key={index}
                  className="capitalize"
                  checked={columnVisibility[branch]}
                  onCheckedChange={(value) => {
                    // setBranch(value ? branch : "");
                    handleSearchParam("branch", value ? branch : "");
                    setColumnVisibility(() => ({
                      // ...prev,
                      [branch]: value,
                    }));
                  }}
                >
                  {branch}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center" asChild>
              {/* <ListFilter className="w-6 h-6" /> */}
              <Button variant="outline" title="Filter by department">
                {department ? `${department}` : "Department"}{" "}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-white">
              {KUNITY_DEPARTMENTS.map((department, index) => (
                <DropdownMenuCheckboxItem
                  key={index}
                  className="capitalize"
                  checked={columnVisibility[department]}
                  onCheckedChange={(value) => {
                    handleSearchParam("department", value ? department : "");
                    setColumnVisibility(() => ({
                      // ...prev,
                      [department]: value,
                    }));
                  }}
                >
                  {department}
                </DropdownMenuCheckboxItem>
              ))}
              {/* Dropdown items for branch selection can be added here */}
            </DropdownMenuContent>
          </DropdownMenu>
          {(branch || department || name) && (
            <Button variant="outline" onClick={handleClearFilters}>
              <X className="w-4 h-4 " /> Clear filters
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {/* <Input
            placeholder="Search by name "
            value={
              (table.getColumn("name")?.getFilterValue() as string) ?? name
              // (table.getColumn("phone")?.getFilterValue() as string)
            }
            onChange={(e) => {
              table.getColumn("name")?.setFilterValue(e.target.value);
              // table.getColumn("phone")?.setFilterValue(e.target.value);
              // handleSearchParam("name", name);

              // setSearch(e.target.value)
            }}
            className="max-w-sm"
          /> */}

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
        <TableCaption className="text-gray-300">List of airtime topups</TableCaption>

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
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No aitime top ups yet
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
                          {loading? "Loading top ups...": "No airtime top ups yet"}
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
