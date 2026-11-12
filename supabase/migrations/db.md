# Base de datos para Trafkintu Kimün · Intercambio de saberes

La base de datos es relacional en **PostgreSQL (Supabase)**, esquema `public`, con seguridad a nivel de filas (**RLS**) habilitada en todas las tablas.

## Entidades principales

**escuela:** id_escuela (PK), nombre, descripcion, direccion, ubicacion, canal_youtube

**usuario:** id_usuario (PK), id_auth (FK -> auth.users, unique), nombre_completo, rol, activo, fecha_creacion, escuela_id_escuela (FK -> escuela)

**publicacion:** id_publicacion (PK), tipo, titulo, subtitulo (opcional), contenido, autor, estado (default 'borrador'), fecha_creacion, fecha_publicacion (opcional)

**archivo:** id_archivo (PK), tipo, nombre, bucket, ruta, descripcion (opcional), texto_alternativo (opcional), transcripcion (opcional), orden (opcional), publicacion_id_publicacion (FK -> publicacion)

**etiqueta:** id_etiqueta (PK), nombre (unique)

**comentario:** id_comentario (PK), contenido, estado (default 'pendiente'), fecha_creacion, motivo_moderacion (opcional), fecha_moderacion (opcional)

**territorio:** id_territorio (PK), nombre, ubicacion (opcional), estado (default 'activo'), escuela_id_escuela (FK -> escuela)

**especie:** id_especie (PK), nombre_comun, nombre_cientifico, nombre_mapudungun (opcional), grupo, descripcion (opcional), habitat (opcional), estado_conservacion (opcional), fuente_informacion (opcional), estado (default 'activo'), escuela_id_escuela (FK -> escuela)

## Tablas intermedias y relaciones

**escuela_publicacion:** escuela_id_escuela (PK/FK -> escuela), publicacion_id_publicacion (PK/FK -> publicacion)

**usuario_publicacion:** usuario_id_usuario (PK/FK -> usuario), publicacion_id_publicacion (PK/FK -> publicacion)

**etiqueta_publicacion:** etiqueta_id_etiqueta (PK/FK -> etiqueta), publicacion_id_publicacion (PK/FK -> publicacion)

**publicacion_comentario:** publicacion_id_publicacion (PK/FK -> publicacion), comentario_id_comentario (PK/FK -> comentario)

**usuario_comentario:** usuario_id_usuario (PK/FK -> usuario), comentario_id_comentario (PK/FK -> comentario)

**moderador_comentario:** usuario_id_moderador (PK/FK -> usuario), comentario_id_comentario (PK/FK -> comentario)

**me_gusta:** usuario_id_usuario (PK/FK -> usuario), publicacion_id_publicacion (PK/FK -> publicacion), fecha_creacion

**territorio_especie:** territorio_id_territorio (PK/FK -> territorio), especie_id_especie (PK/FK -> especie)

## Seguridad RLS y funciones auxiliares

- **Funciones:** `es_usuario_activo()` y `mi_id_usuario()`.
- **Lectura pública:** `escuela`, `etiqueta`, `etiqueta_publicacion`, `escuela_publicacion`, `publicacion_comentario`, `me_gusta`, `territorio_especie`, además de registros visibles en `publicacion` (`estado = 'publicado'`), `archivo` (de publicaciones publicadas), `comentario` (`estado` aprobado/publicado), `territorio` (`estado = 'activo'`) y `especie` (`estado = 'activo'`).
- **Gestión autenticada:** solo usuarios registrados en `usuario` con `activo = true` pueden crear o editar contenidos; cada usuario solo puede editar su propio perfil y gestionar sus propios `me_gusta` o `usuario_comentario`.
