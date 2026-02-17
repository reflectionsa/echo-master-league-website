import { useGoogleSheets } from './useGoogleSheets';
import { getRosterConfig, GOOGLE_SHEETS_CONFIG } from '../../config/sheets';

/**
 * Parse score rounds (R1, R2, R3) and calculate total
 * Returns winner's score and loser's score
 * 
 * Sheet structure: Week | Match Type | Match Status | Match Date | Match Time (ET) | Team A | Team B | Round 1 | [empty] | Round 2 | [empty] | Round 3 | [empty]
 * Round 1/2/3 columns contain Team A scores, empty columns after them contain Team B scores
 * Empty headers are now named _empty_N by useGoogleSheets
 */
const parseMatchScore = (row) => {
    const team1 = row['Team A'] || row.team1 || '';
    const team2 = row['Team B'] || row.team2 || '';

    // Get round scores for Team A (in the Round columns)
    const t1r1 = parseInt(row['Round 1'] || 0);
    const t1r2 = parseInt(row['Round 2'] || 0);
    const t1r3 = parseInt(row['Round 3'] || 0);
    const team1Total = t1r1 + t1r2 + t1r3;

    // Get round scores for Team B (in the _empty_ columns after Round columns)
    // These are columns 8, 10, 12 in the original sheet
    const t2r1 = parseInt(row['_empty_8'] || 0);
    const t2r2 = parseInt(row['_empty_10'] || 0);
    const t2r3 = parseInt(row['_empty_12'] || 0);
    return {
        team1,
        team2,
        team1Score: team1Total,
        team2Score: team2Total,
        team1Won: team1Total > team2Total,
        team2Won: team2Total > team1Total,
        isForfeit,
        matchStatus,
    };
};

/**
 * Hook to fetch match results from Google Sheets
 * Shows completed matches with scores (winner in green, loser in red)
 */
export const useMatchResults = () => {
    const config = getRosterConfig();
    const { data, loading, error, refetch } = useGoogleSheets(
        config.spreadsheetId,
        GOOGLE_SHEETS_CONFIG.ranges.matchResults,
        config.apiKey
    );

    // Transform Google Sheets data to app format
    const matchResults = data.map(row => {
        const scoreData = parseMatchScore(row);

        return {
            id: row.id,
            week: row['Week'] || row.week || '',
            matchDate: row['Match Date'] || row.date || '',
            matchTime: row['Match Time (ET)'] || row.matchTime || '',
            matchType: row['Match Type'] || row.matchType || '',
            ...scoreData,
        };
    }).filter(match => {
        // Filter: must have both teams and either have scores OR be a forfeit
        return match.team1 && match.team2 && (match.team1Score > 0 || match.team2Score > 0 || match.isForfeit);
    });

    return { matchResults, loading, error, refetch };
};
