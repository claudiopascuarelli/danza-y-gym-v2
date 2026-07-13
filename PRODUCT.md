# Danza y Gym V2

## Propósito

Aplicación privada para administrar academias de danza, estudios y gimnasios chicos o medianos. Se entrega como una implementación anual por cliente, con infraestructura y datos bajo control del cliente.

## Modelo comercial

- No es un SaaS abierto.
- No existe registro público.
- Cada cliente tiene su propio GitHub, Supabase y Vercel.
- El cliente es propietario del dominio; el proveedor puede administrar DNS mediante acceso delegado.
- El owner recibe una invitación inicial, configura su contraseña y administra usuarios.
- El proveedor no conserva accesos permanentes ni backdoors.
- Soporte extraordinario mediante acceso temporal, auditable y revocable.

## Usuarios

- Owner: configuración, módulos, usuarios y permisos.
- Administración: alumnos, clases, cobros, caja y reportes.
- Recepción: alumnos, asistencia, cobros y caja según permisos.
- Profesor: acceso restringido a asistencias y sus clases.
- Alumno o responsable: portal privado.

## Alcance funcional

- Alumnos y responsables.
- Profesores básicos.
- Clases, salas y grilla horaria.
- Formaciones o carreras configurables.
- Talleres configurables.
- Asistencias.
- Cuotas, pagos parciales, descuentos, recargos y becas.
- Caja diaria.
- Liquidaciones de profesores.
- Portal del alumno.
- Ventas adicionales.
- Reportes básicos.
- Logos, colores, roles y acceso.
- Facturación fiscal y ARCA como módulo opcional.

## Principios

- Ningún nombre, porcentaje o regla de una academia queda fijo en código.
- Los módulos se habilitan desde un catálogo único con dependencias.
- Desactivar un módulo nunca elimina información.
- Los cobros confirmados se revierten, no se borran.
- Comprobante interno y factura fiscal son conceptos separados.
- ARCA está desactivado por defecto y se ejecuta únicamente desde backend.
- La primera versión usa datos demo y no se conecta a Supabase.

## Fuera de alcance inicial

- SaaS multiempresa.
- Registro público.
- Superadmin global.
- Contabilidad general.
- Compras, stock o ERP genérico.
- Integración real con ARCA antes de contar con credenciales y homologación del cliente.

## Registro

product
