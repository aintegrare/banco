"use client"

import { useEffect } from "react"
import * as pdfjs from "pdfjs-dist"

export function PDFWorkerLoader() {
  useEffect(() => {
    // Configurar o worker do PDF.js usando CDN
    const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc

    console.log("PDF.js worker configurado:", workerSrc)
  }, [])

  // Este componente não renderiza nada visualmente
  return null
}
