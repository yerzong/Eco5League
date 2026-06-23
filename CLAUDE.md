# ECO5League — Guía del proyecto (contexto para Claude / desarrolladores)

App móvil de una **liga de esports (Gears / Xbox)** en **React Native**. Hoy está en
fase de **maquetado** (UI fiel a Figma) con datos simulados; el backend se conecta
después a través de la capa de servicios ya preparada.

> Este archivo es la fuente de verdad para retomar el desarrollo en cualquier
> sesión nueva. Mantenerlo actualizado al agregar features importantes.

---

## 1. Stack

- **React Native 0.86** (bare CLI, **no** Expo) + **TypeScript**
- **React Navigation v7** (native-stack + bottom-tabs)
- **react-native-svg** (badges, fondos con glow, botones angulares)
- Íconos: **@tabler/icons-react-native** (siempre vía `src/design-system/icons.ts`)
- Fuentes: **Oswald** (titulares/CTAs) + **Inter** (cuerpo)
- iOS: módulo nativo Swift (Vision) para quita-fondos de fotos
- Diseño: Figma **"ECO 5 ESPORTS"** (plugin Figma Desktop Bridge para leer/editar)

---

## 2. Arquitectura — 5 capas en `src/`

Estructura **feature-first**. La regla que mantiene todo desacoplado:

> **Dirección de dependencias:** `features` → usa `design-system`, `shared` y
> `services`. Nunca al revés. `design-system` solo conoce sus `tokens`.
> `shared` y `services` no importan UI. `app` es el único que conoce a todos.

```
src/
├── app/            Composición y arranque
│   ├── App.tsx                      raíz: <AppProviders><RootNavigator/>
│   ├── providers/AppProviders.tsx   SafeAreaProvider + SessionProvider
│   └── navigation/
│       ├── RootNavigator.tsx        isAuthenticated ? AppTabs : Onboarding
│       ├── OnboardingNavigator.tsx  stack del flujo de acceso
│       ├── tabs/AppTabs.tsx         tab bar dinámica por rol
│       ├── tabs/tabScreens.ts       mapa TabKey → pantalla
│       └── types.ts                 param lists tipados de navegación
│
├── design-system/  Lenguaje visual (genérico, sin negocio)
│   ├── tokens/      colors.ts · spacing.ts · typography.ts (fuente de verdad)
│   ├── theme.ts     agrupa los tokens → se consume como `theme.colors…`
│   ├── icons.ts     punto único de íconos Tabler
│   └── components/  Txt, Button, AngularButton, TextField, SelectField,
│                    OtpInput, PasswordRules, ConfirmModal, BottomSheet,
│                    ProgressBar, CircleBadge, AuthHeader, TextLink,
│                    Eyebrow, BackButton, HexBadge, GlowBackground, Screen…
│                    (exportados por components/index.ts)
│
├── features/       El producto, por dominio (cada uno con screens/)
│   ├── auth/        onboarding completo (ver §6)
│   ├── eventos/ perfil/ partidas/ gestion/ descubrir/
│   └── organizacion/ invitaciones/ staff/   (placeholders por ahora)
│
├── services/       Capa de datos / integraciones (POO) — ver §5
│   ├── config.ts            apiBaseUrl, useMockServices, datos demo
│   ├── http/ApiClient.ts    cliente fetch (clase) + ApiError.ts
│   ├── auth/                 AuthService (interfaz) + Mock + Http
│   └── index.ts             composition root: exporta `authService`, `apiClient`
│
└── shared/         Lógica transversal SIN UI
    ├── auth/        SessionContext, roles.ts, permissions.ts, mockUsers.ts (datos)
    ├── hooks/       useExitConfirm.ts
    ├── utils/       validation.ts
    ├── data/        nationalities.ts
    └── native/      backgroundRemover.ts (puente al módulo Swift)
```

**Alias de imports:** `@/` → `src/` (configurado en `babel.config.js` y `tsconfig.json`).
Ej: `import { Txt } from '@/design-system/components'`.

---

## 3. Design system — cómo construir UI

Flujo: **tokens → theme → components → screens**. Reglas:

- **Nunca** escribas un color/spacing a mano en una pantalla. Usa `theme.colors.*`,
  `theme.spacing.*`, `theme.radius.*` o una variante de `Txt`.
- Texto siempre con `<Txt variant="…" color="…">`, no `<Text>` crudo.
- Íconos siempre desde `@/design-system/icons` (no de `@tabler/...` directo).
- Componentes clave reutilizables:
  - `<AuthHeader icon eyebrow title subtitle />` — encabezado de pantallas de auth.
  - `<CircleBadge icon />` — insignia circular (60px) con ícono.
  - `<AngularButton label onPress />` — CTA con esquinas cortadas (borde rojo por defecto).
  - `<TextField label icon error rightAction password />` — campo de formulario.
  - `<TextLink label onPress />` — enlace de texto rojo.
  - `<ConfirmModal />` + `useExitConfirm()` — confirmación al salir de un flujo.

---

## 4. Navegación

- **RootNavigator** decide por `useSession().isAuthenticated`:
  sin sesión → `OnboardingNavigator`; con sesión → `AppTabs`.
- **AppTabs** genera 4 pestañas según el rol (`TABS_BY_ROLE` en `shared/auth/roles.ts`)
  y se remonta con `key={role}` al cambiar de rol.
- Al agregar una pantalla: registra la ruta en `app/navigation/types.ts` **y** en el
  navigator correspondiente.

---

## 5. Capa de servicios (POO) — dónde va la lógica de datos

Toda llamada a backend pasa por `src/services/`. Patrón: **programar contra interfaces**
e **inyectar dependencias** (no instanciar servicios dentro de las pantallas).

```ts
// En una pantalla:
import { authService } from '@/services';
const result = await authService.signIn({ email, password });
```

- `config.ts` decide el modo: `useMockServices: true` (maqueta) usa las clases `Mock*`;
  en `false` usa las `Http*` contra `apiBaseUrl`.
- `AuthService` es una **interfaz** (`services/auth/types.ts`). Implementaciones:
  - `MockAuthService` — valida contra `MOCK_USERS` y el OTP demo.
  - `HttpAuthService` — esqueleto listo: cada método ya mapea a un endpoint REST.
- `services/index.ts` es el **composition root**: elige la implementación y exporta
  la instancia (`authService`). Las pantallas no saben si es mock o HTTP.

**Para agregar un servicio nuevo** (ej. `EventosService`):
1. `services/eventos/types.ts` → interfaz `EventosService`.
2. `MockEventosService` + `HttpEventosService` (usa `apiClient` por constructor).
3. Exporta la instancia elegida en `services/index.ts`.

---

## 6. Estado de la app & datos demo

**Hecho:**
- Flujo completo de **Acceso & Onboarding** (Figma "00 / 00b"):
  Splash · Login (OB-02) · Crear cuenta (OB-03) · Completar perfil (OB-04) ·
  Verificar OTP teléfono (OB-05) · Recuperar contraseña (OB-06a→d).
- **Super-admin** (Figma "08 · Super-admin", sección 📱 App Móvil 390×844):
  - **SA-M01 · Inicio** — dashboard: KPIs, tareas pendientes, actividad reciente.
  - **SA-M05 · Notificaciones** — centro de alertas con filtros por categoría.
  - **SA-M06 · Perfil** — avatar, datos de cuenta, configuración, cerrar sesión
    (+ selector de rol DEMO para probar la navegación por rol).
  - **SA-M02 · Eventos** — búsqueda + filtros FUNCIONALES, evento destacado,
    próximos eventos, FAB, estado vacío.
  - **Navbar por rol**: superadmin/admin ven Inicio · Eventos · Staff · Equipos ·
    Usuarios. Perfil y Notificaciones se abren desde el header (campana + avatar),
    NO son pestañas. Staff/Equipos/Usuarios son placeholder por ahora.

**Sesión:** `SessionContext` guarda `isAuthenticated`, `role`, `nombre`,
`initials` en memoria (`signIn(role?)`, `signOut()`, `setRole()`).
La tab bar sale del rol → para ver Super-admin entra con `gerson@eco5.mx`
o cambia el rol en Perfil. Los botones sociales (Xbox/Discord) entran como jugador.

**Credenciales demo** (en `shared/auth/mockUsers.ts`, contraseña `eco5demo`):

| Correo | Rol |
|--------|-----|
| gerson@eco5.mx | superadmin |
| admin@eco5.mx | admin |
| jugador@eco5.mx | jugador |

**Código OTP demo** (teléfono y recuperación): `529713` (en `services/config.ts`).

**Servicios activos** (todos Mock; ver §5): `authService`, `dashboardService`,
`notificationsService`, `eventsService`.

### 👉 Dónde nos quedamos (retomar aquí)
- **Siguiente pantalla a maquetar: SA-M03 · Staff** (luego SA-M04 · Equipos, luego
  Usuarios). Solo la pantalla principal de cada una por ahora; los **flujos completos
  de cada módulo van al final**.
- Patrón a seguir (ya establecido): leer el nodo de Figma → reutilizar componentes
  del design-system (SearchField, FilterPills, Tag, Fab, GameArt, Avatar,
  HeaderActions, StatCard…) → datos vía un `*Service` POO nuevo en `services/` →
  pantalla en su feature. Header FIJO, búsqueda/filtros funcionales, estado vacío.
- **Figma**: usar **una sola** conexión a la vez (Desktop Bridge *o* MCP oficial,
  nunca ambas — se tumban). Recomendado para design-to-code: **MCP oficial de Figma**
  (`claude mcp add --scope user --transport http figma-desktop http://127.0.0.1:3845/mcp`),
  da capturas confiables. El Desktop Bridge solo si hace falta EDITAR el archivo.
- **Pendiente menor**: el arte de juego (banner "VALORANT/LOL") se genera con Views
  (`GameArt`) porque no hay imágenes exportadas; si dan assets reales, integrarlos.
- **Idea propuesta (no aplicada)**: dejar rol `superadmin` por defecto mientras se
  maqueta este módulo, para no cambiar de rol cada vez. El usuario no confirmó.

---

## 7. Convenciones

- **Commits:** Conventional Commits en español (`feat`, `fix`, `refactor`, `chore`…).
  Rama de trabajo actual: `feat/maqueta-onboarding`.
- **Comentarios y copy:** en español.
- **Buenas prácticas:** componentes genéricos y reutilizables; cero duplicación
  (si algo se repite 2+ veces, extráelo al design-system o a shared); lógica de
  negocio fuera de las pantallas (en `shared` o `services`); tipado estricto.
- Antes de dar por terminado: `npx tsc --noEmit` debe pasar limpio.

---

## 8. Correr la app

```bash
npm start                              # Metro (deja la terminal abierta: r=reload, d=devmenu)
npm run ios -- --simulator="iPhone 17" # simulador
npm run ios                            # iPhone real conectado (desbloquéalo antes)
```

- iPhone real: abrir `ios/Eco5League.xcworkspace` (¡el workspace, no el .xcodeproj!),
  firmar con Apple ID en *Signing & Capabilities*, y confiar el certificado en
  *Ajustes → General → VPN y gestión de dispositivos*. Con Apple ID gratis la app
  caduca a los 7 días.
- Si Metro da `EADDRINUSE`: `lsof -ti:8081 | xargs kill -9`.

---

## 9. Gotchas conocidos

- **Acentos recortados en botones:** los CTAs con `Txt` necesitan `lineHeight` holgado
  o el acento (Ó) se corta arriba. `AngularButton` ya lo maneja.
- **Figma Desktop Bridge** se desconecta seguido; el token REST puede expirar. Si vas a
  leer Figma, reabre el plugin (Plugins → Development → Figma Desktop Bridge) y verifica
  con `figma_get_status`. El plugin (WebSocket) sí puede editar; el REST solo lee.
- **Lint pendiente (pre-existente):** `AppTabs.tsx` (Txt sin usar, componente anidado)
  y `validation.ts` (`dd` sin usar). No bloquean.
