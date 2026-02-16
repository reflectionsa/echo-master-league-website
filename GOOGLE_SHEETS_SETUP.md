# Google Sheets Integration Guide

The Echo Master League site pulls live data from Google Sheets for teams, matches, and rankings.

## Setup Instructions

### 1. Get a Google Sheets API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the **Google Sheets API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy your API key

### 2. Configure the Application

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API key:

   ```
   VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
   ```

### 3. Make Sheets Publicly Accessible

The Google Sheets must be publicly viewable for the API to access them:

**Option A: Publish to Web** (Recommended)

1. Open your Google Sheet
2. Go to File → Share → Publish to web
3. Choose the sheets you want to publish
4. Click "Publish"

**Option B: Share Link**

1. Click the "Share" button
2. Change access to "Anyone with the link can view"
3. Click "Done"

## Current Data Sources

The application is configured to pull from these Google Sheets:

### Roster & Matches

- **Sheet ID**: `1Xxui4vb0j8dkIJgprfyYgUV2G-EeBfQ2ijrABxZGgoc`
- **Sheets**:
  - `_RosterWide` - Team rosters with captains and players
  - `Upcoming Matches` - Match schedule

### Rankings & Tournament

- **Sheet ID**: `1jK1FRzc044wq2miNZQbcqDDPoVAA3dR5knd8MZEpKdw`
- **Sheets**:
  - `NA Pblc Rnkngs` - Public rankings
  - `EML NA Season 4 - TOURNAMENT` - Tournament standings

## Expected Data Format

### Teams (_RosterWide sheet)

Columns (flexible header names):

- Team Name / Team
- Captain
- Co-Captain / Co Captain
- Player 1, Player 2, Player 3, Player 4
- Tier
- Region
- Status
- League Points / Points
- Wins
- Losses

### Matches (Upcoming Matches sheet)

Columns:

- Match Date / Date
- Match Time / Time
- Team 1
- Team 2
- Score
- Status (Scheduled, Live, Completed)
- Week
- Round
- Stream Link
- Division

### Rankings (NA Pblc Rnkngs sheet)

Columns:

- Position / Rank
- Team / Team Name
- Tier
- Region
- Wins / W
- Losses / L
- MMR / Rating
- Points / League Points

## Troubleshooting

### "Missing required parameters" error

- Make sure you've created a `.env` file with your API key
- Restart the dev server after adding the `.env` file

### "Failed to fetch" error

- Verify the Google Sheets are publicly accessible
- Check that the Google Sheets API is enabled in your Google Cloud project
- Verify your API key is correct

### Empty data

- Check that the sheet names match exactly (case-sensitive)
- Ensure the first row contains headers
- Verify there's data in the sheets

### API Quota Exceeded

- Google Sheets API has daily quotas
- Consider implementing caching if you hit limits
- Free tier: 100 requests per 100 seconds per user

## Development

To modify which sheets are used, edit `config/sheets.js`:

```javascript
export const GOOGLE_SHEETS_CONFIG = {
  spreadsheets: {
    roster: 'YOUR_ROSTER_SHEET_ID',
    tournament: 'YOUR_TOURNAMENT_SHEET_ID',
  },
  ranges: {
    rosterWide: 'Sheet Name!A:Z',
    // ... other ranges
  }
};
```

## Live Data Features

With Google Sheets integration enabled:

- ✅ Real-time team rosters
- ✅ Live match schedules
- ✅ Dynamic league standings
- ✅ Accurate player counts in Hero section
- ✅ Up-to-date rankings

Data refreshes automatically when components mount and can be manually refreshed using the refetch function in each hook.
