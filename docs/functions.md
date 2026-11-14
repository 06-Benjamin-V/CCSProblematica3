# Edge Functions de Backend · Trafkintu Kimün

Documentación de las funciones serverless ubicadas en `supabase/functions/` que se ejecutan en el entorno de Supabase Edge Runtime (Deno).

---

## 1. `crear-usuario`

* **Ruta local:** `http://127.0.0.1:54321/functions/v1/crear-usuario`
* **Método:** `POST`
* **Archivo:** `supabase/functions/crear-usuario/index.ts`

### Propósito
Dado que el registro público está deshabilitado en `supabase/config.toml` (`enable_signup = false`), los profesores y estudiantes no pueden autoregistrarse. Esta función permite que un **encargado** o **administrador** registre nuevas cuentas escolares de forma segura mediante la clave privilegiada `service_role` en el servidor.

### Encabezados (Headers)
```http
Authorization: Bearer <token_jwt_del_encargado>
apikey: <clave_publica_anon>
Content-Type: application/json
```

### Cuerpo de la solicitud (Body JSON)
```json
{
  "email": "profesor.monteverde@escuela.cl",
  "password": "PasswordSegura123!",
  "nombre_completo": "Juan Pérez",
  "rol": "profesor",
  "escuela_id_escuela": 1
}
```

### Reglas de seguridad y validaciones
1. El solicitante debe estar autenticado y tener `activo = true` en la tabla `public.usuario`.
2. El rol del solicitante debe ser `encargado` o `administrador`.
3. Un encargado solo puede crear cuentas vinculadas a su propia escuela (`escuela_id_escuela`).
4. Si la creación en `public.usuario` falla, se revierte automáticamente la creación en `auth.users` para no dejar datos huérfanos.

### Respuesta exitosa (201 Created)
```json
{
  "success": true,
  "message": "Usuario creado exitosamente.",
  "user": {
    "id_usuario": 3,
    "id_auth": "uuid-generado",
    "email": "profesor.monteverde@escuela.cl",
    "nombre_completo": "Juan Pérez",
    "rol": "profesor",
    "escuela_id_escuela": 1
  }
}
```

---

## 2. `rebuild-sitio`

* **Ruta local:** `http://127.0.0.1:54321/functions/v1/rebuild-sitio`
* **Método:** `POST`
* **Archivo:** `supabase/functions/rebuild-sitio/index.ts`

### Propósito
Resuelve el requerimiento descrito en `docs/architecture.md`:
> *"La salida actual es estática. Actualizar datos en Supabase no regenera las páginas automáticamente; el mecanismo de publicación se definirá al implementar los contenidos dinámicos."*

Esta función dispara de forma segura la reconstrucción y despliegue del frontend en Vercel a través de un webhook (*Deploy Hook*), evitando exponer URLs secretas en el navegador.

### Encabezados (Headers)
```http
Authorization: Bearer <token_jwt_usuario_o_webhook>
apikey: <clave_publica_anon>
Content-Type: application/json
```

### Variables de entorno requeridas en Supabase
* `VERCEL_DEPLOY_HOOK_URL`: URL secreta del Deploy Hook generado en el panel de Vercel del proyecto.

### Respuesta exitosa (200 OK)
```json
{
  "success": true,
  "message": "Reconstrucción del sitio en Vercel solicitada con éxito.",
  "job": {
    "id": "chk_xxx",
    "state": "pending"
  }
}
```
