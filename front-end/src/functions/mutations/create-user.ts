"use server";

import { revalidateTag } from "next/cache";
import bcrypt from "bcryptjs";

import type { UserType as InsertUser } from "@local/db/schema";
import { db } from "@local/db/client";
import { User } from "@local/db/schema";

import generateId from "@/functions/calculations/generate-id";

interface IFormInput {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
  terms: boolean;
}
export default async function CreateUser(formData: IFormInput) {
  const password = formData.password;
  const newHash = bcrypt.hashSync(password, 10);
  try {
    await db.insert(User).values({
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
