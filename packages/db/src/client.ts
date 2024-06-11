import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

// import postgres from "postgres";

import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// const postgresSqlClient = postgres(connectionString);
const pool = new Pool({ connectionString });

export const db = drizzle(pool, { schema });
