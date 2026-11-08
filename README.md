# Trafkintu Kimün · Intercambio de saberes

Plataforma educativa y cultural para el intercambio recíproco de saberes entre
las escuelas Reducción Monte Verde y Ruca Raqui. Busca dar visibilidad a sus
humedales, entorno, cultura y espiritualidad, sin fines comerciales.

## Integrantes

- Gabriel Fierro
- Vicente Hernández
- Benjamin Valenzuela

## Tecnologías

- Astro y TypeScript para la aplicación web.
- Supabase para PostgreSQL, autenticación, archivos y funciones de backend.
- Vercel para desplegar la aplicación.
- Docker para verificar una imagen ejecutable del sitio estático.

## Desarrollo

Requiere Node.js 24 y npm. La versión se indica en `.node-version`.

```sh
npm ci
npm run dev
```

La aplicación se abre en http://localhost:4321. Esta base contiene una portada
provisional y puede compilar sin credenciales ni conexión a Supabase.

Para conectar Supabase, copia `.env.example` a `.env` y completa las variables
públicas con los valores de tu proyecto. Nunca uses una clave secreta o
`service_role` en el navegador. La autenticación y los permisos RLS se
implementarán junto con el modelo de datos.

## Estructura

```text
src/
  pages/             Rutas de Astro
  layouts/           Estructuras compartidas
  components/        Componentes genéricos
  features/          Módulos por funcionalidad
  lib/supabase/      Cliente de conexión
  styles/            Estilos globales
public/              Archivos públicos estáticos
supabase/
  migrations/        Cambios SQL y políticas de acceso
  functions/         Funciones de backend
  config.toml        Configuración local
  seed.sql           Datos iniciales de desarrollo
.github/workflows/   Integración continua
docs/                Arquitectura y flujo de trabajo
```

La aplicación vive en la raíz. Supabase es el backend administrado; su carpeta
versiona la configuración y los cambios, no un segundo servidor web.

## Verificaciones

```sh
npm run check
npm run build
npm run preview
```

## Supabase local (opcional)

Requiere Docker Desktop activo. El CLI está fijado en las dependencias de desarrollo.

```sh
npm run supabase -- start
npm run supabase -- status
npm run supabase -- stop
```

Esto inicia servicios locales. No modifica un proyecto remoto. Consulta
[supabase/README.md](supabase/README.md) antes de crear migraciones.

## Docker

```sh
docker build -t trafkintu-kimun:local .
docker run --rm -p 127.0.0.1:8080:8080 trafkintu-kimun:local
```

El contenedor sirve el sitio en http://localhost:8080 con un usuario sin
privilegios. No incluye Supabase ni credenciales. Vercel utiliza su propia
compilación, no este contenedor.

## CI en main

`.github/workflows/ci-main.yml` se ejecuta con pushes a `main`, Pull Requests
hacia `main` y ejecución manual sobre `main`. Comprueba tipos, compila Astro,
construye la imagen Docker y verifica una respuesta HTTP del contenedor.
No publica imágenes ni despliega a Vercel o Supabase.

## CI en develop

`.github/workflows/ci-develop.yml` se ejecuta con pushes a `develop`, Pull
Requests hacia `develop` y ejecución manual sobre `develop`. Instala las
dependencias con `npm ci`, comprueba tipos y compila Astro. La construcción y
prueba Docker permanecen en el CI de `main`.

Commitlint valida los commits de ambas ramas mediante su workflow independiente.

## Convención de commits

`npm ci` o `npm install` activa Husky en el clon local. Cada commit de trabajo
debe tener el formato `tipo(zona): mensaje`, con zona obligatoria en minúsculas
y guiones, y un encabezado de hasta 100 caracteres. Por ejemplo:

```text
feat(escuelas): agregar perfil público
fix(auth): corregir recuperación de acceso
ci(docker): verificar el contenedor
docs(readme): documentar instalación
```

Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`,
`chore` y `revert`. Los mensajes automáticos de integración de ramas se exceptúan.

El hook `commit-msg` valida antes de crear el commit. También existe un workflow
de Commitlint para pushes y Pull Requests de todas las ramas: revisa los commits
del cambio, sin exigir reescribir el historial anterior a esta configuración.

Los hooks locales pueden omitirse. Para bloquear merges con validaciones
fallidas habrá que exigir el job `Validar commits` en las protecciones remotas.
Las protecciones de ramas se configuran en GitHub.

## Despliegue en Vercel

Importar el repositorio con el preset **Astro**, directorio raíz `.`, comando
`npm run build`, salida `dist` y Node.js 24. Agregar las variables de Supabase
cuando se implemente su integración. El sitio es estático por ahora; las rutas
que necesiten servidor requerirán incorporar el adaptador de Vercel.

Más detalles: [docs/architecture.md](docs/architecture.md).
