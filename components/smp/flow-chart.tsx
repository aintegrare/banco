"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  MarkerType,
} from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Trash2,
  Save,
  Download,
  Share2,
  ZoomIn,
  ZoomOut,
  Target,
  Lightbulb,
  Users,
  MessageCircle,
  BarChart,
  Calendar,
} from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Nó personalizado para estratégia
const StrategyNode = ({ data }) => {
  return (
    <Card className="min-w-[180px] border-2 border-[#4b7bb5]">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <Target className="h-4 w-4 text-[#4b7bb5]" />
          <h3 className="text-sm font-medium">{data.label}</h3>
        </div>
        <p className="text-xs text-gray-500">{data.description}</p>
      </CardContent>
    </Card>
  )
}

// Nó personalizado para ideia
const IdeaNode = ({ data }) => {
  return (
    <Card className="min-w-[180px] border-2 border-amber-400">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-medium">{data.label}</h3>
        </div>
        <p className="text-xs text-gray-500">{data.description}</p>
      </CardContent>
    </Card>
  )
}

// Nó personalizado para audiência
const AudienceNode = ({ data }) => {
  return (
    <Card className="min-w-[180px] border-2 border-green-400">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <Users className="h-4 w-4 text-green-500" />
          <h3 className="text-sm font-medium">{data.label}</h3>
        </div>
        <p className="text-xs text-gray-500">{data.description}</p>
      </CardContent>
    </Card>
  )
}

// Nó personalizado para conteúdo
const ContentNode = ({ data }) => {
  return (
    <Card className="min-w-[180px] border-2 border-purple-400">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <MessageCircle className="h-4 w-4 text-purple-500" />
          <h3 className="text-sm font-medium">{data.label}</h3>
        </div>
        <p className="text-xs text-gray-500">{data.description}</p>
      </CardContent>
    </Card>
  )
}

// Nó personalizado para métricas
const MetricsNode = ({ data }) => {
  return (
    <Card className="min-w-[180px] border-2 border-red-400">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <BarChart className="h-4 w-4 text-red-500" />
          <h3 className="text-sm font-medium">{data.label}</h3>
        </div>
        <p className="text-xs text-gray-500">{data.description}</p>
      </CardContent>
    </Card>
  )
}

// Nó personalizado para cronograma
const TimelineNode = ({ data }) => {
  return (
    <Card className="min-w-[180px] border-2 border-blue-400">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="h-4 w-4 text-blue-500" />
          <h3 className="text-sm font-medium">{data.label}</h3>
        </div>
        <p className="text-xs text-gray-500">{data.description}</p>
      </CardContent>
    </Card>
  )
}

// Mapeamento de tipos de nós para componentes
const nodeTypes = {
  strategy: StrategyNode,
  idea: IdeaNode,
  audience: AudienceNode,
  content: ContentNode,
  metrics: MetricsNode,
  timeline: TimelineNode,
}

// Nós iniciais
const initialNodes = [
  {
    id: "1",
    type: "strategy",
    position: { x: 250, y: 0 },
    data: {
      label: "Estratégia Principal",
      description: "Aumentar engajamento nas redes sociais em 30% em 3 meses",
    },
  },
  {
    id: "2",
    type: "audience",
    position: { x: 100, y: 150 },
    data: {
      label: "Público-Alvo",
      description: "Jovens de 18-35 anos interessados em moda sustentável",
    },
  },
  {
    id: "3",
    type: "idea",
    position: { x: 400, y: 150 },
    data: {
      label: "Ideia de Campanha",
      description: "Série de posts mostrando o processo de produção sustentável",
    },
  },
  {
    id: "4",
    type: "content",
    position: { x: 100, y: 300 },
    data: {
      label: "Conteúdo Instagram",
      description: "Reels mostrando bastidores da produção + hashtags de sustentabilidade",
    },
  },
  {
    id: "5",
    type: "content",
    position: { x: 400, y: 300 },
    data: {
      label: "Conteúdo Facebook",
      description: "Artigos longos sobre impacto ambiental da moda fast-fashion",
    },
  },
  {
    id: "6",
    type: "metrics",
    position: { x: 250, y: 450 },
    data: {
      label: "Métricas de Sucesso",
      description: "Aumento de 30% em engajamento, 20% em seguidores, 15% em conversões",
    },
  },
  {
    id: "7",
    type: "timeline",
    position: { x: 550, y: 450 },
    data: {
      label: "Cronograma",
      description: "Lançamento em Junho, avaliação em Julho, ajustes em Agosto",
    },
  },
]

// Conexões iniciais
const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
    style: { stroke: "#4b7bb5" },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    animated: true,
    style: { stroke: "#4b7bb5" },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e2-4",
    source: "2",
    target: "4",
    animated: true,
    style: { stroke: "#4b7bb5" },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e3-5",
    source: "3",
    target: "5",
    animated: true,
    style: { stroke: "#4b7bb5" },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e4-6",
    source: "4",
    target: "6",
    animated: true,
    style: { stroke: "#4b7bb5" },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e5-6",
    source: "5",
    target: "6",
    animated: true,
    style: { stroke: "#4b7bb5" },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e3-7",
    source: "3",
    target: "7",
    animated: true,
    style: { stroke: "#4b7bb5" },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
]

export function FlowChart() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNodeType, setSelectedNodeType] = useState("strategy")
  const reactFlowWrapper = useRef(null)
  const [reactFlowInstance, setReactFlowInstance] = useState(null)

  const [nodeEditOpen, setNodeEditOpen] = useState(false)
  const [currentNode, setCurrentNode] = useState(null)
  const [editedLabel, setEditedLabel] = useState("")
  const [editedDescription, setEditedDescription] = useState("")

  // Função para adicionar conexão
  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          { ...params, animated: true, style: { stroke: "#4b7bb5" }, markerEnd: { type: MarkerType.ArrowClosed } },
          eds,
        ),
      ),
    [setEdges],
  )

  // Função para adicionar novo nó
  const onAddNode = useCallback(() => {
    const newNode = {
      id: `${nodes.length + 1}`,
      type: selectedNodeType,
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
      data: {
        label: `Novo ${selectedNodeType.charAt(0).toUpperCase() + selectedNodeType.slice(1)}`,
        description: "Clique para editar a descrição",
      },
    }
    setNodes((nds) => nds.concat(newNode))
  }, [nodes.length, selectedNodeType, setNodes])

  // Função para excluir nós selecionados
  const onDeleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected))
    setEdges((eds) => eds.filter((edge) => !edge.selected))
  }, [setNodes, setEdges])

  // Função para salvar o fluxo
  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject()
      localStorage.setItem("mindmap-flow", JSON.stringify(flow))
      alert("Mindmap salvo com sucesso!")
    }
  }, [reactFlowInstance])

  // Função para carregar o fluxo salvo
  useEffect(() => {
    const savedFlow = localStorage.getItem("mindmap-flow")
    if (savedFlow) {
      const flow = JSON.parse(savedFlow)
      if (flow.nodes && flow.edges) {
        setNodes(flow.nodes)
        setEdges(flow.edges)
      }
    }
  }, [setNodes, setEdges])

  const onNodeClick = useCallback((event, node) => {
    setCurrentNode(node)
    setEditedLabel(node.data.label)
    setEditedDescription(node.data.description)
    setNodeEditOpen(true)
  }, [])

  const saveNodeChanges = useCallback(() => {
    if (!currentNode) return

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === currentNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              label: editedLabel,
              description: editedDescription,
            },
          }
        }
        return node
      }),
    )

    setNodeEditOpen(false)
  }, [currentNode, editedLabel, editedDescription, setNodes])

  return (
    <div className="h-full w-full flex flex-col flex-1 bg-white">
      <div className="border-b p-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onAddNode}>
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
          <Button variant="outline" size="sm" onClick={onDeleteSelected}>
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir
          </Button>
          <Button variant="outline" size="sm" onClick={onSave}>
            <Save className="h-4 w-4 mr-1" />
            Salvar
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-1" />
            Compartilhar
          </Button>
        </div>
      </div>

      <div className="flex-1 h-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          onInit={setReactFlowInstance}
          onNodeClick={onNodeClick}
          className="bg-gray-50"
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />

          <Panel position="top-left" className="bg-white p-2 rounded-md shadow-md">
            <Tabs defaultValue="strategy" value={selectedNodeType} onValueChange={setSelectedNodeType}>
              <TabsList className="grid grid-cols-6 h-8">
                <TabsTrigger value="strategy" className="px-2 py-1">
                  <Target className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="idea" className="px-2 py-1">
                  <Lightbulb className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="audience" className="px-2 py-1">
                  <Users className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="content" className="px-2 py-1">
                  <MessageCircle className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="metrics" className="px-2 py-1">
                  <BarChart className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="timeline" className="px-2 py-1">
                  <Calendar className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </Panel>

          <Panel position="bottom-right" className="bg-white p-2 rounded-md shadow-md">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => reactFlowInstance?.zoomIn()}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => reactFlowInstance?.zoomOut()}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => reactFlowInstance?.fitView()}>
                <Target className="h-4 w-4" />
              </Button>
            </div>
          </Panel>
        </ReactFlow>
      </div>
      <Dialog open={nodeEditOpen} onOpenChange={setNodeEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar {currentNode?.type}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-sm font-medium">
                Título
              </label>
              <Input
                id="name"
                value={editedLabel}
                onChange={(e) => setEditedLabel(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right text-sm font-medium">
                Descrição
              </label>
              <Textarea
                id="description"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={saveNodeChanges}>
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
