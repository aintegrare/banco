-- Tabela para armazenar os posts
CREATE TABLE IF NOT EXISTS smp_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  caption TEXT NOT NULL,
  hashtags TEXT[] DEFAULT '{}',
  theme TEXT,
  type TEXT NOT NULL CHECK (type IN ('PLM', 'PLC')),
  position_x FLOAT NOT NULL,
  position_y FLOAT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para armazenar as conexões entre posts
CREATE TABLE IF NOT EXISTS smp_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES smp_posts(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES smp_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(source_id, target_id)
);

-- Índices para melhorar a performance
CREATE INDEX IF NOT EXISTS idx_smp_posts_type ON smp_posts(type);
CREATE INDEX IF NOT EXISTS idx_smp_connections_source ON smp_connections(source_id);
CREATE INDEX IF NOT EXISTS idx_smp_connections_target ON smp_connections(target_id);
