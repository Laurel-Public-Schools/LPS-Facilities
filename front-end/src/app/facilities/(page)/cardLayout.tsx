'use client';
import FacilityCard from './facility_card';
import { useSearchParams } from 'next/navigation';

import * as React from 'react';
import type { RouterOutputs } from '@local/api';



export default function CardLayout(props: {
  facilities: Promise<RouterOutputs['facility']['all']>;
}) {

  const facilities = React.use(props.facilities)
  const searchParams = useSearchParams();
  let selectedBuilding: string | null = 'All';
  if (searchParams && searchParams.has('building')) {
    selectedBuilding = searchParams.get('building');
  }

  if (selectedBuilding !== 'All') {
    const filteredFacilities = facilities.filter(
      (facility) => facility.building === selectedBuilding
    );

    return (
      <>
        <div className="flex flex-col sm:grid  p-0  sm:grid-cols-2 gap-4 mt-0 pb-[1px] sm:pb-[150px] ">
          {filteredFacilities?.map((facility) => (
            <div key={facility.id} className="gap-3 m-2 show flex-1">
              <FacilityCard {...facility} />
            </div>
          ))}
        </div>
      </>
    );
  } else if (selectedBuilding === 'All' || null) {
    return (
      <>
        <div className="flex flex-col sm:grid  p-0  sm:grid-cols-2 gap-4 mt-0 pb-[1px] sm:pb-[150px] ">
          {facilities?.map((facility) => (
            <div key={facility.id} className="gap-3 m-2 show flex-1">
              <FacilityCard {...facility} />
            </div>
          ))}
        </div>
      </>
    );
  }
}
