"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="container flex items-center justify-center min-h-screen py-8 px-4">
      <Card className="w-full max-w-md border-red-200">
        <CardHeader className="bg-red-50">
          <CardTitle className="text-red-700">Ocorreu um erro</CardTitle>
          <CardDescription className="text-red-600">
            Desculpe, encontramos um problema ao carregar esta página.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-sm text-gray-600 mb-4">
            <p>Detalhes técnicos:</p>
            <p className="font-mono bg-gray-100 p-2 rounded mt-2 text-xs overflow-auto">
              {error?.message || "Erro desconhecido"}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Voltar para página inicial
          </Button>
          <Button onClick={() => reset()}>Tentar novamente</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
