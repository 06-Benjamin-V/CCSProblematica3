# Arquitectura

- **Frontend:** Astro y TypeScript, con despliegue previsto en Vercel.
- **Backend:** Supabase para PostgreSQL, autenticación, archivos y funciones.
- **Contenedor:** Docker sirve la compilación estática con Nginx para validación en CI.

## Organización

- `src/pages/`: rutas y páginas.
- `src/components/` y `src/layouts/`: interfaz compartida.
- `src/features/`: módulos de negocio.
- `src/lib/supabase/`: conexión con Supabase.
- `supabase/`: configuración local, migraciones SQL y funciones.

## Seguridad y contenido

El acceso a datos debe protegerse mediante políticas RLS. Las claves secretas se usan
exclusivamente en el servidor; el navegador utiliza la clave pública.

La salida actual es estática. Actualizar datos en Supabase no regenera las
páginas automáticamente; el mecanismo de publicación se definirá al implementar
los contenidos dinámicos.
