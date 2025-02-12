"use server";
import {
  getSignInUrl,
  signOut as signOutFunc,
} from "@workos-inc/authkit-nextjs";

// TODO: Implement Redis and Mongo DB here
const getOrganisationSignInUrl = async (hostname: string) => {
  return await getSignInUrl({
    organizationId: "org_01JKT4XCE5JXNXPH6NXN5Y8AAN",
  });
};

const signOut = async () => {
  return await signOutFunc({ returnTo: "/" });
};

export { getOrganisationSignInUrl, signOut };
