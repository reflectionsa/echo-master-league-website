# Echo Master League

A modern React application for the Echo Master League, built with Vite, React 18, and Chakra UI v3.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Google Sheets API (Required for Live Data)

The site pulls live team rosters, matches, and rankings from Google Sheets.

1. Copy the environment file:

   ```bash
   cp .env.example .env
   ```

2. Get a Google Sheets API key from [Google Cloud Console](https://console.cloud.google.com/)

3. Add your API key to `.env`:

   ```
   VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
   ```

📖 **Detailed setup instructions**: See [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at <http://localhost:3000>

## Project Structure

```
echo-master-league/
├── src/                     # Source files
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   ├── data/               # Static data
│   ├── examples/           # Example components
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   ├── styles.css          # Global styles
│   └── ErrorBoundary.jsx   # Error handling
├── config/                  # Configuration files
├── public/                  # Static assets (if needed)
├── index.html              # HTML entry point
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies & scripts
└── .gitignore              # Git ignore rules
```

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production to `dist/`
- `npm run preview` - Preview production build locally
- `npm run deploy` - Build and deploy to GitHub Pages

## Tech Stack

- **React 18** - UI library
- **Vite 6** - Build tool and dev server
- **Chakra UI 3** - Component library
- **Lucide React** - Icon library

## Features

### Core Features
- 🎨 Dark/Light theme toggle with localStorage persistence
- 📱 Responsive design with mobile bottom navigation
- 🏆 League standings and match tracking
- 👥 Team rosters and player profiles
- 📅 Calendar and scheduling
- 🎮 Discord bot integration info
- 📊 **Live data from Google Sheets** (teams, matches, rankings)
- 🔄 Auto-refresh with manual refetch capability
- 📈 Dynamic stats (real team/player counts)

### New Competitive & Historical Features
- 📊 **Player Leaderboard** - Individual player statistics with sortable columns
  - Win rate, goals, assists, saves, MVP awards
  - Per-game averages and totals
  - Visibility toggle for end-of-season reveal
- 🏅 **Trophy System** - Team achievements and tournament placements
  - Championship stars on team pages
  - Trophy case with tournament history
  - Support for EML, ECF, and custom tournaments
- 📜 **Historical Data** - Player legacy across seasons
  - Past teams and placements
  - Season statistics archive
  - Legacy achievements tracking

### Media & Content Features
- 🎬 **EML Highlights** - Curated video highlights
  - Embedded YouTube, Twitch, and TikTok clips
  - Featured highlight carousel
  - Player spotlight tags
- 💡 **Tips & Tricks** - Educational content library
  - Instructional videos
  - Strategy guides
  - Humorous content
- 🎤 **Team Interviews** - High-production team features (hook available)
- 📺 **Media Hub** - Links to Twitch, YouTube, TikTok channels

### Community & Engagement Features
- 🗳️ **Match Predictions** - Community poll-based predictions
  - Vote percentages and totals
  - Open/closed prediction states
  - No betting or currency (pure fun)
- 🏷️ **Player Tags** - Cosmetic nameplates and titles
  - Championship badges
  - Achievement tags
  - Fun community titles (e.g., "11.5", "Oops! I dinged it again")
- 📢 **Dynamic Announcements** - League updates from Google Sheets
  - Categorized announcements
  - Priority levels
  - Date-sorted feed

### Bot Integration
- 🤖 **Discord Bot Sync** - Real-time data updates
  - Bot writes to Google Sheets
  - Website reads and displays data
  - 30-second refresh cycle
  - See `BOT_INTEGRATION.md` for details

## Development

The app uses Vite's hot module replacement for instant updates during development. Error boundaries are in place to catch and display runtime errors with detailed stack traces.

### VS Code Integration

Press `F5` in VS Code to launch the dev server and open Brave browser with debugging enabled (see `.vscode/launch.json`).

### File Organization

All source code is in the `src/` directory following React/Vite conventions:

- Components are in `src/components/` (40+ components)
- Custom hooks are in `src/hooks/` (20+ data hooks)
- Static data is in `src/data/`
- Configuration files are in the `config/` directory

## Documentation

- 📖 **[FEATURE_ROADMAP.md](FEATURE_ROADMAP.md)** - Complete feature implementation roadmap
- 🔧 **[BOT_INTEGRATION.md](BOT_INTEGRATION.md)** - Discord bot integration guide
- 📊 **[SHEETS_DATA_FORMAT.md](SHEETS_DATA_FORMAT.md)** - Google Sheets data format reference
- 🚀 **[GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)** - Google Sheets API setup
- 🎨 **[docs/COLOR_REFERENCE.md](docs/COLOR_REFERENCE.md)** - Theme color reference

## Browser Support

Modern browsers with ES2020+ support. Tested in Chrome, Brave, Firefox, and Edge.

## Deployment

The app is configured for GitHub Pages deployment:

```bash
npm run deploy
```

This will build the app and push to the `gh-pages` branch.
