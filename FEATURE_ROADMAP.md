# EML Website Feature Expansion Roadmap

## Overview
Expand the EML website with competitive, historical, and media-driven features to increase immersion, esports identity, and long-term league branding.

---

## 🎯 Feature Categories

### 1. Leaderboard & Competitive Data

#### Player-Based Leaderboard
- **Priority**: High
- **Status**: Not Implemented
- **Description**: Add individual player leaderboard (not team-based)
- **Requirements**:
  - Display player stats with sorting capabilities
  - Accept that some stats may be inflated due to team aggregation
  - Include visibility toggle to keep leaderboard hidden until finals or end-of-season
  - Integration with Google Sheets for live data
- **Implementation Notes**:
  - Create `usePlayerLeaderboard.jsx` hook
  - Add new sheet range in `config/sheets.js`
  - Build `PlayerLeaderboardView.jsx` component
  - Add admin toggle for visibility control

---

### 2. Team Pages & Champion Identity

#### Dedicated Team Pages
- **Priority**: High
- **Status**: Partial (TeamProfileModal exists)
- **Description**: Enhance existing team profile modals into full-featured team pages
- **Requirements**:
  - Confirm and expand dedicated team pages
  - Display Champion Star representing championship wins
  - Show team roster with player links
  - Display match history and statistics
- **Implementation Notes**:
  - Enhance `TeamProfileModal.jsx` with championship indicators
  - Add trophy/achievement display section

#### Custom Team Banners
- **Priority**: Medium
- **Status**: Not Implemented
- **Description**: Restore custom team banner uploads
- **Requirements**:
  - Allow teams to upload custom banners
  - Display banners on team pages
  - Fallback to default styling if no banner
- **Implementation Notes**:
  - Add banner URL field to team data structure
  - Update `TeamCard.jsx` and `TeamProfileModal.jsx` to display banners
  - Document banner upload process (via Google Sheets or external hosting)

#### Championship Stars
- **Priority**: Medium
- **Status**: Not Implemented
- **Description**: Visual indicator of championship wins on team pages
- **Requirements**:
  - Display star icon(s) for each championship won
  - Support multiple championships (EML, ECF, side tournaments)
  - Clear visual distinction for different tournament types
- **Implementation Notes**:
  - Add `championships` field to team data
  - Create `ChampionshipStars.jsx` component
  - Integrate into `TeamCard.jsx` and `TeamProfileModal.jsx`

---

### 3. Media & Highlights

#### EML Highlights Page
- **Priority**: High
- **Status**: Basic (links to external platforms)
- **Description**: Create curated highlights page with embedded stream clips
- **Requirements**:
  - Embedded video player UI
  - Carousel for browsing highlights
  - Featured clip panel for spotlight content
  - Spotlight player section
  - Integration with Twitch, YouTube, TikTok
- **Implementation Notes**:
  - Enhance `MediaView.jsx` with embedded players
  - Create `HighlightsCarousel.jsx` component
  - Add Google Sheets range for highlights data (title, URL, platform, featured)
  - Create `useHighlights.jsx` hook

#### Team Interviews Section
- **Priority**: Medium
- **Status**: Not Implemented
- **Description**: High-production video content featuring team interviews
- **Requirements**:
  - Display on team pages or as standalone section
  - Video embed support
  - Metadata (date, team, interviewer)
- **Implementation Notes**:
  - Add to `TeamProfileModal.jsx` or create `InterviewsView.jsx`
  - Add Google Sheets range for interview data
  - Create `useInterviews.jsx` hook

#### Tips & Tricks Media Section
- **Priority**: Low
- **Status**: Not Implemented
- **Description**: Humorous or instructional shorts and long-form videos
- **Requirements**:
  - Support for short clips and long videos
  - Categories (humorous, instructional, strategy)
  - Video embed support
- **Implementation Notes**:
  - Create `TipsAndTricksView.jsx` component
  - Add to navigation menu
  - Add Google Sheets range for tips data
  - Create `useTipsAndTricks.jsx` hook

---

### 4. Community & Engagement Features

#### Predictions System
- **Priority**: Medium
- **Status**: Not Implemented
- **Description**: Lightweight match predictions for community engagement
- **Requirements**:
  - Poll-based prediction system
  - Match outcome voting
  - Display community predictions
  - Fun engagement (no real betting/currency)
- **Implementation Notes**:
  - Create `PredictionsView.jsx` component
  - Add Google Sheets range for predictions data
  - Create `usePredictions.jsx` hook
  - Add to `MatchCard.jsx` or create dedicated section

#### Player Nameplates / Tags
- **Priority**: Low
- **Status**: Not Implemented
- **Description**: Cosmetic player tags for achievements and fun titles
- **Requirements**:
  - Display tags on player profiles
  - Support multiple tag types:
    - Champion titles
    - Finalist badges
    - Legacy achievements
    - Fun/community rewards (e.g., "11.5", "Oops! I dinged it again")
  - Visual distinction for different tag types
- **Implementation Notes**:
  - Add `tags` array to player data structure
  - Create `PlayerTag.jsx` component
  - Integrate into `PlayerProfileModal.jsx`
  - Define tag categories and styling

---

### 5. Historical & Legacy Data

#### Historical Player Data Integration
- **Priority**: High (stated as high priority)
- **Status**: Not Implemented
- **Description**: Display player history from older seasons
- **Requirements**:
  - Past teams played for
  - Season placements
  - Historical stats
  - Legacy achievements
  - Season archive navigation
- **Implementation Notes**:
  - Create `useHistoricalData.jsx` hook
  - Add Google Sheets range for historical data
  - Create `HistoricalDataView.jsx` component
  - Enhance `PlayerProfileModal.jsx` with history tab
  - Add season selector/filter

---

### 6. Trophies & Achievements

#### Trophy System
- **Priority**: High
- **Status**: Placeholder exists (ChampionshipSection.jsx hidden)
- **Description**: Display tournament placements on team pages
- **Requirements**:
  - Show trophies for 1st, 2nd, 3rd, finalist placements
  - Customizable per tournament (EML, ECF, side tournaments)
  - Visual trophy display (gold, silver, bronze)
  - Trophy metadata (tournament name, season, placement)
- **Implementation Notes**:
  - Unhide and enhance `ChampionshipSection.jsx`
  - Create `TrophyCase.jsx` component
  - Add Google Sheets range for trophy data
  - Create `useTrophies.jsx` hook
  - Integrate into `TeamProfileModal.jsx`

---

### 7. Bot & Website Integration

#### EML League Bot Integration
- **Priority**: High
- **Status**: Partial (BotView exists with commands)
- **Description**: Bot dynamically updates website data
- **Requirements**:
  - Bot updates rosters (via Google Sheets)
  - Bot updates standings (via Google Sheets)
  - Bot updates player stats (via Google Sheets)
  - Bot updates predictions (via Google Sheets)
  - Bot posts announcements (via Google Sheets)
- **Implementation Notes**:
  - All integration happens via Google Sheets (bot writes, website reads)
  - Document bot API/sheet update protocols
  - Add refresh indicators when data is updated
  - Consider webhook for real-time updates (optional)
  - Update `BotView.jsx` with integration documentation

---

### 8. Announcements & News

#### Centralized Announcements / News Page
- **Priority**: Medium
- **Status**: Partial (AnnouncementsView exists with hardcoded data)
- **Description**: Dynamic announcements page for league updates
- **Requirements**:
  - League updates
  - Management messages
  - Schedule changes
  - Major events
  - Timestamp and author
- **Implementation Notes**:
  - Convert `AnnouncementsView.jsx` to use Google Sheets data
  - Add Google Sheets range for announcements
  - Create `useAnnouncements.jsx` hook
  - Add announcement categories and filtering
  - Add rich text support (markdown or HTML)

---

### 9. Design & Constraints

#### Design Requirements
- **Priority**: High
- **Requirements**:
  - Keep existing media links intact
  - Keep Echo VR Lounge link intact
  - Keep EML Discord links intact
  - Visual style must be:
    - Competitive
    - Immersive
    - Esports-focused
    - Premium look and feel
- **Implementation Notes**:
  - Use existing Chakra UI theme
  - Maintain dark/light mode support
  - Follow existing color scheme (CYAN_ACCENT, ORANGE_ACCENT)
  - Ensure responsive design
  - Maintain accessibility features

---

## 📊 Implementation Priority Matrix

### Phase 1: Core Features (High Priority)
1. Player Leaderboard with visibility toggle
2. Historical Player Data integration
3. Trophy System for team pages
4. Bot Integration documentation
5. EML Highlights page with embedded clips

### Phase 2: Team & Media (Medium Priority)
6. Custom Team Banner uploads
7. Championship Stars on team pages
8. Team Interviews section
9. Dynamic Announcements system
10. Predictions System

### Phase 3: Community & Polish (Low Priority)
11. Player Nameplates/Tags
12. Tips & Tricks media section
13. Additional media carousel features

---

## 🔧 Technical Requirements

### Google Sheets Integration
New sheet ranges needed in `config/sheets.js`:
- `playerStats` - Individual player statistics
- `playerHistory` - Historical season data
- `trophies` - Team trophy/achievement records
- `highlights` - Video highlight metadata
- `interviews` - Interview video metadata
- `predictions` - Match predictions data
- `announcements` - League announcements/news
- `playerTags` - Cosmetic player tags/titles
- `tipsAndTricks` - Tips & tricks video metadata

### New Hooks Required
- `usePlayerLeaderboard.jsx`
- `useHistoricalData.jsx`
- `useTrophies.jsx`
- `useHighlights.jsx`
- `useInterviews.jsx`
- `usePredictions.jsx`
- `useAnnouncements.jsx` (replace hardcoded)
- `usePlayerTags.jsx`
- `useTipsAndTricks.jsx`

### New Components Required
- `PlayerLeaderboardView.jsx`
- `HighlightsCarousel.jsx`
- `TrophyCase.jsx`
- `ChampionshipStars.jsx`
- `InterviewsView.jsx`
- `PredictionsView.jsx`
- `PlayerTag.jsx`
- `TipsAndTricksView.jsx`
- `HistoricalDataView.jsx`

---

## 📝 Notes

- All features should maintain existing Google Sheets integration pattern
- Bot integration works via Google Sheets (bot writes, website reads)
- Visibility toggles for competitive integrity (leaderboards hidden until season end)
- Maintain responsive design and dark/light mode support
- All external links (Discord, Echo VR Lounge, social media) must remain intact
- Focus on competitive, esports-focused, premium visual style
