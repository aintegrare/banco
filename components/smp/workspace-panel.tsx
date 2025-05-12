"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlowChart } from "@/components/smp/flow-chart"
import { TimelineView } from "@/components/smp/timeline-view"
import { PostsCanvas } from "@/components/smp/posts-canvas"

interface WorkspacePanelProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function WorkspacePanel({ activeTab, onTabChange }: WorkspacePanelProps) {
  return (
    <div className="h-full flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden">
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex flex-col h-full">
        <div className="border-b border-gray-200">
          <TabsList className="h-10 w-full justify-start rounded-none bg-transparent">
            <TabsTrigger value="posts" className="data-[state=active]:bg-white rounded-none border-r border-gray-200">
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="flowchart"
              className="data-[state=active]:bg-white rounded-none border-r border-gray-200"
            >
              Estratégia
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="data-[state=active]:bg-white rounded-none border-r border-gray-200"
            >
              Calendário
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="posts" className="flex-1 p-0 m-0">
          <PostsCanvas />
        </TabsContent>

        <TabsContent value="flowchart" className="flex-1 p-0 m-0">
          <FlowChart />
        </TabsContent>

        <TabsContent value="timeline" className="flex-1 p-0 m-0">
          <TimelineView />
        </TabsContent>
      </Tabs>
    </div>
  )
}
