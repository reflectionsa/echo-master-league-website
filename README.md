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

- 🎨 Dark/Light theme toggle with localStorage persistence
- 📱 Responsive design with mobile bottom navigation
- 🏆 League standings and match tracking
- 👥 Team rosters and player profiles
- 📅 Calendar and scheduling
- 🎮 Discord bot integration info
- 📺 Media highlights and content
- 🔔 Announcements and updates
- 📊 **Live data from Google Sheets** (teams, matches, rankings)
- 🔄 Auto-refresh with manual refetch capability
- 📈 Dynamic stats (real team/player counts)

## Development

The app uses Vite's hot module replacement for instant updates during development. Error boundaries are in place to catch and display runtime errors with detailed stack traces.

### VS Code Integration

Press `F5` in VS Code to launch the dev server and open Brave browser with debugging enabled (see `.vscode/launch.json`).

### File Organization

All source code is in the `src/` directory following React/Vite conventions:

- Components are in `src/components/`
- Custom hooks are in `src/hooks/`
- Static data is in `src/data/`
- Configuration files are in the `config/` directory

## Browser Support

Modern browsers with ES2020+ support. Tested in Chrome, Brave, Firefox, and Edge.

## Deployment

The app is configured for GitHub Pages deployment:

```bash
npm run deploy
```

This will build the app and push to the `gh-pages` branch.
