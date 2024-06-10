import ReservationForm from '@/components/forms/reservationForm2';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {auth} from "@local/auth"
const Loading = () => {
  return (
    <div>
      <Skeleton className=" h-20 w-auto" />
      <Skeleton className=" h-96 w-auto" />
      <Skeleton className=" h-20 w-auto" />
    </div>
  );
};

export default async function reservationPage() {
  const session = await auth();

  return (
    <section className="justify-center flex flex-col sm:flex-row my-4">
      <Suspense fallback={<Loading />}>
        <ReservationForm email={session?.user.email!} userId={session?.user.id!} />
      </Suspense>
    </section>
  );
}
