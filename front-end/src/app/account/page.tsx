import { DataTable } from '@/components/ui/tables';
import { columns } from './columns';
import React from 'react';


import { userReservations } from '@/functions/calculations/tableData';

import { ReloadIcon } from '@radix-ui/react-icons';
import { Separator } from '@/components/ui/separator';
import {auth} from '@local/auth'

import { Suspense } from 'react';
import {api} from '@/trpc/server'
import { notFound } from 'next/navigation';



export default async function Account() {
  const session = await auth()
  if(!session) return notFound();
  const data = await api.reservation.usersReservations({userId: session.user.id})
  if (!data) {
    return <div>loading ...</div>;
  }

  return (
    <div className="space-y-7">
      <div>
        <h3 className="text-lg font-medium">My Reservations</h3>
      </div>
      <Separator />

      <Suspense fallback={<LoadingComponent />}>
        <DataTable columns={columns} data={data} />
      </Suspense>
    </div>
  );
}

const LoadingComponent = () => {
  return (
    <div>
      Loading <ReloadIcon className="w-4 h-4 animate-spin" />
    </div>
  );
};
