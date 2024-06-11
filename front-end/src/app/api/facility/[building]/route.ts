import { NextResponse } from "next/server";
import { like } from "drizzle-orm";

import { db } from "@local/db/client";

import { BuildingQuery } from "@/lib/db/queries/facility";
import { serializeJSON } from "@/utils/serializeJSON";
import { Facility } from "../../../../../../packages/db/src/schema/schema";

export async function GET(
  request: Request,
  { params }: { params: { building: string } },
) {
  const facilityBuilding = params.building;

  const res = await db.query.Facility.findMany({
    where: like(Facility.building, facilityBuilding),
  });
  return NextResponse.json(serializeJSON(res));
}
