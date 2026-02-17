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
  apiKey: 'AIzaSyBASNrr1R2CIXcyEFDQNpcRVdJ9-SU54Kc',

  // Spreadsheet ID - all data comes from this one sheet
  spreadsheets: {
    // Main EML data spreadsheet (contains all tabs)
    roster: '1Xxui4vb0j8dkIJgprfyYgUV2G-EeBfQ2ijrABxZGgoc',
  },

  // Sheet names and ranges
  ranges: {
    rosterWide: '_RosterWide!A:Z',        // Complete team roster data (PROTECTED - needs unprotection)
    upcomingMatches: 'Upcoming Matches!A:Z', // Match schedule ✓ WORKING
    rankings: 'Rankings!A:Z',             // Public rankings (PROTECTED - needs unprotection)
    matches: 'Proposed Match Results!A:Z', // Match results with scoring ✓ WORKING
    cooldownList: 'Cooldown List!A:Z',    // Players on cooldown ✓ WORKING
    teamRoles: 'Team Roles!A:Z',          // Team captain and co-captain assignments ✓ WORKING
    matchResults: 'Match Results!A:Z',    // Completed match results with scores (PROTECTED - needs unprotection)
    forfeits: 'Forfeits!A:Z',             // Forfeited matches (PROTECTED - needs unprotection)
    registeredLeagueSubs: 'Registered League Subs!A:Z', // League substitute players ✓ WORKING
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

// Alias for getTournamentConfig - now points to same spreadsheet
export const getTournamentConfig = () => ({
  apiKey: getConfig().apiKey,
  spreadsheetId: getConfig().spreadsheets.roster,
});

