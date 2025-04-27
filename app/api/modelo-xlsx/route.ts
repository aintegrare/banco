import { NextResponse } from "next/server"
import * as XLSX from "xlsx"

export async function GET() {
  try {
    // Dados de exemplo
    const data = [
      {
        nome: "João Silva",
        email: "joao@exemplo.com",
        telefone: "(11) 98765-4321",
        cpf: "123.456.789-00",
        cidade: "São Paulo",
        categoria: "2",
        categoria_negocio: "7",
        temperatura: "3",
        valor_cliente: "3",
        preferencia_contato: "1",
        fonte_captacao: "2",
        ultimo_contato: "2023-04-15",
        data_descoberta: "2023-01-10",
        observacoes: "Cliente interessado em expandir negócios",
      },
      {
        nome: "Maria Oliveira",
        email: "maria@exemplo.com",
        telefone: "(21) 91234-5678",
        cpf: "987.654.321-00",
        cidade: "Rio de Janeiro",
        categoria: "3",
        categoria_negocio: "5",
        temperatura: "2",
        valor_cliente: "2",
        preferencia_contato: "3",
        fonte_captacao: "1",
        ultimo_contato: "2023-03-22",
        data_descoberta: "2023-02-05",
        observacoes: "Advogada especializada em direito empresarial",
      },
      {
        nome: "Carlos Santos",
        email: "carlos@exemplo.com",
        telefone: "(31) 99876-5432",
        cpf: "111.222.333-44",
        cidade: "Belo Horizonte",
        categoria: "1",
        categoria_negocio: "2",
        temperatura: "1",
        valor_cliente: "1",
        preferencia_contato: "2",
        fonte_captacao: "3",
        ultimo_contato: "2023-05-10",
        data_descoberta: "2023-03-15",
        observacoes: "Médico interessado em investimentos",
      },
    ]

    // Criar uma planilha
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contatos")

    // Converter para buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

    // Retornar como resposta para download
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="modelo-importacao.xlsx"',
      },
    })
  } catch (error) {
    console.error("Erro ao gerar arquivo XLSX:", error)
    return new NextResponse("Erro ao gerar arquivo XLSX", { status: 500 })
  }
}
