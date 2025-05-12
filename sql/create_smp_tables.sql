-- Verificar se as tabelas já existem
DO $$
BEGIN
    -- Criar tabela para posts se não existir
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'smp_posts') THEN
        CREATE TABLE public.smp_posts (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            caption TEXT NOT NULL,
            hashtags TEXT[] DEFAULT '{}',
            theme TEXT,
            type TEXT NOT NULL CHECK (type IN ('PLM', 'PLC')),
            position JSONB NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        RAISE NOTICE 'Tabela smp_posts criada com sucesso';
    ELSE
        RAISE NOTICE 'Tabela smp_posts já existe';
    END IF;

    -- Criar tabela para conexões se não existir
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'smp_connections') THEN
        CREATE TABLE public.smp_connections (
            id TEXT PRIMARY KEY,
            source TEXT NOT NULL REFERENCES public.smp_posts(id) ON DELETE CASCADE,
            target TEXT NOT NULL REFERENCES public.smp_posts(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(source, target)
        );
        
        RAISE NOTICE 'Tabela smp_connections criada com sucesso';
    ELSE
        RAISE NOTICE 'Tabela smp_connections já existe';
    END IF;

    -- Inserir dados de exemplo se as tabelas estiverem vazias
    IF NOT EXISTS (SELECT FROM public.smp_posts LIMIT 1) THEN
        INSERT INTO public.smp_posts (id, title, caption, hashtags, theme, type, position)
        VALUES 
            ('post1', 'Lançamento de Produto', 'Novo produto chegando às lojas em breve! Fiquem ligados para mais informações.', 
             ARRAY['novoproduto', 'lançamento', 'inovação'], 'Produto', 'PLM', '{"x": 100, "y": 100}'),
            ('post2', 'Promoção de Verão', 'Aproveite nossos descontos especiais de verão em toda a linha de produtos!', 
             ARRAY['promoção', 'verão', 'descontos'], 'Promoção', 'PLC', '{"x": 400, "y": 300}');
             
        RAISE NOTICE 'Dados de exemplo inseridos na tabela smp_posts';
        
        INSERT INTO public.smp_connections (id, source, target)
        VALUES ('conn1', 'post1', 'post2');
        
        RAISE NOTICE 'Dados de exemplo inseridos na tabela smp_connections';
    END IF;
END $$;
