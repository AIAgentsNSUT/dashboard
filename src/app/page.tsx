import { withAuth } from "@workos-inc/authkit-nextjs";
import React from "react";

export default async function page() {
  const { user, role, permissions, organizationId } = await withAuth();
  return (
    <div>
      Dashboard after logging in for {user?.email} with role {role} and
      permissions {permissions}, organisation {organizationId}
    </div>
  );
}
