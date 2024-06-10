'use server';
import { db } from '@local/db/client';
import { eq } from 'drizzle-orm';
import { ReservationFees } from '../../../../packages/db/src/schema/schema';
import { revalidateTag } from 'next/cache';

export default async function removeFee(feeId: any) {
  try {
    await db.delete(ReservationFees).where(eq(ReservationFees.id, feeId));

    return revalidateTag('reservations');
  } catch (error) {
    throw new Error();
  }
}
