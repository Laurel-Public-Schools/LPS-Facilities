import type { TRPCRouterRecord } from "@trpc/server";
import { format } from "date-fns";
import { z } from "zod";

import { eq, gte } from "@local/db";
import {
  CreateEmailNotificationsSchema,
  EmailNotifications,
  ReservationDate,
  User,
} from "@local/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

const today = new Date();
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
                where: gte(
                  ReservationDate.startDate,
                  format(today, "yyyy-MM-dd"),
                ),
              },
              Facility: true,
              ReservationFees: true,
            },
          },
        },
      });
    }),
  GetEmailPrefsByAddress: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.EmailNotifications.findFirst({
      where: eq(EmailNotifications.email, ctx.session.User.email!),
    });
  }),
  DeleteEmailPrefsByAddress: protectedProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(EmailNotifications)
        .where(eq(EmailNotifications.email, input.email));
    }),
  UpdateEmailPrefs: protectedProcedure
    .input(CreateEmailNotificationsSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(EmailNotifications)
        .set(input)
        .where(eq(EmailNotifications.email, input.email));
    }),
  CreateEmailPrefs: protectedProcedure
    .input(CreateEmailNotificationsSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(EmailNotifications).values(input);
    }),
  GetAllEmailPrefs: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.EmailNotifications.findMany();
  }),
} satisfies TRPCRouterRecord;
