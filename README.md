# Banco de Contatos

Este projeto consiste em duas partes:

1. Uma aplicação Next.js para o frontend e API
2. Um Cloudflare Worker para gerenciar o banco de dados D1

## Implantação no Cloudflare Workers

Para implantar o Worker no Cloudflare:

1. Instale as dependências:
   \`\`\`
   npm install
   \`\`\`

2. Faça login no Cloudflare (se ainda não estiver logado):
   \`\`\`
   npx wrangler login
   \`\`\`

3. Implante o Worker:
   \`\`\`
   npx wrangler deploy
   \`\`\`

4. Verifique se o Worker está funcionando acessando a URL fornecida após a implantação.

## Configuração do Banco de Dados

Para configurar o banco de dados D1:

1. Execute o script SQL para criar as tabelas:
   \`\`\`
   npx wrangler d1 execute banco-contatos --file=schema.sql
   \`\`\`

2. Execute o script SQL para adicionar as categorias e outros dados de referência:
   \`\`\`
   npx wrangler d1 execute banco-contatos --file=schema-update.sql
   \`\`\`

## Desenvolvimento Local

Para desenvolvimento local com o Next.js, certifique-se de que a variável de ambiente `D1_DATABASE` esteja configurada no seu arquivo `.env.local`.

## Implantação no Vercel

Para implantar o frontend no Vercel:

1. Conecte seu repositório ao Vercel
2. Configure a variável de ambiente `D1_DATABASE` no projeto Vercel
3. Implante o projeto

## Estrutura do Projeto

- `/app`: Código do frontend Next.js
- `/components`: Componentes React
- `/src`: Código do Cloudflare Worker
- `schema.sql`: Script para criar as tabelas do banco de dados
- `schema-update.sql`: Script para adicionar dados de referência
- `wrangler.toml`: Configuração do Cloudflare Worker
