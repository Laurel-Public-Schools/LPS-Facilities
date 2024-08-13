import { DataTable } from "@/components/ui/tables/reservations/data-table";
import * as React from "react";
import columns from "./columns"
import { api } from "@/trpc/server";

async function GetData() {
  const data = await api.user.GetAllEmailPrefs()
  return data
}

export default async function emailPage() {
  const data = await GetData()
  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-lg font-medium">Email Notifications</h1>
      </div>
    <React.Suspense fallback={<div>Loading...</div>}> 
      <DataTable columns={columns} data={data} />
      </React.Suspense>
    </div>
  );
}
