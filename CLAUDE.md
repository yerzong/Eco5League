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
  Las 4 listas (Eventos/Staff/Equipos/Usuarios) comparten el patrón rediseñado:
  header fijo + búsqueda + **fila de controles** (`ControlsRow`: pill de orden
  `SortControl` + botón `FiltersButton` con badge) + chips (`FilterPills`) +
  **fila de conteo** (`CountRow`) + lista. Búsqueda, chips, **orden y filtros son
  FUNCIONALES**:
  - **Filtros** → `FilterSheet` (bottom sheet genérico): grupos de chips
    multi-selección por entidad (Eventos: Estado/Tipo/Juego · Staff: Sub-rol/
    Estado/Alcance · Equipos: Estado/Roster/Evento · Usuarios: Rol/Estado/Xbox),
    "Limpiar" y CTA "VER N …". El badge del botón muestra nº de filtros activos.
  - **Ordenar** → `SortSheet` (bottom sheet genérico): criterio (radios) +
    dirección (`SegmentedControl`) + "APLICAR ORDEN".
  - Lógica de filtrado pura y genérica en `shared/filters.ts` (`applyFilterGroups`,
    `countSelected`, `toggleSelection`); cada pantalla declara sus `FILTER_GROUPS`
    con predicados sobre sus datos.
  - **SA-M02 · Eventos** (v2) — chips por estado (Todos/En curso/Inscripciones/
    Finalizados), cards con cover (gradiente por acento + logo + badge), secciones
    "En curso" / "Próximos", FAB.
  - **SA-M03 · Staff** (v2) — chips por rol (Todos/Caster/Streamer/Moderador),
    tarjetas con avatar coloreado, chips de rol, estado, alcance, "Gestionar".
  - **SA-M04 · Equipos** (v2) — tarjetas con barra de acento por estado, escudo,
    nombre+org, cupo, "Ver equipo".
  - **USR · Usuarios** (v2) — mismo `ScreenHeader` que el resto (eyebrow + título +
    total + campana/avatar), chips de rol redondeados, filas con avatar sólido,
    badge de rol, @usuario, estado y fecha.
  - **Navbar por rol**: superadmin/admin ven Inicio · Eventos · Staff · Equipos ·
    Usuarios. Perfil y Notificaciones se abren desde el header (campana + avatar),
    NO son pestañas. **Todas las pestañas SA ya están maquetadas.**

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
`notificationsService`, `eventsService`, `staffService`, `teamsService`,
`usersService`.

- **Rediseño "glass" de las 5 pantallas principales SA** (Figma "SAN ✦ Pantallas
  principales (glass)", nodo `586:3719`): Inicio · Eventos · Staff · Equipos ·
  Usuarios. Todas usan fondo `bgDeep` + `GlowBackground` + `GlassScreenHeader`
  (título + campana + avatar). Eventos: `GlassSearch` + `GlassToolbar` + secciones
  (`GlassSectionHeader`) con `GlassEventCard` + FAB. Staff/Equipos/Usuarios:
  `GlassSearch` + `GlassToolbar` + `GlassCountRow` + lista (`GlassStaffRow` /
  `GlassTeamRow` / `GlassUserRow`). Orden y filtros siguen funcionando vía
  `SortSheet`/`FilterSheet` (el toolbar los abre). Las versiones v2 anteriores
  (ScreenHeader/SearchField/ControlsRow/chips) quedaron reemplazadas.

### 👉 Dónde nos quedamos (retomar aquí)
- **Módulo Eventos: COMPLETO** — listado v2, **Crear evento** (wizard 3 pasos +
  éxito animado, subida real de imagen y PDF), **Ver evento** (detalle con 5 tabs:
  Resumen/Equipos/Staff/Brackets/Partidos) y **Editar/Eliminar evento**. La card
  abre Ver evento; desde ahí "Editar" abre el form de edición.
- **Estados de carga (skeletons)**: `SkeletonList` + `useTabLoading(1s)` en las 4
  listas SA.
- **Tab bar "glass" (Figma 580:3366)**: píldora flotante (`AppTabs.tsx`) con fondo
  translúcido `rgba(20,20,24,0.92)`, borde sutil, sombra y esquinas `26`. Se
  superpone al contenido (`position:absolute`); activo en `#ff5f73` (Manrope Bold),
  inactivo `#5b616b`. Sin barra-indicador (no existe en el diseño). Las pantallas
  dejan `paddingBottom ≥110` para no quedar tapadas.
- **DEV autologin** como `superadmin` activado en `SessionContext.tsx`
  (`DEV_AUTOLOGIN = true`); ponlo en `false` para volver a exigir login.
- **Siguiente sugerido**: EV-08/EV-09 (equipos del evento / remover equipo), o
  replicar los flujos (ver/crear/editar) en Staff · Equipos · Usuarios. Patrón:
  leer nodo Figma → reutilizar design-system → datos vía `*Service` POO + filtros
  puros (`shared/filters.ts`) → pantalla en su feature.
- **Componentes genéricos clave** (design-system): `ScreenHeader`, `SearchField`,
  `ControlsRow`/`SortControl`/`FiltersButton`/`CountRow`, `FilterPills`,
  `FilterSheet`/`SortSheet`, `SegmentedControl`, `StatusPill`, `ActionLink`,
  `Avatar` (prop `font`/`solid`), `GameArt`, `Fab`, `BottomSheet`, `StepIndicator`,
  `FormField`/`FormInput`/`FormSelect`/`FormDate`/`CoverUpload`/`PdfUpload`,
  `GradientButton`, `Skeleton`/`SkeletonList`, `DangerConfirm`.
- **Componentes "glass" (rediseño SA)**: `GlassScreenHeader`, `GlassSectionHeader`,
  `GlassKpiCard`, `GlassTaskCard`, `GlassEventCard`, `GlassSearch`, `GlassToolbar`,
  `GlassCountRow`, `GlassStaffRow`, `GlassTeamRow`, `GlassUserRow`. Tokens glass en
  `colors.ts` (`glassFill`, `glassBorder`, `bgDeep`, `textOnGlass*`…), fuentes
  Space Grotesk + Manrope (`fonts.glass*`), util `withAlpha` en `colorUtils.ts`.
- **Deps nativas añadidas** (requieren rebuild, no solo reload): `react-native-image-picker`
  (portada) y `@react-native-documents/picker` (PDF). Para pods: `bundle exec pod
  install` desde `ios/` (CocoaPods 1.15.2 del Gemfile; el `pod` de Homebrew es 1.16.2
  y rompe `run-ios`).
- **Figma**: archivo **"ECO 5 ESPORTS"**, `fileKey = WLPeo7vBpmHcNjtVzBUYmK`.
  Conectado por el **MCP oficial de Figma** (`plugin:figma`, autenticado como
  gersongarcia@zurco.com.mx). Para leer diseños: `get_design_context` / `get_screenshot`
  / `get_metadata` con ese fileKey y el `node-id` de la URL (`123-456` → `123:456`).
  Si un nodo es muy grande, la respuesta se guarda en archivo y devuelve metadata.
  Usar **una sola** conexión a la vez (oficial *o* Desktop Bridge, nunca ambas).
- **Pendiente menor**: el arte de juego (banner) se genera con `GameArt` (Views/SVG);
  si dan assets reales, integrarlos.

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
