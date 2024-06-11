"use server";

import { revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@local/db/client";

import { ReservationFees } from "../../../../packages/db/src/schema/schema";

export default async function removeFee(feeId: any) {
  try {
    await db.delete(ReservationFees).where(eq(ReservationFees.id, feeId));

    return revalidateTag("reservations");
  } catch (error) {
    throw new Error();
  }
}
