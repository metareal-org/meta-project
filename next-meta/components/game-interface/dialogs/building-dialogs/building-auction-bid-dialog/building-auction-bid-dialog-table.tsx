import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef, SortingState, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { Bid } from "@/store/useAuctionStore";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { useUserStore } from "@/store/player-store/useUserStore";
import useLandStore from "@/store/world-store/useLandStore";

export default function BidsTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { user } = useUserStore();
  const { currentLandDetails } = useLandStore();
  const activeAuction = currentLandDetails?.active_auction;
  const bids = activeAuction?.bids;
  if (!bids) return;
  const columns : ColumnDef<any ,any>[] = [
    {
      accessorKey: "id",
      header: "Bid ID",
      cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Amount
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("amount")} CP</div>,
    },
    {
      accessorKey: "created_at",
      header: "Time",
      cell: ({ row }) => <div>{moment(row.getValue("created_at")).fromNow()}</div>,
    },
  ];

  const table = useReactTable({
    data: bids,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TooltipProvider key={row.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TableRow data-state={row.getIsSelected() && "selected"} className={row.original.user_id === user?.id ? "bg-white/10" : ""}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  </TooltipTrigger>
                  {row.original.user_id === user?.id && (
                    <TooltipContent>
                      <p>Your bid</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No bids yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
