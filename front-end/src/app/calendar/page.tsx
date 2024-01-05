import React from 'react';
import CalendarMain from '@/components/calendar/Calendar';

async function getEvents() {
  'use server';
  const data = await fetch(process.env.NEXT_PUBLIC_HOST + '/api/events', {
    cache: 'no-store',
    // next: {
    //   tags: ['events'],
    //   revalidate: 60,
    // },
  }).then((res) => res.json());

  return data;
}

export default async function Page() {
  const events = await getEvents();

  return (
    <div className="space-y-7">
      <CalendarMain fetchedEvents={events} />
    </div>
  );
}
