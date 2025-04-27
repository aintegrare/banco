const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

// Garantir que o diretório src existe
if (!fs.existsSync("src")) {
  fs.mkdirSync("src")
}

// Verificar se o arquivo index.ts existe
if (!fs.existsSync("src/index.ts")) {
  console.error("Erro: O arquivo src/index.ts não foi encontrado!")
  process.exit(1)
}

// Verificar se o arquivo wrangler.toml existe
if (!fs.existsSync("wrangler.toml")) {
  console.error("Erro: O arquivo wrangler.toml não foi encontrado!")
  process.exit(1)
}

try {
  console.log("Iniciando deploy do Worker...")
  execSync("npx wrangler deploy", { stdio: "inherit" })
  console.log("Deploy do Worker concluído com sucesso!")
} catch (error) {
  console.error("Erro durante o deploy do Worker:", error.message)
  process.exit(1)
}
