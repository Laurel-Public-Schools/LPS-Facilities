import type { Adapter } from "@auth/core/adapters";

import "drizzle-orm";

import { and, eq } from "@local/db";
import { db } from "@local/db/client";
import { accounts, Session, User, VerificationToken } from "@local/db/schema";

export function mySqlDrizzleAdapter(client: typeof db): Adapter {
  return {
    //@ts-ignore - authjs types are wrongrn {
    async createUser(data) {
      const id = crypto.randomUUID();

      const name = data?.name ?? data.email?.split("@")[0]!;

      console.log(name, data);
      // @ts-ignore -- this is a hack to make the adapter less picky about column names
      await client.insert(User).values({ ...data, name, id });
      const user = await client.query.User.findFirst({
        where: (user) => eq(user.id, id),
      });

      return user!;
    },
    //@ts-ignore - authjs types are wrong
    async getUser(data) {
      const thing =
        (await client.query.User.findFirst({
          where: (user) => eq(user.id, data),
        })) ?? null;

      return thing;
    },
    //@ts-ignore - authjs types are wrong
    async getUserByEmail(data) {
      const user =
        (await client.query.User.findFirst({
          where: (user) => eq(user.email, data),
        })) ?? null;

      return user;
    },
    //@ts-ignore - authjs types are wrong
    async createSession(data) {
      // @ts-ignore -- this is a hack to make the adapter less picky about column names
      await client.insert(Session).values(data);
      const session = await client.query.Session.findFirst({
        where: (session) => eq(session.sessionToken, data.sessionToken),
      });
      return session!;
    },
    //@ts-ignore - authjs types are wrong
    async getSessionAndUser(data) {
      let sessionAndUser = null;

      const res = await client.query.Session.findFirst({
        where: (session) => eq(session.sessionToken, data),
        with: {
          User: true,
        },
      });
      if (res) {
        const { User, ...rest } = res;
        sessionAndUser = { session: rest, User };
      }

      return sessionAndUser;
    },
    //@ts-ignore - authjs types are wrong
    async updateUser(data) {
      if (!data.id) {
        throw new Error("No user id.");
      }
      // @ts-ignore -- this is a hack to make the adapter less picky about column names
      await client.update(User).set(data).where(eq(User.id, data.id));

      const user = await client.query.User.findFirst({
        where: (user) => eq(user.id, data.id),
      });
      return user!;
    },
    //@ts-ignore - authjs types are wrong
    async updateSession(data) {
      await client
        .update(Session)
        // @ts-ignore -- this is a hack to make the adapter less picky about column names
        .set(data)
        .where(eq(Session.sessionToken, data.sessionToken));

      return await client.query.Session.findFirst({
        where: (session) => eq(session.sessionToken, data.sessionToken),
      });
    },
    //@ts-ignore - authjs types are wrong
    async linkAccount(rawAccount) {
      // @ts-ignore -- this is a hack to make the adapter less picky about column names
      await client.insert(accounts).values(rawAccount);
    },
    //@ts-ignore - authjs types are wrong
    async getUserByAccount(account) {
      const dbAccount =
        (await client.query.accounts.findFirst({
          where: (acc) =>
            and(
              eq(acc.providerAccountId, account.providerAccountId),
              eq(acc.provider, account.provider),
            ),
          with: {
            User: true,
          },
        })) ?? null;

      if (!dbAccount) {
        return null;
      }

      return dbAccount.User;
    },
    //@ts-ignore - authjs types are wrong
    async deleteSession(sessionToken) {
      const session =
        client.query.Session.findFirst({
          where: (session) => eq(session.sessionToken, sessionToken),
        }) ?? null;

      await client
        .delete(Session)
        .where(eq(Session.sessionToken, sessionToken));

      return session;
    },
    //@ts-ignore - authjs types are wrong
    async createVerificationToken(token) {
      // @ts-ignore -- this is a hack to make the adapter less picky about column names
      await client.insert(VerificationToken).values(token);

      return await client
        .select()
        .from(VerificationToken)
        .where(eq(VerificationToken.identifier, token.identifier))
        .then((res) => res[0]);
    },
    //@ts-ignore - authjs types are wrong
    async useVerificationToken(token) {
      try {
        const deletedToken =
          (await client
            .select()
            .from(VerificationToken)
            .where(
              and(
                eq(VerificationToken.identifier, token.identifier),
                eq(VerificationToken.token, token.token),
              ),
            )
            .then((res) => res[0])) ?? null;

        await client
          .delete(VerificationToken)
          .where(
            and(
              eq(VerificationToken.identifier, token.identifier),
              eq(VerificationToken.token, token.token),
            ),
          );

        return deletedToken;
      } catch (err) {
        throw new Error("No verification token found.");
      }
    },
    //@ts-ignore - authjs types are wrong
    async deleteUser(id) {
      const user = await client.query.User.findFirst({
        where: (user) => eq(user.id, id),
      });

      await client.delete(User).where(eq(User.id, id));

      return user;
    },
    //@ts-ignore - authjs types are wrong
    async unlinkAccount(account) {
      await client
        .delete(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, account.providerAccountId),
            eq(accounts.provider, account.provider),
          ),
        );

      return undefined;
    },
  };
}
