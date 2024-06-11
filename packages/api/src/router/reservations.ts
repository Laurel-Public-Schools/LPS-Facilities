import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, count, eq, gte } from "@local/db";
import {
  GetAllReservations,
  GetApprovedDates,
  GetDateByID,
  GetRequests,
  GetReservationbyID,
  GetReservations,
  ReservationCountThisWeek,
} from "@local/db/queries";
import {
  CreateReservationDateArray,
  CreateReservationSchema,
  Facility,
  Reservation,
  ReservationDate,
} from "@local/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const ReservationRouter = {
  all: protectedProcedure.query(() => {
    return GetAllReservations.execute();
  }),
  requestCount: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .select({ value: count(Reservation.approved) })
      .from(Reservation)
      .where(eq(Reservation.approved, "pending"));
  }),
  thisWeek: protectedProcedure.query(() => {
    return ReservationCountThisWeek.execute();
  }),
  allRequests: protectedProcedure.query(() => {
    return GetRequests.execute();
  }),
  allApproved: protectedProcedure.query(() => {
    return GetReservations.execute();
  }),
  byId: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      return GetReservationbyID.execute({ id: input.id });
    }),
  approvedDates: protectedProcedure
    .input(z.object({ reservationId: z.number() }))
    .query(({ input }) => {
      return GetApprovedDates.execute({ reservationId: input.reservationId });
    }),
  dateById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      return GetDateByID.execute({ id: input.id });
    }),
  createReservation: protectedProcedure
    .input(CreateReservationSchema)
    .mutation(async ({ ctx, input }) => {
      const [newId] = await ctx.db
        .insert(Reservation)
        .values(input)
        .returning({ id: Reservation.id });
      return newId;
    }),

  usersReservations: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.db
        .select({
          eventName: Reservation.eventName,
          Facility: Facility.name,
          ReservationDate: ReservationDate.startDate,
          approved: Reservation.approved,
          id: Reservation.id,
        })
        .from(Reservation)
        .where(eq(Reservation.userId, input.userId))
        .innerJoin(Facility, eq(Reservation.facilityId, Facility.id))
        .innerJoin(
          ReservationDate,
          eq(Reservation.id, ReservationDate.reservationId),
        );
    }),

  createReservationDates: protectedProcedure
    .input(CreateReservationDateArray)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(ReservationDate).values(input);
    }),
} satisfies TRPCRouterRecord;
