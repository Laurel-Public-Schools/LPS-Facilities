"use server";

import { revalidatePath } from "next/cache";
import { TrashIcon } from "lucide-react";
import z from "zod";

import { CreateEmailNotificationsSchema } from "@local/db/schema";

import { api } from "@/trpc/server";

type CreateEmailNotifications = z.infer<typeof CreateEmailNotificationsSchema>;

export async function DeleteEmail(email: string) {
  try {
    await api.user.DeleteEmailPrefsByAddress({ email: email });
  } catch (error) {
    console.error(error);
  }
  revalidatePath("/admin/settings", "page");
}
