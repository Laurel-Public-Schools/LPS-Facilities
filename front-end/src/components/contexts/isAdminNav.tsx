//@ts-nocheck

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import React from 'react';

export default function IsAdminNav({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (
    session?.user.role === 'ADMIN_ADMIN' ||
    session?.user.role === 'CAL_ADMIN' ||
    session?.user.role === 'GR_ADMIN' ||
    session?.user.role === 'HS_ADMIN' ||
    session?.user.role === 'LMS_ADMIN' ||
    session?.user.role === 'WE_ADMIN' ||
    session?.user.role === 'SO_ADMIN' ||
    session?.user.role === 'SUP_ADMIN'
  ) {
    return <> {children} </>;
  } else {
    return null;
  }
}
