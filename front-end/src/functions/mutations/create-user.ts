"use server";

import { revalidateTag } from "next/cache";
import bcrypt from "bcryptjs";

import { db } from "@local/db/client";

import type { InsertUser } from "../../../../packages/db/src/schema/schema";
import generateId from "@/functions/calculations/generate-id";
import { User } from "../../../../packages/db/src/schema/schema";

export default async function CreateUser(formData: InsertUser) {
  const password = formData.password!;
  const newHash = bcrypt.hashSync(password, 10);
  try {
    await db.insert(User).values({
      id: generateId(),
      email: formData.email,
      password: newHash,
      name: formData.name,
      tos: true,
    });
  } catch (error) {
    console.log(error);
    throw new Error();
  }
  revalidateTag("users");
  return "success";
}
