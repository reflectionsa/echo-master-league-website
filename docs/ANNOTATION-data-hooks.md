# Data Hooks Annotation Report

Generated: 2026-06-19
Scope: All files in `/mnt/aaliyah/src/hooks/` plus supporting context files.

---

## Hook Inventory (26 files)

---

### useAccessibility.jsx

1. **Purpose**: Detects OS-level accessibility settings (high contrast, forced colors, reduced transparency) to swap red/green to blue/orange for color-blind users.
2. **Data source**: Browser `window.matchMedia` queries against OS preferences.
3. **Return values**: `{ needsColorBlindSupport: boolean }`
4. **Caching strategy**: None. Reads media queries once on mount, listens for live changes.
5. **Error handling**: Guards against SSR with `typeof window === 'undefined'` check. No error state.
6. **Dependencies on other hooks**: None.

---

### useAnnouncements.jsx

1. **Purpose**: Fetches league announcements from the EML Cloudflare Worker API and auto-refreshes every 5 minutes.
2. **Data source**: EML Worker API endpoint `GET /announcements` via `emlApi`.
3. **Return values**: `{ announcements: array, loading: boolean, error: string|null, refresh: function, lastFetched: Date|null }`
4. **Caching strategy**: `setInterval` re-fetches every 5 minutes (matches worker cache TTL per comment).
5. **Error handling**: Catches errors and sets `error` state with `err.message`. Loading state managed via try/finally.
6. **Dependencies on other hooks**: `useEmlApi` (the `emlApi` function).

---

### useAuth.js

1. **Purpose**: Re-exports `useAuth` from `AuthContext.jsx` so consumers can import from the hooks directory.
2. **Data source**: N/A (re-export only).
3. **Return values**: Same as `AuthContext.useAuth`: `{ user, loading, error, login, logout, isAdmin, isMod, isCaster, isPlayer, isLeagueSub, isLoggedIn, playerProfile, isRegistered, isOnTeam, refreshProfile }`
4. **Caching strategy**: N/A.
5. **Error handling**: N/A.
6. **Dependencies on other hooks**: `AuthContext.jsx`.

---

### useChallenges.jsx

1. **Purpose**: Fetches team challenges and provides `sendChallenge` / `respondToChallenge` mutation functions.
2. **Data source**: EML Worker API endpoints `GET /challenges/{teamId}`, `POST /challenge/send`, `POST /challenge/respond` via `emlApi`.
3. **Return values**: `{ challenges: array, loading: boolean, error: string|null, sendChallenge: function, respondToChallenge: function, refresh: function }`
4. **Caching strategy**: None. Fetches on mount and when `teamId` changes; re-fetches after mutations.
5. **Error handling**: Catches errors, sets `error` state. Mutations re-throw after setting error so callers can react.
6. **Dependencies on other hooks**: `useAuth` (for `user.id`), `useEmlApi` (`emlApi` function).

---

### useCooldownList.jsx

1. **Purpose**: Fetches players on transfer cooldown who cannot participate in matches.
2. **Data source**: Primary: `data.json` key `cooldownPlayers` via `useDataJson`. Fallback: Google Sheets range `Cooldown List!A:C`.
3. **Return values**: `{ cooldownPlayers: array, loading: boolean, error: string|null, refetch: function }`
4. **Caching strategy**: Inherits from `useDataJson` (5-min module cache + 2-min polling) and `useGoogleSheets` (2-min polling).
5. **Error handling**: Inherits from sub-hooks. No additional error handling.
6. **Dependencies on other hooks**: `useDataJson`, `useGoogleSheets`.

---

### useDataJson.jsx

1. **Purpose**: Loads a single section from the static `public/data.json` file, serving as a fast-path cache ahead of live Google Sheets calls.
2. **Data source**: Local `data.json` file served from the app's `BASE_URL`.
3. **Return values**: `{ data: any[]|null, loading: boolean, error: string|null }`
4. **Caching strategy**: Module-level singleton cache with 5-minute TTL (`CACHE_TTL_MS`). 2-minute re-poll interval (`POLL_INTERVAL_MS`). Stale threshold of 7 days -- if `data.json.lastUpdated` is older, returns empty array to trigger Sheets fallback. Exposes `invalidateDataJsonCache()` for manual cache-busting.
5. **Error handling**: Catches fetch errors, sets `error` state. Uses `cancelled` flag to avoid state updates after unmount.
6. **Dependencies on other hooks**: None. Also exports `invalidateDataJsonCache`.

---

### useEmlApi.js

1. **Purpose**: Low-level fetch wrapper for the EML Cloudflare Worker API; not a hook itself (no React state), but a shared utility function.
2. **Data source**: Cloudflare Worker at `VITE_WORKER_URL`.
3. **Return values**: Returns the parsed JSON response body. Throws on non-OK responses.
4. **Caching strategy**: None.
5. **Error handling**: Throws `Error` if `VITE_WORKER_URL` is not set. Throws `Error` with server error message or status on non-OK responses.
6. **Dependencies on other hooks**: None.

---

### useGoogleSheets.jsx

1. **Purpose**: Generic hook to fetch and transform data from the Google Sheets v4 API, converting rows into objects keyed by header names.
2. **Data source**: Google Sheets API `GET /v4/spreadsheets/{id}/values/{range}?key={apiKey}`.
3. **Return values**: `{ data: array, loading: boolean, error: string|null, refetch: function }`
4. **Caching strategy**: `setInterval` re-fetches every 2 minutes (`POLL_INTERVAL_MS`). Dispatches `eml:datachanged` custom event on data change.
5. **Error handling**: Catches fetch errors, logs warning to console, sets `error` state. Guards against missing parameters.
6. **Dependencies on other hooks**: None. Also exports `useTeamsFromSheets` and `useMatchesFromSheets` convenience wrappers.

---

### useLeagueSubs.jsx

1. **Purpose**: Fetches registered league substitute players.
2. **Data source**: Primary: `data.json` key `leagueSubs` via `useDataJson`. Fallback: Google Sheets range `Registered League Subs!A:B`.
3. **Return values**: `{ subs: string[], count: number, loading: boolean, error: string|null, refetch: function }`
4. **Caching strategy**: Inherits from `useDataJson` / `useGoogleSheets`.
5. **Error handling**: Inherits from sub-hooks. No additional error handling.
6. **Dependencies on other hooks**: `useDataJson`, `useGoogleSheets`.

---

### useMatches.jsx

1. **Purpose**: Fetches proposed (pending) match results from the "Proposed Match Results" sheet.
2. **Data source**: Primary: `data.json` key `proposedMatches` via `useDataJson`. Fallback: Google Sheets range `Proposed Match Results!A:J`.
3. **Return values**: `{ matches: array, loading: boolean, error: string|null, refetch: function }`
4. **Caching strategy**: Inherits from `useDataJson` / `useGoogleSheets`.
5. **Error handling**: Inherits from sub-hooks. Filters out rows missing both team names.
6. **Dependencies on other hooks**: `useDataJson`, `useGoogleSheets`.

---

### useMatchReport.jsx

1. **Purpose**: Provides `reportMatch` and `disputeMatch` mutation functions for submitting match scores to the backend.
2. **Data source**: EML Worker API endpoints `POST /match/report`, `POST /match/dispute` via `emlApi`.
3. **Return values**: `{ reportMatch: function, disputeMatch: function, loading: boolean, error: string|null }`
4. **Caching strategy**: None (write-only).
5. **Error handling**: Catches errors, sets `error` state, re-throws so callers can handle.
6. **Dependencies on other hooks**: `useAuth` (for `user.id`), `useEmlApi` (`emlApi` function).

---

### useMatchResults.jsx

1. **Purpose**: Fetches completed match results with parsed round-by-round scores.
2. **Data source**: Primary: `data.json` key `matchResults` via `useDataJson`. Fallback: Google Sheets range `Match Results!A:P`.
3. **Return values**: `{ matchResults: array, loading: boolean, error: string|null, refetch: function }`
4. **Caching strategy**: Inherits from `useDataJson` / `useGoogleSheets`.
5. **Error handling**: Inherits from sub-hooks. Filters rows requiring both teams and either scores or forfeit status.
6. **Dependencies on other hooks**: `useDataJson`, `useGoogleSheets`.

---

### useMyTeam.jsx

1. **Purpose**: Finds the logged-in user's team by matching Discord nicknames against roster data, then assembles standings and recent match history.
2. **Data source**: Composed from `useAuth`, `useTeamRoles`, `useStandings`, `useMatchResults`.
3. **Return values**: `{ team: object|null, myRole: string|null, isOnTeam: boolean, standingsData: object|null, matchHistory: array, loading: boolean }`
4. **Caching strategy**: Uses `useMemo` for derived data. Inherits caching from underlying hooks.
5. **Error handling**: None explicit. Degrades gracefully if user is not found on a roster.
6. **Dependencies on other hooks**: `useAuth`, `useTeamRoles`, `useStandings`, `useMatchResults`.

---

### useNotifications.jsx

1. **Purpose**: Polls for user notifications from the worker API every 30 seconds and provides a `markRead` function.
2. **Data source**: EML Worker API endpoints `GET /notifications/{userId}`, `POST /notifications/read` via `emlApi`.
3. **Return values**: `{ notifications: array, loading: boolean, markRead: function, unreadCount: number, refresh: function }`
4. **Caching strategy**: `setInterval` polls every 30 seconds. Optimistic local update on `markRead`.
5. **Error handling**: Silently catches errors (empty `catch` blocks). Comment states "notifications are non-critical".
6. **Dependencies on other hooks**: `useAuth` (for `user.id`, `isLoggedIn`), `useEmlApi` (`emlApi` function).

---

### usePlayerLeaderboard.jsx

1. **Purpose**: Fetches player leaderboard data sorted by overall rating.
2. **Data source**: Primary: `data.json` key `playerLeaderboard` via `useDataJson`. Fallback: Google Sheets range `Player Leaderboard!A:E`.
3. **Return values**: `{ leaderboard: array, loading: boolean, error: string|null, refetch: function }`
4. **Caching strategy**: Inherits from `useDataJson` / `useGoogleSheets`.
5. **Error handling**: Inherits from sub-hooks. Filters out entries without a name.
6. **Dependencies on other hooks**: `useDataJson`, `useGoogleSheets`.

---

### usePlayerProfile.jsx

1. **Purpose**: Finds a player's team and role (Captain/Co-Captain/Player) by searching the team roster data.
2. **Data source**: Derived from `useTeamRoles`.
3. **Return values**: `{ team: object|null, playerRole: string|null, loading: boolean }`
4. **Caching strategy**: None (computed on each render when dependencies change).
5. **Error handling**: None. Returns null values when player is not found.
6. **Dependencies on other hooks**: `useTeamRoles`.

---

### useProductionStats.jsx

1. **Purpose**: Retrieves and aggregates production crew statistics (casters and camera operators).
2. **Data source**: `data.json` key `productionStats` via `useDataJson`. No Google Sheets fallback.
3. **Return values**: `{ casterStats: array, cameraStats: array, allStats: array, loading: boolean, error: string|null, total: { casters, cameraOps, totalEvents, totalMatches } }`
4. **Caching strategy**: Uses `useMemo` for derived data. Inherits `useDataJson` caching.
5. **Error handling**: Inherits from `useDataJson`.
6. **Dependencies on other hooks**: `useDataJson`.

---

### useRankings.jsx

1. **Purpose**: Fetches team rankings with parsed rank tiers (Diamond 1, Platinum 3, etc.) and MMR ratings.
2. **Data source**: Primary: `data.json` key `rankings` via `useDataJson`. Fallback: Google Sheets range `Rankings!A:D`.
3. **Return values**: `{ rankings: array, loading: boolean, error: string|null, refetch: function }`
4. **Caching strategy**: Inherits from `useDataJson` / `useGoogleSheets`.
5. **Error handling**: Inherits from sub-hooks. Filters out empty rows.
6. **Dependencies on other hooks**: `useDataJson`, `useGoogleSheets`.

---

### useSchedule.jsx

1. **Purpose**: Combines completed match results with upcoming matches from Google Sheets into a unified, date-sorted schedule.
2. **Data source**: `useMatchResults` (completed), Google Sheets range `Upcoming Matches!A2:Z` (upcoming), `useTeamRoles` (team enrichment).
3. **Return values**: `{ matches: array, loading: boolean }`
4. **Caching strategy**: Uses `useMemo` for computed data. Inherits caching from underlying hooks.
5. **Error handling**: None explicit. No error state exposed.
6. **Dependencies on other hooks**: `useMatchResults`, `useTeamRoles`, `useGoogleSheets`.

---

### useStandings.jsx

1. **Purpose**: Fetches team standings (position, tier, wins, losses, MMR, points).
2. **Data source**: Primary: `data.json` key `standings` via `useDataJson`. Fallback: Google Sheets range `Rankings!A:D`.
3. **Return values**: `{ standings: array, loading: boolean, error: string|null, refetch: function }`
4. **Caching strategy**: Inherits from `useDataJson` / `useGoogleSheets`.
5. **Error handling**: Inherits from sub-hooks. Filters out empty rows.
6. **Dependencies on other hooks**: `useDataJson`, `useGoogleSheets`.

---

### useTeamHistory.jsx

1. **Purpose**: Fetches player team history from Google Sheets to show previous teams a player has been on.
2. **Data source**: Google Sheets range `Player Team History!A:Z` only. No `data.json` fallback.
3. **Return values**: `{ getPlayerHistory: function(playerName) => [{ team, season }], loading: boolean }`
4. **Caching strategy**: Inherits from `useGoogleSheets` (2-min polling).
5. **Error handling**: Inherits from `useGoogleSheets`. Returns empty array if player not found.
6. **Dependencies on other hooks**: `useGoogleSheets`.

---

### useTeamManagement.jsx

1. **Purpose**: Provides CRUD mutation functions for team management (create, invite, kick, leave, transfer captain, disband, join requests, profile registration).
2. **Data source**: EML Worker API endpoints: `POST /team/create`, `GET /team/{id}`, `POST /team/invite`, `POST /team/invite/respond`, `POST /team/kick`, `POST /team/leave`, `POST /team/transfer`, `POST /team/disband`, `POST /team/join-request`, `GET /team/join-requests/{id}`, `POST /team/join-request/respond`, `POST /player/register`, `POST /player/unregister`, `GET /player/{id}` via `emlApi`.
3. **Return values**: `{ createTeam, getTeam, invitePlayer, respondToInvite, kickPlayer, leaveTeam, transferCaptain, disbandTeam, submitJoinRequest, getJoinRequests, respondToJoinRequest, registerProfile, unregisterProfile, getProfile, loading: boolean, error: string|null }`
4. **Caching strategy**: None (mutation-oriented).
5. **Error handling**: Generic `wrap` function catches errors, sets shared `error` state, re-throws.
6. **Dependencies on other hooks**: `useAuth` (for `user.id`, `user.username`, etc.), `useEmlApi` (`emlApi` function).

---

### useTeamProfile.jsx

1. **Purpose**: Assembles a full team profile with roster, tier, MMR, and match history for a given team name.
2. **Data source**: Composed from `useTeamRoles`, `useStandings`, `useMatchResults`.
3. **Return values**: `{ team: object|null, matchHistory: array, mmr: number, loading: boolean, error: string|null }`
4. **Caching strategy**: None beyond what sub-hooks provide. Re-computes in `useEffect` on dependency changes.
5. **Error handling**: Sets `error` to "Team not found" when team is missing from roster data.
6. **Dependencies on other hooks**: `useTeamRoles`, `useStandings`, `useMatchResults`.

---

### useTeamRoles.jsx

1. **Purpose**: Fetches team roster data with captain/co-captain/player assignments and active/inactive status, supporting both row-per-player and row-per-team sheet formats.
2. **Data source**: Primary: `data.json` key `teamRoles` via `useDataJson`. Fallback: Google Sheets ranges `Team Roles!A:D` + `Rankings!A:D` (for active status).
3. **Return values**: `{ teams: array, loading: boolean, error: string|null, refetch: function }`
4. **Caching strategy**: Uses `useMemo` for transformation. Inherits caching from sub-hooks.
5. **Error handling**: Inherits from sub-hooks. Filters out empty rows.
6. **Dependencies on other hooks**: `useDataJson`, `useGoogleSheets` (two separate calls in Sheets fallback path).

---

### useTeams.jsx

1. **Purpose**: Fetches team data from the `_RosterWide` sheet with full player lists, tiers, and status.
2. **Data source**: Primary: `data.json` key `teams` via `useDataJson`. Fallback: Google Sheets range `_RosterWide!A:H`.
3. **Return values**: `{ teams: array, loading: boolean, error: string|null, refetch: function }`
4. **Caching strategy**: Inherits from `useDataJson` / `useGoogleSheets`.
5. **Error handling**: Inherits from sub-hooks. Filters out empty rows.
6. **Dependencies on other hooks**: `useDataJson`, `useGoogleSheets`.

---

### useTheme.jsx

1. **Purpose**: Manages theme selection (color scheme + light/dark mode) with localStorage persistence and CSS custom property injection.
2. **Data source**: `localStorage` key `eml-theme`. `COLOR_THEMES` from `../theme/colors`.
3. **Return values**: `{ theme: string, toggleTheme: function, colorScheme: string, mode: string, setColorScheme: function, setMode: function }`
4. **Caching strategy**: Persists to `localStorage`. Reads on init only.
5. **Error handling**: Falls back to `'g2-dark'` if `localStorage` is unavailable or value is missing.
6. **Dependencies on other hooks**: None.

---

## Summary

### Data Flow Diagram

```
                                  EXTERNAL DATA SOURCES
  +----------------------------+    +-------------------+    +-----------------+
  | Google Sheets API (v4)     |    | public/data.json  |    | EML Worker API  |
  | spreadsheetId: 1Xxui...oc  |    | (static file,     |    | (Cloudflare)    |
  | 11 named ranges            |    |  pre-built from   |    | VITE_WORKER_URL |
  +-------------+--------------+    |  Apps Script)     |    +--------+--------+
                |                   +--------+----------+             |
                |                            |                        |
         +------v-------+          +---------v---------+    +---------v---------+
         | useGoogleSheets|         | useDataJson       |    | emlApi (useEmlApi) |
         | (generic)     |<---------| (fast-path cache) |    | (fetch wrapper)   |
         | 2-min polling |  falls   | 5-min module cache|    | no caching        |
         +------+-------+  back    | 2-min re-poll     |    +---------+---------+
                |           to      +--------+----------+             |
                |           Sheets           |                        |
  +-------------v-----------v----------------v---+    +---------------v--------------+
  |         CONSUMER HOOKS (data.json -> Sheets) |    |  CONSUMER HOOKS (Worker API)  |
  |                                              |    |                               |
  | useCooldownList  (cooldownPlayers)           |    | useAnnouncements              |
  | useLeagueSubs    (leagueSubs)                |    | useChallenges                 |
  | useMatches       (proposedMatches)           |    | useMatchReport                |
  | useMatchResults  (matchResults)              |    | useNotifications              |
  | usePlayerLeaderboard (playerLeaderboard)     |    | useTeamManagement             |
  | useRankings      (rankings)                  |    +-------------------------------+
  | useStandings     (standings)                 |
  | useTeamRoles     (teamRoles + Rankings)      |
  | useTeams         (teams)                     |
  | useProductionStats (productionStats)         |
  +------------------+--------+-----------------+
                     |        |
         +-----------v--------v-----------+
         |     COMPOSITE HOOKS            |
         |                                |
         | useMyTeam (auth + teamRoles    |
         |   + standings + matchResults)  |
         | useTeamProfile (teamRoles      |
         |   + standings + matchResults)  |
         | usePlayerProfile (teamRoles)   |
         | useSchedule (matchResults      |
         |   + teamRoles + Sheets:        |
         |   Upcoming Matches)            |
         +--------------------------------+

  STANDALONE HOOKS (no external data):
    useAccessibility   (OS media queries)
    useTheme           (localStorage)
    useAuth            (re-export of AuthContext)
    useTeamHistory     (Sheets only, no data.json)
```

### Auth Model

**OAuth Provider**: Discord OAuth2

**Flow**:
1. User clicks login; `AuthContext.login()` builds a Discord OAuth2 authorize URL with `client_id`, `redirect_uri`, `response_type=code`, `scope=identify guilds.members.read`, and a CSRF `state` parameter.
2. `DISCORD_CLIENT_ID` is hardcoded as fallback (`1477115120759996667`) if `VITE_DISCORD_CLIENT_ID` env var is missing.
3. `redirect_uri` is derived at runtime from `window.location` or env var, with special-casing for `echo-master-league-website.pages.dev`.
4. User authorizes on Discord, is redirected back with `?code=` and `?state=` query params.
5. On mount, `AuthContext` detects `?code=`, cleans it from browser history, validates CSRF state (permissive: allows through if no stored state, only rejects explicit mismatch), then POSTs `{ code, redirect_uri }` to `WORKER_URL/auth/callback`.
6. Worker exchanges code for token, fetches user info, returns user data. Stored in `localStorage` key `eml-auth-user` with expiry field.
7. After login, `fetchProfile` calls `GET WORKER_URL/player/{userId}` to check registration/team status.

**Role derivation** (from `user.appRole` set by worker):
- `isAdmin`: `appRole === 'admin'`
- `isMod`: `appRole === 'mod'` or `isAdmin`
- `isCaster`: `appRole === 'caster'` or `isAdmin`
- `isPlayer`: appRole in `['player', 'caster', 'mod', 'admin']`
- `isLeagueSub`: `user.guildRoles` array includes `'League Sub'`
- `isRegistered`: playerProfile fetched and is an object (not null/false)
- `isOnTeam`: registered and `playerProfile.teamId` is truthy

---

### SMELL Annotations

#### SMELL-001: Duplicate data fetching for team rosters
- **Category**: Redundant data
- **Fact**: `useTeams` fetches from `data.json` key `teams` / Sheets range `_RosterWide!A:H`. `useTeamRoles` fetches from `data.json` key `teamRoles` / Sheets ranges `Team Roles!A:D` + `Rankings!A:D`. Both provide team lists with captain/player assignments. Any component that consumes both hooks will trigger two independent fetch cycles for overlapping data.
- **File**: `useTeams.jsx` (lines 6-11), `useTeamRoles.jsx` (lines 12-27)

#### SMELL-002: useStandings and useRankings fetch the same Sheets range
- **Category**: Redundant data
- **Fact**: `useStandings` falls back to Google Sheets range `Rankings!A:D` (line 11 in useStandings.jsx). `useRankings` also falls back to Google Sheets range `Rankings!A:D` (line 44 in useRankings.jsx). They use different `data.json` keys (`standings` vs `rankings`) but hit the identical Sheets range when data.json is unavailable.
- **File**: `useStandings.jsx` (line 11), `useRankings.jsx` (line 44)

#### SMELL-003: useTeamRoles makes two independent Google Sheets requests in fallback path
- **Category**: Redundant data
- **Fact**: `useTeamRoles` calls `useGoogleSheets` twice: once for `Team Roles!A:D` and once for `Rankings!A:D` (lines 16, 23). Each instance creates its own 2-minute polling interval. The Rankings fetch duplicates what `useRankings` and `useStandings` also fetch.
- **File**: `useTeamRoles.jsx` (lines 16-27)

#### SMELL-004: useSchedule bypasses data.json fallback pattern for upcoming matches
- **Category**: Inconsistency
- **Fact**: `useSchedule` fetches `Upcoming Matches!A2:Z` directly from Google Sheets (line 12) without first trying `data.json`. All other consumer hooks use the data.json-first pattern. If data.json is stale or absent, this hook still works, but it is the only hook that always hits Google Sheets for one of its data sources.
- **File**: `useSchedule.jsx` (lines 11-14)

#### SMELL-005: useTeamHistory has no data.json fallback
- **Category**: Inconsistency
- **Fact**: `useTeamHistory` fetches `Player Team History!A:Z` directly from Google Sheets (line 11) with no `useDataJson` layer. If Google Sheets API is rate-limited or the API key has domain restrictions, this hook silently fails.
- **File**: `useTeamHistory.jsx` (lines 9-12)

#### SMELL-006: useProductionStats has no Google Sheets fallback
- **Category**: Inconsistency
- **Fact**: `useProductionStats` reads from `data.json` key `productionStats` only (line 11). If `data.json` is stale (>7 days) or the key is missing, `useDataJson` returns `[]` and the hook returns empty stats with no fallback.
- **File**: `useProductionStats.jsx` (line 11)

#### SMELL-007: Debug console.log statements left in useLeagueSubs
- **Category**: Code hygiene
- **Fact**: Lines 47-49 contain `console.log('League Subs loaded:', subs.length, 'subs')` and `console.log('First 5 subs:', subs.slice(0, 5))` with a `// DEBUG` comment.
- **File**: `useLeagueSubs.jsx` (lines 47-49)

#### SMELL-008: useEmlApi throws when VITE_WORKER_URL is missing; AuthContext hardcodes its own fallback
- **Category**: Inconsistency
- **Fact**: `useEmlApi.js` line 4 reads `VITE_WORKER_URL` and throws on line 7 if it is falsy. `AuthContext.jsx` lines 29-33 independently reads the same env var and hardcodes a fallback URL `https://eml-discord-oauth.aaliyahkarol101.workers.dev`. If `VITE_WORKER_URL` is unset, auth works but every `emlApi` call throws.
- **File**: `useEmlApi.js` (lines 4, 7), `AuthContext.jsx` (lines 29-33)

#### SMELL-009: Race condition in useGoogleSheets -- interval fires during in-flight fetch
- **Category**: Race condition
- **Fact**: `useGoogleSheets` starts a 2-minute `setInterval` (line 93) that calls `fetchData` unconditionally. `fetchData` is async but the interval does not check whether a previous fetch is still in flight. Two concurrent fetches can interleave `setData` calls.
- **File**: `useGoogleSheets.jsx` (lines 91-95, 18-89)

#### SMELL-010: Race condition in useDataJson -- poll interval invalidates cache and re-fetches without await
- **Category**: Race condition
- **Fact**: The poll interval (line 99-102) calls `invalidateDataJsonCache()` then immediately calls `load()`. `invalidateDataJsonCache` sets `_promise = null`, so if a fetch from another hook's `useDataJson` is in flight, its promise reference is dropped. The shared `_promise` dedup (line 28 in `fetchDataJson`) only works if the previous promise is still stored.
- **File**: `useDataJson.jsx` (lines 99-102, 25-49)

#### SMELL-011: useNotifications shadows the global fetch function
- **Category**: Code hygiene
- **Fact**: The `useCallback` on line 10 is named `fetch`, which shadows `window.fetch`. The function internally calls `emlApi` (which uses `window.fetch`), so it works, but the shadowing is a readability hazard.
- **File**: `useNotifications.jsx` (line 10)

#### SMELL-012: Google Sheets API key exposed in client-side config
- **Category**: Security
- **Fact**: `config/sheets.js` line 22 contains a hardcoded Google Sheets API key `AIzaSyBASNrr1R2CIXcyEFDQNpcRVdJ9-SU54Kc`. The env var fallback on line 49 only applies if `VITE_GOOGLE_SHEETS_API_KEY` is set; otherwise the hardcoded key ships in the client bundle. The key is restricted by domain (referenced in useGoogleSheets console.warn on line 84) but is still publicly visible.
- **File**: `config/sheets.js` (line 22)

#### SMELL-013: Hardcoded Discord Client ID in AuthContext
- **Category**: Configuration
- **Fact**: `AuthContext.jsx` lines 8-12 hardcode Discord client ID `1477115120759996667` as a fallback. The comment acknowledges it is "not a secret" but it couples the source code to a specific Discord application.
- **File**: `AuthContext.jsx` (lines 8-12)

#### SMELL-014: Hardcoded fallback logo URL used in multiple hooks
- **Category**: Hardcoded URL
- **Fact**: The URL `https://cdn.discordapp.com/avatars/1461558413971554392/791aa1c1bae16f1a423fa2e008279e39.webp?size=1024` appears as a fallback team logo in both `useRankings.jsx` (line 72) and `useTeamProfile.jsx` (line 102). If this avatar changes or the CDN URL rotates, both locations need updating.
- **File**: `useRankings.jsx` (line 72), `useTeamProfile.jsx` (line 102)

#### SMELL-015: useSchedule does not expose an error state
- **Category**: Missing error handling
- **Fact**: `useSchedule` returns `{ matches, loading }` (line 88) but does not forward the `error` from `useMatchResults` or `useGoogleSheets`. Consumers cannot distinguish "no matches" from "fetch failed."
- **File**: `useSchedule.jsx` (line 88)

#### SMELL-016: useNotifications silently swallows all errors
- **Category**: Missing error handling
- **Fact**: Both the `fetch` callback (line 18: empty `catch`) and `markRead` (line 34: empty `catch`) discard errors without logging. The fetch catch has a comment "silently fail" but `markRead` has no comment.
- **File**: `useNotifications.jsx` (lines 18, 34)

#### SMELL-017: teamRosters.js is a static local file that duplicates Sheets data
- **Category**: Redundant data
- **Fact**: `/mnt/aaliyah/src/data/teamRosters.js` contains a hardcoded array of 43 teams with rosters. This data overlaps with what `useTeams`, `useTeamRoles`, and `useTeamProfile` fetch from data.json/Google Sheets. If this file is consumed anywhere, it provides a stale snapshot that diverges from live data.
- **File**: `src/data/teamRosters.js` (entire file)

#### SMELL-018: useMyTeam matches players by display name, not by unique ID
- **Category**: Data integrity
- **Fact**: `useMyTeam` (lines 21-29) matches the logged-in user to a team by comparing `user.nick`, `user.globalName`, and `user.username` (case-insensitive) against roster player names from Sheets. Discord users can change display names at any time, which would break team detection.
- **File**: `useMyTeam.jsx` (lines 21-29)

#### SMELL-019: usePlayerProfile performs case-sensitive comparison
- **Category**: Data integrity
- **Fact**: `usePlayerProfile` (lines 19-33) uses `t.players.includes(playerName)` which is case-sensitive, while `useMyTeam` normalizes to lowercase. A player name differing in case would be found by `useMyTeam` but not by `usePlayerProfile`.
- **File**: `usePlayerProfile.jsx` (line 29)
