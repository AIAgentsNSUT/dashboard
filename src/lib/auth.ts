"use server";
import { getOrganisationByHostname } from "@/server/organisation";
import {
  getSignInUrl,
  signOut as signOutFunc,
} from "@workos-inc/authkit-nextjs";

// TODO: Implement Redis and Mongo DB here
const getOrganisationSignInUrl = async (hostname: string) => {
  const org = await getOrganisationByHostname(hostname);
  if (!org) {
    throw new Error("Organisation not found");
  }
  return await getSignInUrl({
    organizationId: org.workosId,
  });
};

const signOut = async () => {
  return await signOutFunc({ returnTo: "/" });
};

export { getOrganisationSignInUrl, signOut };
