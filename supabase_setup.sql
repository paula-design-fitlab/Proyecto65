-- Tabla: menú semanal (una fila por usuario, se sobreescribe)
CREATE TABLE IF NOT EXISTS p65_menu_semanal (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario text NOT NULL UNIQUE,
  menu jsonb NOT NULL,
  actualizado timestamptz DEFAULT now()
);

-- Tabla: registro de peso
CREATE TABLE IF NOT EXISTS p65_peso (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario text NOT NULL,
  peso numeric(5,2) NOT NULL,
  fecha timestamptz DEFAULT now()
);

-- Desactivar RLS para uso sin autenticación (igual que Fitlab)
ALTER TABLE p65_menu_semanal DISABLE ROW LEVEL SECURITY;
ALTER TABLE p65_peso DISABLE ROW LEVEL SECURITY;
