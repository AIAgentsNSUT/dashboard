import { withAuth } from "@workos-inc/authkit-nextjs";
import React from "react";

export default async function page() {
  const { user } = await withAuth();
  return <div>Landing Page of the Application</div>;
}
