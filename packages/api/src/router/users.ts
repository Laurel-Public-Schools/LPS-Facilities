import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, eq, gte, or, sql } from "@local/db";
import { ReservationDate, User } from "@local/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const UserRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(User);
  }),

  ByEmail: protectedProcedure
    .input(z.object({ email: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select({
          id: User.id,
          name: User.name,
          email: User.email,
          role: User.role,
          tos: User.tos,
        })
        .from(User)
        .where(eq(User.email, input.email));
    }),
  ById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.User.findFirst({
        where: eq(User.id, input.id),
        columns: {
          password: false,
        },
        with: {
          Reservation: {
            with: {
              ReservationDate: {
                where: gte(ReservationDate.startDate, sql`now()`),
              },
              Facility: true,
              ReservationFees: true,
            },
          },
        },
      });
    }),
} satisfies TRPCRouterRecord;
