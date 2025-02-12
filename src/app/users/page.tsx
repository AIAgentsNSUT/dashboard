import "@radix-ui/themes/styles.css";
import { withAuth } from "@workos-inc/authkit-nextjs";
import {
  UsersManagement as WorkOSUsersManagement,
  WorkOsWidgets,
} from "@workos-inc/widgets";

export default async function UsersManagement() {
  const { accessToken } = await withAuth();
  return (
    <WorkOsWidgets
      theme={{
        appearance: "inherit",
        radius: "medium",
        accentColor: "gray",
      }}
      className="p-4 rounded-md"
    >
      <WorkOSUsersManagement authToken={accessToken} />
    </WorkOsWidgets>
  );
}
