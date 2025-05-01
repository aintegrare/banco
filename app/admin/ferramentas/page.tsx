import { PDFExtractorTester } from "@/components/admin/pdf-extractor-tester"

export default function FerramentasPage() {
  return (
    <div className="min-h-screen bg-[#f2f1ef]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#4072b0] mb-6">Ferramentas de Diagnóstico</h1>

        <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-6">
          <PDFExtractorTester />
        </div>
      </div>
    </div>
  )
}
