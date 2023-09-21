'use server';

import prisma from '@/lib/prisma';

export default async function PayinPerson(id: any) {
  const res = await prisma.reservation.update({
    where: {
      id: BigInt(id),
    },
    data: {
      inPerson: true,
    },
  });

  return res;
}
