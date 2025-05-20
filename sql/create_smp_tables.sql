-- Tabela para posts do SMP
CREATE TABLE IF NOT EXISTS smp_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  caption TEXT NOT NULL,
  hashtags TEXT[] DEFAULT '{}',
  theme TEXT,
  type TEXT NOT NULL,
  position JSONB NOT NULL DEFAULT '{"x": 0, "y": 0}'
);

-- Tabela para conexões entre posts
CREATE TABLE IF NOT EXISTS smp_connections (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL REFERENCES smp_posts(id) ON DELETE CASCADE,
  target TEXT NOT NULL REFERENCES smp_posts(id) ON DELETE CASCADE,
  UNIQUE(source, target)
);

-- Tabela para módulos
CREATE TABLE IF NOT EXISTS smp_modules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  metrics JSONB NOT NULL DEFAULT '{"engagement": 0, "reach": 0}',
  status TEXT NOT NULL DEFAULT 'active',
  settings JSONB NOT NULL DEFAULT '{}'
);

-- Tabela para modelos de IA
CREATE TABLE IF NOT EXISTS smp_ai_models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  capabilities TEXT[] DEFAULT '{}',
  metrics JSONB NOT NULL DEFAULT '{"accuracy": 0, "speed": 0, "cost": 0}',
  status TEXT NOT NULL DEFAULT 'active',
  settings JSONB NOT NULL DEFAULT '{}'
);

-- Tabela para preferências do usuário
CREATE TABLE IF NOT EXISTS smp_user_preferences (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, key)
);

-- Índices para melhorar a performance
CREATE INDEX IF NOT EXISTS idx_smp_posts_type ON smp_posts(type);
CREATE INDEX IF NOT EXISTS idx_smp_modules_category ON smp_modules(category);
CREATE INDEX IF NOT EXISTS idx_smp_modules_status ON smp_modules(status);
CREATE INDEX IF NOT EXISTS idx_smp_ai_models_category ON smp_ai_models(category);
CREATE INDEX IF NOT EXISTS idx_smp_ai_models_status ON smp_ai_models(status);
CREATE INDEX IF NOT EXISTS idx_smp_user_preferences_user_id ON smp_user_preferences(user_id);
