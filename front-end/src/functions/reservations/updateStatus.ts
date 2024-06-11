"use server";

import { revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@local/db/client";

import { GetReservationbyID } from "@/lib/db/queries/reservations";
import {
  Reservation,
  ReservationDate,
} from "../../../../packages/db/src/schema/schema";
import { CreateGoogleEvent } from "../google/singleDate";

interface props {
  id: number;
  status: "approved" | "denied" | "pending";
  reservationID?: number;
}

export default async function UpdateStatus({
  id,
  status,
  reservationID,
}: props) {
  try {
    if (reservationID) {
      const reservation = await GetReservationbyID.execute({
        id: reservationID,
      });

      if (reservation?.approved === "pending" && status === "approved") {
        await db
          .update(Reservation)
          .set({
            approved: status,
          })
          .where(eq(Reservation.id, reservationID));
      }
    }

    await db
      .update(ReservationDate)
      .set({
        approved: status,
      })
      .where(eq(ReservationDate.id, id));
  } catch (error) {
    return error;
  }
  if (status === "approved") {
    try {
      await CreateGoogleEvent(id);
    } catch (error) {
      return { message: "failed to update event" };
    }
  }
  return revalidateTag("reservations");
}
