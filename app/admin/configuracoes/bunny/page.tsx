import Link from "next/link"
import { ArrowLeft, Info } from "lucide-react"

export default function BunnyConfigPage() {
  return (
    <div className="min-h-screen bg-[#f2f1ef]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/admin/configuracoes" className="flex items-center text-[#4b7bb5] hover:text-[#3d649e]">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar para Configurações
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-[#4072b0] mb-6">Configuração do Bunny.net</h1>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-start mb-4">
            <Info className="h-5 w-5 text-[#4b7bb5] mr-2 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-[#4072b0]">Importante: Configuração da Pull Zone</h2>
              <p className="mt-2 text-gray-700">
                Para acessar os arquivos armazenados no Bunny Storage publicamente, é necessário configurar uma Pull
                Zone conectada à sua Storage Zone. Sem essa configuração, os arquivos só podem ser acessados através da
                API usando a chave de acesso.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-lg font-medium text-[#4072b0] mb-3">Como configurar uma Pull Zone:</h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>Acesse o painel de controle do Bunny.net e navegue até a seção de Storage.</li>
              <li>
                Selecione sua Storage Zone (<strong>{process.env.BUNNY_STORAGE_ZONE || "sua-storage-zone"}</strong>).
              </li>
              <li>Clique no botão "Connect Pull Zone" no canto superior direito.</li>
              <li>Você pode criar uma nova Pull Zone ou conectar uma existente.</li>
              <li>
                Após a conexão, seus arquivos estarão disponíveis publicamente através da URL:
                <br />
                <code className="bg-gray-100 px-2 py-1 rounded text-[#4072b0] block mt-1">
                  https://integrare.b-cdn.net/
                </code>
              </li>
            </ol>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-lg font-medium text-[#4072b0] mb-3">Configurações atuais:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Storage Zone:</p>
                <p className="bg-gray-100 px-3 py-2 rounded">{process.env.BUNNY_STORAGE_ZONE || "Não configurado"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">URL da API de Storage:</p>
                <p className="bg-gray-100 px-3 py-2 rounded text-xs md:text-sm break-all">
                  https://storage.bunnycdn.com/{process.env.BUNNY_STORAGE_ZONE || "sua-storage-zone"}/
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">URL pública (Pull Zone):</p>
                <p className="bg-gray-100 px-3 py-2 rounded text-xs md:text-sm break-all">
                  https://integrare.b-cdn.net/
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-lg font-medium text-[#4072b0] mb-3">Observações importantes:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                Servir arquivos diretamente de uma Storage Zone é uma violação dos Termos de Serviço do Bunny.net e pode
                resultar na suspensão da sua conta.
              </li>
              <li>Todo o tráfego voltado ao público deve ser servido através do CDN (Pull Zone).</li>
              <li>
                A Pull Zone oferece benefícios como cache global, proteção contra DDoS e opções de segurança adicionais.
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-[#4072b0] mb-4">Links úteis</h2>
          <ul className="space-y-2">
            <li>
              <a
                href="https://support.bunny.net/hc/en-us/articles/8561433879964-How-to-access-and-deliver-files-from-Bunny-Storage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4b7bb5] hover:text-[#3d649e] hover:underline"
              >
                Como acessar e entregar arquivos do Bunny Storage
              </a>
            </li>
            <li>
              <a
                href="https://bunny.net/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4b7bb5] hover:text-[#3d649e] hover:underline"
              >
                Painel de controle do Bunny.net
              </a>
            </li>
            <li>
              <a
                href="https://docs.bunny.net/reference/storage-api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4b7bb5] hover:text-[#3d649e] hover:underline"
              >
                Documentação da API do Bunny Storage
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
