# XXXIII CNDP - Plataforma digital

Aplicacion Next.js y maqueta Expo/React Native del ecosistema digital para el XXXIII Congreso Nacional de Derecho Procesal, La Plata 2026.

## Stack

- Next.js con App Router para web.
- React para interacciones de agenda, favoritos y networking.
- Export estatico para GitHub Pages.
- React Native con Expo para maqueta movil.
- GitHub Actions para build y deploy automatico de la web.

## Rutas web principales

- `/` Home institucional.
- `/agenda` Agenda filtrable y favoritos.
- `/sedes` Sedes e informacion util.
- `/ponentes` Panel de ponentes.
- `/ponencias` Repositorio de ponencias.
- `/networking` Directorio de participantes.
- `/perfil` Maqueta conceptual de app movil.

## Desarrollo web local

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Desarrollo mobile con Expo

```bash
cd mobile
npm install
npm run start
```

Escanear el QR con Expo Go desde iOS o Android.

## Build estatico web

```bash
npm run build
```

El sitio exportado queda en `out/`.

## Deploy web

Cada push a `main` ejecuta `.github/workflows/deploy-pages.yml` y publica el sitio en GitHub Pages.

URL esperada cuando Pages este activo:

`https://abugvila.github.io/congresoapp/`

## Deploy de maqueta de app

Para mostrar una maqueta navegable sin publicar en stores, hay tres caminos:

- Web responsive en GitHub Pages: ideal para validar interfaz rapido.
- Expo Preview con React Native: permite abrir la maqueta en un telefono con Expo Go.
- Build interno con EAS/TestFlight/APK: sirve para compartir una app instalable con testers.

## Incluye

- Home institucional con emblema estilizado y cuenta regresiva.
- Menu desplegable con secciones.
- Paginas separadas por modulo.
- Agenda filtrable por dia y tipo de actividad.
- Favoritos persistidos en `localStorage` en web.
- App Expo con bottom navigation: Agenda, Ponentes, Networking y Perfil.
- Seccion de sedes con mapa conceptual.
- Panel de ponentes.
- Repositorio de ponencias con formulario de validacion.
- Networking con buscador de participantes.
- Manifest PWA inicial.
