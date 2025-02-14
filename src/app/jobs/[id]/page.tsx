import { Button } from "@/components/ui/button";
import { PenIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function page({ params }: { params: { id: string } }) {
  return (
    <div>
      Job with {params.id}
      <Button asChild>
        <Link href={`/jobs/${params.id}/edit`}>
          <PenIcon />
          Edit Job
        </Link>
      </Button>
    </div>
  );
}
