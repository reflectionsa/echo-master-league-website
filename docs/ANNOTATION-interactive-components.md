# Interactive Component Annotation Report

Generated: 2026-06-19

---

## Hero.jsx

1. **Purpose:** Landing banner displaying league branding, live stats (active teams, players, subs), and a live-match pulse indicator.
2. **Props:** `theme`, `onTeamsClick`, `onPlayersClick`, `onSubsClick`, `onMatchesClick`
3. **Internal state:** None (derived stats via `useMemo`).
4. **Visual pattern:** Hero banner with stat blocks and embedded `LiveMatchPulse` child.
5. **Data dependencies:** `useTeamRoles` (teams, loading), `useLeagueSubs` (count, loading).
6. **User interactions:** Click on each stat block fires the corresponding `on*Click` callback. Logo hover scales.
7. **SMELL annotations:**
   - `[coupling]` Stat computation (lines 15-48) embeds business logic (active = 4+ players, deduplicated player set) directly in the UI component rather than in a hook or utility. Line 26: `teams.filter(t => t.status === 'Active')`.
   - `[hardcoded-url]` Line 85: Discord CDN avatar URL for league logo is hardcoded inline.

---

## MatchCard.jsx

1. **Purpose:** Single match display card showing two teams, score, status badge, stream link, and click-through to team profiles.
2. **Props:** `match`, `theme`
3. **Internal state:** `selectedTeam` (string|null) -- drives TeamProfileModal open/close.
4. **Visual pattern:** Card with status badge, team-vs-team score, optional stream button.
5. **Data dependencies:** `useAccessibility` (color blind support).
6. **User interactions:** Click team name to open `TeamProfileModal`; click stream button to `window.open`.
7. **SMELL annotations:**
   - `[window-open]` Line 30: `window.open` called without user-gesture guard, though it is in an onClick handler so it is safe.
   - `[dual-match-card]` This component is a separate `MatchCard` from the one defined inline in `MatchesOfWeek.jsx`. Two components share the same name in the codebase. Lines 8-165 vs MatchesOfWeek lines 109-183.

---

## MatchesOfWeek.jsx

1. **Purpose:** Section displaying current/latest week's matches in a responsive grid, with embedded VOD dropdowns supporting YouTube and Twitch.
2. **Props:** `theme`
3. **Internal state:** `VodDropdown` sub-component has `open` (boolean) toggle per card.
4. **Visual pattern:** Section with header + 3-column grid of match cards. Each card contains a collapsible VOD embed.
5. **Data dependencies:** `useMatchResults` (completed matches), `useSchedule` (live/upcoming).
6. **User interactions:** Click VOD toggle opens/closes embedded iframe (YouTube/Twitch); hover on cards lifts them.
7. **SMELL annotations:**
   - `[inline-subcomponent]` Lines 109-183: `MatchCard` is defined as a file-local component, not exported, and shares a name with the separate `./MatchCard.jsx` export.
   - `[window-location]` Line 87: `window.location.hostname` used inline in Twitch iframe src.
   - `[no-season-prop]` Line 234: "Season 4" is hardcoded in the subtitle text.

---

## LiveMatchPulse.jsx

1. **Purpose:** Animated "LIVE" banner shown on the Hero when at least one match has status Live/In Progress.
2. **Props:** `theme`, `onMatchesClick`
3. **Internal state:** None.
4. **Visual pattern:** Inline alert button with pulsing dot and team names.
5. **Data dependencies:** `useSchedule` (matches, loading).
6. **User interactions:** Entire component is a button; clicking fires `onMatchesClick`.
7. **SMELL annotations:**
   - `[a11y]` Lines 43-44: `role="alert"` and `aria-live="polite"` are correctly applied.
   - `[single-match-display]` Only the first live match is shown in detail (line 23: `const first = liveMatches[0]`); overflow indicated as "+N more" text.

---

## PlayerFlipCard.jsx

1. **Purpose:** Trading-card-style flip card showing player info (front: avatar, name, team, role; back: win/loss/win%).
2. **Props:** `player`, `theme`, `onClick`, `width` (default '180px'), `height` (default '240px')
3. **Internal state:** None (flip is CSS hover-based, not stateful).
4. **Visual pattern:** CSS 3D flip card with front/back faces.
5. **Data dependencies:** None (pure props).
6. **User interactions:** Click fires `onClick`; Enter key fires `onClick`; hover triggers CSS flip.
7. **SMELL annotations:**
   - `[inline-style-tag]` Lines 39-46: `<style>` tag with `@keyframes eml-drift` is injected into the DOM on every render of every card instance.
   - `[raw-html-div]` Lines 47-164: Uses raw `<div>` elements with inline `style` objects instead of Chakra `<Box>`, inconsistent with all other components.
   - `[css-class-dependency]` Lines 49, 56, 59, 121: Relies on CSS classes `eml-flip-card`, `eml-flip-inner`, `eml-flip-front`, `eml-flip-back` that must be defined in a global stylesheet. Not self-contained.

---

## TeamCard.jsx

1. **Purpose:** Team display card showing logo, name, region, tier badge, captain name, and league points.
2. **Props:** `team`
3. **Internal state:** None.
4. **Visual pattern:** Vertical card with image header area and info body.
5. **Data dependencies:** None (pure props, utility imports `getTierImage`, `getBaseTier`).
6. **User interactions:** Hover lift animation. No click handler.
7. **SMELL annotations:**
   - `[no-theme-prop]` Component does not accept a `theme` prop. Uses hardcoded Chakra color tokens (`gray.900`, `gray.800`, `purple.700`, `purple.400`) rather than the themed color system used by every other component.
   - `[no-interactivity]` No onClick or navigation; card is display-only with a hover effect that implies clickability.

---

## StandingsTable.jsx

1. **Purpose:** League standings table sorted by league points, with rank icons, tier badges, and clickable team names opening TeamProfileModal.
2. **Props:** `teams`, `theme`
3. **Internal state:** `selectedTeam` (string|null) -- drives TeamProfileModal open/close.
4. **Visual pattern:** Table with header and sortable rows.
5. **Data dependencies:** `useAccessibility` (color blind support).
6. **User interactions:** Click team name to open `TeamProfileModal`.
7. **SMELL annotations:**
   - `[status-check-fragile]` Line 110: Active/inactive check uses triple-or pattern: `team.active === 'Yes' || team.active === 'Active' || team.active === true`. Repeated on line 117. Indicates inconsistent upstream data shape.

---

## TeamRosterTable.jsx

1. **Purpose:** Full roster table showing team name, captain, co-captain, up to 4 players, and status. Clickable names open profile modals.
2. **Props:** `teams`, `theme`
3. **Internal state:** `selectedTeam` (string|null), `selectedPlayer` (string|null) -- each drives a profile modal.
4. **Visual pattern:** Scrollable table with responsive column hiding on mobile.
5. **Data dependencies:** `useAccessibility` (color blind support).
6. **User interactions:** Click team name opens `TeamProfileModal`; click player name opens `PlayerProfileModal`.
7. **SMELL annotations:**
   - `[pad-to-4]` Lines 15-19: `padPlayers` function hardcodes roster size to exactly 4 slots. If roster size changes this breaks silently.

---

## SparklineChart.jsx

1. **Purpose:** Small inline SVG sparkline showing trend data with area fill, colored by positive/negative trend.
2. **Props:** `data` (number[]), `width` (80), `height` (28), `color`, `positiveColor`, `negativeColor`, `showDot` (true)
3. **Internal state:** None.
4. **Visual pattern:** Inline SVG chart.
5. **Data dependencies:** None (pure props).
6. **User interactions:** None (display only).
7. **SMELL annotations:**
   - `[gradient-id-collision]` Line 44: SVG gradient `id` is derived from `color` prop via `spark-grad-${color.replace('#', '')}`. If two SparklineCharts share the same `color` prop value, their gradient IDs collide and the last-rendered one wins.
   - `[fake-data-generator]` Lines 75-93: `generateTrendData` produces deterministic pseudo-random data from a player name hash. It is exported and usable elsewhere but the generated data is synthetic, not real.

---

## SeasonCountdown.jsx

1. **Purpose:** Between-seasons countdown timer showing days/hours/minutes/seconds until the next season start.
2. **Props:** `theme`
3. **Internal state:** `remaining` (object with days/hours/minutes/seconds) -- updated every second via `setInterval`.
4. **Visual pattern:** Full-width section with countdown tiles and ambient glow.
5. **Data dependencies:** None (uses hardcoded date constant).
6. **User interactions:** None (display only).
7. **SMELL annotations:**
   - `[hardcoded-date]` Lines 12-13: Next season date (`2026-06-29`) and label (`Season 5`) are hardcoded module-level constants.
   - `[interval-leak-risk]` Line 63: `setInterval` runs at 1-second rate. Cleanup is correct via return from `useEffect`.

---

## SeasonHighlight.jsx

1. **Purpose:** Rotating highlight carousel showing notable match results (biggest score margins), auto-advancing every 8 seconds.
2. **Props:** `theme`
3. **Internal state:** `index` (current highlight), `visible` (transition flag).
4. **Visual pattern:** Card carousel with prev/next buttons and dot indicators.
5. **Data dependencies:** `useMatchResults` (match results for highlight picking).
6. **User interactions:** Click prev/next arrows; click dot indicators to jump; auto-rotate at 8s interval.
7. **SMELL annotations:**
   - `[manual-transition]` Lines 115-121: `goTo` uses `setTimeout(180ms)` to coordinate visibility toggle. This is a manual CSS transition orchestration rather than using an animation library or CSS transition events.

---

## LoginButton.jsx

1. **Purpose:** Discord OAuth login button with loading and error states.
2. **Props:** `size` (default 'sm')
3. **Internal state:** None (loading/error from `useAuth` hook).
4. **Visual pattern:** Single button with spinner or error tooltip.
5. **Data dependencies:** `useAuth` (login, loading, error).
6. **User interactions:** Click triggers Discord OAuth login flow.
7. **SMELL annotations:** None.

---

## UserMenu.jsx

1. **Purpose:** Authenticated user dropdown menu showing avatar, role badge, and context-sensitive navigation items (notifications, profile, team, admin, caster tools, logout).
2. **Props:** `theme`, `onProductionSignupClick`, `onAdminPanelClick`, `onMyTeamClick`, `onMyProfileClick`, `onRegisterClick`, `onUnregisterClick`, `onNotificationsClick`, `onChallengeClick`, `onMatchReportClick`, `onCreateTicketClick`, `onCasterGreenRoomClick`
3. **Internal state:** None (menu state managed by Chakra `Menu.Root`).
4. **Visual pattern:** Dropdown menu with role-gated items.
5. **Data dependencies:** `useAuth` (user, logout, role flags), `useNotifications` (unreadCount).
6. **User interactions:** Click menu trigger opens dropdown; select item fires corresponding callback; logout calls `logout()`.
7. **SMELL annotations:**
   - `[prop-explosion]` Line 15: 11 callback props. This component acts as a routing hub for the entire app navigation.
   - `[duplicate-handler]` Lines 30 and 36: `if (details.value === 'register') onRegisterClick?.()` appears twice in `handleSelect`.

---

## ChassisShowcase.jsx

1. **Purpose:** Special event match showcase with a spinning Echo VR chassis SVG, team emblems, and collapsible VOD embed.
2. **Props:** `theme`, `event` (object with team1, team2, title, subtitle, vodUrl, date, live)
3. **Internal state:** `hovering` (pauses spin animation), `VodBlock.expanded` (toggles VOD iframe).
4. **Visual pattern:** Full-width showcase section with SVG animation, team emblems, VS divider.
5. **Data dependencies:** None (pure props).
6. **User interactions:** Hover on chassis pauses spin; click VOD button toggles embed; click team emblem displays info.
7. **SMELL annotations:**
   - `[duplicate-yt-parser]` Lines 82-86: `getYtId` helper is duplicated from `MatchesOfWeek.jsx` (lines 16-19). Same regex, same logic.
   - `[css-class-conflict]` Lines 192-193: Animation class `eml-chassis-paused` uses `animation-play-state: paused` but is applied to parent container, not the SVG element that has the `eml-chassis-spin` class.

---

## CreateTicketModal.jsx

1. **Purpose:** Informational modal listing ticket types and linking to the EML Discord's #create-a-ticket channel.
2. **Props:** `open`, `onClose`, `theme`
3. **Internal state:** None.
4. **Visual pattern:** Modal dialog with ticket type cards and Discord link button.
5. **Data dependencies:** None.
6. **User interactions:** Click "Open in Discord" button calls `window.open` to Discord channel URL. Fallback Discord invite link at bottom.
7. **SMELL annotations:**
   - `[no-form]` This modal contains no actual form submission. It is a read-only info panel that redirects to Discord. The ticket types listed are informational only and do not map to any action.
   - `[hardcoded-urls]` Line 8: Discord ticket channel URL. Line 193: Discord invite link. Both are hardcoded string constants.

---

## MatchReportModal.jsx

1. **Purpose:** Form for captains to propose match results (Bo3 round scores or forfeit) against an eligible opponent.
2. **Props:** `open`, `onClose`, `theme`
3. **Internal state:** `selectedMatchId`, `rounds` (array of 3 {team1, team2} objects), `forfeit`, `forfeitTeam`, `done` (null|'confirmed'|'pending').
4. **Visual pattern:** Modal dialog with opponent selector, round score inputs, forfeit toggle, submit button.
5. **Data dependencies:** `useMatchReport` (reportMatch, loading, error), `useMyTeam` (team), `useSchedule` (matches), `useTeamRoles` (allTeams), `emlApi` (notification push).
6. **User interactions:** Select opponent from dropdown; enter scores per round; toggle forfeit checkbox and select forfeiting team; click Submit.
7. **SMELL annotations:**
   - `[notification-fire-and-forget]` Line 127: Notification push to opponent captain/co-captain uses `.catch(() => {})`, silently swallowing failures.
   - `[native-select]` Lines 235-259: Uses a raw `<select>` HTML element with inline `style` object instead of Chakra's `Select` component, inconsistent with AdminPanel which uses `Select.Root`.

---

## MyProfileModal.jsx

1. **Purpose:** User's own profile modal with editable bio, uploadable profile picture, Discord identity display, and team/role badges.
2. **Props:** `theme`, `open`, `onClose`
3. **Internal state:** `profilePic` (data URL|null), `bio` (string), `editingBio` (boolean), `picSaving` (boolean), `picMsg` (object|null).
4. **Visual pattern:** Full-size modal dialog with header gradient, avatar, bio editor, photo upload section.
5. **Data dependencies:** `useAuth` (user), `useMyTeam` (team, myRole, isOnTeam), `emlApi` (avatar sync).
6. **User interactions:** Click avatar upload button to select file; click Reset Photo to revert; click Edit bio to enter edit mode; type bio; click Save.
7. **SMELL annotations:**
   - `[localStorage-as-database]` Lines 13-14 and throughout: Bio and profile picture are stored in `localStorage` as primary storage. Server sync (`emlApi POST /player/avatar`) is best-effort with swallowed errors (line 61: `catch { ... }`).
   - `[displayName-before-definition]` Line 52: `displayName` is referenced in `handlePicFile` callback (line 52) but not defined until line 91. This works because `handlePicFile` is only called after render, but it is a readability hazard.

---

## PlayerProfileModal.jsx

1. **Purpose:** Public player profile view showing avatar, role, team link, bio, championship badges, and previous team history.
2. **Props:** `open`, `onClose`, `playerName`, `theme`
3. **Internal state:** `teamModalOpen` (boolean), `workerPic` (string|null).
4. **Visual pattern:** Modal dialog with centered avatar, role badge, team card, championship badges, previous-teams list.
5. **Data dependencies:** `usePlayerProfile` (team, playerRole), `useTeamHistory` (getPlayerHistory), `emlApi` (avatar fetch).
6. **User interactions:** Click team card to open `TeamProfileModal`.
7. **SMELL annotations:**
   - `[hardcoded-player-data]` Lines 14-31: `staticProfilePictures` and `seasonChampions` are hardcoded maps keyed by player name strings. Not data-driven.
   - `[nested-modal]` Line 252-261: Opens `TeamProfileModal` from within this modal, creating a modal-on-modal stack.
   - `[localStorage-read]` Lines 41-42: Player picture and bio read from localStorage using slugified name keys. Anyone can overwrite another player's data locally.

---

## PlayerRegistrationModal.jsx

1. **Purpose:** Region-selection registration form for new players joining the league.
2. **Props:** `open`, `onClose`, `theme`, `onSuccess`
3. **Internal state:** `region` (string), `done` (boolean).
4. **Visual pattern:** Modal dialog with Discord identity card, region radio cards, register button.
5. **Data dependencies:** `useAuth` (user, playerProfile), `useTeamManagement` (registerProfile, loading, error).
6. **User interactions:** Click region card to select; click Complete Registration to submit; auto-close after 1.8s on success.
7. **SMELL annotations:**
   - `[missing-import]` Line 36: `useEffect` is used but not imported. The import on line 2 includes `useState` but not `useEffect`. This will crash at runtime if the effect branch executes.
   - `[localStorage-flag]` Lines 27-28: Registration state stored in localStorage (`eml_registered_${user.id}`, `eml_reg_seen_${user.id}`) to suppress future auto-popups. Not synced with server state.

---

## TeamCreationModal.jsx

1. **Purpose:** Form for creating a new team with name, tag, region, optional logo/banner upload. Creator becomes captain.
2. **Props:** `open`, `onClose`, `theme`, `onCreated`
3. **Internal state:** `form` (object: name, tag, region, logoUrl, bannerUrl), `done` (boolean), `createdTeam` (object|null), `fileError` (string|null).
4. **Visual pattern:** Modal dialog with text inputs, region buttons, file upload sections, live preview strip.
5. **Data dependencies:** `useTeamManagement` (createTeam, loading, error), `emlApi` (team asset upload).
6. **User interactions:** Type team name/tag; click region button; upload logo/banner images; click Create Team.
7. **SMELL annotations:**
   - `[fire-and-forget-api]` Line 74: `emlApi('POST', '/team/assets', ...)` is `.catch(() => {})` -- logo/banner save silently fails.

---

## TeamProfileModal.jsx

1. **Purpose:** Full team profile modal showing banner, tier/MMR, roster, championship trophies, team history/achievements, and match history table.
2. **Props:** `open`, `onClose`, `teamName`, `teamData`, `theme`
3. **Internal state:** `workerAssets` (object: logoUrl, bannerUrl).
4. **Visual pattern:** Large modal with banner header, tier badge, roster list, trophy grid, history timeline, match history table.
5. **Data dependencies:** `useTeamProfile` (team, matchHistory, mmr, loading, error), `useAccessibility`, `emlApi` (team assets fetch).
6. **User interactions:** Click "Yes" casted badge on match history row opens stream link. Scroll through roster, trophies, achievements, match history.
7. **SMELL annotations:**
   - `[hardcoded-team-data]` Lines 17-45: `teamChampionships` and `teamHistory` objects are hardcoded maps with mock data. Comments say "replace with real data from sheets" (line 16).
   - `[modal-size-xl]` This modal is `size="xl"` with `maxH="90vh"` and contains multiple sections -- it functions more like a full page than a modal.

---

## AdminPanel.jsx

1. **Purpose:** Admin/mod control panel with tabs for match score management, roster management, announcements, production (Discord tickets, caster/camera stats), bot command execution, and audit log.
2. **Props:** `theme`, `open`, `onClose`
3. **Internal state:** 25+ separate `useState` calls for form fields across tabs (ticket, caster stats, camera stats, team admin, player admin, match admin, bot command forms, audit log).
4. **Visual pattern:** Modal with vertical sidebar tabs and content panels.
5. **Data dependencies:** `useAuth` (user, isAdmin, isMod), `emlApi` (all admin endpoints), raw `fetch` (production endpoints).
6. **User interactions:** Switch tabs; fill forms; execute admin commands; create Discord tickets; update caster/camera stats; load audit log.
7. **SMELL annotations:**
   - `[state-explosion]` Lines 27-78: 25+ individual useState calls. This component manages state for 6 different functional areas in a single component. No state reducer, no sub-components for tabs.
   - `[disabled-buttons]` Lines 534, 588, 642: Match Scores, Roster, and Announcements tabs have permanently disabled submit buttons with "coming soon" text. These are stub UIs.
   - `[mixed-api-patterns]` Lines 121-150: Production tab uses raw `fetch(${WORKER_URL}/...)` while other tabs use the `emlApi` wrapper. Two different HTTP patterns in one component.
   - `[alert-calls]` Lines 139, 141, 147, 155, 167, 171, 198, 202, 208: Uses `alert()` for user feedback instead of the toast/message pattern used elsewhere.

---

## CaptainsDashboard.jsx

1. **Purpose:** Match-day checklist for team captains with 4 steps (Check In, Get Spark Link, Confirm Roster, Report Score) tracked via local toggle state.
2. **Props:** `open`, `onClose`, `theme`
3. **Internal state:** `checked` (object keyed by step ID).
4. **Visual pattern:** Modal dialog with a progress badge and interactive checklist cards.
5. **Data dependencies:** `useAuth` (user, isLoggedIn), `useTeamRoles` (teams).
6. **User interactions:** Click each checklist card to toggle done/undone. Cards show/hide detail text based on completion.
7. **SMELL annotations:**
   - `[ephemeral-checklist]` Checklist state is local `useState` only -- not persisted to localStorage or server. Closing and reopening the modal resets all checks.
   - `[unused-import]` Line 1: `Checkbox` is imported from Chakra but never used in the component.

---

## CasterGreenRoom.jsx

1. **Purpose:** Caster-facing modal showing today's live and upcoming matches, with claim/unclaim functionality and Twitch channel entry.
2. **Props:** `open`, `onClose`, `theme`
3. **Internal state:** `twitchChannel` (string), `claimedMatches` (array from worker).
4. **Visual pattern:** Modal with live-now section (red), ready-to-cast section (green), Twitch input, caster tips.
5. **Data dependencies:** `useSchedule` (matches, loading), `useAuth` (user, isLoggedIn, isCaster), `emlApi` (caster claim/unclaim/list).
6. **User interactions:** Enter Twitch channel name; click Claim/Unclaim per match; click Join Stream/Stream Link to open external URLs.
7. **SMELL annotations:**
   - `[swallowed-errors]` Lines 31, 37: Claim/unclaim API calls use `catch { /* ignore */ }`.
   - `[date-comparison]` Lines 47-48: Today boundary uses `new Date()` constructor at render time, not from a stable reference. This is fine for a modal but worth noting for testing.

---

## ChallengerCup.jsx

1. **Purpose:** Placeholder for future tournament bracket implementation.
2. **Props:** None.
3. **Internal state:** None.
4. **Visual pattern:** Returns `null`.
5. **Data dependencies:** None.
6. **User interactions:** None.
7. **SMELL annotations:**
   - `[stub]` Entire component is `const ChallengerCup = () => null;`. Lines 1-7.

---

## ChallengeSystem.jsx

1. **Purpose:** Team challenge modal allowing captains to send, accept, or decline inter-team challenges within ELO and region constraints.
2. **Props:** `open`, `onClose`, `myTeam`, `theme`
3. **Internal state:** None beyond what hooks provide.
4. **Visual pattern:** Modal with two sections: Active Challenges list and Eligible Opponents list.
5. **Data dependencies:** `useChallenges` (challenges, sendChallenge, respondToChallenge), `useAuth` (user), `useTeams` (teams).
6. **User interactions:** Click Challenge button on an eligible team; click Accept/Decline on incoming challenges.
7. **SMELL annotations:**
   - `[client-side-eligibility]` Lines 86-92: Eligibility filtering (same region, ELO within 300, no Diamond-vs-Master) is done client-side. Server must also enforce these rules to prevent bypasses.

---

## NotificationsPanel.jsx

1. **Purpose:** Notification feed modal showing typed notifications (team invites, challenges, kicks, transfers, disputes) with mark-as-read functionality.
2. **Props:** `open`, `onClose`, `theme`
3. **Internal state:** None (all state from `useNotifications` hook).
4. **Visual pattern:** Modal with notification item list, each with icon, title, body, relative timestamp, and read/unread indicator.
5. **Data dependencies:** `useNotifications` (notifications, loading, markRead, unreadCount).
6. **User interactions:** Click check icon on individual notification to mark read; click "Mark all read" button.
7. **SMELL annotations:** None.

---

## ProductionSignup.jsx

1. **Purpose:** Caster-only modal for signing up to cast upcoming matches. Shows current signups per match and allows toggle.
2. **Props:** `theme`, `open`, `onClose`
3. **Internal state:** `signupsMap` (object keyed by matchId), `loadingMap` (per-match loading state), `submittingId` (matchId being toggled).
4. **Visual pattern:** Modal with match list, each showing signed-up casters and a toggle button.
5. **Data dependencies:** `useAuth` (user, isCaster), `useSchedule` (matches, loading), raw `fetch` (signups API).
6. **User interactions:** Click Sign Up / Withdraw button per match.
7. **SMELL annotations:**
   - `[raw-fetch]` Lines 34, 53: Uses raw `fetch(${WORKER_URL}/signups/...)` instead of `emlApi` wrapper, inconsistent with the rest of the codebase.
   - `[effect-dependency]` Lines 26-42: `useEffect` depends on `open` but also references `upcomingMatches` and `signupsMap` without including them in the dependency array. The `eslint-disable-next-line` comment on line 41 acknowledges this.

---

## TeamManagementPanel.jsx

1. **Purpose:** Captain's team management panel with tabs for roster viewing, player invite, team branding (logo/banner upload), and danger zone (captain transfer, team disband). Non-captains see roster and leave-team tabs.
2. **Props:** `open`, `onClose`, `teamId`, `theme`, `onTeamUpdate`
3. **Internal state:** `team` (object), `activeTab` (string), `inviteTarget`/`inviteUsername` (strings), `transferTarget` (string), `message` (object|null), `confirmAction` (object|null), `brandingLogo`/`brandingBanner` (data URLs|null), `brandingMsg` (object|null), `brandingSaving` (boolean).
4. **Visual pattern:** Tabbed modal dialog with conditional tab visibility based on captain status. Includes a confirm overlay for destructive actions.
5. **Data dependencies:** `useAuth` (user), `useTeamManagement` (getTeam, invitePlayer, kickPlayer, leaveTeam, transferCaptain, disbandTeam, loading, error), `emlApi` (team assets).
6. **User interactions:** Switch tabs; view roster; invite player by Discord ID; kick player; leave team; transfer captain; disband team; upload logo/banner; confirm destructive actions.
7. **SMELL annotations:**
   - `[timed-dismiss]` Line 67: Success/error message auto-dismisses after 3 seconds via `setTimeout`. No cleanup on unmount.
   - `[confirm-overlay]` Lines 364-376: Confirm dialog is an absolute-positioned overlay inside the modal content, not a separate `Dialog`. Works but is non-standard.

---

## DataChangeNotifier.jsx

1. **Purpose:** Fixed-position toast notification that appears when `eml:datachanged` custom DOM events fire, prompting the user to refresh the page.
2. **Props:** `theme`
3. **Internal state:** `changedSections` (string[]), `visible` (boolean).
4. **Visual pattern:** Fixed-bottom toast bar with section labels, Refresh button, and dismiss CloseButton.
5. **Data dependencies:** None (listens to `window` custom event `eml:datachanged`).
6. **User interactions:** Click Refresh to reload page (`window.location.reload()`); click close to dismiss.
7. **SMELL annotations:**
   - `[full-page-reload]` Line 101: Refresh button does `window.location.reload()` instead of a targeted data refetch.
   - `[auto-dismiss]` Line 29: Auto-dismiss after 15 seconds may cause users to miss the notification.

---

## ErrorBoundary.jsx

1. **Purpose:** React class-based error boundary that catches render errors and displays a diagnostic error screen.
2. **Props:** `children`
3. **Internal state:** `error` (Error|null), `errorInfo` (object|null).
4. **Visual pattern:** Full-width error panel with monospace font, message, and stack trace. Red-on-pink color scheme.
5. **Data dependencies:** None.
6. **User interactions:** None (read-only error display). No retry/dismiss mechanism.
7. **SMELL annotations:**
   - `[no-recovery]` No "Retry" or "Go Home" button. Once the error boundary triggers, the user must manually reload the page.
   - `[emoji-in-production]` Line 31: Error heading uses emoji ("Warning Application Error") which renders in production error screens.
   - `[no-error-reporting]` Line 15: Error is only `console.error`'d. No external error reporting service integration.
