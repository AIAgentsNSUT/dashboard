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

let nodeCounter = 0;
let edgeCounter = 0;
// Helper function to generate unique IDs
const getNodeId = () => `node-${nodeCounter++}`;
const getEdgeId = () => `edge-${edgeCounter++}`;

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
          id: getNodeId(),
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

      // Cycle detection logic remains the same
      const wouldCreateCycle = (
        source: string,
        target: string,
        existingEdges: Edge[]
      ): boolean => {
        if (source === target) return true;
        const outgoingEdges = existingEdges.filter(
          (edge) => edge.source === target
        );
        return outgoingEdges.some(
          (edge) =>
            edge.target === source ||
            wouldCreateCycle(source, edge.target, existingEdges)
        );
      };

      if (wouldCreateCycle(params.source, params.target, edges)) {
        console.warn("Cannot create connection: cycle detected");
        return;
      }

      // Function to process handle identifiers
      const getModifiedHandle = (handle: string | null | undefined) => {
        if (!handle) return null;
        const parts = handle.split("-");
        if (parts.length > 2) {
          parts.pop(); // Remove the last element
          parts.pop(); // Remove the second last element
        }
        return parts.join("-");
      };

      // Get modified handles
      const modifiedSourceHandle = getModifiedHandle(params.sourceHandle);
      const modifiedTargetHandle = getModifiedHandle(params.targetHandle);

      // Find source output
      // @ts-ignore
      const sourceOutput = sourceNode.data.outputs?.find(
        // @ts-ignore
        (output) => `output-${output._id}` === modifiedSourceHandle
      );

      // Find target input
      // @ts-ignore
      const targetInput = targetNode.data.inputs?.find(
        // @ts-ignore
        (input) => `input-${input._id}` === modifiedTargetHandle
      );

      // Type compatibility check
      if (
        !sourceOutput ||
        !targetInput ||
        sourceOutput.identifier !== targetInput.identifier ||
        sourceOutput.version !== targetInput.version
      ) {
        console.warn("Cannot create connection: incompatible types");
        return;
      }

      // Check if the target input is already connected
      const existingConnection = edges.find(
        (edge) => edge.targetHandle === params.targetHandle
      );

      setEdges((eds) => {
        // Remove existing connection if present
        const filteredEdges = eds.filter(
          (edge) => edge.targetHandle !== params.targetHandle
        );

        // Add new connection
        const newEdge: Edge = {
          id: getEdgeId(),
          source: params.source,
          target: params.target,
          sourceHandle: params.sourceHandle,
          targetHandle: params.targetHandle,
          deletable: true,
        };

        return [...filteredEdges, newEdge];
      });
    },
    [nodes, edges, setEdges]
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
