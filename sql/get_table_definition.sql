CREATE OR REPLACE FUNCTION get_table_definition(table_name TEXT)
RETURNS TEXT AS $$
DECLARE
  definition TEXT;
BEGIN
  SELECT 
    pg_get_tabledef(table_name::regclass) INTO definition;
  
  RETURN definition;
EXCEPTION WHEN OTHERS THEN
  RETURN 'Erro ao obter definição: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql;
