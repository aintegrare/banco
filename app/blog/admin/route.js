import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ message: "Esta rota está funcionando corretamente" })
}
