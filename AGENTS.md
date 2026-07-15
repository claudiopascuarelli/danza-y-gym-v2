<!-- BEGIN:nextjs-agent-rules -->
# Next.js 16

Esta versión puede incluir cambios de API o estructura. Leer la guía relevante en `node_modules/next/dist/docs/` antes de modificar código Next.js.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — Danza y Gym V2

Leer este archivo antes de analizar, modificar, probar o desplegar.

## Producto

- Aplicación privada por cliente, no SaaS abierto.
- Sin landing pública y sin registro libre.
- Sin superadmin global ni acceso permanente del proveedor.
- GitHub, Supabase y Vercel pertenecen al cliente.
- La primera etapa no usa Supabase.
- ARCA es opcional, desacoplado y desactivado por defecto.

## Trabajo seguro

1. Revisar `git status`.
2. Leer `PRODUCT.md` y `DESIGN.md`.
3. Definir alcance y archivos.
4. Modificar solo lo autorizado.
5. Revisar el diff completo.
6. Ejecutar `git diff --check`.
7. Ejecutar `npm run build`.
8. Explicar cómo probar.
9. Proponer commit.
10. Commit, push y deploy solo con autorización.

## Reglas funcionales

- No escribir porcentajes ni nombres de academias como reglas fijas.
- Usar configuración con vigencia para descuentos, recargos, becas y liquidaciones.
- Usar un catálogo central para menú, rutas, permisos y dependencias.
- No borrar datos al desactivar módulos.
- No borrar cobros confirmados; registrar reversas.
- Separar comprobantes internos de facturación fiscal.
- No guardar certificados o claves fiscales en frontend ni GitHub.

## Evaluación objetiva de ideas

Analizar propuestas estratégicas, comerciales, funcionales o técnicas con la técnica de los seis sombreros:

1. Blanco: hechos, evidencia disponible y datos faltantes.
2. Rojo: intuición, percepción y reacción probable de usuarios o clientes.
3. Negro: riesgos, límites y motivos para no avanzar.
4. Amarillo: beneficios y oportunidades posibles.
5. Verde: alternativas, simplificaciones y experimentos.
6. Azul: síntesis, recomendación y próximo paso verificable.

Reglas de objetividad:

- Separar hechos, inferencias, supuestos y opiniones.
- Verificar afirmaciones inestables o técnicas con fuentes primarias cuando corresponda.
- Indicar nivel de confianza alto, medio o bajo.
- No validar una idea por afinidad con el usuario.
- Recomendar modificar, postergar o descartar una propuesta cuando la evidencia lo justifique.
- Priorizar pruebas pequeñas y reversibles antes de inversiones o desarrollos amplios.

## Prohibido sin aprobación

- Crear o conectar Supabase.
- Configurar RLS, migraciones o Edge Functions.
- Configurar producción de ARCA.
- Modificar Vercel, DNS o variables de entorno.
- Agregar registro público o multiempresa SaaS.
- Crear accesos ocultos.
- Agregar dependencias, hacer refactors grandes o eliminar módulos.
- Crear commits, push o deploy.

## Entrega después de cambios

- Archivos modificados.
- Resumen.
- Resultado de `git diff --check`.
- Resultado de `npm run build`.
- Cómo probar.
- Commit recomendado.
