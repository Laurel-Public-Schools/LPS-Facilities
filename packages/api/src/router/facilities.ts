import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import {
  BuildingnameQuery,
  BuildingQuery,
  FacilitiesQuery,
  FacilityQuery,
} from "@local/db/queries";
import { Facility } from "@local/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const FacilityRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.Facility.findMany({
      with: {
        Category: true,
      },
    });
  }),
  allIds: publicProcedure.query(({ ctx }) => {
    return ctx.db.select({ id: Facility.id }).from(Facility);
  }),
  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input, ctx }) => {
      return FacilityQuery.execute({ id: input.id });
    }),
  byBuilding: publicProcedure
    .input(z.object({ building: z.string() }))
    .query(({ input, ctx }) => {
      return BuildingQuery.execute({ building: input.building });
    }),
  byBuildingName: publicProcedure
    .input(z.object({ building: z.string() }))
    .query(({ input, ctx }) => {
      return BuildingnameQuery.execute({ building: input.building });
    }),
};
