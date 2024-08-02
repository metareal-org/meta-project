import React, { useCallback, useMemo, useState, useEffect } from "react";
import { ColumnDef, SortingState, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowUpDown, Loader2 } from "lucide-react";
import { Flex } from "@/components/ui/tags";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import moment from "moment";
import useLandStore from "@/store/world-store/useLandStore";
import numeral from "numeral";
import { useUserStore } from "@/store/player-store/useUserStore";
import { usePlayerOffersStore } from "@/store/player-store/usePlayerOffersStore";

export type Offer = {
  id: number;
  user_id: number;
  price: number;
  created_at: string;
  user: {
    id: number;
    nickname: string;
    assets: {
      id: number;
      user_id: number;
      gift: number;
      ticket: number;
      wood: number;
      stone: number;
      sand: number;
      gold: number;
      created_at: string;
      updated_at: string;
    };
  };
};

interface BuildingOfferListTableProps {
  data: Offer[][];
  sortable?: boolean;
  isLoading: boolean;
}

export default function BuildingOfferListTable({ data, sortable = true, isLoading }: BuildingOfferListTableProps) {
  const { currentLandDetails, fetchLandDetails } = useLandStore();
  const { acceptOffer } = usePlayerOffersStore();
  const { user, fetchUser } = useUserStore();
  const [processingOfferId, setProcessingOfferId] = useState<number | null>(null);

  // Flatten the nested array structure
  const flattenedData = useMemo(() => data.flat(), [data]);

  // Debug logging
  useEffect(() => {
    console.log("Current user:", user);
    console.log("All offers:", flattenedData);
  }, [user, flattenedData]);

  const handleAcceptOffer = useCallback(
    async (offerId: number) => {
      setProcessingOfferId(offerId);
      try {
        await acceptOffer(offerId);
        console.log("Offer accepted successfully");
        await fetchUser();
        if (currentLandDetails) {
          await fetchLandDetails(currentLandDetails.id);
        }
      } catch (error) {
        console.error("Error accepting offer:", error);
        console.log("Failed to accept offer. Please try again.");
      } finally {
        setProcessingOfferId(null);
      }
    },
    [acceptOffer, fetchUser, currentLandDetails, fetchLandDetails]
  );

  const columns: ColumnDef<Offer>[] = useMemo(
    () => [
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
        cell: ({ row }) => <div className="capitalize !pl-3">{row.original.user.nickname}</div>,
      },
      {
        accessorKey: "created_at",
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
          const date = row.original.created_at;
          const formattedDate = moment(date).fromNow();
          return <div className="lowercase">{formattedDate}</div>;
        },
      },
      {
        accessorKey: "price",
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
          const offer = row.original.price;
          const formatted = numeral(offer).format("$0,0");
          return <div className="font-medium">{formatted}</div>;
        },
      },
      {
        accessorKey: "id",
        header: () => (sortable ? <div className="flex justify-center">Action</div> : null),
        cell: ({ row }) => {
          const offerId = row.original.id;
          return sortable ? (
            <Flex className="gap-2 items-center justify-center">
              <Button size={"sm"} onClick={() => handleAcceptOffer(offerId)} disabled={processingOfferId === offerId}>
                {processingOfferId === offerId ? "Processing..." : "Accept"}
              </Button>
            </Flex>
          ) : null;
        },
      },
    ],
    [sortable, processingOfferId, handleAcceptOffer]
  );

  const [sorting, setSorting] = useState<SortingState>([{ id: "price", desc: true }]);
  const [rowSelection, setRowSelection] = useState({});

  const filteredData = useMemo(() => {
    if (!user) return flattenedData;

    return flattenedData.filter((offer) => offer.user_id !== user.id);
  }, [flattenedData, user]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: { sorting, rowSelection },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full">
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
            {filteredData.length > 0 ? (
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
                  No pending offers.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}