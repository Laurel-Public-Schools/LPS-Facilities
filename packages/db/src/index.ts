import type { PgSelect as Select } from "drizzle-orm/pg-core";
import {Pool} from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"
// import postgres from "postgres";

import * as main from "./schema/schema";

export * from "drizzle-orm";
export { pgTable, PgDatabase, type PgTableFn } from "drizzle-orm/pg-core";

const connectionString = process.env.DATABASE_URL!;

// const postgresSqlClient = postgres(connectionString);
const pool = new Pool({connectionString})

export const schema = { ...main };

export const db = drizzle(pool, {schema});
export type SelectCategory = typeof schema.Category.$inferSelect;
export type SelectReservationFees = typeof schema.ReservationFees.$inferSelect;

export type NewReservation = typeof schema.Reservation.$inferInsert;
export type SelectReservation = typeof schema.Reservation.$inferSelect;
export type InsertReservationDate = typeof schema.ReservationDate.$inferInsert;
export type SelectReservationDate = typeof schema.ReservationDate.$inferSelect;
export type SelectKey_User_role = typeof schema.User_role;
export type SelectEvents = typeof schema.Events.$inferSelect;
export type InsertEvents = typeof schema.Events.$inferInsert;
export type InsertFacility = typeof schema.Facility.$inferInsert;
export type SelectFacility = typeof schema.Facility.$inferSelect;
export type InsertUser = typeof schema.User.$inferInsert;
export type SelectUser = typeof schema.User.$inferSelect;