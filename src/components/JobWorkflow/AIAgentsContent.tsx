"use client";
import React, { useState, useEffect } from "react";
import { IAIAgent } from "@/models/AIAgent";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

const AIAgentsContent = ({ aiAgentsStr }: { aiAgentsStr: string }) => {
  const [agents, setAgents] = useState<IAIAgent[]>([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const aiAgents = JSON.parse(aiAgentsStr);
        setAgents(aiAgents);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };
    fetchAgents();
  }, []);

  const onDragStart = (event: React.DragEvent, agent: IAIAgent) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(agent));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="space-y-2">
      {agents.map((agent) => (
        <Card
          key={agent._id?.toString()}
          className="cursor-move"
          draggable
          onDragStart={(e) => onDragStart(e, agent)}
        >
          <CardHeader>
            <CardTitle>{agent.name}</CardTitle>
            <CardDescription>{agent.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default AIAgentsContent;
