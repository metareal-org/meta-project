import { ColumnDef, SortingState, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Flex } from "@/components/ui/tags";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import moment from "moment";
import { useState } from "react";

const data: Payment[] = [
  {
    id: "1",
    offer: 316,
    user: "DanteVelli",
    date: Date.now(),
  },
  {
    id: "2",
    offer: 242,
    user: "JohnDoe",
    date: Date.now() - 3600 * 1000 * 24,
  },
  {
    id: "3",
    offer: 837,
    user: "Eminem",
    date: Date.now() - 3600 * 1000 * 12,
  },
  {
    id: "4",
    offer: 874,
    user: "Richard Dawkins",
    date: Date.now() - 3600 * 1000 * 5,
  },
  {
    id: "5",
    offer: 721,
    user: "Hannah Montana",
    date: Date.now() - 3600 * 1000 * 3,
  },
];

export type Payment = {
  id: string;
  offer: number;
  user: string;
  date: any;
};

export default function BuildingOfferListTable({ sortable = true }) {
  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "user",
      header: ({ column }) => {
        return sortable ? (
          <Button variant="ghost" className="px-0" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Username
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <div>Username</div>
        );
      },
      cell: ({ row }) => <div className="capitalize">{row.getValue("user")}</div>,
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return sortable ? (
          <Button variant="ghost" className="px-0" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <div>Date</div>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue("date");
        const formattedDate = moment(date as Date).fromNow();
        return <div className="lowercase">{formattedDate}</div>;
      },
    },
    {
      accessorKey: "offer",
      header: ({ column }) => {
        return sortable ? (
          <Button variant="ghost" className="px-0" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Offer
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <div>Offer</div>
        );
      },
      cell: ({ row }) => {
        const offer = parseFloat(row.getValue("offer"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(offer);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "id",
      header: () => (sortable ? <div>Action</div> : null),
      cell: ({ row }) => {
        return sortable ? (
          <>
            <Flex className="gap-2 items-center justify-center">
              <Button size={"sm"}>Accept</Button>
            </Flex>
          </>
        ) : null;
      },
    },
  ];

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "offer",
      desc: true,
    },
  ]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  return (
    <div className="w-full pt-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
    </div>
  );
}
