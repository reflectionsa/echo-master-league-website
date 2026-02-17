import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch data from Google Sheets
 * @param {string} spreadsheetId - Your Google Sheet ID from the URL
 * @param {string} range - Sheet name and range (e.g., "Teams!A1:H100")
 * @param {string} apiKey - Your Google Sheets API key
 * @returns {object} { data, loading, error, refetch }
 */
export const useGoogleSheets = (spreadsheetId, range, apiKey) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!spreadsheetId || !range || !apiKey) {
      setError('Missing required parameters: spreadsheetId, range, or apiKey');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const result = await response.json();

      // Transform rows into objects using first row as keys
      const rows = result.values || [];
      if (rows.length === 0) {
        setData([]);
        return;
      }

      const headers = rows[0];
      const dataRows = rows.slice(1);

      // Handle empty headers by numbering them to prevent overwrites
      const processedHeaders = headers.map((header, index) => {
        if (!header || header.trim() === '') {
          return `_empty_${index}`;
        }
        return header;
      });

      const transformedData = dataRows.map((row, index) => {
        const obj = { id: index + 1 };
        processedHeaders.forEach((header, i) => {
          obj[header] = row[i] || '';
        });
        return obj;
      });

      setData(transformedData);
    } catch (err) {
      console.error('Google Sheets fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [spreadsheetId, range, apiKey]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook to fetch EML team data from Google Sheets
 * @param {string} spreadsheetId - Your Google Sheet ID
 * @param {string} apiKey - Your Google Sheets API key
 */
export const useTeamsFromSheets = (spreadsheetId, apiKey) => {
  const { data, loading, error, refetch } = useGoogleSheets(
    spreadsheetId,
    'Teams!A:H', // Adjust range based on your sheet
    apiKey
  );

  // Transform Google Sheets data to match app format
  const teams = data.map(row => ({
    id: row.id,
    name: row['Team Name'] || row.name,
    captain: row.Captain || row.captain,
    coCaptain: row['Co-Captain'] || row.coCaptain,
    tier: row.Tier || row.tier,
    region: row.Region || row.region,
    status: row.Status || row.status,
    leaguePoints: parseInt(row['League Points'] || row.leaguePoints || 0),
    teamLogo: row['Team Logo'] || row.teamLogo,
  }));

  return { teams, loading, error, refetch };
};

/**
 * Hook to fetch match schedule from Google Sheets
 * @param {string} spreadsheetId - Your Google Sheet ID
 * @param {string} apiKey - Your Google Sheets API key
 */
export const useMatchesFromSheets = (spreadsheetId, apiKey) => {
  const { data, loading, error, refetch } = useGoogleSheets(
    spreadsheetId,
    'Matches!A:G', // Adjust range based on your sheet
    apiKey
  );

  // Transform to match format
  const matches = data.map(row => ({
    id: row.id,
    name: row['Match Name'] || row.name,
    homeTeam: row['Home Team'] || row.homeTeam,
    awayTeam: row['Away Team'] || row.awayTeam,
    matchDate: row['Match Date'] ? new Date(row['Match Date']) : null,
    status: row.Status || row.status,
    score: row.Score || row.score,
    streamLink: row['Stream Link'] || row.streamLink,
    caster: row.Caster || row.caster,
  }));

  return { matches, loading, error, refetch };
};
