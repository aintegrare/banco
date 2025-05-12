"use client"

import { motion } from "framer-motion"
import { Instagram, Facebook, Twitter, Linkedin, Youtube } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ModulesTab({
  selectedModule,
  setSelectedModule,
}: {
  selectedModule: string
  setSelectedModule: (id: string) => void
}) {
  const modules = [
    {
      id: "instagram",
      name: "Instagram",
      description: "Planejamento e gestão de conteúdo para Instagram",
      icon: <Instagram size={24} className="text-[#4b7bb5]" />,
      status: "active",
    },
    {
      id: "facebook",
      name: "Facebook",
      description: "Estratégias para engajamento no Facebook",
      icon: <Facebook size={24} className="text-[#4b7bb5]" />,
      status: "active",
    },
    {
      id: "twitter",
      name: "Twitter",
      description: "Gestão de campanhas no Twitter",
      icon: <Twitter size={24} className="text-[#4b7bb5]" />,
      status: "coming-soon",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      description: "Conteúdo corporativo para LinkedIn",
      icon: <Linkedin size={24} className="text-[#4b7bb5]" />,
      status: "coming-soon",
    },
    {
      id: "youtube",
      name: "YouTube",
      description: "Estratégia de conteúdo em vídeo",
      icon: <Youtube size={24} className="text-[#4b7bb5]" />,
      status: "coming-soon",
    },
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 flex flex-col h-full overflow-hidden">
      <div className="p-4 flex-shrink-0 border-b border-gray-200">
        <motion.div
          className="flex items-center justify-between mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-lg font-medium text-gray-800">Módulos de Mídia Social</h2>
        </motion.div>
      </div>

      <div className="flex-grow overflow-y-auto p-4">
        <div className="grid gap-4">
          {modules.map((module) => (
            <Card
              key={module.id}
              className={`cursor-pointer transition-all ${
                selectedModule === module.id ? "border-[#4b7bb5] shadow-md" : "hover:border-gray-300"
              }`}
              onClick={() => module.status === "active" && setSelectedModule(module.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {module.icon}
                    <CardTitle className="text-base">{module.name}</CardTitle>
                  </div>
                  {module.status === "coming-soon" && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Em breve</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{module.description}</CardDescription>
              </CardContent>
              {module.status === "active" && (
                <CardFooter className="pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[#4b7bb5] border-[#4b7bb5] hover:bg-[#4b7bb5] hover:text-white"
                  >
                    Selecionar
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
