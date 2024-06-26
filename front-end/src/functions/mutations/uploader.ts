"use server";

import { revalidatePath } from "next/cache";

export default async function Uploader(body: any, id: any) {
  const file = body.files[0];
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_HOST + "/api/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name as string,
        fileType: file.type,
        fileSize: file.size,
        id: id,
      }),
    });

    const { putUrl, getUrl } = await res.json();

    const uploadResponse = await fetch(putUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    return { status: uploadResponse.ok, uploadedURL: getUrl };
  } catch (error) {
    throw new Error("Couldn't upload file", { cause: error });
  } finally {
    revalidatePath("/reservation/[id]", "page");
  }
}
