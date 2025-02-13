import { Button } from "@/components/ui/button";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { PlusCircleIcon } from "lucide-react";
import React from "react";

export default async function page() {
  const { user, permissions, role } = await withAuth();

  return (
    <div>
      {permissions?.includes("jobs:create") && (
        <Button>
          <PlusCircleIcon />
          Create Job
        </Button>
      )}
      <h1>Active Jobs List with a button to see past or inactive jobs</h1>
    </div>
  );
}
