/**
 * Google Sheets Configuration
 * 
 * SETUP INSTRUCTIONS:
 * 1. Get your Spreadsheet ID from the Google Sheets URL:
 *    https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit
 * 
 * 2. Get an API Key:
 *    - Go to https://console.cloud.google.com/apis/credentials
 *    - Click "Create Credentials" → "API Key"
 *    - Enable "Google Sheets API" for your project
 * 
 * 3. Make your sheet publicly accessible:
 *    - File → Share → Publish to web
 *    OR
 *    - Share → Anyone with the link can view
 * 
 * 4. Update the values below
 */

export const GOOGLE_SHEETS_CONFIG = {
  // Your Google Sheets API Key (get from Google Cloud Console)
  apiKey: 'YOUR_API_KEY_HERE',

  // Spreadsheet IDs for different data sources
  spreadsheets: {
    // Team rosters and match data
    roster: '1Xxui4vb0j8dkIJgprfyYgUV2G-EeBfQ2ijrABxZGgoc',
    // Rankings and tournament data
    tournament: '1jK1FRzc044wq2miNZQbcqDDPoVAA3dR5knd8MZEpKdw',
  },

  // Sheet names and ranges
  ranges: {
    rosterWide: '_RosterWide!A:Z',        // Complete team roster data
    upcomingMatches: 'Upcoming Matches!A:Z', // Match schedule
    rankings: 'NA Pblc Rnkngs!A:Z',       // Public rankings
    tournament: 'EML NA Season 4 - TOURNAMENT!A:Z', // Tournament standings
  }
};

// Use environment variables (recommended for production)
export const getConfig = () => ({
  apiKey: import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || GOOGLE_SHEETS_CONFIG.apiKey,
  spreadsheets: GOOGLE_SHEETS_CONFIG.spreadsheets,
  ranges: GOOGLE_SHEETS_CONFIG.ranges,
});

// Helper functions to get specific spreadsheet configs
export const getRosterConfig = () => ({
  apiKey: getConfig().apiKey,
  spreadsheetId: getConfig().spreadsheets.roster,
});

export const getTournamentConfig = () => ({
  apiKey: getConfig().apiKey,
  spreadsheetId: getConfig().spreadsheets.tournament,
});

