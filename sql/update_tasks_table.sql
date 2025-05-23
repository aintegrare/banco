-- Atualizar estrutura da tabela tasks para usar os novos status padronizados
-- Execute este script para migrar os dados existentes

-- 1. Primeiro, vamos verificar os status atuais
SELECT DISTINCT status FROM tasks;

-- 2. Atualizar os status para o novo padrão
UPDATE tasks SET status = 'backlog' WHERE status = 'Backlog';
UPDATE tasks SET status = 'todo' WHERE status = 'Pendente';
UPDATE tasks SET status = 'in_progress' WHERE status = 'Em andamento';
UPDATE tasks SET status = 'review' WHERE status = 'Em revisão';
UPDATE tasks SET status = 'done' WHERE status = 'Concluído';

-- 3. Atualizar as prioridades para o novo padrão
UPDATE tasks SET priority = 'low' WHERE priority = 'Baixa';
UPDATE tasks SET priority = 'medium' WHERE priority = 'Média';
UPDATE tasks SET priority = 'high' WHERE priority = 'Alta';

-- 4. Adicionar coluna order_position se não existir
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS order_position INTEGER DEFAULT 0;

-- 5. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_order_position ON tasks(order_position);

-- 6. Verificar o resultado
SELECT status, COUNT(*) as count FROM tasks GROUP BY status;
SELECT priority, COUNT(*) as count FROM tasks GROUP BY priority;
