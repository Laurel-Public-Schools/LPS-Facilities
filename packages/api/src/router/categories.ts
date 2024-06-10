import type {TRPCRouterRecord} from "@trpc/server";
import {z} from "zod";

import { CategoryByFacility} from "@local/db/queries";
import {Category} from "@local/db/schema"
import { protectedProcedure, publicProcedure } from "../trpc";


export const CategoryRouter ={
  byFacility: protectedProcedure.input(z.object({facilityId: z.number(), name: z.string()})).query(({input}) => {
    return CategoryByFacility.execute({facilityId: input.facilityId, name: input.name});
  }),
}satisfies TRPCRouterRecord;