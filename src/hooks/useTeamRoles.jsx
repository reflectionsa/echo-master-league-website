import { useGoogleSheets } from './useGoogleSheets';
import { getRosterConfig, GOOGLE_SHEETS_CONFIG } from '../../config/sheets';

/**
 * Hook to fetch team roles (captains and co-captains) from Google Sheets
 */
export const useTeamRoles = () => {
    const config = getRosterConfig();
    const { data, loading, error, refetch } = useGoogleSheets(
        config.spreadsheetId,
        GOOGLE_SHEETS_CONFIG.ranges.teamRoles,
        config.apiKey
    );

    // Transform Google Sheets data to app format
    const teamRoles = data.map(row => ({
        id: row.id,
        teamName: row['Team Name'] || row['Team'] || row.teamName || row.team || '',
        captain: row['Captain'] || row.captain || '',
        coCaptain: row['Co-Captain'] || row['Co Captain'] || row.coCaptain || '',
        tier: row['Tier'] || row.tier || '',
        region: row['Region'] || row.region || 'NA',
    })).filter(team => team.teamName); // Filter out empty rows

    return { teamRoles, loading, error, refetch };
};
