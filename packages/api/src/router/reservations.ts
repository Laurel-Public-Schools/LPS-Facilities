import type {TRPCRouterRecord} from "@trpc/server";
import {z} from "zod";

import { GetReservations, GetRequests, GetReservationbyID, GetApprovedDates, GetDateByID,GetAllReservations } from "@local/db/queries";
import {CreateReservationSchema,  Reservation, CreateReservationDateArray, ReservationDate} from "@local/db/schema"
import { protectedProcedure, publicProcedure } from "../trpc";


export const ReservationRouter ={
  all: protectedProcedure.query(() => {
    return GetAllReservations.execute();
  }),
  allRequests: protectedProcedure.query(() => {
    return GetRequests.execute();
  }),
  allApproved: protectedProcedure.query(() => {
    return GetReservations.execute();
  }),
  byId: protectedProcedure.input(z.object({id: z.number()})).query(({input}) => {

    return GetReservationbyID.execute({id: input.id});
  }),
  approvedDates: protectedProcedure.input(z.object({reservationId: z.number()})).query(({input}) => {
    return GetApprovedDates.execute({reservationId: input.reservationId});
  }),
  dateById: protectedProcedure.input(z.object({id: z.number()})).query(({input}) => {
    return GetDateByID.execute({id: input.id});
  }),
  createReservation: protectedProcedure.input(CreateReservationSchema).mutation(async ({ctx, input}) => {
    const [newId] = await ctx.db.insert(Reservation).values(input).returning({id: Reservation.id});
    return newId;
  }),
  createReservationDates: protectedProcedure.input(CreateReservationDateArray).mutation(async ({ctx, input}) => {
    return ctx.db.insert(ReservationDate).values(input)
  })
}satisfies TRPCRouterRecord;


