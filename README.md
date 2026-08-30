# TiendaWisp

Monorepo para una tienda online profesional de equipos de antenas y redes con arquitectura hexagonal.

## Estructura

- `backend`: API Node.js + Express + TypeScript
- `frontend`: React + Vite + TypeScript + Tailwind CSS
- `prisma`: esquema y migraciones de PostgreSQL

## Arquitectura

- Domain: reglas de negocio puras
- Application: casos de uso
- Adapters: HTTP, persistencia, IA, pagos, almacenamiento, shipping
- Infrastructure: composición, config y arranque

## Siguientes pasos

1. Instalar dependencias en `backend` y `frontend`.
2. Ejecutar Prisma para generar cliente y migraciones.
3. Conectar los adapters reales a los ports.
