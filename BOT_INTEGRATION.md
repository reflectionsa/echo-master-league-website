# EML Bot & Website Integration Guide

## Overview
The EML website and Discord bot are integrated through Google Sheets as the single source of truth. The bot writes data to Google Sheets, and the website reads from it in real-time.

## Architecture

```
Discord Bot → Google Sheets → Website
   (Write)       (Database)      (Read)
```

## Integration Points

### 1. Team Rosters
- **Bot Command**: `/roster add`, `/roster remove`, `/roster set-captain`
- **Sheet**: `_RosterWide` or `Team Roles`
- **Website Hook**: `useTeamRoles`, `useTeamProfile`
- **Auto-Updates**: Team cards, team profiles, roster lists

### 2. League Standings
- **Bot Command**: `/standings update`, `/mmr update`
- **Sheet**: `Rankings`
- **Website Hook**: `useStandings`
- **Auto-Updates**: Standings table, team MMR, win/loss records

### 3. Match Scheduling & Results
- **Bot Command**: `/match schedule`, `/match submit`, `/match result`
- **Sheet**: `Upcoming Matches`, `Match Results`, `Proposed Match Results`
- **Website Hook**: `useMatches`, `useMatchResults`
- **Auto-Updates**: Match cards, upcoming matches, match history

### 4. Player Statistics
- **Bot Command**: `/stats update`, `/stats player`
- **Sheet**: `Player Stats`
- **Website Hook**: `usePlayerLeaderboard`
- **Auto-Updates**: Player leaderboard, player stats on profiles

### 5. Announcements
- **Bot Command**: `/announce post`
- **Sheet**: `Announcements`
- **Website Hook**: `useAnnouncements`
- **Auto-Updates**: Announcements page, notification badges
- **Format**:
  - Title: Short announcement title
  - Content: Full announcement text (supports line breaks)
  - Date: ISO 8601 timestamp
  - Author: Staff member name
  - Category: "League Updates", "Management", "Schedule", "Major Events"
  - Priority: "High" or "Normal"

### 6. Predictions
- **Bot Command**: `/predict create`, `/predict vote`, `/predict close`
- **Sheet**: `Predictions`
- **Website Hook**: `usePredictions`
- **Auto-Updates**: Predictions view with vote percentages
- **Format**:
  - Match ID: Unique identifier matching the match
  - Team A Votes: Number of votes for Team A
  - Team B Votes: Number of votes for Team B
  - Total Votes: Sum of all votes
  - Closed: Boolean (true/false or 1/0)
  - Result: Final match result when closed

### 7. Trophies & Achievements
- **Bot Command**: `/trophy award`, `/achievement grant`
- **Sheet**: `Trophies`
- **Website Hook**: `useTrophies`
- **Auto-Updates**: Trophy case on team pages, championship stars
- **Format**:
  - Team Name: Full team name
  - Tournament: "EML", "ECF", or custom tournament name
  - Season: Season identifier
  - Placement: "1st", "2nd", "3rd", "Finalist"
  - Date: ISO 8601 timestamp
  - Trophy Type: Same as Placement (for consistency)

### 8. Highlights & Media
- **Bot Command**: `/highlight add`, `/highlight feature`
- **Sheet**: `Highlights`
- **Website Hook**: `useHighlights`
- **Auto-Updates**: Highlights view, featured carousel
- **Format**:
  - Title: Video title
  - URL: YouTube, Twitch, or TikTok URL
  - Platform: "YouTube", "Twitch", "TikTok"
  - Date: ISO 8601 timestamp
  - Featured: Boolean (true/false or 1/0)
  - Player: Player name (optional)
  - Description: Short description
  - Thumbnail: URL to thumbnail image (optional)

### 9. Player Tags/Titles
- **Bot Command**: `/tag grant`, `/tag revoke`
- **Sheet**: `Player Tags`
- **Website Hook**: `usePlayerTags`
- **Auto-Updates**: Player profile tags, cosmetic titles
- **Format**:
  - Player Name: Full player name
  - Tag: Tag text (e.g., "11.5", "Champion")
  - Type: "Achievement", "Champion", "Fun", "Legacy"
  - Description: What the tag means

### 10. Historical Data
- **Bot Command**: `/history import`, `/history season`
- **Sheet**: `Player History`
- **Website Hook**: `useHistoricalData`
- **Auto-Updates**: Historical player data viewer
- **Format**:
  - Player Name: Full player name
  - Season: Season identifier
  - Team: Team played for
  - Placement: Final season placement
  - Stats: Season statistics summary
  - Achievements: Notable achievements
  - Notes: Additional context (optional)

## Bot Implementation Notes

### Writing to Google Sheets
The bot should use the Google Sheets API with a service account that has edit permissions:

```javascript
const { google } = require('googleapis');

async function updateSheet(range, values) {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: range,
    valueInputOption: 'USER_ENTERED',
    resource: { values },
  });
}
```

### Real-Time Updates
The website automatically refetches data every 30 seconds for active views. For immediate updates:

1. Bot writes to Google Sheets
2. Website polls Google Sheets API every 30s
3. Changes appear within 30 seconds

For truly real-time updates (optional enhancement):
- Implement webhook system where bot notifies website
- Use WebSocket connection for instant updates
- Requires backend server infrastructure

### Data Validation
The bot should validate data before writing to sheets:
- Check for valid team names
- Verify player exists in roster
- Ensure proper date formatting (ISO 8601)
- Validate URL formats for media
- Confirm numeric values for stats

### Error Handling
Bot should handle sheet write failures gracefully:
- Retry failed writes with exponential backoff
- Log errors for debugging
- Send error messages to admins
- Maintain data consistency

## Website Refresh Mechanism

The website uses these strategies to keep data fresh:

1. **Auto-Refresh**: All hooks refetch every 30 seconds when view is open
2. **Manual Refresh**: Users can manually trigger refresh via refetch buttons
3. **On-Open Refresh**: Data refreshes when opening a view
4. **Cache Duration**: 30-second cache to prevent excessive API calls

## Testing Bot Integration

1. **Test Command**: Use bot commands to update data
2. **Verify Sheet**: Check that data appears in Google Sheets
3. **Check Website**: Open relevant view and verify data appears
4. **Timing**: Data should appear within 30 seconds (or on manual refresh)

## Troubleshooting

### Data Not Appearing on Website
1. Verify data is in correct sheet tab
2. Check column headers match expected format
3. Ensure sheet is publicly readable or API key has access
4. Check browser console for API errors
5. Verify VITE_GOOGLE_SHEETS_API_KEY is set

### Bot Write Failures
1. Verify service account has edit permissions
2. Check quota limits on Google Sheets API
3. Validate data format before writing
4. Check for duplicate/conflicting data

### Performance Issues
1. Limit concurrent sheet writes
2. Batch updates when possible
3. Implement rate limiting on bot commands
4. Monitor API quota usage

## Future Enhancements

### Planned Improvements
- WebSocket real-time updates
- Bot notification when data updates
- Data versioning/history
- Backup and restore functionality
- Admin dashboard for data management
- Automated data validation
- Duplicate detection and prevention

### Optional Features
- Image upload support (via external hosting + URL in sheets)
- Rich text formatting in announcements (Markdown)
- Comment threads on announcements
- Voting/polling directly in Discord
- Match reminder notifications
- Automated highlight detection from streams
