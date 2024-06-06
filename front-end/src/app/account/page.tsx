import { DataTable } from '@/components/ui/tables';
import { columns } from './columns';
import React from 'react';
import type { Reservation} from '@/lib/types';

import { userReservations } from '@/functions/calculations/tableData';

import { ReloadIcon } from '@radix-ui/react-icons';
import { Separator } from '@/components/ui/separator';
import {auth} from '@local/auth'

import { Suspense } from 'react';
import { GetUserById } from '@/lib/db/queries/users';


const baseUrl = process.env.NEXT_PUBLIC_HOST;

async function getData() {
  try {
    const userSession = await auth();
    if (!userSession) {
      return [];
    } else if (userSession) {
      const user = await GetUserById.execute({ id: userSession.user.id });
      //@ts-expect-error - bad typing #TODO fix
      const reservations: Reservation[]  = user?.Reservation!;
      if (!reservations) {
        return [];
      }
      return userReservations(reservations);
    }
  } catch (error) {
    return [];
  }
}

export default async function Account() {
  const data = await getData();
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
