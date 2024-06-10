
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/buttons/button';
import Link from 'next/link';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import moment from 'moment';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Suspense } from 'react';
import {api} from "@/trpc/server"
import LoadingScreen from '@/components/ui/loadingScreen';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const facilities = await api.facility.allIds()
  return facilities.map((facility) => ({
    id: facility.id.toString(),
  }));
}

export default async function facilityPage({
  params,
}: {
  params: {
    id: number;
  };
}) {


  const facility = await api.facility.byId({id:params.id})
  if (!facility) return notFound();

  
  const map = `https://www.google.com/maps/search/?api=1&query=${facility.address}`;

  return (
    <TooltipProvider>
      <div className="flex flex-col sm:flex-row w-auto h-full mb-10  justify-center p-2 m-1 mt-7 sm:p-5 sm:m-5 gap-2 ">
        <div className="flex flex-col">
          <h1 className="font-bold text-2xl text-center sm:text-start sm:text-4xl drop-shadow">
            {facility.name}
          </h1>
          <h2 className="font-bold text-md text-center sm:text-start sm:text-xl drop-shadow text-gray-600 dark:text-gray-300">
            {facility.building} ⋅ Max Capacity: {facility.capacity}{' '}
          </h2>
          <Link
            href={map}
            target="_blank"
            className="text-center sm:text-start"
          >
            {facility.address} <ExternalLink className="inline-block scale-75" />
          </Link>
          <div className="hidden sm:flex">
            {facility.imagePath ? (
              <Image
                src={facility.imagePath}
                alt={facility.name}
                width={600}
                height={600}
                className="drop-shadow-md shadow-md "
              />
            ) : (
              <Image
                src="/logo.jpg"
                alt={facility.name}
                width={480}
                height={480}
                className=" drop-shadow-xl"
              />
            )}
          </div>
          <div className="flex justify-center sm:hidden">
            {facility.imagePath ? (
              <Image
                src={facility.imagePath}
                alt={facility.name}
                width={300}
                height={300}
                className="drop-shadow-md shadow-md "
              />
            ) : (
              <Image
                src="/logo.jpg"
                alt={facility.name}
                width={240}
                height={240}
                className=" drop-shadow-xl"
              />
            )}
          </div>
        </div>
        <div className="  p-4 gap-3 flex flex-col justify-center items-center  ">
          <Button asChild className="font-bold text-xl drop-shadow-lg ">
            <Link
              href={{
                pathname: '/reservation',
                query: {
                  id: facility.id,
                },
              }}
            >
              {' '}
              Request a rental{' '}
            </Link>
          </Button>

          <div className="p-4 border-4 my-3 mr-4 max-w-sm sm:max-w-md items-end justify-center sm:justify-between">
            <h1 className="font-bold text-2xl border-b-2">Pricing</h1>
            {facility.Category?.map((category) => (
                <div key={category.id} className="grid grid-cols-3   p-4">
                  <Tooltip>
                    <TooltipTrigger className="font-semibold text-left col-start-1  col-span-2 text-lg truncate">
                      {category.name}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className=" flex-wrap flex w-[240px]">
                        {category.description}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                  {facility.name === 'Laurel Stadium' ? (
                    <p className="justify-around align-bottom items-end font-semibold text-lg text-right self-end col-start-3 justify-items-end right-0 left-9 ">
                      ${category.price}
                    </p>
                  ) : (
                    <p className="justify-around align-bottom items-end font-semibold text-lg text-right self-end col-start-3 justify-items-end right-0 left-9 ">
                      ${category.price} / hr
                    </p>
                  )}
                </div>
              ))}
          </div>
          <Suspense fallback={<LoadingScreen />}>
            <ScrollArea className=" h-[400px] w-[340px] sm:h-[400px] sm:w-[480px] rounded-md border p-4">
              <h1 className="font-bold text-2xl border-b-2">Upcoming Events</h1>
              {facility.Events &&
                [...facility.Events]
                  .sort(
                    (a, b) =>
                      new Date(a.start!).getTime() - new Date(b.start!).getTime()
                  )
                  .map((event) => (
                    <div key={event.id}>
                      <div className="grid grid-cols-2 border-b   p-4">
                        <h3 className=" col-start-1">{event.title}</h3>
                        <p className="bg-transparent text-sm">
                          {moment(event.start).format(
                            'ddd, MMM Do YYYY,  h:mm a'
                          )}{' '}
                          {' to '} {moment(event.end!).format('h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))}
            </ScrollArea>
          </Suspense>
        </div>
      </div>
    </TooltipProvider>
  );
}
