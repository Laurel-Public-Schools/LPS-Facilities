import ResNav from '@/components/ui/reservationNav';
import React from 'react';
import EditPricingModal from '@/components/forms/paymentModal';
import EditCatModal from '@/components/forms/catModal';
import { PaidButton } from '@/components/ui/buttons';
import prisma from '@/lib/prisma';

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
  const {
    name,
    Facility,
    eventName,
    people,
    doorAccess,
    doorsDetails,
    techSupport,
    techDetails,
    InsuranceFiles,
    responsibleParty,
    primaryContact,
    insurance,
    phone,
    details,
    fees,
    approved,
    paid,
    createdAt,
    Event,
    Category,
    User,
    ReservationDate,
  } = reservation;
  const categories = await prisma.category.findMany({
    where: {
      facilityId: reservation.facilityId,
    },
  });
  const additionalFees = reservation.additionalFees;
  const additionalFeesTotal = additionalFees.reduce(
    (sum: any, fee: any) => sum + fee.additionalFees,
    0
  );
  const user = User.name;
  const totalBasePrice = Category.price * reservation.totalHours;
  const totalCost: number = additionalFeesTotal + totalBasePrice;

  return (
    <div>
      <ResNav id={id} facility={Facility} />
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
            <div className="flex-shrink flex  ">
              <EditCatModal id={id} categories={categories} {...reservation} />
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
            <div className="p-2 m-2 self-end flex justify-end">
              <EditPricingModal
                id={id}
                {...additionalFees}
                {...reservation}
                amount={totalCost}
                user={user}
              />
            </div>

            <div className="flex  my-2 p-2  justify-end text-xl border-b-2 border-b-gray-700 dark:border-b-white text-justify ">
              Total: ${totalCost}
            </div>
            {paid && (
              <div className="flex  my-2 p-2  justify-end text-xl border-b-2 border-b-gray-700 dark:border-b-white text-justify ">
                <span className="text-green-500">Paid</span>
              </div>
            )}
            {!paid && (
              <div className="flex  my-2 p-2  justify-end text-xl border-b-2 border-b-gray-700 dark:border-b-white text-justify ">
                <span className="text-red-500">Not Paid</span>
                <PaidButton id={id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}