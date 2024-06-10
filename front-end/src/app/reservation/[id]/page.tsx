import {api} from "@/trpc/server"
import { notFound } from "next/navigation";


export default async function reservationPage({
  params,
}: {
  params: { id: number };
}) {
  const reservation = await api.reservation.byId({ id: params.id });
  if (!reservation) return notFound();
  const {
    name,
    Facility,
    primaryContact,
    phone,
    details,
    Category,
  } = reservation;


  return (
    <div className="space-y-7 ">
      <div>
        <h2 className="text-2xl text-muted-foreground"> Summary </h2>
      </div>
      <div className="hidden sm:flex flex-col justify-between flex-wrap">
        <div className="flex flex-row  justify-between text-lg border-b-2   text-justify ">
          Primary Contact: {primaryContact} <div> {name}</div>
        </div>
        <div className="flex flex-row  justify-between text-lg border-b-2   text-justify ">
          Contact Number: <div>{phone}</div>
        </div>
        <div className="flex flex-row  justify-between text-lg border-b-2   text-justify ">
          Contact Email: <div>{reservation.User.email}</div>
        </div>
        <div className="flex flex-row  sm:justify-between text-lg border-b-2   text-justify ">
          Requested Category:{' '}
          <div className="truncate overflow-ellipsis text max-w-sm">
            {Category.name}
          </div>
        </div>
        <div className="flex flex-row my-10 text-ellipsis flex-wrap gap-10 justify-between text-xl border-b-2  text-justify">
          Description:{' '}
          <div className="text-left ml-10 flex text-md text-ellipsis">
            {details}{' '}
          </div>
        </div>
      </div>
    </div>
  );
}
