/***
 *  Default Middleware for the application
 *  Middleware is an edge function that runs before any req to specified paths throughout the application
 * 	Middleware can be used to redirect, rewrite, or block reqs
 * 	Middleware can be used to check for authentication, authorization, or other conditions
 *  @see https://nextjs.org/docs/app/building-your-application/routing/middleware
 */

import NextAuth from "next-auth";
import {  NextResponse } from 'next/server';
import authConfig from "@local/auth/auth.config";
const { auth: middleware } = NextAuth(authConfig);
const blockedCountries = [
  'CN',
  'RU',
  'KP',
  'IR',
  'SY',
  'CU',
  'IQ',
  'LY',
  'SD',
  'VN',
  'RO',
];

// wrap default middleware with withAuth to provide NextAuth Token context to middleware
export default middleware((req) => {
    const response = NextResponse.next();
    const token = req.auth;
    

    /**
     * Geo IP Blocking for specific countries.
     * As a school district, we are more vulnerable to cyber attacks from foreign countries.
     * This is a simple way to block reqs from countries that we do not expect to receive reqs from.
     * @param {string} country - The country code of the req.
     * @param {string[]} blockedCountries - An array of country codes to block.
     */
    const country = req.geo?.country;
    if (country && blockedCountries.includes(country)) {
      return NextResponse.redirect(new URL('/404', req.url));
    }

    /**
     * A path was changed during some refactoring, and this
     * redirect catches the old path and redirects to the new one.
     */
    if (req.nextUrl.pathname.startsWith('/admin/reservations/')) {
      const path = req.nextUrl.pathname;
      const segments = path.split('/');
      const index = segments.findIndex((segment) => segment === 'reservations');
      const paramValue = segments[index + 1];
      if (paramValue) {
        return NextResponse.rewrite(
          new URL(`/reservation/${paramValue}`, req.url)
        );
      }
    }

    if (req.nextUrl.pathname.startsWith('/api/users') && token) {
      if (token.user.role === 'USER' || token.user.role === null) {
        return new Response('Unauthorized', { status: 401 });
      }
    }

    // Redirects to the 404 page if a user tries to access the admin dashboard without being an admin.
    if (req.nextUrl.pathname.startsWith('/admin') && token) {
      if (token.user.role === 'USER' || token.user.role === null) {
        return NextResponse.redirect(new URL('/404', req.url));
      }
    }
  }
)


// The matcher property is used to specify which paths the middleware should run on.
export const config = {
  matcher: [
    // {
    //   source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
    //   missing: [
    //     { type: "header", key: "next-router-prefetch" },
    //     { type: "header", key: "purpose", value: "prefetch" },
    //   ],
    // },
    '/api/account',
    '/api/users',
    '/api/requests',
    '/api/reservation',
    '/api/reservation/:path*',
    '/reservation',
    '/reservation/:path*',
    '/admin/reservations/:path*',
    '/admin/:path*',
  ],
};
