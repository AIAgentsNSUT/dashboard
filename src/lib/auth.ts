import "server-only";
import useOrgStore from "@/server/organisation";
import {
  getSignInUrl,
  signOut as signOutFunc,
} from "@workos-inc/authkit-nextjs";

const getOrganisationSignInUrl = async (hostname: string) => {
  "use server";
  const org = await useOrgStore.getState().getOrgByHostname(hostname);

  if (!org) {
    throw new Error("Organisation not found");
  }
  return await getSignInUrl({
    organizationId: org.workosId,
  });
};

const signOut = async () => {
  "use server";
  return await signOutFunc({ returnTo: "/" });
};

export { getOrganisationSignInUrl, signOut };
