CREATE OR REPLACE FUNCTION get_table_definition(table_name text)
RETURNS TABLE (
  table_definition text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pg_get_tabledef(table_name::regclass)::text;
END;
$$ LANGUAGE plpgsql;
