import { NextResponse } from 'next/server';
import { db } from '@local/db/client';
import { serializeJSON } from '@/utils/serializeJSON';

export async function GET(request: Request) {
  const res = await db.query.Facility.findMany({
    with: {
      Category: true,
    },
  });
  return NextResponse.json(serializeJSON(res));
}
