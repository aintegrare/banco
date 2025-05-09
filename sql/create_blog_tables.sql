-- Verificar se a tabela blog_authors existe
CREATE TABLE IF NOT EXISTS blog_authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Verificar se a tabela blog_categories existe
CREATE TABLE IF NOT EXISTS blog_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Verificar se a tabela blog_posts existe
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  author_id INTEGER REFERENCES blog_authors(id),
  category_id INTEGER REFERENCES blog_categories(id),
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  read_time VARCHAR(50),
  meta_title VARCHAR(255),
  meta_description TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Verificar se a tabela blog_tags existe
CREATE TABLE IF NOT EXISTS blog_tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Verificar se a tabela blog_posts_tags existe
CREATE TABLE IF NOT EXISTS blog_posts_tags (
  post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Inserir algumas categorias de exemplo se não existirem
INSERT INTO blog_categories (name, slug, description)
SELECT 'Marketing Digital', 'marketing-digital', 'Artigos sobre marketing digital e estratégias online'
WHERE NOT EXISTS (SELECT 1 FROM blog_categories WHERE slug = 'marketing-digital');

INSERT INTO blog_categories (name, slug, description)
SELECT 'SEO', 'seo', 'Artigos sobre otimização para motores de busca'
WHERE NOT EXISTS (SELECT 1 FROM blog_categories WHERE slug = 'seo');

INSERT INTO blog_categories (name, slug, description)
SELECT 'Redes Sociais', 'redes-sociais', 'Artigos sobre estratégias para redes sociais'
WHERE NOT EXISTS (SELECT 1 FROM blog_categories WHERE slug = 'redes-sociais');

-- Inserir um autor de exemplo se não existir
INSERT INTO blog_authors (name, email, avatar_url, bio)
SELECT 'Admin Integrare', 'admin@redeintegrare.com.br', '/placeholder.svg?height=100&width=100&query=avatar', 'Administrador do blog da Integrare'
WHERE NOT EXISTS (SELECT 1 FROM blog_authors WHERE email = 'admin@redeintegrare.com.br');

-- Inserir um post de exemplo se não existir
INSERT INTO blog_posts (title, slug, excerpt, content, featured_image, author_id, category_id, published, published_at, read_time)
SELECT 
  'Bem-vindo ao Blog da Integrare', 
  'bem-vindo-ao-blog-da-integrare',
  'Este é o primeiro post do blog da Integrare. Aqui você encontrará conteúdos sobre marketing, negócios e tecnologia.',
  '<p>Bem-vindo ao blog da Integrare!</p><p>Este é o nosso primeiro post e estamos muito felizes em compartilhar conteúdos relevantes sobre marketing, negócios e tecnologia com você.</p><p>Fique ligado para mais conteúdos em breve!</p>',
  '/placeholder.svg?height=600&width=1200&query=welcome+blog',
  (SELECT id FROM blog_authors WHERE email = 'admin@redeintegrare.com.br'),
  (SELECT id FROM blog_categories WHERE slug = 'marketing-digital'),
  true,
  CURRENT_TIMESTAMP,
  '2 min'
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE slug = 'bem-vindo-ao-blog-da-integrare');

-- Inserir um post de teste se não existir
INSERT INTO blog_posts (title, slug, excerpt, content, featured_image, author_id, category_id, published, published_at, read_time)
SELECT 
  'Post de Teste', 
  'teste',
  'Este é um post de teste para verificar o funcionamento do blog.',
  '<p>Este é um post de teste para verificar o funcionamento do blog.</p><p>Se você está vendo este conteúdo, significa que o sistema está funcionando corretamente!</p>',
  '/placeholder.svg?height=600&width=1200&query=test+blog',
  (SELECT id FROM blog_authors WHERE email = 'admin@redeintegrare.com.br'),
  (SELECT id FROM blog_categories WHERE slug = 'marketing-digital'),
  true,
  CURRENT_TIMESTAMP,
  '1 min'
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE slug = 'teste');
