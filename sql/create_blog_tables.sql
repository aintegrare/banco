-- Tabela de categorias do blog
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de autores do blog
CREATE TABLE IF NOT EXISTS blog_authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  avatar VARCHAR(255),
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de posts do blog
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_image VARCHAR(255),
  author_id UUID REFERENCES blog_authors(id),
  category_id UUID REFERENCES blog_categories(id),
  status VARCHAR(20) DEFAULT 'draft', -- draft, published, scheduled
  published_at TIMESTAMP WITH TIME ZONE,
  featured BOOLEAN DEFAULT FALSE,
  meta_title VARCHAR(255),
  meta_description TEXT,
  tags TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de comentários do blog
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, spam
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar o timestamp de updated_at
CREATE TRIGGER update_blog_categories_updated_at
BEFORE UPDATE ON blog_categories
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_blog_authors_updated_at
BEFORE UPDATE ON blog_authors
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_blog_comments_updated_at
BEFORE UPDATE ON blog_comments
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Inserir algumas categorias de exemplo
INSERT INTO blog_categories (name, slug, description)
VALUES
  ('Marketing Digital', 'marketing-digital', 'Artigos sobre estratégias e tendências de marketing digital'),
  ('SEO', 'seo', 'Dicas e técnicas para otimização de sites para mecanismos de busca'),
  ('Redes Sociais', 'redes-sociais', 'Estratégias para redes sociais e gestão de comunidades online'),
  ('E-mail Marketing', 'email-marketing', 'Melhores práticas para campanhas de e-mail marketing'),
  ('Análise de Dados', 'analise-de-dados', 'Como utilizar dados para tomar decisões de marketing'),
  ('Tendências', 'tendencias', 'Novidades e tendências no mundo do marketing')
ON CONFLICT (slug) DO NOTHING;

-- Inserir alguns autores de exemplo
INSERT INTO blog_authors (name, email, avatar, bio)
VALUES
  ('Ana Silva', 'ana.silva@integrare.com.br', '/placeholder.svg?height=100&width=100&query=woman%20profile', 'Especialista em Marketing Digital com mais de 10 anos de experiência no mercado.'),
  ('Carlos Mendes', 'carlos.mendes@integrare.com.br', '/placeholder.svg?height=100&width=100&query=man%20profile', 'Consultor de SEO e especialista em estratégias de conteúdo.'),
  ('Juliana Costa', 'juliana.costa@integrare.com.br', '/placeholder.svg?height=100&width=100&query=woman%20profile%20professional', 'Gerente de Mídias Sociais com experiência em grandes marcas nacionais.')
ON CONFLICT (email) DO NOTHING;
