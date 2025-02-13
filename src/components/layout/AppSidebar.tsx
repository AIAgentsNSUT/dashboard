import { Construction, Home, User } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Suspense } from "react";
import {
  OrganisationDetails,
  OrganisationDetailsSkeleton,
} from "./OrganisationDetails";
import UserDetails from "./UserDetails";
import Link from "next/link";
import { withAuth } from "@workos-inc/authkit-nextjs";

interface Item {
  title: string;
  url: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const items: Item[] = [
  {
    title: "Home",
    url: "/",
    icon: Home,
    roles: ["admin", "employee", "hr", "senior-hr"],
  },
  {
    title: "Jobs",
    url: "/jobs",
    icon: Construction,
    roles: ["admin", "employee", "hr", "senior-hr"],
  },
  {
    title: "Manage Users",
    url: "/users",
    icon: User,
    roles: ["admin"],
  },
];

export async function AppSidebar() {
  const { role } = await withAuth();
  return (
    <Sidebar>
      <SidebarHeader>
        <Suspense fallback={<OrganisationDetailsSkeleton />}>
          <OrganisationDetails />
        </Suspense>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(
                (item) =>
                  item.roles.includes(role as UserRole) && (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserDetails />
      </SidebarFooter>
    </Sidebar>
  );
}
