import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import moment from "moment";

import { userReservations } from "@/functions/calculations/tableData";
import { GetUserById } from "@/lib/db/queries/users";
import { Reservation, TableReservation } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("userId");
  console.log("ID:", id);
  const user = await GetUserById.execute({ id: id });

  if (!user) return NextResponse.error();
  const reservations = user?.Reservation;

  //@ts-expect-error
  const mappedReservations = await userReservations(reservations);

  return NextResponse.json(mappedReservations);
}
