"use client";
import { IJob } from "@/models/Job";
import {
  Background,
  ColorMode,
  Connection,
  Controls,
  Edge,
  Node,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import React, { useCallback, useEffect, useState } from "react";
import AIAgentNode from "./AIAgentNode";
import { IAIAgent } from "@/models/AIAgent";
import { useTheme } from "next-themes";

export default function AIAgentsCanvasWrapper({ job }: { job: IJob }) {
  return (
    <ReactFlowProvider>
      <AIAgentsCanvas job={job} />
    </ReactFlowProvider>
  );
}

interface AIAgentsCanvasProps {
  job: IJob;
}
const AIAgentsCanvas: React.FC<AIAgentsCanvasProps> = ({ job }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { screenToFlowPosition } = useReactFlow();
  const { theme } = useTheme();

  useEffect(() => {
    if (job.workflow) {
      const flowNodes = job.workflow.nodes.map((node) => ({
        id: node.nodeId,
        type: "aiAgent",
        position: node.position,
        data: {
          agent: node.agentId,
          status: node.status,
          runtimeData: node.runtimeData,
        },
      }));

      const flowEdges = job.workflow.edges.map((edge) => ({
        id: edge.edgeId,
        source: edge.source,
        target: edge.target,
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);
    }
  }, [job]);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const agentData = JSON.parse(
        event.dataTransfer.getData("application/reactflow")
      ) as IAIAgent;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `node-${Date.now()}`,
        type: "aiAgent",
        position,
        data: {
          agent: agentData,
          inputs: agentData.inputs,
          outputs: agentData.outputs,
          status: "pending",
          runtimeData: [],
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition]
  );
  const onConnect = useCallback(
    (params: Connection) => {
      // Get source and target nodes
      const sourceNode = nodes.find(
        (node) => node.id === params.source
      ) as Node;
      const targetNode = nodes.find(
        (node) => node.id === params.target
      ) as Node;

      if (!sourceNode || !targetNode) return;

      // Get the output and input data types
      // TODO: This is a temporary solution. We need to improve this.
      // @ts-ignore
      const sourceOutput = sourceNode.data.outputs?.find(
        // @ts-ignore
        (output) => `output-${output._id}` === params.sourceHandle
      );
      // @ts-ignore
      const targetInput = targetNode.data.inputs?.find(
        // @ts-ignore
        (input) => `input-${input._id}` === params.targetHandle
      );

      // Check if the types match by identifier and version
      if (
        sourceOutput &&
        targetInput &&
        sourceOutput.identifier === targetInput.identifier &&
        sourceOutput.version === targetInput.version
      ) {
        const newEdge: Edge = {
          id: `edge-${Date.now()}`,
          source: params.source,
          target: params.target,
          sourceHandle: params.sourceHandle,
          targetHandle: params.targetHandle,
        };
        setEdges((eds) => [...eds, newEdge]);
      }
    },
    [nodes]
  );

  const nodeTypes = {
    aiAgent: AIAgentNode,
  };

  return (
    <ReactFlow
      colorMode={theme as ColorMode}
      nodes={nodes}
      edges={edges}
      onDrop={onDrop}
      onConnect={onConnect}
      onDragOver={(e) => e.preventDefault()}
      nodeTypes={nodeTypes}
      fitView
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
};
