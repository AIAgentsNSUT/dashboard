import { withAuth } from "@workos-inc/authkit-nextjs";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { rolesMapping } from "@/lib/data";
import { Button } from "../ui/button";
import { LogOutIcon } from "lucide-react";
import { signOut } from "@/lib/auth";

export default async function UserDetails() {
  const { user, role } = await withAuth();
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-sidebar-accent flex items-center gap-4 p-2 rounded-md">
        <Avatar>
          <AvatarImage src={user.profilePictureUrl!} />
          <AvatarFallback>
            {user.firstName![0] + user.lastName![0]}
          </AvatarFallback>
        </Avatar>

        <div className="overflow-hidden text-left flex-1 min-w-0">
          <p className="text-sm md:text-base font-medium text-sidebar-foreground truncate">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs md:text-sm text-sidebar-foreground truncate">
            {user.email}
          </p>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-inherit">
        <DropdownMenuLabel>
          <div className="overflow-hidden text-left flex-1 min-w-0">
            <p className="text-sm md:text-base font-medium text-sidebar-foreground truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs md:text-sm text-sidebar-foreground truncate">
              {user.email}
            </p>
            <Badge className="text-xs md:text-sm truncate">
              {role ? rolesMapping[role as UserRole] : "No role assigned"}
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="w-full">
          <Button
            variant={"destructive"}
            className="cursor-pointer"
            onClick={signOut}
          >
            <LogOutIcon />
            <p>Sign Out</p>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
