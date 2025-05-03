import { PDFExtractorTester } from "@/components/admin/pdf-extractor-tester"

export default function PDFExtractorPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6 text-[#4072b0]">Extrator de PDF</h1>
      <p className="mb-6 text-gray-600">
        Use esta ferramenta para testar a extração de texto de documentos PDF e verificar se o processamento está
        funcionando corretamente.
      </p>

      <PDFExtractorTester />
    </div>
  )
}
