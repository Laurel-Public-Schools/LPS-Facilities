import React, { Suspense } from "react";

import CalendarMain from "@/components/calendar/Calendar";
import LoadingScreen from "@/components/ui/loadingScreen";
import { GetAllEvents } from "@/functions/events/googleAPI";

export const dynamic = "force-dynamic";
export default function Page() {
  return (
    <div className="space-y-7">
      <Suspense fallback={<LoadingScreen />}>
        <CalendarMain promise={GetAllEvents()} />
      </Suspense>
    </div>
  );
}
