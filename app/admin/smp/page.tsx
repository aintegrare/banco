import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SocialMediaPlatform } from "@/components/smp/social-media-platform"
import { ReportGenerator } from "@/components/smp/report-generator"

export default function SMPPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6 text-[#4b7bb5]">Plataforma de Mídia Social</h1>

      <Tabs defaultValue="platform" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="platform">Plataforma</TabsTrigger>
          <TabsTrigger value="modules">Módulos</TabsTrigger>
          <TabsTrigger value="models">Modelos IA</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="platform" className="border rounded-md mt-6">
          <div className="h-[calc(100vh-220px)]">
            <SocialMediaPlatform />
          </div>
        </TabsContent>

        <TabsContent value="modules" className="mt-6">
          <div className="grid gap-4">
            <h2 className="text-xl font-semibold">Módulos</h2>
            <p className="text-gray-500">Gerencie os módulos disponíveis na plataforma.</p>
            {/* Conteúdo dos módulos */}
          </div>
        </TabsContent>

        <TabsContent value="models" className="mt-6">
          <div className="grid gap-4">
            <h2 className="text-xl font-semibold">Modelos de IA</h2>
            <p className="text-gray-500">Configure os modelos de inteligência artificial.</p>
            {/* Conteúdo dos modelos de IA */}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <div className="grid gap-4">
            <h2 className="text-xl font-semibold">Relatórios</h2>
            <p className="text-gray-500">Gere relatórios personalizados do seu conteúdo.</p>
            <div className="mt-4">
              <ReportGenerator />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
