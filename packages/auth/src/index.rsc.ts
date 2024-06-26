import type { DefaultSession, NextAuthConfig } from "next-auth";
import { cache } from "react";
import { Adapter } from "@auth/core/adapters";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import { decode, getToken } from "next-auth/jwt";

import type { UserType } from "@local/db/schema";
import { pgTable, PgTableFn } from "@local/db";
import { db } from "@local/db/client";
import { accounts, Session, User, VerificationToken } from "@local/db/schema";

import { mySqlDrizzleAdapter } from "./adapter";
import authConfig from "./auth.config";

export type { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    User: {
      id: string;
      roles:
        | "SUP_ADMIN"
        | "WE_ADMIN"
        | "SO_ADMIN"
        | "LHS_ADMIN"
        | "LMS_ADMIN"
        | "GR_ADMIN"
        | "USER"
        | "CAL_ADMIN"
        | "ADMIN_ADMIN";
    } & DefaultSession["user"];
  }
  interface JWT {
    id: string;
    roles:
      | "SUP_ADMIN"
      | "WE_ADMIN"
      | "SO_ADMIN"
      | "LHS_ADMIN"
      | "LMS_ADMIN"
      | "GR_ADMIN"
      | "USER"
      | "CAL_ADMIN"
      | "ADMIN_ADMIN";
  }
}

declare module "@auth/core/adapters" {
  export interface AdapterUser extends UserType {
    roles:
      | "SUP_ADMIN"
      | "WE_ADMIN"
      | "SO_ADMIN"
      | "LHS_ADMIN"
      | "LMS_ADMIN"
      | "GR_ADMIN"
      | "USER"
      | "CAL_ADMIN"
      | "ADMIN_ADMIN";
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

const {
  handlers: { GET, POST },
  auth: defaultAuth,
  signIn,
  signOut,
} = NextAuth({
  // @ts-ignore - this is a hack to make the adapter less picky about column names
  adapter: mySqlDrizzleAdapter(db),

  ...authConfig,
});

const auth = cache(defaultAuth);

export { decode, getToken, authConfig, signIn, signOut, GET, POST, auth };
