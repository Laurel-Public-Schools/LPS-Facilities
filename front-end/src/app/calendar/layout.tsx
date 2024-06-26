import React, { Suspense } from "react";

import { buildingSideBar2 } from "@local/validators/constants";

import { Separator } from "@/components/ui/separator";
import { SidebarSearchParamsNav } from "@/components/ui/sidebar-searchParams";
import { Skeleton } from "@/components/ui/skeleton";

export default function calendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container relative">
      <Suspense fallback={<Skeleton className="h-auto w-auto" />}>
        <div className="sm:hidden">{children}</div>
        <div className="hidden space-y-6 p-10 pb-16 sm:block lg:p-2">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-bold">Calendar</h1>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5">
              <SidebarSearchParamsNav items={buildingSideBar2} />
            </aside>
            <div className="flex-1 lg:max-w-2xl">{children}</div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
