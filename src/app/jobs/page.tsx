import { Button } from "@/components/ui/button";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function page() {
  const { permissions } = await withAuth();

  return (
    <div>
      {permissions?.includes("jobs:create") && (
        <Button asChild>
          <Link href="/jobs/create">
            <PlusCircleIcon />
            Create Job
          </Link>
        </Button>
      )}
      <h1>Active Jobs List with a button to see past or inactive jobs</h1>
    </div>
  );
}
