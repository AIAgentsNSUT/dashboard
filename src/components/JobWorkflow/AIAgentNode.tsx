import { Handle, Position } from "@xyflow/react";
import React from "react";
import { IAIAgent } from "@/models/AIAgent";
import { IAIAgentData } from "@/models/AIAgentData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface AIAgentNodeProps {
  id: string;
  data: {
    agent: IAIAgent;
    inputs: IAIAgentData[];
    outputs: IAIAgentData[];
    status: string;
  };
}

export default function AIAgentNode({ id: nodeId, data }: AIAgentNodeProps) {
  const { agent, inputs, outputs, status } = data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{agent.name}</CardTitle>
        <CardDescription>
          <span
            className={`text-xs px-2 py-1 rounded-full inline-block
          ${
            status === "completed"
              ? "bg-green-100 text-green-800"
              : status === "running"
              ? "bg-blue-100 text-blue-800"
              : status === "failed"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }`}
          >
            {status}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex justify-between gap-4">
        {/* Input Handles */}
        <div className="text-xs space-y-4">
          {inputs.map((input) => (
            <div
              key={input._id?.toString()}
              className="relative flex items-center"
            >
              <Handle
                type="target"
                position={Position.Left}
                id={`input-${input._id}-${nodeId}`}
                className="w-3 h-3 bg-gray-400"
                style={{ left: -20 }}
                data-type={`${input.identifier}-${input.version}`}
              />
              <div className="pl-1 text-gray-600">
                <div>{input.name}</div>
                <div className="text-[10px] text-gray-400">
                  {input.type} ({input.identifier} v{input.version})
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Output Handles */}
        <div className="text-xs space-y-4">
          {outputs.map((output) => (
            <div
              key={output._id?.toString()}
              className="relative flex items-center justify-end"
            >
              <div className="pr-1 text-right text-gray-600">
                <div>{output.name}</div>
                <div className="text-[10px] text-gray-400">
                  {output.type} ({output.identifier} v{output.version})
                </div>
              </div>
              <Handle
                type="source"
                position={Position.Right}
                id={`output-${output._id}-${nodeId}`}
                className="w-3 h-3 bg-gray-400"
                style={{ right: -20 }}
                data-type={`${output.identifier}-${output.version}`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
