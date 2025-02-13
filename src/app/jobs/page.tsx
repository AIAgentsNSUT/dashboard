import { withAuth } from "@workos-inc/authkit-nextjs";
import React from "react";

export default async function page() {
  const { user, permissions, role } = await withAuth();
  return (
    <div>
      <button>Create Jobs Button</button>
      <h1>Active Jobs List with a button to see past or inactive jobs</h1>
    </div>
  );
}
