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
                // Try all possible column names from Rankings sheet
                const teamName = row['Team'] || row['team name'] || row['Team Name'] || row.team || row['team'] ||
                    Object.values(row)[0]; // Fallback to first column
                if (teamName && String(teamName).trim()) {
                    activeTeamNames.add(String(teamName).toLowerCase().trim());
                }
            });
        }

        // Detect data format - check if first row has "Player Name" column (row-per-player)
        // or if it's row-per-team format
        const firstRow = data[0] || {};
        const hasPlayerNameColumn = 'Player Name' in firstRow || 'Player' in firstRow || 'player' in firstRow;

        const teamMap = new Map();

        if (hasPlayerNameColumn) {
            // ROW-PER-PLAYER FORMAT (Player Name | Team Name | Role)
            data.forEach((row, idx) => {
                const playerName = row['Player Name'] || row.Player || row.player || '';
                const teamName = row['Team Name'] || row.Team || row.team || '';

                // Check Captain/Co-Captain columns (might have trailing space!)
                const isCaptain = (row['Captain'] || row.captain || '').toString().toLowerCase() === 'yes';
                const isCoCaptain = (row['Co-Captain '] || row['Co-Captain'] || row['co-captain'] || '').toString().toLowerCase() === 'yes';
                const rank = row['Rank'] || row.rank || '';

                if (!playerName || !teamName) {
                    return;
                }

                if (!teamMap.has(teamName)) {
                    teamMap.set(teamName, {
                        name: teamName,
                        captain: '',
                        coCaptain: '',
                        players: [],
                        ranks: [],
                    });
                }

                const team = teamMap.get(teamName);

                if (isCaptain) {
                    team.captain = playerName;
                } else if (isCoCaptain) {
                    team.coCaptain = playerName;
                } else {
                    team.players.push(playerName);
                }

                if (rank) team.ranks.push(rank);
            });
        } else {
            // ROW-PER-TEAM FORMAT (Team | Player1 | Player2 | ... | Status)
            data.forEach(row => {
                // Get all values from the row, excluding the 'id' field added by useGoogleSheets
                const values = Object.entries(row)
                    .filter(([key, val]) => key !== 'id' && val && String(val).trim())
                    .map(([_, val]) => val);

                if (values.length === 0) return;

                const teamName = String(values[0]).trim();
                if (!teamName || teamName === 'Active' || teamName === 'Inactive') return;

                const playerValues = values.slice(1).filter(v =>
                    v &&
                    String(v).trim() &&
                    v !== 'Active' &&
                    v !== 'Inactive'
                );

                if (!teamMap.has(teamName)) {
                    teamMap.set(teamName, {
                        name: teamName,
                        captain: '',
                        coCaptain: '',
                        players: [],
                        ranks: [],
                    });
                }

                const team = teamMap.get(teamName);

                // First player is captain (unless marked with (CC))
                // Players with (CC) prefix are co-captains
                let captainAssigned = false;

                playerValues.forEach(playerValue => {
                    const playerStr = String(playerValue).trim();

                    // Check if this is a co-captain
                    if (playerStr.startsWith('(CC)')) {
                        const playerName = playerStr.replace('(CC)', '').trim();
                        if (playerName) {
                            team.coCaptain = playerName;
                        }
                    } else {
                        // First non-CC player is the captain
                        if (!captainAssigned && playerStr) {
                            team.captain = playerStr;
                            captainAssigned = true;
                        } else if (playerStr) {
                            team.players.push(playerStr);
                        }
                    }
                });
            });
        }

        // Convert map to array and determine status
        const teamsArray = Array.from(teamMap.values()).map((team, index) => {
            const totalPlayers = [
                team.captain,
                team.coCaptain,
                ...team.players
            ].filter(Boolean).length;

            // Determine status: Active if team is in Rankings sheet
            const normalizedTeamName = team.name.toLowerCase().trim();
            const isInRankings = activeTeamNames.has(normalizedTeamName);
            const status = isInRankings ? 'Active' : 'Inactive';

            return {
                id: index + 1,
                name: team.name,
                captain: team.captain,
                coCaptain: team.coCaptain,
                players: team.players.filter(Boolean),
                status,
                totalPlayers,
                ranks: team.ranks,
            };
        });

        // Sort by name
        return teamsArray.sort((a, b) => a.name.localeCompare(b.name));
    }, [data, rankingsData]);

    return { teams, loading: loading || rankingsLoading, error, refetch };
};
