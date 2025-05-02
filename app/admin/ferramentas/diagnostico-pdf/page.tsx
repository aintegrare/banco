import { PDFDiagnostics } from "@/components/admin/pdf-diagnostics"

export default function PDFDiagnosticsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#4072b0]">Diagnóstico de PDF</h1>
      </div>

      <p className="text-gray-600">
        Use esta ferramenta para diagnosticar problemas de acesso e extração de texto de arquivos PDF.
      </p>

      <PDFDiagnostics />
    </div>
  )
}
