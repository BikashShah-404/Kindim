import React, { useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllOrdersQuery } from "@/redux/api/orderSlice";
import { Spinner } from "@/components/ui/spinner";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import PaginationComp from "@/components/Pagination";
import ActionsCell from "./OrderActions";
import AdminMenu from "./AdminMenu";

const columns = [
  {
    accessorKey: "_id",
    header: () => <div className="text-center">Order-Id</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">{row.getValue("_id")}</div>
      );
    },
  },
  {
    accessorKey: "orderItems",
    header: "Items",
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium flex flex-col gap-y-2">
          {row.getValue("orderItems").map((eachItem, index) => (
            <p key={eachItem.product}>
              {index + 1}. {eachItem.name}
            </p>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "user.email",
    header: "User",
  },
  {
    accessorKey: "itemsPrice",
    header: () => <div className="text-right">Items-Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("itemsPrice"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return (
        <div className="text-center font-medium text-green-400">
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "shippingPrice",
    header: () => <div className="text-right">Shipping-Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("shippingPrice"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return (
        <div className="text-center font-medium text-green-400">
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "taxPrice",
    header: () => <div className="text-right">Tax-Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("taxPrice"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return (
        <div className="text-center font-medium text-green-400">
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "totalPrice",
    header: () => <div className="text-right">Total-Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalPrice"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return (
        <div className="text-center font-medium text-green-400">
          {formatted}
        </div>
      );
    },
  },

  {
    accessorKey: "paymentMethod",
    header: "Payment-Method",
  },
  {
    accessorKey: "isPaid",
    header: "Is-Paid",
  },
  {
    accessorKey: "paidAt",
    header: "PaidAt",
  },
  {
    accessorKey: "isDelivered",
    header: "IsDelivered",
  },
  {
    accessorKey: "deliveredAt",
    header: "DeliveredAt",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell order={row.original} />,
  },
];

const DataTable = ({ columns, data }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-md border bg-slate-800 ">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={
                      "text-secondary text-center border-r border-r-gray-600"
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={"hover:bg-black"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={"border-r border-r-gray-600 text-center "}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const AllOrders = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, isError } = useGetAllOrdersQuery({
    page,
    limit,
  });
  const orders = data?.data?.orders.map((eachOrder) => ({
    ...eachOrder,
    paidAt: eachOrder.paidAt
      ? new Date(eachOrder.paidAt).toDateString()
      : "Not Paid Yet",
    deliveredAt: eachOrder.deliveredAt
      ? new Date(eachOrder.deliveredAt).toDateString()
      : "Not Delivered Yet",
  }));
  console.log(orders);

  return (
    <div className=" min-h-screen flex items-center justify-center bg-gradient-to-tr from-black via-gray-600 to-gray-500 ">
      <AdminMenu />
      {isLoading ? (
        <div className="flex items-center gap-x-4 shadow-2xl bg-gradient-to-tl from-black via-gray-600 to-gray-500 py-2 px-6 rounded-2xl ">
          <Spinner className={"h-10 w-10 "} />
          <span className="text-secondary font-semibold">Fetching Orders</span>
        </div>
      ) : isError ? (
        <div className="flex items-center gap-x-4 shadow-2xl bg-gradient-to-tl from-black via-gray-600 to-gray-500 py-2 px-6 rounded-2xl ">
          <span className="text-secondary font-semibold text-lg">
            Oops! Something went wrong
          </span>
        </div>
      ) : (
        <div className=" py-10 text-secondary flex flex-col gap-y-6  w-full  px-4">
          <DataTable columns={columns} data={orders} />
          <div className="text-primary">
            <PaginationComp
              page={page}
              limit={limit}
              setPage={setPage}
              setLimit={setLimit}
              total={data?.data?.totalPages}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllOrders;
