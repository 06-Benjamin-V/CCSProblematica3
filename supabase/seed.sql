-- =============================================================================
-- Datos de desarrollo iniciales (Seed) para Trafkintu Kimün
-- No contiene datos personales reales ni credenciales.
-- =============================================================================

-- 1. Escuelas participantes
INSERT INTO public.escuela (id_escuela, nombre, descripcion, direccion, ubicacion, canal_youtube)
VALUES
  (
    1,
    'Escuela Reducción Monte Verde',
    'Comunidad educativa rural comprometida con el cuidado de los humedales, la memoria local y el diálogo de saberes ancestrales con el entorno natural.',
    'Sector Monte Verde s/n, Comuna de Nueva Imperial',
    'https://maps.google.com/?q=-38.7450,-72.9500',
    'https://www.youtube.com/@EscuelaMonteVerde'
  ),
  (
    2,
    'Escuela Ruca Raqui',
    'Escuela intercultural emplazada junto al humedal de Ruca Raqui, dedicada a la preservación del patrimonio biocultural, el mapuzugun y la protección comunitaria del agua.',
    'Camino Ruca Raqui km 4, Comuna de Saavedra',
    'https://maps.google.com/?q=-38.7800,-73.3200',
    'https://www.youtube.com/@EscuelaRucaRaqui'
  )
ON CONFLICT (id_escuela) DO NOTHING;

SELECT setval(pg_get_serial_sequence('public.escuela', 'id_escuela'), coalesce(max(id_escuela), 1)) FROM public.escuela;

-- 2. Etiquetas temáticas (Ejes de conocimiento)
INSERT INTO public.etiqueta (id_etiqueta, nombre)
VALUES
  (1, 'Humedales'),
  (2, 'Biodiversidad'),
  (3, 'Medicina ancestral'),
  (4, 'Mapuzugun'),
  (5, 'Espiritualidad'),
  (6, 'Aves nativas'),
  (7, 'Territorio'),
  (8, 'Trafkintu')
ON CONFLICT (id_etiqueta) DO NOTHING;

SELECT setval(pg_get_serial_sequence('public.etiqueta', 'id_etiqueta'), coalesce(max(id_etiqueta), 1)) FROM public.etiqueta;

-- 3. Territorios protegidos y sitios de interés
INSERT INTO public.territorio (id_territorio, nombre, ubicacion, estado, escuela_id_escuela)
VALUES
  (
    1,
    'Humedal y Menoko de Monte Verde',
    'https://maps.google.com/?q=-38.7465,-72.9530',
    'activo',
    1
  ),
  (
    2,
    'Vega y Marisma de Ruca Raqui',
    'https://maps.google.com/?q=-38.7820,-73.3250',
    'activo',
    2
  )
ON CONFLICT (id_territorio) DO NOTHING;

SELECT setval(pg_get_serial_sequence('public.territorio', 'id_territorio'), coalesce(max(id_territorio), 1)) FROM public.territorio;

-- 4. Especies nativas de flora y fauna
INSERT INTO public.especie (
  id_especie,
  nombre_comun,
  nombre_cientifico,
  nombre_mapudungun,
  grupo,
  descripcion,
  habitat,
  estado_conservacion,
  fuente_informacion,
  estado,
  escuela_id_escuela
)
VALUES
  (
    1,
    'Pidén',
    'Pardirallus sanguinolentus',
    'Pürén',
    'Ave',
    'Ave tímida de humedal, de plumaje castaño y pico largo con base verdosa y roja. Se desplaza sigilosamente entre los pajonales.',
    'Pajonales densos y bordes de humedales con agua dulce o salobre.',
    'Preocupación menor (LC)',
    'Observaciones de campo de la comunidad educativa y guías ornitológicas locales.',
    'activo',
    1
  ),
  (
    2,
    'Chucao',
    'Scelorchilus rubecula',
    'Chukaw',
    'Ave',
    'Ave del bosque húmedo y quebradas sombrías. Su canto sonoro y variado es considerado tradicionalmente portador de mensajes y presagios.',
    'Sotobosque húmedo con quila y vegetación ribereña.',
    'Preocupación menor (LC)',
    'Saberes transmitidos por educadores tradicionales y monitoreo escolar.',
    'activo',
    2
  ),
  (
    3,
    'Coipo',
    'Myocastor coypus',
    'Koypu',
    'Mamífero',
    'Roedor acuático autóctono que construye madrigueras en las orillas de humedales y ríos, cumpliendo un rol clave en la dinámica hídrica.',
    'Cuerpos de agua con abundante vegetación palustre.',
    'Preocupación menor (LC)',
    'Inventario de fauna del humedal Ruca Raqui.',
    'activo',
    2
  ),
  (
    4,
    'Hualtata / Trupa',
    'Senecio fistulosus',
    'Walfata',
    'Planta',
    'Hierba perenne de gran tamaño con hojas carnosas e inflorescencias amarillas. Usada ancestralmente como planta medicinal y de protección del agua.',
    'Suelos pantanosos, bordes de esteros y humedales.',
    'Sin categoría de amenaza crítica',
    'Relatos de sabias y sabios de la comunidad Monte Verde.',
    'activo',
    1
  )
ON CONFLICT (id_especie) DO NOTHING;

SELECT setval(pg_get_serial_sequence('public.especie', 'id_especie'), coalesce(max(id_especie), 1)) FROM public.especie;

-- 5. Relación Territorio - Especie
INSERT INTO public.territorio_especie (territorio_id_territorio, especie_id_especie)
VALUES
  (1, 1), -- Monte Verde: Pidén
  (1, 4), -- Monte Verde: Hualtata
  (2, 2), -- Ruca Raqui: Chucao
  (2, 3)  -- Ruca Raqui: Coipo
ON CONFLICT (territorio_id_territorio, especie_id_especie) DO NOTHING;

-- 6. Publicaciones de ejemplo (Saberes compartidos)
INSERT INTO public.publicacion (
  id_publicacion,
  tipo,
  titulo,
  subtitulo,
  contenido,
  autor,
  estado,
  fecha_creacion,
  fecha_publicacion
)
VALUES
  (
    1,
    'poema',
    'El suspiro del Menoko',
    'Canto al despertar del humedal en la mañana temprana',
    E'Nace la niebla sobre el juncal,\nun canto de chucao rompe el silencio del agua.\n\nEl menoko no está solo:\nrespira en las raíces de los temus,\nguarda la memoria de los antiguos que cruzaron este estero.\n\nCuidar el humedal no es tarea de un día,\nes sembrar el respeto en cada palabra,\nen cada trafkintu que hermana nuestras escuelas.',
    'Colectivo de Estudiantes de Ruca Raqui',
    'publicado',
    now() - interval '2 days',
    now() - interval '2 days'
  ),
  (
    2,
    'articulo',
    'Kimün del agua: La memoria viva de nuestros humedales',
    'Experiencia pedagógica de monitoreo comunitario y reciprocidad entre escuelas',
    E'Los humedales de Monte Verde y Ruca Raqui no son simples reservorios hídricos: constituyen espacios vivos de aprendizaje y espiritualidad compartida.\n\nA través de este proyecto de Trafkintu Kimün, las y los estudiantes han documentado la presencia de aves bioindicadoras como el pidén y la tagua, a la vez que han dialogado con sus familias sobre las propiedades curativas de la hualtata.\n\nEste intercambio recíproco refuerza el lazo cultural entre ambas comunidades escolares y nos recuerda que el saber se fortalece cuando se comparte sin fines de lucro, respetando el territorio y sus ciclos naturales.',
    'Docentes y Educadores Tradicionales de Monte Verde',
    'publicado',
    now() - interval '1 day',
    now() - interval '1 day'
  ),
  (
    3,
    'relato',
    'La conversación de los juncos con el viento',
    'Borrador escolar en proceso de revisión',
    'Texto en preparación sobre la observación del viento puelche sobre los pajonales del humedal...',
    'Taller de Escritura Escolar',
    'borrador',
    now(),
    NULL
  )
ON CONFLICT (id_publicacion) DO NOTHING;

SELECT setval(pg_get_serial_sequence('public.publicacion', 'id_publicacion'), coalesce(max(id_publicacion), 1)) FROM public.publicacion;

-- 7. Asociar publicaciones a escuelas
INSERT INTO public.escuela_publicacion (escuela_id_escuela, publicacion_id_publicacion)
VALUES
  (2, 1), -- Publicación 1 pertenece a Ruca Raqui
  (1, 2), -- Publicación 2 pertenece a Monte Verde
  (1, 3)  -- Publicación 3 pertenece a Monte Verde
ON CONFLICT (escuela_id_escuela, publicacion_id_publicacion) DO NOTHING;

-- 8. Asociar publicaciones a etiquetas
INSERT INTO public.etiqueta_publicacion (etiqueta_id_etiqueta, publicacion_id_publicacion)
VALUES
  (1, 1), -- Pub 1: Humedales
  (5, 1), -- Pub 1: Espiritualidad
  (1, 2), -- Pub 2: Humedales
  (2, 2), -- Pub 2: Biodiversidad
  (8, 2)  -- Pub 2: Trafkintu
ON CONFLICT (etiqueta_id_etiqueta, publicacion_id_publicacion) DO NOTHING;

-- 9. Archivos multimedia asociados (alojados en el bucket 'multimedia')
INSERT INTO public.archivo (
  id_archivo,
  tipo,
  nombre,
  bucket,
  ruta,
  descripcion,
  texto_alternativo,
  transcripcion,
  orden,
  publicacion_id_publicacion
)
VALUES
  (
    1,
    'imagen',
    'amanecer-humedal-ruca-raqui.webp',
    'multimedia',
    'escuelas/ruca-raqui/amanecer-humedal.webp',
    'Fotografía del amanecer en la vega de Ruca Raqui con niebla sobre el agua.',
    'Amanecer en el humedal de Ruca Raqui con vegetación acuática y neblina.',
    NULL,
    1,
    1
  ),
  (
    2,
    'imagen',
    'monitoreo-estudiantes-monte-verde.webp',
    'multimedia',
    'escuelas/monte-verde/monitoreo-escolar.webp',
    'Registro fotográfico de la jornada de observación de fauna en el humedal.',
    'Estudiantes de la Escuela Monte Verde registrando aves con prismáticos.',
    NULL,
    1,
    2
  )
ON CONFLICT (id_archivo) DO NOTHING;

SELECT setval(pg_get_serial_sequence('public.archivo', 'id_archivo'), coalesce(max(id_archivo), 1)) FROM public.archivo;
