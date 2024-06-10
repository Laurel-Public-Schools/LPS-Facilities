'use server';
import { db } from '@local/db/client';
import { Reservation } from '../../../../packages/db/src/schema/schema';
import { eq, sql } from 'drizzle-orm';

export default async function PiP(id: any) {
  try {
    await db
      .update(Reservation)
      .set({
        inPerson: true,
      })
      .where(eq(Reservation.id, id));
  } catch (error) {
    throw new Error();
  }
  return Response.json(({ response: 200, body: 'success' }.response = 200));
}
