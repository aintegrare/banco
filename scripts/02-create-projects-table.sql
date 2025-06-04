-- Criar tabela de projetos
CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  client_name TEXT,
  start_date DATE,
  end_date DATE,
  budget DECIMAL(10,2),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  team_members TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_client_name ON projects(client_name);
CREATE INDEX IF NOT EXISTS idx_projects_start_date ON projects(start_date);
CREATE INDEX IF NOT EXISTS idx_projects_end_date ON projects(end_date);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Adicionar foreign key na tabela tasks
ALTER TABLE tasks 
ADD CONSTRAINT fk_tasks_project_id 
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;

-- Inserir alguns projetos de exemplo
INSERT INTO projects (name, description, status, priority, client_name, start_date, end_date, budget, progress, team_members) VALUES
('Website Cacau Show', 'Desenvolvimento completo do novo site institucional da Cacau Show', 'active', 'high', 'Cacau Show', '2024-12-01', '2025-02-28', 25000.00, 65, ARRAY['estrategia@designmarketing.com.br', 'dev@integrare.com.br']),
('Campanha Carla Mendes', 'Estratégia de marketing digital para lançamento de nova coleção', 'active', 'medium', 'Carla Mendes', '2024-11-15', '2025-01-31', 15000.00, 80, ARRAY['estrategia@designmarketing.com.br']),
('Rebranding Eletro Beltrão', 'Renovação completa da identidade visual e presença digital', 'planning', 'medium', 'Eletro Beltrão', '2025-01-15', '2025-04-30', 35000.00, 10, ARRAY['estrategia@designmarketing.com.br', 'design@integrare.com.br']),
('SEO Portal Cidade', 'Otimização completa de SEO para melhorar rankeamento orgânico', 'active', 'high', 'Portal Cidade', '2024-10-01', '2025-03-31', 18000.00, 45, ARRAY['estrategia@designmarketing.com.br']),
('E-commerce Espaço Chic', 'Desenvolvimento de loja virtual completa com integração de pagamentos', 'completed', 'high', 'Espaço Chic', '2024-08-01', '2024-11-30', 40000.00, 100, ARRAY['estrategia@designmarketing.com.br', 'dev@integrare.com.br']),
('Social Media Jonric', 'Gestão completa de redes sociais e criação de conteúdo', 'active', 'medium', 'Jonric', '2024-09-01', '2025-08-31', 12000.00, 30, ARRAY['estrategia@designmarketing.com.br']),
('Website Marina Regiani', 'Site institucional para consultora de beleza', 'on_hold', 'low', 'Marina Regiani', '2024-12-15', '2025-02-15', 8000.00, 20, ARRAY['estrategia@designmarketing.com.br']),
('Campanha Sanches Odontologia', 'Marketing digital para clínica odontológica', 'active', 'medium', 'Sanches Odontologia', '2024-11-01', '2025-05-31', 22000.00, 55, ARRAY['estrategia@designmarketing.com.br']);

-- Atualizar algumas tarefas para associar aos projetos
UPDATE tasks SET project_id = 1 WHERE title = 'Criar nova landing page';
UPDATE tasks SET project_id = 2 WHERE title = 'Criar posts para redes sociais';
UPDATE tasks SET project_id = 4 WHERE title = 'Otimizar SEO do site';
UPDATE tasks SET project_id = 1 WHERE title = 'Configurar Google Analytics';
UPDATE tasks SET project_id = 2 WHERE title = 'Campanha de email marketing';

SELECT 'Tabela projects criada com sucesso!' as resultado;
