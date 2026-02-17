import { useGoogleSheets } from './useGoogleSheets';
import { getRosterConfig, GOOGLE_SHEETS_CONFIG } from '../../config/sheets';
import { useMemo } from 'react';

/**
 * Hook to fetch team roster data from Team Roles sheet
 * Groups players by team - ALL teams show as Active
 */
export const useTeamRoles = () => {
    const config = getRosterConfig();
    const { data, loading, error, refetch } = useGoogleSheets(
        config.spreadsheetId,
        GOOGLE_SHEETS_CONFIG.ranges.teamRoles,
        config.apiKey
    );

    const teams = useMemo(() => {
        if (!data || data.length === 0) return [];

        // Group players by team name
        const teamMap = new Map();

        data.forEach(row => {
            const playerName = row['Player Name'] || row.Player || row.player || '';
            const teamName = row['Team Name'] || row.Team || row.team || '';
            const role = row['Role'] || row.role || 'Player';

            if (!playerName || !teamName) return;

            if (!teamMap.has(teamName)) {
                teamMap.set(teamName, {
                    name: teamName,
                    captain: '',
                    coCaptain: '',
                    players: [],
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
        });

        // Convert map to array and add status
        const teamsArray = Array.from(teamMap.values()).map((team, index) => {
            const totalPlayers = [
                team.captain,
                team.coCaptain,
                ...team.players
            ].filter(Boolean).length;

            // All teams are Active
            const status = 'Active';

            return {
                id: index + 1,
                name: team.name,
                captain: team.captain,
                coCaptain: team.coCaptain,
                players: team.players.filter(Boolean),
                status,
                totalPlayers,
            };
        });

        // Sort by name
        return teamsArray.sort((a, b) => a.name.localeCompare(b.name));
    }, [data]);

    return { teams, loading, error, refetch };
};
