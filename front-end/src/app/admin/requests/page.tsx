import type { Reservation } from "@/lib/types";
import { headers } from "next/headers";

import { DataTable } from "@/components/ui/tables";
import { mapRequests } from "@/functions/calculations/tableData";
import { TableReservation } from "@/lib/types";
import { columns } from "./columns";

async function getData() {
  const headersInstance = headers();
  const auth = headersInstance.get("Cookie")!;

  const data: Reservation[] = await fetch(
    `${process.env.NEXT_PUBLIC_HOST}/api/requests`,
    {
      headers: {
        Cookie: auth,
      },
      cache: "no-store",
    },
  ).then((res) => res.json());
  return mapRequests(data);
}

export default async function Requests() {
  const data = await getData();
  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-lg font-medium">Requests</h1>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
