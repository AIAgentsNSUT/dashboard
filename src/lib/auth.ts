"use server";
import { getSignInUrl } from "@workos-inc/authkit-nextjs";

// TODO: Implement Redis and Mongo DB here
const getOrganisationSignInUrl = async (hostname: string) => {
  return await getSignInUrl({
    organizationId: "org_01JKT4XCE5JXNXPH6NXN5Y8AAN",
  });
};

export { getOrganisationSignInUrl };
