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

  // Sheet names and ranges (limited to primary data section to avoid duplicate columns)
  ranges: {
    rosterWide: '_RosterWide!A:H',        // Team, Captain, Co-Captain (CC) Player, Player×4, Status
    upcomingMatches: 'Upcoming Matches!A:Z', // Match schedule ✓ WORKING
    rankings: 'Rankings!A:D',             // team name, Rating, Rank, Active
    matches: 'Proposed Match Results!A:J', // Proposed match results (first section)
    cooldownList: 'Cooldown List!A:C',    // Player Name, Team Left, Expires
    teamRoles: 'Team Roles!A:D',          // Team Name, Player Name, Captain, Co-Captain
    matchResults: 'Match Results!A:P',    // Week through Result (first section only)
    forfeits: 'Forfeits!A:P',             // Forfeited matches (first section only)
    registeredLeagueSubs: 'Registered League Subs!A:B', // Player Name, Region
    
    // New ranges for expanded features
    playerStats: 'Player Stats!A:M',      // Player Name, Team, Wins, Losses, Goals, Assists, Saves, etc.
    playerHistory: 'Player History!A:G',  // Player Name, Season, Team, Placement, Stats, Achievements
    trophies: 'Trophies!A:F',             // Team Name, Tournament, Season, Placement, Date, Trophy Type
    highlights: 'Highlights!A:H',         // Title, URL, Platform, Date, Featured, Player, Description, Thumbnail
    interviews: 'Interviews!A:G',         // Title, Team, Date, URL, Interviewer, Description, Thumbnail
    predictions: 'Predictions!A:F',       // Match ID, Team A Votes, Team B Votes, Total Votes, Closed, Result
    announcements: 'Announcements!A:F',   // Title, Content, Date, Author, Category, Priority
    playerTags: 'Player Tags!A:D',        // Player Name, Tag, Type, Description
    tipsAndTricks: 'Tips And Tricks!A:G', // Title, URL, Category, Date, Description, Thumbnail, Duration
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

