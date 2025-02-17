"use server";

import { WorkOS } from "@workos-inc/node";

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

export async function searchUserByEmail(email: string) {
  if (!email) {
    throw new Error("Email is required");
  }

  const users = await workos.userManagement.listUsers({
    email,
    limit: 10,
  });

  if (users.data.length === 0) {
    return null;
  }

  return JSON.stringify(users.data[0]);
}
