-- Função para verificar se outra função existe
CREATE OR REPLACE FUNCTION function_exists(function_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT FROM pg_proc
    WHERE proname = function_name
  );
END;
$$ LANGUAGE plpgsql;

-- Função para executar SQL dinâmico
CREATE OR REPLACE FUNCTION execute_sql(sql_statement TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE sql_statement;
END;
$$ LANGUAGE plpgsql;

-- Função para obter informações sobre as colunas de uma tabela
CREATE OR REPLACE FUNCTION get_table_columns(table_name TEXT)
RETURNS TABLE (
  column_name TEXT,
  data_type TEXT,
  is_nullable TEXT,
  column_default TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.column_name::TEXT,
    c.data_type::TEXT,
    c.is_nullable::TEXT,
    c.column_default::TEXT
  FROM 
    information_schema.columns c
  WHERE 
    c.table_schema = 'public' 
    AND c.table_name = table_name
  ORDER BY 
    c.ordinal_position;
END;
$$ LANGUAGE plpgsql;
