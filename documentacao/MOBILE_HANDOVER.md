# EB Services — Mobile Handover (Prestador)

Documento de entrega do aplicativo mobile **EB Services Prestador** (`eb--app`). Stack: **Expo SDK 54**, React Native, JavaScript.

---

## 1. Visão geral

| Item | Valor |
|------|-------|
| Pasta | `eb--app/` |
| API | `https://sistema-api.a8v108.easypanel.host/api/v1` |
| WebSocket | `https://sistema-api.a8v108.easypanel.host` |
| Público | Prestadores (`role: provider`) |
| i18n | PT, EN, ES, FR, DE |

### Fluxo principal

Splash → Onboarding → Login → Permissões (GPS + Câmera) → Tabs (Agenda · Histórico · Perfil)

- **Agenda** → Execução (check-in, fotos, extras, check-out)
- **Histórico** → Detalhe com fotos antes/depois + card de ganhos
- **Perfil** → Inventário de Campo · Configurações (idioma) · Logout

---

## 2. Pré-requisitos

- Node.js 20+
- npm ou yarn
- Conta [Expo](https://expo.dev)
- **EAS CLI** instalado globalmente:

```bash
npm install -g eas-cli
```

- Login na Expo:

```bash
eas login
```

---

## 3. Desenvolvimento local

```bash
cd eb--app
npm install
npx expo start
```

- **iOS Simulator:** tecla `i`
- **Android Emulator:** tecla `a`
- **Dispositivo físico:** Expo Go + QR code

### Variáveis de ambiente

A API está fixa em `src/api/api-client.js`. Para staging, altere `API_BASE_URL` e `SOCKET_URL` antes do build de produção.

---

## 4. Configuração EAS (primeira vez)

Na raiz de `eb--app/`:

```bash
eas init
```

Isso associa o projeto à sua conta Expo. O arquivo `eas.json` já está incluímos com perfis:

| Perfil | Uso |
|--------|-----|
| `development` | Dev client interno |
| `preview` | APK Android para testes internos |
| `production` | Loja (Play Store / App Store) |

---

## 5. Gerar APK (Android)

### APK de preview (testes internos — recomendado antes da loja)

```bash
cd eb--app
eas build --platform android --profile preview
```

- Gera um **APK** instalável diretamente (sem Play Store).
- Ao concluir, o EAS exibe um link para download.

### AAB de produção (Google Play Store)

```bash
eas build --platform android --profile production
```

- Gera um **Android App Bundle (`.aab`)** para upload na Play Console.

### Instalar APK no dispositivo

1. Baixe o APK pelo link do EAS Build.
2. No Android, habilite **Fontes desconhecidas** para o navegador/gerenciador de arquivos.
3. Instale o APK.

---

## 6. Gerar build iOS

### Pré-requisitos iOS

- Conta **Apple Developer** (paga).
- Certificados e provisioning profiles gerenciados pelo EAS (recomendado).

### Build de preview (TestFlight / internal)

```bash
cd eb--app
eas build --platform ios --profile preview
```

### Build de produção (App Store)

```bash
eas build --platform ios --profile production
```

### Submeter à App Store

Após build de produção:

```bash
eas submit --platform ios --profile production
```

Siga o assistente para escolher o build e conectar à App Store Connect.

---

## 7. Build simultâneo (Android + iOS)

```bash
eas build --platform all --profile production
```

---

## 8. Identificadores do app

Configure em `app.json` antes do primeiro build de produção:

```json
{
  "expo": {
    "slug": "eb-services-provider",
    "ios": {
      "bundleIdentifier": "com.ebservices.provider"
    },
    "android": {
      "package": "com.ebservices.provider"
    }
  }
}
```

> **Importante:** `bundleIdentifier` e `package` devem ser únicos na Apple/Google. Ajuste conforme o domínio da empresa.

---

## 9. Permissões nativas

Já configuradas em `app.json`:

| Permissão | Motivo |
|-----------|--------|
| Localização | Geofence 200 m no check-in/check-out |
| Câmera | Fotos antes/depois |
| Galeria | Anexo de fotos existentes |

---

## 10. Real-time (Socket.io)

O app escuta:

| Evento | Ação no app |
|--------|-------------|
| `ORDER_ASSIGNED` | Alerta + refresh da Agenda |
| `INVENTORY_CRITICAL` | Refresh do Inventário |
| `force_logout` | Logout imediato |

Requer backend com `notifyOrderAssigned` (implementado em `service-order.service.js`).

---

## 11. Offline

Fila AsyncStorage (`eb_offline_queue`): check-in, check-out e extras são enfileirados sem sinal e sincronizados na reconexão do socket.

---

## 12. Estrutura de pastas

```
eb--app/
├── App.js
├── app.json
├── eas.json
├── src/
│   ├── api/           # Axios + endpoints
│   ├── components/    # Atomic Design
│   ├── context/       # Auth, i18n, Realtime
│   ├── hooks/
│   ├── i18n/locales/  # pt, en, es, fr, de
│   ├── navigation/
│   ├── screens/
│   ├── theme/
│   └── utils/
└── documentacao/
    └── MOBILE_HANDOVER.md
```

---

## 13. Checklist pré-deploy

- [ ] `bundleIdentifier` / `package` definidos em `app.json`
- [ ] Ícones e splash em `assets/` (1024×1024 icon, splash 1284×2778)
- [ ] API apontando para produção
- [ ] Build `preview` testado em dispositivo físico (GPS + câmera)
- [ ] Login com usuário `provider` real
- [ ] Teste de atribuição OS → notificação `ORDER_ASSIGNED`
- [ ] Build `production` + submit iOS/Android

---

## 14. Comandos rápidos

```bash
# Dev
npx expo start

# APK Android (teste)
eas build -p android --profile preview

# Produção Android (Play Store)
eas build -p android --profile production

# Produção iOS (App Store)
eas build -p ios --profile production

# Submit iOS
eas submit -p ios --profile production

# Submit Android
eas submit -p android --profile production
```

---

## 15. Suporte

- Documentação Expo EAS: https://docs.expo.dev/build/introduction/
- Backend handover: `eb--api/src/documentacao/BACKEND_HANDOVER_FINAL.md`

**EB Services** — Ecossistema pronto para deploy final.
