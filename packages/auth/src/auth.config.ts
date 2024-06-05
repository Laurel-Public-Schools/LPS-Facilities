import type { DefaultSession, NextAuthConfig } from "next-auth";
import azureAd from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import GetUser from "./credentialsFunc";
import { env } from "../env";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roles: "SUP_ADMIN" | "WE_ADMIN" | "SO_ADMIN" | "LHS_ADMIN" | "LMS_ADMIN" |"GR_ADMIN" | "USER" | "CAL_ADMIN" | "ADMIN_ADMIN"
    } & DefaultSession["user"];
  }
  interface JWT {
    id: string;
    roles: "SUP_ADMIN" | "WE_ADMIN" | "SO_ADMIN" | "LHS_ADMIN" | "LMS_ADMIN" |"GR_ADMIN" | "USER" | "CAL_ADMIN" | "ADMIN_ADMIN"
  }
  interface User {
    id?: string | undefined;
    roles: "SUP_ADMIN" | "WE_ADMIN" | "SO_ADMIN" | "LHS_ADMIN" | "LMS_ADMIN" |"GR_ADMIN" | "USER" | "CAL_ADMIN" | "ADMIN_ADMIN"
  }
}

export default {
  providers: [
    CredentialsProvider({
      name: 'Non LPS Staff Login',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'person@email.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        
        const user = await GetUser(credentials.email);
        
        if (
          user &&
          (await bcrypt.compare(credentials.password, user.password!))
        ) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            roles: user.role,
          };
        } else {
          return null;
        }
      },
    }),
    azureAd({
      clientId: env.AZURE_AD_CLIENT_ID,
      clientSecret: env.AZURE_AD_CLIENT_SECRET,
      tenantId: env.AZURE_TENANT_ID,
      profile(profile: any) {
        return {
          id: profile.oid,
          name: profile.name,
          email: profile.email,
          roles: profile.roles[0] || "USER",
        };
      },
      allowDangerousEmailAccountLinking: true,
    }),
  ],

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
    jwt({ token, account, user}) {
      if (user) {
        token.id = user.id as string;
        token.email = user.email;
        token.name = user.name;
        token.roles = user.roles;
        token.accessToken = account?.accessToken;
      }
      return token;
    },

    async session({ session, token, user }) {
      //@ts-expect-error - authjs types are wrong
      session.user.roles = token.role ? token.role : 'USER';
      //@ts-expect-error - authjs types are wrong
      session.user.id = token.id;
      //@ts-expect-error - authjs types are wrong
      session.accessToken = token.accessToken;
      return session;
    },
  },
} satisfies NextAuthConfig;
