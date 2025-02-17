"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Background,
  Controls,
  Connection,
  Node,
  Edge,
  ColorMode,
} from "@xyflow/react";
import { useTheme } from "next-themes";
import "@xyflow/react/dist/style.css";

import { IJob } from "@/models/Job";
import { IAIAgent } from "@/models/AIAgent";
import AIAgentNode from "./AIAgentNode";

// Node types definition
const nodeTypes = {
  aiAgent: AIAgentNode,
};

// Helper function to generate unique IDs
const getId = () => `node-${Date.now()}`;

interface AIAgentsCanvasProps {
  job: IJob;
}

function AIAgentsCanvas({ job }: AIAgentsCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition } = useReactFlow();
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  // Initialize nodes and edges from job.workflow
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
  }, [job, setNodes, setEdges]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      try {
        const agentData = JSON.parse(
          event.dataTransfer.getData("application/reactflow")
        ) as IAIAgent;

        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newNode = {
          id: getId(),
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
      } catch (error) {
        console.error("Error creating new node:", error);
      }
    },
    [screenToFlowPosition, setNodes]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      const sourceNode = nodes.find((node) => node.id === params.source);
      const targetNode = nodes.find((node) => node.id === params.target);

      if (!sourceNode || !targetNode) return;

      // Temp Fix
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
          deletable: true,
        };
        setEdges((eds) => [...eds, newEdge]);
      }
    },
    [nodes, setEdges]
  );

  if (!mounted) return null;

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        colorMode={theme as ColorMode}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

// Wrapper component with ReactFlowProvider
export default function AIAgentsCanvasWrapper({ job }: { job: IJob }) {
  return (
    <ReactFlowProvider>
      <AIAgentsCanvas job={job} />
    </ReactFlowProvider>
  );
}
