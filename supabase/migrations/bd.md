# Base de datos para Trafkintu Kimün · Intercambio de saberes

La base de datos es una base de datos de tipo sql, por lo que su relación es por tablas

## Entidad

**escuela:** id_escuela, nombre, direccion, ubicacion

**encargado:** id_encargado, nombre, apellido_parterno, apellido_materno, telefono, correo, direccion, titulo, cargo, rut\
**profesor:** id, nombre, apellido_parterno, apellido_materno, telefono, correo, direccion, titulo, cargo, rut \
**estudiante:** id, nombre, apellido_parterno, apellido_materno, telefono, correo, direccion, rut

**poema** id, Titulo, contenido, autor(Encargado, Profesor, Estudiante, Anonimo), Fecha, audio \
**articulo:**id, Titulo, Subtitulo, contenido, autor(profesor), fecha_con_tiempo, audio \
**galeria**id, nombre, etiqueta, escuela, imagen, audio

**imagen:** id, nombre, ruta \
**video:**id, nombre, ruta \
**audio:**id, nombre, ruta