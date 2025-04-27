export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      console.log("Configurando D1 para ambiente de desenvolvimento")

      // Configurar um mock do D1 para desenvolvimento local
      const mockD1 = {
        prepare: () => {
          return {
            bind: (...args: any[]) => ({
              first: async () => ({ total: 0 }),
              all: async () => ({ results: [] }),
              run: async () => ({}),
            }),
            first: async () => ({ total: 0 }),
            all: async () => ({ results: [] }),
            run: async () => ({}),
          }
        },
        batch: async (queries: any[]) => [],
        exec: async (query: string) => ({ results: [] }),
      }

      // Atribuir o mock ao ambiente global
      ;(global as any).__d1Database = mockD1

      // Injetar no process.env para compatibilidade
      ;(process.env as any).D1_DATABASE = mockD1
    } catch (error) {
      console.error("Erro ao configurar D1:", error)
    }
  }
}
