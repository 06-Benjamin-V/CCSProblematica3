# Backend Supabase

Esta carpeta versiona configuración local, migraciones SQL, permisos RLS y
funciones. El proyecto remoto se conectará cuando definamos su modelo de datos.

## Entorno local

Con Docker activo, ejecutar desde la raíz:

```sh
npm run supabase -- start
npm run supabase -- status
npm run supabase -- stop
```

El registro público está deshabilitado en `config.toml`: las cuentas serán de
encargados autorizados. No hay credenciales ni cuentas predefinidas.

## Migraciones

```sh
npm run supabase -- migration new nombre_del_cambio
```

Guardar tablas y políticas RLS en `migrations/`. Todas las tablas expuestas
deben incluir permisos explícitos antes de usarse desde el navegador.

`seed.sql` está vacío intencionalmente. Se completará con datos de desarrollo
cuando exista un esquema. No ejecutar `db reset` contra datos que quieras
conservar: reconstruye la base local a partir de las migraciones y el seed.

No ejecutar `link`, `db push` o despliegues de funciones hasta seleccionar el
proyecto remoto y revisar las migraciones. El CI actual no aplica cambios SQL.

Las funciones usan el entorno de Supabase y se verifican por separado; no se
incluyen en el chequeo TypeScript del frontend.
