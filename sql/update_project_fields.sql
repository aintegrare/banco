-- Função para atualizar campos específicos de um projeto
CREATE OR REPLACE FUNCTION update_project_fields(
  p_id TEXT,
  p_name TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_status TEXT DEFAULT NULL,
  p_start_date TIMESTAMPTZ DEFAULT NULL,
  p_end_date TIMESTAMPTZ DEFAULT NULL,
  p_progress INT DEFAULT NULL
) RETURNS SETOF projects AS $$
BEGIN
  -- Atualizar apenas os campos não nulos
  UPDATE projects
  SET
    name = COALESCE(p_name, name),
    description = COALESCE(p_description, description),
    status = COALESCE(p_status, status),
    start_date = COALESCE(p_start_date, start_date),
    end_date = COALESCE(p_end_date, end_date),
    progress = COALESCE(p_progress, progress)
  WHERE id = p_id::INT;
  
  -- Retornar o projeto atualizado
  RETURN QUERY SELECT * FROM projects WHERE id = p_id::INT;
END;
$$ LANGUAGE plpgsql;
