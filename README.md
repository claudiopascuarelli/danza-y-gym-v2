# Danza y Gym V2

Aplicación privada y configurable para academias de danza, estudios y gimnasios chicos o medianos.

## Estado

Primera base frontend con datos locales. No está conectada a Supabase, ARCA ni servicios externos.

## Desarrollo

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Validación

```bash
git diff --check
npm run build
```

## Documentación

- `PRODUCT.md`: modelo comercial y alcance.
- `DESIGN.md`: principios visuales y de experiencia.
- `docs/ALCANCE_FUNCIONAL.md`: capacidades acordadas.
- `docs/MODULOS.md`: dependencias y reglas del catálogo.
- `docs/MODELO_OPERATIVO.md`: propiedad, accesos, cobros y entrega.

## Infraestructura futura

Cada implementación tendrá GitHub, Supabase y Vercel propios del cliente. No hay registro público ni superadmin global.
