-- Criar tabela de categorias do blog
CREATE TABLE IF NOT EXISTS blog_categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#4b7bb5',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de autores do blog
CREATE TABLE IF NOT EXISTS blog_authors (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  social_links JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de posts do blog
CREATE TABLE IF NOT EXISTS blog_posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  author_id BIGINT REFERENCES blog_authors(id),
  category_id BIGINT REFERENCES blog_categories(id),
  tags TEXT[],
  meta_title TEXT,
  meta_description TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- Triggers para updated_at
CREATE TRIGGER update_blog_categories_updated_at 
    BEFORE UPDATE ON blog_categories 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_authors_updated_at 
    BEFORE UPDATE ON blog_authors 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON blog_posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir categorias de exemplo
INSERT INTO blog_categories (name, slug, description, color) VALUES
('Marketing Digital', 'marketing-digital', 'Estratégias e tendências em marketing digital', '#4b7bb5'),
('SEO', 'seo', 'Otimização para mecanismos de busca', '#527eb7'),
('Redes Sociais', 'redes-sociais', 'Gestão e estratégias para redes sociais', '#3d649e'),
('E-commerce', 'e-commerce', 'Dicas e estratégias para lojas virtuais', '#4072b0'),
('Branding', 'branding', 'Construção e gestão de marca', '#6b91c1');

-- Inserir autor padrão
INSERT INTO blog_authors (name, email, bio, avatar_url) VALUES
('Equipe Integrare', 'estrategia@designmarketing.com.br', 'Especialistas em marketing digital da Agência Integrare', '/professional-woman-avatar.png');

-- Inserir posts de exemplo
INSERT INTO blog_posts (title, slug, excerpt, content, status, author_id, category_id, tags, meta_title, meta_description, published_at) VALUES
('As Principais Tendências do Marketing Digital em 2024', 'tendencias-marketing-digital-2024', 'Descubra as principais tendências que estão moldando o marketing digital neste ano.', 'O marketing digital está em constante evolução...', 'published', 1, 1, ARRAY['tendências', 'marketing', '2024'], 'Tendências Marketing Digital 2024 | Integrare', 'Conheça as principais tendências do marketing digital para 2024 e como aplicá-las em sua estratégia.', NOW() - INTERVAL '5 days'),
('Como Otimizar seu Site para SEO em 2024', 'otimizar-site-seo-2024', 'Guia completo para melhorar o rankeamento do seu site nos mecanismos de busca.', 'A otimização para mecanismos de busca é fundamental...', 'published', 1, 2, ARRAY['SEO', 'otimização', 'rankeamento'], 'Como Otimizar SEO em 2024 | Integrare', 'Aprenda as melhores práticas de SEO para 2024 e melhore o rankeamento do seu site.', NOW() - INTERVAL '3 days'),
('Estratégias de Redes Sociais para Pequenas Empresas', 'estrategias-redes-sociais-pequenas-empresas', 'Como pequenas empresas podem usar as redes sociais para crescer.', 'As redes sociais oferecem oportunidades únicas...', 'published', 1, 3, ARRAY['redes sociais', 'pequenas empresas', 'estratégia'], 'Redes Sociais para Pequenas Empresas | Integrare', 'Descubra estratégias eficazes de redes sociais para pequenas empresas crescerem online.', NOW() - INTERVAL '1 day');

SELECT 'Tabelas do blog criadas com sucesso!' as resultado;
