import { Suspense } from 'react';
import { DataTable } from '@/components/ui/tables/reservations/reservation/data-table';
import { columns } from './columns';
import { Skeleton } from '@/components/ui/skeleton';

import { adminColumns } from './adminColumns';
import {api} from "@/trpc/server"

import dynamic from 'next/dynamic';

import { IsAdmin } from '@/functions/other/helpers';
import { notFound } from 'next/navigation';


export default async function reservationDatesPage({
  params,
}: {
  params: { id: number };
}) {
  const isAdmin = await IsAdmin()
  const AddDates = dynamic(() => import('@/components/ui/alerts/addDates'));
  const reservation = await api.reservation.byId({ id:params.id });
  if (!reservation) return notFound();
  const mappedDates = reservation.ReservationDate!
  return (
    <div className="space-y-7" suppressHydrationWarning>
      <Suspense fallback={<Skeleton className="h-auto w-auto" />}>
        <div>
          <h2 className="Text-lg font-medium">Reservation Dates </h2>
        </div>

        {isAdmin ? (
          <>
            <DataTable columns={adminColumns} data={mappedDates} />
            <div className="float-right">
              <AddDates id={params.id} />
            </div>
          </>
        ) : (
          <>
            <DataTable columns={columns} data={mappedDates} />
          </>
        )}
      </Suspense>
    </div>
  );
}
