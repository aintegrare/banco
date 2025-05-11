CREATE OR REPLACE FUNCTION get_table_info(table_name TEXT)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT 
    jsonb_build_object(
      'columns', (
        SELECT jsonb_agg(jsonb_build_object(
          'name', column_name,
          'type', data_type,
          'nullable', is_nullable,
          'default', column_default
        ))
        FROM information_schema.columns
        WHERE table_name = get_table_info.table_name
      ),
      'constraints', (
        SELECT jsonb_agg(jsonb_build_object(
          'name', constraint_name,
          'type', constraint_type
        ))
        FROM information_schema.table_constraints
        WHERE table_name = get_table_info.table_name
      )
    ) INTO result;
  
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$$ LANGUAGE plpgsql;
