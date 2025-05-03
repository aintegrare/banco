import { UrlDiagnostics } from "@/components/admin/url-diagnostics"

export default function DiagnosticoUrlPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6 text-[#4072b0]">Diagnóstico de URL</h1>
      <p className="mb-6 text-gray-600">
        Use esta ferramenta para diagnosticar problemas com URLs de documentos e arquivos. Ela verifica se a URL contém
        o prefixo incorreto "zona-de-guardar" e testa se a URL é acessível.
      </p>

      <UrlDiagnostics />
    </div>
  )
}
