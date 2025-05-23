-- Atualizar estrutura da tabela projects para usar os novos status padronizados

-- 1. Verificar os status atuais
SELECT DISTINCT status FROM projects;

-- 2. Atualizar os status para o novo padrão (se necessário)
UPDATE projects SET status = 'planning' WHERE status = 'planejamento' OR status = 'Planejamento';
UPDATE projects SET status = 'active' WHERE status = 'ativo' OR status = 'Ativo' OR status = 'em_andamento' OR status = 'Em andamento';
UPDATE projects SET status = 'on_hold' WHERE status = 'pausado' OR status = 'Pausado' OR status = 'em_espera';
UPDATE projects SET status = 'completed' WHERE status = 'concluido' OR status = 'Concluído' OR status = 'finalizado';
UPDATE projects SET status = 'cancelled' WHERE status = 'cancelado' OR status = 'Cancelado';

-- 3. Adicionar colunas se não existirem
ALTER TABLE projects ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE;

-- 4. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_start_date ON projects(start_date);
CREATE INDEX IF NOT EXISTS idx_projects_end_date ON projects(end_date);

-- 5. Verificar o resultado
SELECT status, COUNT(*) as count FROM projects GROUP BY status;
