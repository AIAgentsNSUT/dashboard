import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { withAuth } from "@workos-inc/authkit-nextjs";
import useOrgStore from "@/server/organisation";

export async function OrganisationDetails() {
  const { organizationId } = await withAuth();
  if (!organizationId) throw new Error("No organizationId");

  const org = await useOrgStore.getState().getOrgByWorkOSId(organizationId);

  if (!org) throw new Error("No organisation found");
  return (
    <a
      href={org.website}
      target="_blank"
      className="bg-sidebar-accent flex items-center gap-4 p-2 rounded-md"
    >
      <Avatar className="w-[40px] h-[40px]">
        {/* Todo Implement CDN URL Here */}
        <AvatarImage src={org.logo} />
        <AvatarFallback>{org.name[0]}</AvatarFallback>
      </Avatar>

      <h1>{org.name}</h1>
    </a>
  );
}

export function OrganisationDetailsSkeleton() {
  return (
    <div className="bg-sidebar-accent flex items-center gap-4 p-2 rounded-md">
      <Skeleton className="min-w-[40px] h-[40px] aspect-square rounded-full" />

      <Skeleton className="w-full h-[40px] rounded-md" />
    </div>
  );
}
