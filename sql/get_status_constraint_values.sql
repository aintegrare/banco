-- Função para obter os valores permitidos na restrição de status da tabela tasks
CREATE OR REPLACE FUNCTION get_status_constraint_values()
RETURNS TABLE (allowed_value text) AS $$
BEGIN
    RETURN QUERY
    SELECT trim(both '''' from unnest(string_to_array(
        regexp_replace(
            regexp_replace(
                pg_get_constraintdef(c.oid),
                '.*CHECK $$\(status = ANY \(ARRAY\[(.*)\]$$\)\).*', '\1'
            ),
            '.*CHECK $$\(.*::\w+ = ANY \(ARRAY\[(.*)\]$$\)\).*', '\1'
        ),
        ', '
    ))) AS allowed_value
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE c.conname = 'tasks_status_check'
    AND t.relname = 'tasks'
    AND n.nspname = 'public';
    
    -- Se não encontrar a restrição específica, retornar valores padrão
    IF NOT FOUND THEN
        RETURN QUERY SELECT unnest(ARRAY['pending', 'in_progress', 'review', 'completed', 'cancelled']) AS allowed_value;
    END IF;
END;
$$ LANGUAGE plpgsql;
