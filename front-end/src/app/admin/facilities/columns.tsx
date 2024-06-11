"use client";

import type { TableFacility } from "@/lib/types";
import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/buttons";

export const columns: ColumnDef<TableFacility>[] = [
  {
    accessorKey: "imagePath",
    header: "Image",
    cell: ({ row }) => {
      const imagePath = row.getValue("imagePath") as string;
      return (
        <>
          {imagePath ? (
            <Image
              src={imagePath}
              alt="facility image"
              width={100}
              height={100}
              className="rounded-full"
            />
          ) : (
            <Image
              src="/logo.jpg"
              alt="facility image"
              width={100}
              height={100}
              className="drop-shadow-xl"
            />
          )}
        </>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "building",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Building
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
  },
  {
    accessorKey: "Category",
    header: "Category Prices",
    cell: ({ row }) => {
      const prices = row.getValue("Category") as number[];
      return (
        <>{prices?.map((price, index) => <div key={index}>${price}/hr</div>)}</>
      );
    },
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button variant="link" asChild>
          <Link href="/admin/facilities/new">New Facility</Link>
        </Button>
      );
    },
    cell: ({ row }) => {
      const id = row.getValue("id");
      return (
        <>
          <Button variant="link" asChild>
            <Link href={`/admin/facilities/${id}`}>Edit</Link>
          </Button>
        </>
      );
    },
  },
];
