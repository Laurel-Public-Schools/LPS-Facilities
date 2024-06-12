import type { Reservation } from "@/lib/types";
import React from "react";

export const pageSum = (reservation: Reservation) => {
  return (
    <div className="my-5 hidden justify-between gap-48 border p-2 sm:inline-block">
      <div className="hidden pb-4 sm:flex">
        <h2 className="gap-y-4 text-xl font-bold text-gray-600 dark:text-gray-300">
          {" "}
          Summary{" "}
        </h2>
      </div>
      <div className="flex flex-row justify-between border-b-2 text-justify text-lg">
        Primary Contact: {reservation.primaryContact}{" "}
        <div> {reservation.name}</div>
      </div>
      <div className="flex flex-row justify-between border-b-2 text-justify text-lg">
        Contact Number: <div>{reservation.phone}</div>
      </div>
      <div className="flex flex-row justify-between border-b-2 text-justify text-lg">
        Contact Email: <div>{reservation.User?.email}</div>
      </div>
      <div className="flex max-w-[600px] flex-row border-b-2 text-justify text-lg sm:justify-between">
        Requested Category:{" "}
        <div className="text ml-2 max-w-xs truncate overflow-ellipsis">
          {reservation.Category?.name}
        </div>
      </div>
      <div className="my-10 flex max-w-[600px] flex-row flex-wrap justify-between gap-10 text-ellipsis border-b-2 text-justify text-xl">
        Description:{" "}
        <div className="text-md ml-10 flex text-ellipsis text-left">
          {reservation.details}{" "}
        </div>
      </div>
      {reservation.techSupport && (
        <div className="my-10 flex max-w-[600px] flex-row flex-wrap justify-between gap-10 text-ellipsis border-b-2 text-justify text-xl">
          Tech Support Requested:
          <div className="text-md ml-10 flex max-w-[600px] text-ellipsis text-left">
            {reservation.techDetails}{" "}
          </div>
        </div>
      )}
      {reservation.doorAccess && (
        <div className="my-10 flex max-w-[600px] flex-row flex-wrap justify-between gap-10 text-ellipsis border-b-2 text-justify text-xl">
          Door Access Requested:
          <div className="text-md ml-10 flex text-ellipsis text-left">
            {reservation.doorsDetails}{" "}
          </div>
        </div>
      )}
    </div>
  );
};
