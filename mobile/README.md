# XXXIII CNDP - Mobile Expo

Maqueta React Native con Expo para probar la experiencia movil del congreso en iOS, Android y web.

## Como correrla

```bash
cd mobile
npm install
npm run start
```

Luego escanear el QR con Expo Go desde el telefono.

## Pantallas incluidas

- Agenda con filtros y favoritos de sesion.
- Ponentes con tarjetas institucionales.
- Networking con buscador.
- Perfil con estado de inscripcion, repositorio y notificaciones.

## Build interno opcional

Para generar una APK interna con EAS:

```bash
cd mobile
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

Para iOS se necesita cuenta Apple Developer y usar TestFlight o desarrollo interno.
