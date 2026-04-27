# XXXIII CNDP - Plataforma digital

Aplicacion Next.js del ecosistema digital para el XXXIII Congreso Nacional de Derecho Procesal, La Plata 2026.

## Stack

- Next.js con App Router.
- React para interacciones de agenda, favoritos y networking.
- Export estatico para GitHub Pages.
- GitHub Actions para build y deploy automatico.

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Build estatico

```bash
npm run build
```

El sitio exportado queda en `out/`.

## Deploy

Cada push a `main` ejecuta `.github/workflows/deploy-pages.yml` y publica el sitio en GitHub Pages.

URL esperada cuando Pages este activo:

`https://abugvila.github.io/congresoapp/`

## Incluye

- Home institucional con emblema estilizado y cuenta regresiva.
- Agenda filtrable por dia y tipo de actividad.
- Favoritos persistidos en `localStorage`.
- Seccion de sedes con mapa conceptual.
- Panel de ponentes.
- Repositorio de ponencias con formulario de validacion.
- Networking con buscador de participantes.
- Vista conceptual de app movil con navegacion inferior.
- Manifest PWA inicial.
