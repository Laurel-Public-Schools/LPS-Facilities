import React, { Suspense } from "react";
import { headers } from "next/headers";

import { DataTable } from "@/components/ui/tables";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  mapPastReservations,
  mapReservations,
} from "@/functions/calculations/tableData";
import TableSkeleton from "../requests/skeleton";
import { columns } from "./columns";

async function getReservations() {
  const headersInstance = headers();
  const auth = headersInstance.get("Cookie")!;

  const res = await fetch(process.env.NEXT_PUBLIC_HOST + `/api/reservation`, {
    headers: {
      Cookie: auth,
    },
    next: {
      revalidate: 60,
      tags: ["reservations"],
    },
  });
  const data = await res.json();
  const [Reservations, PastReservations] = await Promise.all([
    mapReservations(data),
    mapPastReservations(data),
  ]);

  return { Reservations, PastReservations };
}

export default async function Reservations() {
  const { Reservations, PastReservations } = await getReservations();
  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-lg font-medium">Reservations</h1>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <DataTable columns={columns} data={Reservations} />
        </TabsContent>
        <TabsContent value="past">
          <DataTable columns={columns} data={PastReservations} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
