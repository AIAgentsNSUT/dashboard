import { IJob } from "@/models/Job";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { PenIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIAgentsContent from "./AIAgentsContent";
import AgentConfigContent from "./AgentConfigContent";
import AIAgentsCanvas from "./AIAgentsCanvas";
import { connectDB } from "@/lib/db";
import AIAgent from "@/models/AIAgent";

export default async function JobWorkflow({ job }: { job: IJob }) {
  await connectDB();

  const aiAgents = JSON.stringify(
    await AIAgent.find({}).populate("inputs").populate("outputs")
  );

  return (
    <div className="flex h-full w-full bg-sidebar-accent rounded-md border-foreground border-2 border-dotted">
      {/* Left Side */}
      <div className="flex-1 border-r-2 border-dotted border-foreground">
        <AIAgentsCanvas job={job} />
      </div>

      {/* Right Side */}
      <div className="flex flex-col h-full max-w-[300px] w-full p-4">
        <div className="flex gap-2 justify-between">
          <h1 className="line-clamp-1 text-2xl font-bold">{job.title}</h1>
          <Link href={`/jobs/${job._id}/edit`}>
            <Button variant="outline">
              <PenIcon />
            </Button>
          </Link>
        </div>
        <Separator className="bg-foreground my-2" />

        <Tabs
          defaultValue="aiagents"
          className="flex flex-col h-[calc(100%-4rem)]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="aiagents">AI Agents</TabsTrigger>
            <TabsTrigger value="agentconfig">Agent Config</TabsTrigger>
          </TabsList>
          <TabsContent className="flex-1 overflow-y-auto" value="aiagents">
            <AIAgentsContent aiAgentsStr={aiAgents} />
          </TabsContent>
          <TabsContent className="flex-1 overflow-y-auto" value="agentconfig">
            <AgentConfigContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
