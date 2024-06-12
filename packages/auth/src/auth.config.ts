import type { DefaultSession, NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";
import azureAd from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";

import { eq } from "@local/db";
import { db } from "@local/db/client";
import { User } from "@local/db/schema";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role:
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
  interface User {
    id?: string | undefined;
    role:
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

export default {
  providers: [
    CredentialsProvider({
      name: "Non LPS Staff Login",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "person@email.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        const [user] = await db
          .select()
          .from(User)
          .where(eq(User.email, credentials.email));
        console.log(user);
        if (user) {
          const valid = await bcrypt.compare(
            credentials.password,
            user.password!,
          );
          console.log(valid);
          if (valid) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          } else {
            console.log("bad password");
            return null;
          }
        } else {
          console.log("bad email");
          return null;
        }
      },
    }),

    azureAd({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_TENANT_ID,
      // profile(profile: any) {
      //   return {
      //     id: profile.oid,
      //     name: profile.name,
      //     email: profile.email,
      //     role: profile.roles[0] || "USER",
      //   };
      // },
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,

  trustHost: true,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session, token }) {
      // @ts-ignore - authjs types are wrong
      if (token?.data?.role && session.user) {
        // @ts-ignore - authjs types are wrong
        session.user.role = token.data.role;
      }
      return session;
    },
    jwt({ token, account, user }) {
      if (user) {
        token.data = user;
      }
      return token;
    },
    async authorized({ request, auth }) {
      if (auth) {
        return true;
      } else {
        return false;
      }
    },
  },
} satisfies NextAuthConfig;
