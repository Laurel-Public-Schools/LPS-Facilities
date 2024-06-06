import type { DefaultSession, NextAuthConfig } from "next-auth";
import { Adapter } from "@auth/core/adapters";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import { decode, getToken } from "next-auth/jwt";


import { db, InferSelectModel, pgTable, PgTableFn, schema } from "@local/db";

import { env } from "../env";
import authConfig from "./auth.config";

export type { Session } from "next-auth";

const { User, accounts, Session, VerificationToken } = schema;
declare module "next-auth" {
  interface Session {
    User: {
      id: string;
      roles: "SUP_ADMIN" | "WE_ADMIN" | "SO_ADMIN" | "LHS_ADMIN" | "LMS_ADMIN" |"GR_ADMIN" | "USER" | "CAL_ADMIN" | "ADMIN_ADMIN"
    } & DefaultSession["user"];
  }
  interface JWT {
    id: string;
    roles: "SUP_ADMIN" | "WE_ADMIN" | "SO_ADMIN" | "LHS_ADMIN" | "LMS_ADMIN" |"GR_ADMIN" | "USER" | "CAL_ADMIN" | "ADMIN_ADMIN"
  }
}

declare module "@auth/core/adapters" {
  export interface AdapterUser extends InferSelectModel<typeof User> {
    roles: "SUP_ADMIN" | "WE_ADMIN" | "SO_ADMIN" | "LHS_ADMIN" | "LMS_ADMIN" |"GR_ADMIN" | "USER" | "CAL_ADMIN" | "ADMIN_ADMIN"
  }
}

type TableFnParams = Parameters<PgTableFn>;

function dumbAdapter(
  name: TableFnParams[0],
  columns: TableFnParams[1],
  extraConfig: TableFnParams[2],
) {
  switch (name) {
    case "user":
      return User;
    case "account":
      return accounts;
    case "session":
      return Session;
    case "verificationToken":
      return VerificationToken;
    default:
      return pgTable(name, columns, extraConfig);
  }
}
export const adapter = DrizzleAdapter(
  db,
  // @ts-ignore - this is a hack to make the adapter less picky about column names
  dumbAdapter as PgTableFn<undefined>,
) as Adapter;

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  
  adapter: adapter,

  ...authConfig,
  debug: true,
});

export { decode, getToken, authConfig };
