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
  // Your Google Sheets API Key
  apiKey: 'YOUR_API_KEY_HERE',
  
  // Your Spreadsheet ID (from the URL)
  spreadsheetId: 'YOUR_SPREADSHEET_ID_HERE',
  
  // Sheet names and ranges
  ranges: {
    teams: 'Teams!A:H',      // Team roster data
    matches: 'Matches!A:G',  // Match schedule
    standings: 'Standings!A:E', // League standings
  }
};

// Alternative: Use environment variables (recommended for production)
export const getConfig = () => ({
  apiKey: import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || GOOGLE_SHEETS_CONFIG.apiKey,
  spreadsheetId: import.meta.env.VITE_SPREADSHEET_ID || GOOGLE_SHEETS_CONFIG.spreadsheetId,
  ranges: GOOGLE_SHEETS_CONFIG.ranges,
});
