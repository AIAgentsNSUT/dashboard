// TODO: OrganisationDetails
// import { withAuth } from "@workos-inc/authkit-nextjs";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function OrganisationDetails() {
  // const { organizationId } = await withAuth();
  // if (!organizationId) throw new Error("No organizationId");

  return (
    <a
      href="https://www.youtube.com/"
      target="_blank"
      className="bg-sidebar-accent flex items-center gap-4 p-2 rounded-md"
    >
      <Avatar>
        <AvatarImage src="https://placehold.co/50" />
        <AvatarFallback>Org</AvatarFallback>
      </Avatar>

      <h1 className="">Organisation Name</h1>
    </a>
  );
}
