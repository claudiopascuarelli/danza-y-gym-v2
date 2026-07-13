# Catálogo de módulos y dependencias

## Tipos de relación

- `requires`: dependencia obligatoria y automática.
- `recommends`: sugerencia que el owner puede rechazar.
- `core`: capacidad interna no comercial.
- `dependent`: módulo que impide desactivar su dependencia.

## Catálogo inicial

| Módulo | Requiere | Recomienda |
| --- | --- | --- |
| Alumnos | Personas | Portal |
| Clases | Alumnos, Profesores, Salas | Grilla, Asistencias |
| Formaciones | Alumnos, Clases, Talleres | Becas, Asistencias |
| Talleres | Alumnos, Profesores | Asistencias, Pagos |
| Asistencias | Alumnos, Clases | Portal |
| Cuotas | Alumnos, Pagos | Caja, Portal |
| Caja diaria | Pagos | Reportes |
| Liquidación profesores | Profesores, Clases, Pagos | Reportes |
| Becas | Alumnos, Cuotas | Formaciones |
| Ventas adicionales | Personas, Pagos | Caja |
| Grilla horaria | Clases, Salas, Profesores | Asistencias |
| Portal alumno | Alumnos | Cuotas, Asistencias |
| Reportes | Auditoría | Módulos operativos activos |
| ARCA | Facturación, Datos fiscales, Pagos | Cuotas, Ventas adicionales |

## Reglas del motor

- Al activar un módulo, mostrar dependencias antes de confirmar.
- Activar automáticamente dependencias obligatorias.
- Sugerir, pero no imponer, módulos recomendados.
- Impedir desactivar una dependencia con módulos dependientes activos.
- Desactivar nunca elimina información.
- Menú, rutas, permisos, dashboard y portal consumen el mismo catálogo.
