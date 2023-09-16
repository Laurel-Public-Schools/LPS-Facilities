import { NextResponse, NextRequest } from 'next/server';
import { revalidateTag } from 'next/cache';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  const res = await prisma.reservation.findUnique({
    where: { id },
    include: {
      Facility: true,
      User: true,
      Event: true,
      ReservationDate: true,
      InsuranceFiles: true,
      additionalFees: true,
      Category: true,
    },
  });
  return NextResponse.json(res);
}