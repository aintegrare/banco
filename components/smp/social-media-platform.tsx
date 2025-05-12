"use client"

import { useState } from "react"
import { PostsCanvas } from "@/components/smp/posts-canvas"
import ChatInterface from "@/components/smp/chat-interface"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlowChart } from "@/components/smp/flow-chart"
import { TimelineView } from "@/components/smp/timeline-view"
import ModulesTab from "@/components/smp/modules-tab"
import AIModels from "@/components/smp/aimodels"
import { Card } from "@/components/ui/card"

export function SocialMediaPlatform() {
  const [activeTab, setActiveTab] = useState("posts")
  const [selectedModule, setSelectedModule] = useState("assistant")
  const [selectedModel, setSelectedModel] = useState("openai-gpt4o")
  const [messages, setMessages] = useState([])

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#4b7bb5]">Social Media Platform</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start rounded-none bg-white border-b">
                  <TabsTrigger
                    value="posts"
                    className="data-[state=active]:bg-[#4b7bb5] data-[state=active]:text-white"
                  >
                    Posts
                  </TabsTrigger>
                  <TabsTrigger
                    value="flowchart"
                    className="data-[state=active]:bg-[#4b7bb5] data-[state=active]:text-white"
                  >
                    Mindmap
                  </TabsTrigger>
                  <TabsTrigger
                    value="timeline"
                    className="data-[state=active]:bg-[#4b7bb5] data-[state=active]:text-white"
                  >
                    Timeline
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="m-0 p-0">
                  <div className="h-[calc(100vh-240px)]">
                    <PostsCanvas />
                  </div>
                </TabsContent>

                <TabsContent value="flowchart" className="m-0 p-0">
                  <div className="h-[calc(100vh-240px)] bg-white">
                    <FlowChart />
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="m-0 p-0">
                  <div className="h-[calc(100vh-240px)] bg-white">
                    <TimelineView />
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="h-full overflow-hidden">
              <Tabs defaultValue="chat" className="h-full">
                <TabsList className="w-full justify-start rounded-none bg-white border-b">
                  <TabsTrigger value="chat" className="data-[state=active]:bg-[#4b7bb5] data-[state=active]:text-white">
                    Chat
                  </TabsTrigger>
                  <TabsTrigger
                    value="modules"
                    className="data-[state=active]:bg-[#4b7bb5] data-[state=active]:text-white"
                  >
                    Módulos
                  </TabsTrigger>
                  <TabsTrigger
                    value="models"
                    className="data-[state=active]:bg-[#4b7bb5] data-[state=active]:text-white"
                  >
                    Modelos
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="m-0 p-0">
                  <div className="h-[calc(100vh-240px)] p-2 bg-white">
                    <ChatInterface messages={messages} setMessages={setMessages} selectedModule={selectedModule} />
                  </div>
                </TabsContent>

                <TabsContent value="modules" className="m-0 p-0">
                  <div className="h-[calc(100vh-240px)] p-2 bg-white">
                    <ModulesTab selectedModule={selectedModule} setSelectedModule={setSelectedModule} />
                  </div>
                </TabsContent>

                <TabsContent value="models" className="m-0 p-0">
                  <div className="h-[calc(100vh-240px)] p-2 bg-white">
                    <AIModels selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
