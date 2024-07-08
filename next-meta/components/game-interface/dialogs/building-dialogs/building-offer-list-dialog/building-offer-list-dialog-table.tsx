import { ColumnDef, SortingState, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Flex } from "@/components/ui/tags";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import moment from "moment";
import { useState } from "react";
import useLandStore from "@/store/world-store/useLandStore";
import numeral from "numeral";

export type Offer = {
  id: string;
  offer: number;
  user: string;
  date: number;
};

interface BuildingOfferListTableProps {
  data: Offer[];
  sortable?: boolean;
  isLoading: boolean;
}

export default function BuildingOfferListTable({ data, sortable = true, isLoading }: BuildingOfferListTableProps) {

  const columns: ColumnDef<Offer>[] = [
    {
      accessorKey: "user",
      header: ({ column }) => {
        return sortable ? (
          <Button variant="ghost" className="!px-0 !pl-3 hover:!bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Nickname
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <div>Nickname</div>
        );
      },
      cell: ({ row }) => <div className="capitalize !pl-3">{row.getValue("user")}</div>,
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return sortable ? (
          <Button variant="ghost" className="!px-0 hover:!bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <div>Date</div>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue("date");
        const formattedDate = moment(date as number).fromNow();
        return <div className="lowercase">{formattedDate}</div>;
      },
    },
    {
      accessorKey: "offer",
      header: ({ column }) => {
        return sortable ? (
          <Button variant="ghost" className="!px-0 hover:!bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Offer
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <div>Offer</div>
        );
      },
      cell: ({ row }) => {
        const offer = parseFloat(row.getValue("offer"));
        const formatted = numeral(offer).format('$0,0');
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "id",
      header: () => (sortable ? <div className="flex justify-center">Action</div> : null),
      cell: ({ row }) => {
        return sortable ? (
          <>
            <Flex className="gap-2 items-center justify-center">
              <Button size={"sm"} onClick={() => handleAcceptOffer(row.getValue("id"))}>
                Accept
              </Button>
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

  const handleAcceptOffer = (offer_id: string) => {};

  return (
    <div className="w-full">
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex justify-center items-center h-32">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? (
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