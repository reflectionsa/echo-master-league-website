import { useGoogleSheets } from './useGoogleSheets';
import { getRosterConfig, GOOGLE_SHEETS_CONFIG } from '../../config/sheets';
import { useMemo } from 'react';

/**
 * Hook to fetch team roster data from Team Roles sheet
 * Cross-references with Rankings sheet to determine Active/Inactive status
 * Teams in Rankings = Active, Teams not in Rankings = Inactive
 */
export const useTeamRoles = () => {
    const config = getRosterConfig();
    const { data, loading, error, refetch } = useGoogleSheets(
        config.spreadsheetId,
        GOOGLE_SHEETS_CONFIG.ranges.teamRoles,
        config.apiKey
    );

    // Also fetch Rankings data to determine active status
    const { data: rankingsData, loading: rankingsLoading } = useGoogleSheets(
        config.spreadsheetId,
        GOOGLE_SHEETS_CONFIG.ranges.rankings,
        config.apiKey
    );

    const teams = useMemo(() => {
        if (!data || data.length === 0) return [];

        // Get list of active team names from Rankings sheet
        const activeTeamNames = new Set();
        if (rankingsData && rankingsData.length > 0) {
            rankingsData.forEach(row => {
                const teamName = row['team name'] || row['Team'] || row.team || '';
                if (teamName) {
                    activeTeamNames.add(teamName.toLowerCase().trim());
                }
            });
        }

        // Group players by team name
        const teamMap = new Map();

        data.forEach(row => {
            const playerName = row['Player Name'] || row.Player || row.player || '';
            const teamName = row['Team Name'] || row.Team || row.team || '';
            const role = row['Role'] || row.role || 'Player';
            const rank = row['Rank'] || row.rank || ''; // Get rank if available

            if (!playerName || !teamName) return;

            if (!teamMap.has(teamName)) {
                teamMap.set(teamName, {
                    name: teamName,
                    captain: '',
                    coCaptain: '',
                    players: [],
                    ranks: [], // Store all player ranks
                });
            }

            const team = teamMap.get(teamName);

            if (role.toLowerCase().includes('captain') && !role.toLowerCase().includes('co')) {
                team.captain = playerName;
            } else if (role.toLowerCase().includes('co-captain') || role.toLowerCase().includes('co captain')) {
                team.coCaptain = playerName;
            } else {
                team.players.push(playerName);
            }

            // Collect ranks
            if (rank) {
                team.ranks.push(rank);
            }
        });

        // Convert map to array and determine status
        const teamsArray = Array.from(teamMap.values()).map((team, index) => {
            const totalPlayers = [
                team.captain,
                team.coCaptain,
                ...team.players
            ].filter(Boolean).length;

            // Determine status: Active if team is in Rankings sheet
            const isInRankings = activeTeamNames.has(team.name.toLowerCase().trim());
            const status = isInRankings ? 'Active' : 'Inactive';

            return {
                id: index + 1,
                name: team.name,
                captain: team.captain,
                coCaptain: team.coCaptain,
                players: team.players.filter(Boolean),
                status,
                totalPlayers,
                ranks: team.ranks, // Include rank data
            };
        });

        // Sort by name
        return teamsArray.sort((a, b) => a.name.localeCompare(b.name));
    }, [data, rankingsData]);

    return { teams, loading: loading || rankingsLoading, error, refetch };
};
