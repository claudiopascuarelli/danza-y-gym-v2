# Modelo operativo e infraestructura

## Propiedad

- Repositorio GitHub del cliente.
- Proyecto Supabase del cliente.
- Proyecto Vercel del cliente.
- Dominio registrado a nombre del cliente.
- DNS administrable por acceso delegado.

## Acceso inicial

- Invitación al correo del owner.
- Configuración de contraseña en primer acceso.
- Recuperación controlada por el cliente.
- MFA recomendado.
- Soporte mediante acceso temporal y revocable.

## Cobros

- Medios configurables: efectivo, transferencia, billetera, tarjeta u otro.
- Estados: informado, pendiente, confirmado, parcial, rechazado y revertido.
- Evidencia opcional de transferencia.
- Registro del usuario que informa y confirma.
- Cierre de caja con saldo esperado, contado y diferencia.
- Sin eliminación de cobros confirmados.

## Comprobantes

- El comprobante interno debe indicar que no es una factura fiscal.
- La facturación ARCA es un proceso separado y opcional.
- Exportación mensual disponible para el contador.

## Flujo de entrega

`cambios locales → revisión → git diff --check → npm run build → prueba visual → commit → push → deploy Vercel`
