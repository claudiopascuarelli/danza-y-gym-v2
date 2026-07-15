# Grilla, reservas y salas

Este documento conserva el alcance acordado para una implementación real. La demo actual es visual, usa datos ficticios y no reemplaza estas reglas.

## Alcance comercial de la demo

- Selector Día, Semana y Mes.
- Filtros por sala y tipo de actividad.
- Clases regulares, talleres, seminarios, prácticas y eventos.
- Profesor, sala, horario, cupo, ocupación y estado visibles.
- Reserva previa, lista de espera, actividad completa y cambios destacados.
- Datos locales sin conexión a Supabase.

## Implementación real por cliente

### Actividades y calendario

- Separar actividades recurrentes de eventos con fechas específicas.
- Permitir uno o más profesores por actividad.
- Configurar sala, modalidad, nivel, edades, capacidad y período de vigencia.
- Registrar excepciones: feriados, cancelaciones, reemplazos y cambios de horario o sala.
- Detectar superposiciones de sala y profesor antes de guardar.
- Conservar historial y autor de cada modificación.

### Reservas de alumnos

- Configurar si una actividad requiere inscripción o reserva previa.
- Controlar cupo por clase, seminario o evento.
- Estados: pendiente, confirmada, cancelada, asistió, ausente y lista de espera.
- Definir plazo de cancelación y liberación automática del lugar.
- Evitar reservas duplicadas y promover la lista de espera de forma controlada.
- Permitir reserva desde administración y Portal del Alumno según permisos.
- Relacionar la reserva con pagos, cuotas o conceptos cuando corresponda.

### Salas

- La asignación de una sala a una actividad bloquea ese horario.
- Configurar capacidad, equipamiento, accesibilidad y disponibilidad.
- La reserva o alquiler de sala sin una clase asociada será un módulo opcional.
- Si se habilita alquiler, agregar solicitante, tarifa, seña, saldo, estado y cancelación.

### Transferencias y caja

- Una transferencia puede confirmar una reserva o aplicarse a una o varias cuotas.
- Estados: pendiente, confirmada, rechazada, revertida y sin identificar.
- Caja diaria recibe únicamente movimientos confirmados.
- Las confirmaciones y reversiones deben ser auditables y no se eliminan.

### Seguridad y persistencia

- Persistir datos en el Supabase propio del cliente.
- Aplicar autenticación, permisos y RLS después de definir usuarios reales.
- Separar owner, administración, recepción, profesor y alumno o responsable.
- No guardar secretos ni credenciales en frontend o GitHub.
- Probar conflictos, concurrencia, zonas horarias y restauración antes de producción.

## Criterios mínimos de aceptación

- Cambiar entre Día, Semana y Mes sin perder filtros.
- Impedir dos actividades simultáneas en la misma sala.
- Impedir superar el cupo sin lista de espera o autorización.
- Reflejar cancelaciones y reemplazos sin borrar el historial.
- Mantener consistencia entre grilla, reservas, asistencias, pagos y Portal del Alumno.
- Funcionar correctamente en computadora, tablet y celular.

