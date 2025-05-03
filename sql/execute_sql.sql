-- Função para executar SQL dinâmico
CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT, params JSONB DEFAULT '[]'::JSONB)
RETURNS VOID AS $$
BEGIN
  EXECUTE sql_query USING params;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
