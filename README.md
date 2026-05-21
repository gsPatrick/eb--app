# EB Services — App Prestador (React Native / Expo)

Aplicativo mobile para prestadores de serviço da EB Services.

## Stack

- Expo SDK 54 · React Native · JavaScript (sem TypeScript)
- React Navigation (Stack + Bottom Tabs customizada)
- Axios · AsyncStorage · Socket.io-client
- Lucide React Native · Reanimated · Expo Location / Camera

## Estrutura

```
src/
  api/           # Camada HTTP (espelho da web)
  assets/        # Ícones e imagens
  components/    # Atomic Design (atoms → molecules → organisms)
  screens/       # Telas completas
  navigation/    # Stack + Tab Bar
  context/       # Auth + Realtime
  hooks/         # useApi, useLocation, useCamera
  theme/         # Design tokens Figma
  utils/         # Formatadores e geofence
```

## Primeira entrega

- Splash Screen cinematográfica
- Onboarding (3 slides)
- Login conectado à API (`POST /users/login`)
- Permissões GPS + Câmera
- Tab Bar: Agenda · Histórico · Perfil
- Agenda com Skeleton loading + API real

## Executar

```bash
cd eb--app
npm install
npx expo start
```

## API

Domínio fixo: `https://sistema-api.a8v108.easypanel.host/api/v1`

Login exclusivo para role `provider`.
