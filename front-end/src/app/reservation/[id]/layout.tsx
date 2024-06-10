import React from 'react';
import {unstable_cache as cache} from 'next/cache'
import {api} from "@/trpc/server"
import { SidebarNav } from '@/components/ui/sidebar-nav';
import IsUserReserv from '@/components/contexts/isUserReserv';
import { headers } from 'next/headers';
import { Separator } from '@/components/ui/separator';
import type {SideBarType} from '@/lib/types/constants';
import type { ReservationClassType } from '@/lib/classes';
import { ReservationClass } from '@/lib/classes';
import AdminPanel from './adminButtons';
import { IsAdmin } from '@/functions/other/helpers';
import { Suspense } from 'react';



export default async function reservationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: number };
}) {
  const [data, isAdmin] = await cachedData(params.id);
  const reservation = new ReservationClass(data);
  const { id, eventName, Facility } = reservation;
  
  const reservationItems: SideBarType = [
    {
      title: 'Summary',
      href: `/reservation/${id}`,
    },
    {
      title: 'Insurance',
      href: `/reservation/${id}/Insurance`,
    },
    {
      title: 'Pricing & Payments',
      href: `/reservation/${id}/Pricing`,
    },
    {
      title: 'Reservation Dates',
      href: `/reservation/${id}/Dates`,
    },
    {
      title: `${reservation.Facility?.name} Calendar`,
      href: `/reservation/${id}/Calendar`,
    },
  ];

  return (
    <IsUserReserv reservation={reservation}>
      <div className="container relative">
        <div className="sm:hidden">{children}</div>
        <div className="hidden sm:block space-y-6 p-10 pb-16 ">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-bold">{eventName}</h1>
            <h2 className=" text-muted-foreground">
              {Facility?.building} {Facility?.name}
            </h2>
            <h3 className="text-muted-foreground">{reservation?.range()}</h3>
            <Suspense fallback={<></>}>
              {isAdmin && (
                <div className="p-4 sm:p-0 self-start sm:self-end sm:right-0 float-right relative">
                  <AdminPanel id={id} facility={reservation.Facility} />
                </div>
              )}
            </Suspense>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5">
              <SidebarNav items={reservationItems} />
            </aside>
            <div className="flex-1 lg:max-w-4xl">{children}</div>
          </div>
        </div>
      </div>
    </IsUserReserv>
  );
}


async function getData(id: number) {
  const res = api.reservation.byId({ id:id })

  const isAdmin = IsAdmin()
  
  return Promise.all([res, isAdmin])
}

const cachedData = cache(
  async (id: number) => getData(id),
  ['reservations']
)