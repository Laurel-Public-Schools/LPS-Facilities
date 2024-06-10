import React from 'react';
import CalendarMain from '@/components/calendar/Calendar';
import { Suspense } from 'react';
import LoadingScreen from '@/components/ui/loadingScreen';
import { GetAllEvents } from '@/functions/events/googleAPI';

export default async function Page() {
  

  return (
    <div className="space-y-7">
      <Suspense fallback={<LoadingScreen />}>
        <CalendarMain promise={GetAllEvents()} />
      </Suspense>
    </div>
  );
}
