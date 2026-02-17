import { useGoogleSheets } from './useGoogleSheets';
import { getRosterConfig, GOOGLE_SHEETS_CONFIG } from '../../config/sheets';

/**
 * Parse rank tier from various formats:
 * - "Diamond 1", "Diamond 2", etc.
 * - "Platinum 3", "Gold 4", etc.
 * - "D1", "P2", "G3", etc.
 * - Single tier: "Diamond", "Platinum", "Gold"
 */
const parseRankTier = (tierString) => {
  if (!tierString) return { rank: 'Unranked', division: null };

  const str = String(tierString).trim();

  // Match patterns like "Diamond 1", "D1", "Diamond1"
  const match = str.match(/^(Diamond|D|Platinum|P|Gold|G|Silver|S|Bronze|B)\s*(\d)?/i);

  if (!match) return { rank: str, division: null };

  const rankMap = {
    'D': 'Diamond', 'DIAMOND': 'Diamond',
    'P': 'Platinum', 'PLATINUM': 'Platinum',
    'G': 'Gold', 'GOLD': 'Gold',
    'S': 'Silver', 'SILVER': 'Silver',
    'B': 'Bronze', 'BRONZE': 'Bronze',
  };

  const rank = rankMap[match[1].toUpperCase()] || match[1];
  const division = match[2] ? parseInt(match[2]) : null;

  return { rank, division };
};

export const useRankings = () => {
  const config = getRosterConfig();
  const { data, loading, error, refetch } = useGoogleSheets(
    config.spreadsheetId,
    GOOGLE_SHEETS_CONFIG.ranges.rankings,
    config.apiKey
  );

  // Transform Google Sheets data to app format
  const rankings = data.map((row, idx) => {
    const tierInfo = parseRankTier(row['Tier'] || row['Rank'] || row.tier || row.rank);

    return {
      id: row.id,
      position: parseInt(row['Position'] || row['Rank #'] || idx + 1),
      name: row['Team'] || row['Team Name'] || row.team || row.name || '',
      captain: row['Captain'] || row.captain || '',
      tier: tierInfo.rank,
      division: tierInfo.division,
      mmr: parseInt(row['MMR'] || row['Rating'] || row.mmr || row.rating || 0),
      region: row['Region'] || row.region || 'North America',
      wins: parseInt(row['Wins'] || row['W'] || row.wins || 0),
      losses: parseInt(row['Losses'] || row['L'] || row.losses || 0),
      teamLogo: {
        url: row['Logo'] || row.logo || 'https://cdn.discordapp.com/avatars/1461558413971554392/791aa1c1bae16f1a423fa2e008279e39.webp?size=1024',
        label: row['Team'] || row.team || 'Team Logo'
      }
    };
  }).filter(ranking => ranking.name); // Filter out empty rows

  return { rankings, loading, error, refetch };
};
