import React, { Suspense } from "react";
import moment from "moment";

import type {
  SelectFacility,
  SelectReservation,
  SelectReservationDate,
} from "@local/db";

import { DataTable } from "@/components/ui/tables";
import { getUser } from "@/functions/data/users";
import { User } from "@/lib/types";
import { columns } from "./columns";
import TableSkeleton from "./skeleton";

interface TableUser {
  name: string;

  eventName: string;
  Facility: string;
  ReservationDate?: string;
  approved: "pending" | "approved" | "denied" | "canceled" | "N/A";
  Details: number;
}

interface Reservation extends SelectReservation {
  ReservationDate: SelectReservationDate[];
  Facility: SelectFacility;
}

const currentDate = moment().format("YYYY-MM-DD");

async function getData(id: string) {
  const user = await getUser(id);
  const reservation: Reservation[] = user?.Reservation || [];
  if (reservation.length === 0) {
    return [user];
  }

  const mappedReservations: TableUser[] = reservation.map((reservation) => {
    const sortedDates = reservation.ReservationDate.sort((a, b) =>
      moment(a.startDate).diff(moment(b.startDate)),
    );
    const nextUpcomingDate = sortedDates.find((date) =>
      moment(date.startDate).isSameOrAfter(currentDate),
    );
    return {
      Name: user?.name ?? "N/A",
      eventName: reservation.eventName,
      Facility: reservation.Facility.name,
      ReservationDate: nextUpcomingDate ? nextUpcomingDate.startDate : "N/A",
      approved: reservation.approved,
      Details: reservation.id,
    };
  });
  return mappedReservations;
}

export default async function accountPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;

  const data: TableUser = await getData(id);

  const name = data[0]?.name!;
  return (
    <div className="space-x-2 space-y-7">
      <h1 className="m-3 flex justify-center border-b p-3 text-4xl font-bold drop-shadow-lg">
        {name}
      </h1>
      <h2 className="text-3xl font-bold text-primary shadow-secondary drop-shadow dark:text-secondary">
        Reservations
      </h2>
      {data.length === 0 ? (
        <p className="text-center">No reservations found.</p>
      ) : (
        <Suspense fallback={<TableSkeleton />}>
          <DataTable columns={columns} data={data} />
        </Suspense>
      )}
    </div>
  );
}
