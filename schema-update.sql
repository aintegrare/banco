-- Adicionar coluna de categoria à tabela de contatos
ALTER TABLE contacts ADD COLUMN category TEXT DEFAULT 'outros';

-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir categorias padrão
INSERT OR IGNORE INTO categories (id, name, color) VALUES 
('1', 'Pessoal', '#3b82f6'),
('2', 'Trabalho', '#10b981'),
('3', 'Família', '#f59e0b'),
('4', 'Amigos', '#8b5cf6'),
('5', 'Outros', '#6b7280');

-- Criar tabela para histórico de interações
CREATE TABLE IF NOT EXISTS interactions (
  id TEXT PRIMARY KEY,
  contact_id TEXT NOT NULL,
  type TEXT NOT NULL,
  notes TEXT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);
