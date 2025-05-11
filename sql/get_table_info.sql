CREATE OR REPLACE FUNCTION get_table_info(table_name text)
RETURNS TABLE (
  column_name text,
  data_type text,
  is_nullable boolean,
  column_default text,
  constraint_name text,
  constraint_type text,
  constraint_definition text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.column_name::text,
    c.data_type::text,
    (c.is_nullable = 'YES')::boolean,
    c.column_default::text,
    tc.constraint_name::text,
    tc.constraint_type::text,
    pgc.consrc::text AS constraint_definition
  FROM 
    information_schema.columns c
  LEFT JOIN 
    information_schema.constraint_column_usage ccu ON c.table_name = ccu.table_name AND c.column_name = ccu.column_name
  LEFT JOIN 
    information_schema.table_constraints tc ON ccu.constraint_name = tc.constraint_name
  LEFT JOIN 
    pg_constraint pgc ON tc.constraint_name = pgc.conname
  WHERE 
    c.table_name = table_name;
END;
$$ LANGUAGE plpgsql;
