"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SocialMediaPlatformClient() {
  const [activeTab, setActiveTab] = useState("posts")

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Plataforma de Mídia Social</h1>
        <Button>Salvar</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="mindmap">Mindmap</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Editor de Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4 min-h-[300px]">
                  <h3 className="font-medium mb-2">Editor</h3>
                  <textarea className="w-full h-[200px] p-2 border rounded-md" placeholder="Digite seu post aqui..." />
                  <div className="flex justify-end mt-2">
                    <Button size="sm">Publicar</Button>
                  </div>
                </div>
                <div className="border rounded-md p-4 min-h-[300px]">
                  <h3 className="font-medium mb-2">Pré-visualização</h3>
                  <div className="bg-gray-100 rounded-md p-4 h-[200px]">Pré-visualização do post</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Posts Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-md p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Post de exemplo {i}</p>
                      <p className="text-sm text-gray-500">Publicado em: 01/05/2023</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] border rounded-md p-4 flex items-center justify-center">
                <p className="text-gray-500">Visualização da timeline será implementada em breve.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mindmap">
          <Card>
            <CardHeader>
              <CardTitle>Mindmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] border rounded-md p-4 flex items-center justify-center">
                <p className="text-gray-500">Visualização do mindmap será implementada em breve.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Exportar/Importar</h3>
                  <div className="flex gap-2">
                    <Button variant="outline">Exportar Dados</Button>
                    <Button variant="outline">Importar Dados</Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Sincronização</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <p>Conectado</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
