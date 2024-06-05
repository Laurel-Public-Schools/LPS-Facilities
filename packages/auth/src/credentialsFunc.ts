import 'server-only'
import {db,eq, schema} from "@local/db";

export default async function GetUser(email: string) {
  const [user] = await db.select().from(schema.User).where(eq(schema.User.email, email));
  return user;
}