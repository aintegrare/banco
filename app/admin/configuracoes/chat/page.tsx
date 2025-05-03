import { PageHeader } from "@/components/layout/page-header"

export default function ChatConfigPage() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Configurações do Chat"
        description="Configure o comportamento e aparência do assistente virtual Jaque"
      />

      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="text-xl font-medium text-[#3d649e] mb-4">Configurações da Jaque</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Modelo da IA</h3>
            <p className="text-gray-600 mb-4">
              O assistente virtual Jaque utiliza o modelo Claude da Anthropic para gerar respostas inteligentes e
              contextualmente relevantes.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm text-blue-700">
                Modelo atual: <span className="font-medium">claude-3-7-sonnet-20250219</span> (Modelo mais recente com
                capacidades superiores)
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Parâmetros de Geração</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <p className="text-sm font-medium text-gray-700">Temperatura: 0.8</p>
                <p className="text-xs text-gray-500 mt-1">
                  Controla o nível de criatividade e aleatoriedade nas respostas. Valor alto para respostas mais
                  criativas e diversas.
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <p className="text-sm font-medium text-gray-700">Max Tokens: 4000</p>
                <p className="text-xs text-gray-500 mt-1">
                  Limite máximo de tokens para cada resposta, permitindo respostas detalhadas e abrangentes.
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <p className="text-sm font-medium text-gray-700">Top P: 0.95</p>
                <p className="text-xs text-gray-500 mt-1">
                  Controla a diversidade de tokens considerados, permitindo respostas variadas mas relevantes.
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <p className="text-sm font-medium text-gray-700">Top K: 50</p>
                <p className="text-xs text-gray-500 mt-1">
                  Limita a seleção aos 50 tokens mais prováveis, equilibrando criatividade e coerência.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Personalidade</h3>
            <p className="text-gray-600 mb-4">
              A Jaque foi configurada com uma personalidade otimizada para representar a Agência Integrare:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Profissional mas calorosa e acessível</li>
              <li>Criativa e inovadora em suas sugestões</li>
              <li>Analítica e estratégica, baseada em dados</li>
              <li>Proativa e entusiasta sobre marketing</li>
              <li>Especialista em marketing digital com conhecimento profundo</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-sm text-yellow-700">
              <strong>Nota:</strong> As configurações atuais foram otimizadas para extrair o máximo potencial do modelo
              Claude 3.7 Sonnet, equilibrando criatividade e precisão. Para personalizar ainda mais o comportamento da
              Jaque, edite o prompt do sistema no arquivo <code>app/api/chat/route.ts</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
