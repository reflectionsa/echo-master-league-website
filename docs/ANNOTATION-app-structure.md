# Annotation Report: App Structure

Generated: 2026-06-19

---

## /src/App.jsx

**Purpose:** Root application component that sets up routing, theme context, auth context, and particles provider, rendering a five-route SPA.

**Dependencies (imports):**
- `@chakra-ui/react` (Box)
- `react-router-dom` (BrowserRouter, Routes, Route)
- `@tsparticles/react` (ParticlesProvider)
- `./hooks/useTheme` (useTheme)
- `./theme/colors` (getThemedColors)
- `./context/AuthContext` (AuthProvider)
- `./utils/particlesInit` (particlesInit)
- `./components/Navigation`
- `./components/Hero`
- `./components/DataChangeNotifier`
- `./components/FloatingShapes`
- `./components/AnnouncementsSection`
- `./components/MatchesOfWeek`
- `./components/SeasonHighlight`
- `./components/SeasonCountdown`
- `./components/MatchesView`
- `./components/TeamsView`
- `./components/MembersView`
- `./components/LeaderboardView`

**Exports:**
- `App` (default export)

**State management:**
- `useTheme()` hook destructures: `theme`, `toggleTheme`, `colorScheme`, `mode`, `setColorScheme`, `setMode`
- `getThemedColors(theme)` derives `colors` object

**Key patterns:**
- BrowserRouter wraps the entire app (client-side routing)
- Provider nesting order: BrowserRouter > ParticlesProvider > AuthProvider
- Five routes defined: `/`, `/matches`, `/teams`, `/members`, `/standings`
- `HomePage` is an inline functional component (lines 22-30), not a separate module
- `theme` prop is threaded manually into every child component

**SMELL annotations:**

1. **[ROUTING-MISMATCH]** App.jsx defines five routes (`/`, `/matches`, `/teams`, `/members`, `/standings`) using eagerly-imported components (lines 16-19, 58-64), but Navigation.jsx lazy-imports the same components (`MatchesView`, `TeamsView`, `MembersView`, `LeaderboardView`) and renders them as overlay modals (lines 24-26, 30, 449-457). The same view components are loaded twice via different mechanisms for different presentation modes.

2. **[ROUTE-DEAD-CODE]** Routes for `/matches`, `/teams`, `/members`, `/standings` (lines 60-63) import and render components eagerly, but Navigation.jsx navigates to some paths via `navigate()` (e.g., `/teams` at line 244, `/rules` at line 255, `/announcements` at line 207, `/about` at line 219, `/media` at line 279, `/leaderboard` at line 293) for which no `<Route>` exists in App.jsx. Those navigations will render a blank page (no catch-all route).

3. **[MISSING-ROUTE]** Navigation.jsx navigates to `/announcements` (line 207), `/about` (line 219), `/rules` (line 255), `/media` (line 279), `/leaderboard` (line 293) -- none of these paths have corresponding `<Route>` definitions in App.jsx (lines 58-64).

4. **[PROP-THREADING]** `theme` is passed as a prop to every component (lines 22, 45, 48-55, 59-63, 68). No context or provider is used for theme distribution despite AuthProvider and ParticlesProvider already being context-based.

5. **[EAGER-IMPORT]** `MatchesView`, `TeamsView`, `MembersView`, `LeaderboardView` are eagerly imported (lines 16-19) for route rendering, while Navigation.jsx lazy-imports the same components (lines 24-26, 30). The eager imports in App.jsx defeat the lazy-loading benefit.

6. **[NOTIFIER-PLACEMENT]** `DataChangeNotifier` (line 68) is rendered outside the `<Box position="relative" zIndex="1">` wrapper (line 47) but inside AuthProvider. It is a sibling to the main layout box rather than inside it.

---

## /src/main.jsx

**Purpose:** Application entry point that mounts the React root with ChakraProvider, ErrorBoundary, and StrictMode.

**Dependencies (imports):**
- `react` (React)
- `react-dom/client` (createRoot)
- `@chakra-ui/react` (ChakraProvider)
- `./theme/system` (system)
- `./App.jsx` (App)
- `./styles.css` (side-effect import)
- `./ErrorBoundary` (ErrorBoundary)

**Exports:**
- None (entry point)

**State management:**
- None

**Key patterns:**
- `React.StrictMode` wraps entire tree
- ChakraProvider uses `value={system}` prop (Chakra UI v3 API)
- ErrorBoundary wraps App

**SMELL annotations:**

1. **[UNUSED-IMPORT]** `React` is imported (line 1) but not used as a named reference in JSX (React 17+ JSX transform does not require it). Only needed if StrictMode is accessed as `React.StrictMode`, which it is (line 11) -- so the import is technically used, but `StrictMode` could be destructured directly.

---

## /src/components/Navigation.jsx

**Purpose:** Primary navigation bar component (fixed top bar + mobile bottom bar) that also owns all overlay/modal state and renders 20+ lazy-loaded modal/panel views.

**Dependencies (imports):**
- `@chakra-ui/react` (Box, Container, HStack, Button, Menu, Portal, Image, Text, Badge)
- `lucide-react` (ChevronDown, Trophy, Calendar, Users, MessageCircle, Shield, Tv, Bell, Swords, ClipboardList, Megaphone, Info, CalendarDays, BookOpen, Bot, Film, BarChart2)
- `react` (useState, useEffect, lazy, Suspense)
- `react-router-dom` (useNavigate, useLocation)
- `./ThemeToggle`
- `./ThemePicker`
- `../theme/colors` (getThemedColors)
- `../hooks/useAuth` (useAuth)
- `./LoginButton`
- `./UserMenu`
- `../hooks/useNotifications` (useNotifications)
- `../hooks/useMyTeam` (useMyTeam)
- `../hooks/useSchedule` (useSchedule)
- `../hooks/useEmlApi` (emlApi)

**Lazy-loaded imports (20):**
- ProductionSignup, AdminPanel, AnnouncementsView, AboutView, CalendarView, ResourcesView, StandingsView, MatchesView, MembersView, TeamsView, RulesView, BotView, MediaView, LeaderboardView, CasterGreenRoom, NotificationsPanel, TeamCreationModal, TeamManagementPanel, PlayerRegistrationModal, ChallengeSystem, MatchReportModal, MyTeamView, MyProfileModal, CreateTicketModal

**Exports:**
- `Navigation` (default export)

**State management:**
- 22 `useState` calls for modal/panel open states (lines 65-86)
- 1 `useState` for `myTeamId` (line 86)
- `useAuth()` hook provides: `isLoggedIn`, `isCaster`, `isAdmin`, `isMod`, `isPlayer`, `user`, `error`, `isRegistered`, `playerProfile`, `isOnTeam`, `refreshProfile`
- `useNotifications()` provides: `unreadCount`
- `useMyTeam()` provides: `team`, `isOnTeam`, `loading`
- `useSchedule()` provides: `matches`
- Derived state: `isOnTeam = authIsOnTeam || rosterIsOnTeam` (line 63)

**Key patterns:**
- Lazy loading: 24 components loaded via `React.lazy()` (lines 17-41)
- Auth-gated rendering: conditional rendering based on `isLoggedIn`, `isCaster`, `isAdmin`, `isMod` (lines 461-514)
- Auto-registration modal: opens when logged-in user has no profile and is not on a team (lines 94-98)
- Saturday reminder side-effect: fires a notification API call for unsubmitted match results (lines 101-144)
- Mobile bottom nav: separate fixed bottom bar for base breakpoint (lines 518-645)
- Discord links: duplicated in desktop dropdown (lines 340-402) and mobile dropdown (lines 576-642)
- Mixed navigation model: some items use `navigate()` (router), others use `setState(true)` (modal overlays)

**SMELL annotations:**

1. **[GOD-COMPONENT]** Navigation.jsx is 651 lines. It owns 22 boolean state variables for modal visibility (lines 65-85), renders 24 lazy-loaded overlay components (lines 449-515), contains business logic for Saturday score reminders (lines 101-144), and manages auth-gated UI. This is a navigation bar, view orchestrator, and business logic host simultaneously.

2. **[UNUSED-IMPORT]** `Badge` is imported from `@chakra-ui/react` (line 1) but never used in the component body.

3. **[UNUSED-IMPORT]** `useLocation` is imported from `react-router-dom` (line 4) but never called.

4. **[UNUSED-IMPORT]** `Shield`, `Tv`, `Bell`, `Swords`, `ClipboardList` are imported from `lucide-react` (line 2) but never referenced in the JSX.

5. **[UNUSED-DESTRUCTURE]** `isRegistered` is destructured from `useAuth()` (line 60) but never referenced.

6. **[UNUSED-DESTRUCTURE]** `unreadCount` is destructured from `useNotifications()` (line 61) but never used to render a badge or indicator.

7. **[DUPLICATED-STATE]** `isOnTeam` is derived from two sources: `authIsOnTeam` (from `useAuth`) and `rosterIsOnTeam` (from `useMyTeam`) via OR at line 63. Two hooks independently track the same domain concept.

8. **[STALE-PROPS]** Props `teamsOpen`, `setTeamsOpen`, `membersOpen`, `setMembersOpen`, `membersCategory`, `setMembersCategory`, `standingsOpen`, `setStandingsOpen` are declared in the function signature (lines 49-56) but are also locally managed via `useState` for `matchesOpen` etc. The parent (App.jsx) does not pass these props -- App.jsx renders `<Navigation>` without them (lines 48-55 of App.jsx).

9. **[SYNTAX-ERROR]** Line 255 has `)` instead of `}` in the `onClick` handler: `onClick={() => navigate('/rules'))` -- mismatched closing delimiter. This would cause a build error.

10. **[SIDE-EFFECT-IN-COMPONENT]** The Saturday reminder `useEffect` (lines 101-144) performs an API POST call (`emlApi`) and writes to `localStorage` as a side effect of rendering a navigation component. This is business logic coupled to a UI component.

11. **[DST-ASSUMPTION]** The Saturday reminder logic uses `utcHour >= 16` as an approximation for "12pm ET" (line 109), with a comment acknowledging it is imprecise across DST boundaries. The check will trigger at 12pm EDT but 11am EST.

12. **[MIXED-NAVIGATION]** Some menu items navigate via router (`navigate('/teams')` at line 244, `navigate('/rules')` at line 255) while others open modals (`setResourcesOpen(true)` at line 230, `setBotOpen(true)` at line 267). The same view components (e.g., TeamsView) are both routed-to in App.jsx and rendered as overlays here.

13. **[DUPLICATE-MARKUP]** Discord links dropdown markup is fully duplicated between desktop (lines 340-402) and mobile (lines 576-642) versions, including the same URLs, images, and structure.

14. **[CONDITIONAL-RENDER-ALWAYS-MOUNTED]** Lazy-loaded components like `AnnouncementsView`, `AboutView`, `CalendarView`, `ResourcesView`, `StandingsView`, `MatchesView` (lines 450-458) are always rendered regardless of their `open` state. They receive `open={false}` but remain in the tree.

---

## /package.json

**Purpose:** NPM package manifest defining the project "echo-master-league" at version 2.0.0 with its dependencies and scripts.

**Dependencies (imports):**

Runtime:
- `@chakra-ui/react` ^3.2.2
- `@emotion/react` ^11.14.0
- `@emotion/styled` ^11.14.1
- `@tsparticles/react` ^4.0.5
- `@tsparticles/slim` ^4.0.5
- `lucide-react` ^0.263.1
- `react` ^18.3.1
- `react-dom` ^18.3.1
- `react-router-dom` ^7.18.0

Dev:
- `@vitejs/plugin-react` ^4.3.4
- `gh-pages` ^6.2.0
- `vite` ^6.0.5

**Exports:**
- N/A (private package)

**State management:**
- N/A

**Key patterns:**
- ES modules (`"type": "module"`)
- Dual deploy targets: `deploy` (gh-pages) and `deploy:cf` (Cloudflare Pages via wrangler)
- `data` script uses PowerShell (`powershell -ExecutionPolicy Bypass`)

**SMELL annotations:**

1. **[PLATFORM-LOCK]** The `data` script (line 14) invokes `powershell` with `-ExecutionPolicy Bypass`, making it Windows-only. The deploy scripts and vite config are platform-agnostic.

2. **[DUAL-DEPLOY]** Two deployment targets exist: `deploy` pushes to GitHub Pages via `gh-pages` (line 12), `deploy:cf` pushes to Cloudflare Pages via `wrangler` (line 13). The `wrangler.toml` at project root confirms Cloudflare is configured -- `gh-pages` in devDependencies may be vestigial.

3. **[POSSIBLY-UNUSED-DEP]** `@emotion/styled` (line 19) is listed as a dependency. Chakra UI v3 uses `@emotion/react` internally but `@emotion/styled` is not required unless the `styled()` API is used directly. No evidence of direct usage in the reviewed files.

---

## /vite.config.js

**Purpose:** Vite build configuration enabling the React plugin and setting the dev server to port 3000.

**Dependencies (imports):**
- `vite` (defineConfig)
- `@vitejs/plugin-react` (react)

**Exports:**
- Default Vite configuration object

**State management:**
- N/A

**Key patterns:**
- `base: '/'` -- root-relative asset paths
- Dev server port 3000
- `defineConfig` receives a factory function (arrow function returning object) rather than a plain object

**SMELL annotations:**

1. **[UNNECESSARY-FACTORY]** `defineConfig` is called with `() => ({...})` (line 4) rather than a plain object. The factory form is used when the config needs access to `command`, `mode`, or `ssrBuild` parameters, none of which are used here.

---

## /wrangler.toml

**Purpose:** Cloudflare Pages deployment configuration specifying the build command and output directory.

**Dependencies (imports):**
- N/A (configuration file)

**Exports:**
- N/A

**State management:**
- N/A

**Key patterns:**
- Build section only: `command = "npm run build"`, `destination = "dist"`
- No `[vars]`, `[site]`, `name`, `compatibility_date`, or Workers/Functions configuration present

**SMELL annotations:**

1. **[INCOMPLETE-CONFIG]** The file contains only a `[build]` section (lines 1-3). Standard Cloudflare Pages `wrangler.toml` files typically include `name` and `compatibility_date`. The `deploy:cf` script in package.json supplies `--project-name` on the CLI, which compensates for the missing `name` field.
