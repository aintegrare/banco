-- Criar tabela de tarefas
CREATE TABLE IF NOT EXISTS tasks (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('backlog', 'todo', 'in_progress', 'review', 'done')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  project_id BIGINT,
  assigned_to TEXT,
  due_date TIMESTAMPTZ,
  estimated_hours INTEGER,
  actual_hours INTEGER,
  order_position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_order_position ON tasks(order_position);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir algumas tarefas de exemplo
INSERT INTO tasks (title, description, status, priority, assigned_to, due_date, estimated_hours) VALUES
('Criar nova landing page', 'Desenvolver landing page para campanha de marketing digital', 'in_progress', 'high', 'estrategia@designmarketing.com.br', NOW() + INTERVAL '7 days', 8),
('Revisar conteúdo do blog', 'Revisar e corrigir posts recentes do blog da empresa', 'todo', 'medium', 'estrategia@designmarketing.com.br', NOW() + INTERVAL '3 days', 4),
('Otimizar SEO do site', 'Implementar melhorias de SEO conforme relatório de auditoria', 'backlog', 'low', 'estrategia@designmarketing.com.br', NOW() + INTERVAL '14 days', 12),
('Reunião com cliente XYZ', 'Apresentar resultados da campanha de marketing do último trimestre', 'done', 'high', 'estrategia@designmarketing.com.br', NOW() - INTERVAL '1 day', 2),
('Criar posts para redes sociais', 'Desenvolver conteúdo para Instagram e Facebook da próxima semana', 'in_progress', 'medium', 'estrategia@designmarketing.com.br', NOW() + INTERVAL '2 days', 6),
('Análise de concorrência', 'Pesquisar e analisar estratégias dos principais concorrentes', 'todo', 'medium', 'estrategia@designmarketing.com.br', NOW() + INTERVAL '10 days', 8),
('Configurar Google Analytics', 'Implementar tracking avançado no site do cliente', 'review', 'high', 'estrategia@designmarketing.com.br', NOW() + INTERVAL '1 day', 3),
('Campanha de email marketing', 'Criar sequência de emails para nutrição de leads', 'backlog', 'medium', 'estrategia@designmarketing.com.br', NOW() + INTERVAL '21 days', 10);

SELECT 'Tabela tasks criada com sucesso!' as resultado;
