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
