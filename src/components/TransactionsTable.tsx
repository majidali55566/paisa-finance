"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "date-fns";
import { Badge } from "./ui/badge";
import {
  Check,
  Clock,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useMemo, useState } from "react";

interface Transaction {
  _id: string;
  amount: number;
  category: string;
  createdAt: string;
  description: string;
  isRecurring: boolean;
  receiptUrl: string;
  recurringInterval: string;
  status: string;
  transactionDate: string;
  type: "income" | "expense";
  updatedAt: string;
  __v: number;
}

export function TransactionsTable({ data }: { data: Transaction[] }) {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const filteredData = useMemo(() => {
    return data.filter((transaction) => {
      const typeMatch = typeFilter === "all" || transaction.type === typeFilter;

      const searchMatch =
        globalFilter === "" ||
        transaction.description
          .toLowerCase()
          .includes(globalFilter.toLowerCase());

      return typeMatch && searchMatch;
    });
  }, [data, typeFilter, globalFilter]);

  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: "transactionDate",
        header: "Date",
        cell: ({ row }) => {
          const date = new Date(row.getValue("transactionDate"));
          return formatDate(date, "dd-MMMM-yy");
        },
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
          const type = row.getValue("type");
          return (
            <Badge
              className={type === "income" ? "bg-green-600" : "bg-orange-600"}
            >
              {type}
            </Badge>
          );
        },
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("amount"));
          return <div className="font-medium">Rs.{amount}</div>;
        },
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
          return row.getValue("category") || "-";
        },
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
          return row.getValue("description") || "-";
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status");
          return (
            <span>
              <Badge variant="outline">
                {status === "completed" ? <Check /> : <Clock />}
                {status}
              </Badge>
            </span>
          );
        },
      },
      {
        accessorKey: "recurringInterval",
        header: "Recurring",
        cell: ({ row }) => {
          const recurringTime = row.getValue("recurringInterval");
          return recurringTime ? (
            <Badge variant="outline">
              <Clock />
              {recurringTime}
            </Badge>
          ) : (
            <Badge variant="outline">
              <Clock />
              one time
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const transaction = row.original;
          return (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(transaction)}
                aria-label="Edit transaction"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(transaction._id)}
                aria-label="Delete transaction"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  function onEdit(transaction: Transaction) {
    console.log("on edit", transaction);
  }
  function onDelete(id: string) {
    console.log("on delete", id);
  }

  return (
    <div className="rounded-md border">
      <div className="flex gap-4 items-center p-4">
        <Input
          placeholder="Search description..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={typeFilter}
          onValueChange={(value) => setTypeFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
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
                No transactions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between px-4 py-2 border-t">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {filteredData.length}{" "}
          results
        </div>
      </div>
    </div>
  );
}
