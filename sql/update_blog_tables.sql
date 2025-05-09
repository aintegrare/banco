-- Verificar se a coluna 'featured' existe e adicioná-la se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'blog_posts' AND column_name = 'featured'
    ) THEN
        ALTER TABLE blog_posts ADD COLUMN featured BOOLEAN DEFAULT FALSE;
    END IF;
END $$;
