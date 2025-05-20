-- Criar tabela de itens de projeto (independente da tabela de tarefas)
CREATE TABLE IF NOT EXISTS project_items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  phase VARCHAR(50) NOT NULL DEFAULT 'planejamento',
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  assigned_to VARCHAR(255),
  due_date TIMESTAMP WITH TIME ZONE,
  priority VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para melhorar a performance das consultas por projeto
CREATE INDEX IF NOT EXISTS project_items_project_id_idx ON project_items(project_id);

-- Criar índice para melhorar a performance das consultas por fase
CREATE INDEX IF NOT EXISTS project_items_phase_idx ON project_items(phase);
