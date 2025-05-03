import { DocumentIntegrityChecker } from "@/components/admin/document-integrity-checker"

export default function VerificarDocumentoPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6 text-[#4072b0]">Verificação de Integridade de Documentos</h1>
      <p className="mb-6 text-gray-600">
        Use esta ferramenta para verificar se um documento está completo e acessível. A ferramenta analisa o conteúdo do
        documento e verifica se ele contém texto real ou apenas placeholders.
      </p>

      <DocumentIntegrityChecker />
    </div>
  )
}
