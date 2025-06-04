-- Criar tabela de clientes
CREATE TABLE IF NOT EXISTS clients (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  company TEXT,
  position TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('lead', 'prospect', 'active', 'inactive', 'churned')),
  source TEXT,
  tags TEXT[],
  notes TEXT,
  address JSONB,
  social_links JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de interações com clientes
CREATE TABLE IF NOT EXISTS client_interactions (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'proposal', 'contract', 'support', 'other')),
  subject TEXT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration_minutes INTEGER,
  outcome TEXT,
  next_action TEXT,
  next_action_date TIMESTAMPTZ,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de notas dos clientes
CREATE TABLE IF NOT EXISTS client_notes (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_private BOOLEAN DEFAULT FALSE,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_company ON clients(company);
CREATE INDEX IF NOT EXISTS idx_client_interactions_client_id ON client_interactions(client_id);
CREATE INDEX IF NOT EXISTS idx_client_interactions_type ON client_interactions(type);
CREATE INDEX IF NOT EXISTS idx_client_interactions_date ON client_interactions(date);
CREATE INDEX IF NOT EXISTS idx_client_notes_client_id ON client_notes(client_id);

-- Triggers para updated_at
CREATE TRIGGER update_clients_updated_at 
    BEFORE UPDATE ON clients 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_interactions_updated_at 
    BEFORE UPDATE ON client_interactions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_notes_updated_at 
    BEFORE UPDATE ON client_notes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir clientes de exemplo
INSERT INTO clients (name, email, phone, company, position, status, source, tags, notes, address, social_links) VALUES
('João Silva', 'joao@cacaushow.com.br', '(11) 99999-1111', 'Cacau Show', 'Gerente de Marketing', 'active', 'indicação', ARRAY['chocolate', 'franquia'], 'Cliente muito engajado com resultados excelentes', '{"rua": "Rua das Flores, 123", "cidade": "São Paulo", "estado": "SP", "cep": "01234-567"}', '{"linkedin": "linkedin.com/in/joaosilva", "instagram": "@cacaushow"}'),
('Maria Santos', 'maria@carlamendess.com.br', '(11) 88888-2222', 'Carla Mendes Moda', 'Proprietária', 'active', 'google ads', ARRAY['moda', 'feminino'], 'Especialista em moda feminina, muito detalhista', '{"rua": "Av. Paulista, 456", "cidade": "São Paulo", "estado": "SP", "cep": "01310-100"}', '{"instagram": "@carlamendesmoda", "facebook": "carlamendesmoda"}'),
('Pedro Costa', 'pedro@eletrobeltrao.com.br', '(11) 77777-3333', 'Eletro Beltrão', 'Diretor Comercial', 'prospect', 'linkedin', ARRAY['eletrodomésticos', 'varejo'], 'Interessado em expandir presença digital', '{"rua": "Rua do Comércio, 789", "cidade": "São Paulo", "estado": "SP", "cep": "03456-789"}', '{"linkedin": "linkedin.com/in/pedrocosta"}'),
('Ana Oliveira', 'ana@portalcidade.com.br', '(11) 66666-4444', 'Portal Cidade', 'Editora-chefe', 'active', 'indicação', ARRAY['jornalismo', 'notícias'], 'Portal de notícias local com grande audiência', '{"rua": "Rua da Imprensa, 321", "cidade": "São Paulo", "estado": "SP", "cep": "04567-890"}', '{"twitter": "@portalcidade", "facebook": "portalcidade"}'),
('Carlos Mendes', 'carlos@espacochic.com.br', '(11) 55555-5555', 'Espaço Chic', 'CEO', 'active', 'evento', ARRAY['moda', 'luxo'], 'Loja de roupas de luxo, projeto finalizado com sucesso', '{"rua": "Rua Oscar Freire, 654", "cidade": "São Paulo", "estado": "SP", "cep": "01426-001"}', '{"instagram": "@espacochic"}');

-- Inserir interações de exemplo
INSERT INTO client_interactions (client_id, type, subject, description, date, duration_minutes, outcome, next_action, next_action_date, created_by) VALUES
(1, 'meeting', 'Reunião de Kickoff do Projeto', 'Primeira reunião para definir escopo e cronograma do novo site', NOW() - INTERVAL '10 days', 90, 'Projeto aprovado', 'Enviar proposta detalhada', NOW() + INTERVAL '2 days', 'estrategia@designmarketing.com.br'),
(1, 'email', 'Aprovação do Layout', 'Cliente aprovou o layout inicial da homepage', NOW() - INTERVAL '5 days', NULL, 'Layout aprovado', 'Iniciar desenvolvimento', NOW() + INTERVAL '1 day', 'estrategia@designmarketing.com.br'),
(2, 'call', 'Briefing da Campanha', 'Conversa sobre objetivos da nova campanha de lançamento', NOW() - INTERVAL '7 days', 45, 'Briefing completo', 'Criar estratégia de conteúdo', NOW() + INTERVAL '3 days', 'estrategia@designmarketing.com.br'),
(3, 'proposal', 'Apresentação da Proposta', 'Apresentação da proposta de rebranding completo', NOW() - INTERVAL '3 days', 60, 'Em análise', 'Aguardar retorno', NOW() + INTERVAL '5 days', 'estrategia@designmarketing.com.br'),
(4, 'meeting', 'Revisão Mensal de SEO', 'Apresentação dos resultados de SEO do último mês', NOW() - INTERVAL '1 day', 30, 'Resultados positivos', 'Continuar estratégia atual', NOW() + INTERVAL '30 days', 'estrategia@designmarketing.com.br');

-- Inserir notas de exemplo
INSERT INTO client_notes (client_id, title, content, is_private, created_by) VALUES
(1, 'Preferências de Design', 'Cliente prefere cores mais vibrantes e layout moderno. Evitar tons pastéis.', FALSE, 'estrategia@designmarketing.com.br'),
(1, 'Informações Comerciais', 'Orçamento aprovado: R$ 25.000. Prazo: 3 meses. Pagamento em 3x.', TRUE, 'estrategia@designmarketing.com.br'),
(2, 'Público-alvo', 'Foco em mulheres de 25-45 anos, classe A/B, interessadas em moda feminina sofisticada.', FALSE, 'estrategia@designmarketing.com.br'),
(3, 'Concorrência', 'Principais concorrentes: Magazine Luiza, Casas Bahia. Diferencial: atendimento personalizado.', FALSE, 'estrategia@designmarketing.com.br'),
(4, 'Histórico de Performance', 'Site teve crescimento de 150% no tráfego orgânico nos últimos 6 meses.', FALSE, 'estrategia@designmarketing.com.br');

SELECT 'Tabelas do CRM criadas com sucesso!' as resultado;
