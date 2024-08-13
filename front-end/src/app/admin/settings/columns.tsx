"use client";

import type { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import { PlusIcon, TrashIcon } from "lucide-react";

import { EmailNotificationsType } from "@local/db/schema";

import { Button } from "@/components/ui/buttons";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteEmail } from "./actions";

const columns: ColumnDef<EmailNotificationsType>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "HsEmails",
    header: "LHS",
    cell: ({ row }) => {
      return <Checkbox checked={row.original.HsEmails} />;
    },
  },
  {
    accessorKey: "MsEmails",
    header: "LMS",
    cell: ({ row }) => {
      return <Checkbox checked={row.original.MsEmails} />;
    },
  },
  {
    accessorKey: "GrEmails",
    header: "Graff",
    cell: ({ row }) => {
      return <Checkbox checked={row.original.GrEmails} />;
    },
  },
  {
    accessorKey: "WeEmails",
    header: "West",
    cell: ({ row }) => {
      return <Checkbox checked={row.original.WeEmails} />;
    },
  },
  {
    accessorKey: "SoEmails",
    header: "South",
    cell: ({ row }) => {
      return <Checkbox checked={row.original.SoEmails} />;
    },
  },
  {
    accessorKey: "StEmails",
    header: "Stadium",
    cell: ({ row }) => {
      return <Checkbox checked={row.original.StEmails} />;
    },
  },
  {
    accessorKey: "id",
    header: () => {
      return (
        <Button variant="ghost" size="icon">
          <PlusIcon className="h-6 w-6" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const email = row.original.email;
      return (
        <Button variant="ghost" size="icon" onClick={() => DeleteEmail(email)}>
          {" "}
          <TrashIcon />{" "}
        </Button>
      );
    },
  },
];
export default columns;
