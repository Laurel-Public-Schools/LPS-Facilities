import {auth} from '@local/auth'

export async function IsAdmin() {
  const session = await auth()
  if (!session) return false
  if (
    session?.user.role === 'ADMIN_ADMIN' ||
    session?.user.role === 'CAL_ADMIN' ||
    session?.user.role === 'GR_ADMIN' ||
    session?.user.role === 'LHS_ADMIN' ||
    session?.user.role === 'LMS_ADMIN' ||
    session?.user.role === 'WE_ADMIN' ||
    session?.user.role === 'SO_ADMIN' ||
    session?.user.role === 'SUP_ADMIN'
  ) {
    return true;
  } else {
    return false;
  }
}