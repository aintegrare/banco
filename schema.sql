-- Remover a tabela se já existir (cuidado: isso apaga todos os dados existentes)
DROP TABLE IF EXISTS contacts;

-- Criar a tabela de contatos
CREATE TABLE contacts (
  id TEXT PRIMARY KEY,           -- Identificador único do contato (UUID)
  name TEXT NOT NULL,            -- Nome do contato
  email TEXT NOT NULL,           -- Email do contato
  phone TEXT NOT NULL,           -- Telefone do contato
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Data de criação do registro
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- Data da última atualização
);

-- Criar índices para melhorar a performance das buscas
CREATE INDEX idx_contacts_name ON contacts(name);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_phone ON contacts(phone);

-- Opcional: Adicionar alguns contatos de exemplo
INSERT INTO contacts (id, name, email, phone) VALUES 
('1', 'João Silva', 'joao@exemplo.com', '(11) 98765-4321'),
('2', 'Maria Oliveira', 'maria@exemplo.com', '(21) 91234-5678'),
('3', 'Carlos Santos', 'carlos@exemplo.com', '(31) 99876-5432');
