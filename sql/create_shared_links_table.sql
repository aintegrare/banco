-- Criar tabela para links compartilhados
CREATE TABLE IF NOT EXISTS shared_links (
  id SERIAL PRIMARY KEY,
  token UUID NOT NULL UNIQUE,
  path TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_password_protected BOOLEAN DEFAULT FALSE,
  password TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  access_count INTEGER DEFAULT 0
);

-- Criar índice para busca rápida por token
CREATE INDEX IF NOT EXISTS idx_shared_links_token ON shared_links(token);

-- Criar índice para expiração
CREATE INDEX IF NOT EXISTS idx_shared_links_expires_at ON shared_links(expires_at);
