# Alcance funcional configurable

## Alumnos

- Alta, baja lógica, búsqueda y filtros.
- Inscripciones modificables sin eliminar alumnos.
- Cambio automático de listas al cambiar una inscripción.
- Nombre, apellido, DNI, dirección, nacimiento y edad calculada.
- Contactos responsables configurables.
- Teléfonos y correos.
- Apto físico y autorizaciones.
- Alertas configurables de edad y recategorización.

## Portal del alumno

- Estado de cuenta y vencimientos.
- Historial de pagos.
- Clases, talleres y asistencias.
- Calendario y sala virtual opcional.
- Comprobante interno imprimible y compartible.

## Clases, salas y grilla

- Actividades y categorías configurables.
- Profesores, niveles, capacidad y edades.
- Salas configurables.
- Grilla visual Día, Semana y Mes con filtros por sala, profesor y actividad.
- Detección de superposiciones de sala y profesor.
- Reservas, cupos y listas de espera configurables.
- Reglas detalladas en [GRILLA_Y_RESERVAS.md](GRILLA_Y_RESERVAS.md).

## Formaciones

- Carreras y cantidad de años configurables.
- Clases y talleres obligatorios por año.
- Identificación visual.
- Exportación de asistencia por período.
- Reglas específicas de becas y conceptos alcanzados.

## Talleres

- Catálogo configurable.
- Obligatorios u opcionales.
- Abiertos a externos.
- Recargo para externos configurable por porcentaje o importe fijo.

## Cuotas, descuentos y becas

- Valores y vencimientos configurables.
- Recargos por fecha y medio de pago.
- Descuentos familiares, de formación o por rol.
- Reglas acumulables o excluyentes.
- Porcentaje o importe fijo.
- Vigencia desde/hasta.
- Pagos parciales y aplicación a conceptos.
- Becas con cupo, porcentaje, período y alcance.

## Profesores y liquidaciones

- Pago porcentual por alumno.
- Importe por alumno, hora, clase o mes.
- Porcentaje de recaudación.
- Reglas por profesor, clase o taller y con vigencia.
- Liquidación mensual detallada.
- Estado pendiente o pagado y medio de pago.

## Asistencias

- Acceso restringido para profesores.
- Uso desde tablet en recepción.
- Registro por clase o taller.
- Reportes y exportación según permisos.

## Ventas adicionales

- Productos, variantes y listas de precios.
- Pedidos y medios de pago.
- Descuentos para alumnos.
- Comisión de la academia.
- Rendición a proveedor o responsable.
- Impresión y envío por WhatsApp.

## Reportes

- Deuda y vencimientos.
- Asistencias.
- Liquidaciones.
- Caja y recaudación simple.
- Exportaciones para administración o contador.

## Facturación y ARCA

- Sin facturación fiscal, facturación externa o integración ARCA.
- Configuración fiscal por cliente.
- Homologación separada de producción.
- Punto de venta, tipos de comprobante y numeración correlativa.
- Estados borrador, enviando, autorizado, observado y rechazado.
- CAE, vencimiento, auditoría e idempotencia.
- Certificados y claves solo en backend y secretos del cliente.
- Una factura autorizada no se elimina; se corrige mediante comprobante fiscal correspondiente.
