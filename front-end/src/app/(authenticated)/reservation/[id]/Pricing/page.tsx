import IsUserReserv from '@/components/contexts/isUserReserv';
import UserResNav from '@/components/ui/userResNav';
import { ShowPayment } from '@/components/forms';

import React from 'react';

export default async function paymentPage({
  params,
}: {
  params: { id: number };
}) {
  const id = params.id;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_HOST}/api/reservation/${id}`,
    { cache: 'no-store' }
  );
  const reservation = await res.json();
  const { Category } = reservation;
  const user = reservation.User.name;
  const url = reservation.paymentUrl;

  const additionalFees = reservation.additionalFees;
  // const additionalFeesTotal = additionalFees.reduce(
  //   (sum: any, fee: any) => sum + fee.additionalFees,
  //   0
  // );

  const totalBasePrice = Category.price * reservation.totalHours;
  const totalCost = reservation.fees;
  const paid: boolean = reservation.paid;

  return (
    <IsUserReserv reservation={reservation}>
      <div>
        <UserResNav id={id} />
        <div className="justify-center flex flex-col sm:flex-row my-4 ">
          <div className="flex  flex-col border-gray-600 dark:border-white drop-shadow-xl shadow-xl   max-w-[900px] m-3 p-4 border-2">
            <h2 className="flex font-bold text-4xl text-gray-600 dark:text-gray-300">
              Pricing and Payments
            </h2>
            <div className=" my-5  gap-36">
              <div className="flex flex-shrink  my-2 p-2  justify-between text-xl border-b-2 border-b-gray-700 dark:border-b-white text-justify ">
                <table>
                  <thead>
                    <tr>
                      <th> Category: </th>
                      <th> Price: </th>
                      <th> Total Hours: </th>
                      <th> Total Base Price: </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-ellipsis overflow-hidden">
                        {' '}
                        {Category.name} -{' '}
                      </td>
                      <td> ${Category.price} /hr </td>
                      <td> {reservation.totalHours}</td>
                      <td> ${totalBasePrice}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex  my-2 p-2  justify-between text-xl  border-b-gray-700 dark:border-b-white text-justify ">
                <table>
                  <thead>
                    <tr>
                      <th> Additional Fees: </th>

                      <th> Price: </th>
                    </tr>
                  </thead>
                  <tbody>
                    {additionalFees.map((fee: any, index: any) => (
                      <tr key={index} className="m-2">
                        <td className="text-ellipsis overflow-hidden">
                          {fee.feesType}
                        </td>
                        <td>${fee.additionalFees}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex  my-2 p-2  justify-end text-xl border-b-2 border-b-gray-700 dark:border-b-white text-justify ">
                Total: $ {!paid ? totalCost : 'Paid'}
              </div>
              {!paid && <ShowPayment id={id} />}
            </div>
          </div>
        </div>
      </div>
    </IsUserReserv>
  );
}