import { useState, useEffect } from 'react';
import { useGoogleSheets } from './useGoogleSheets';

/**
 * Hook to fetch match predictions
 * Columns: Match ID, Team A Votes, Team B Votes, Total Votes, Closed, Result
 */
export function usePredictions() {
  const { data, loading, error, refetch } = useGoogleSheets('roster', 'predictions');
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) {
      setPredictions([]);
      return;
    }

    // Parse predictions data
    const parsedPredictions = data.slice(1).map((row, index) => {
      const [
        matchId,
        teamAVotes,
        teamBVotes,
        totalVotes,
        closed,
        result
      ] = row;

      const aVotes = parseInt(teamAVotes) || 0;
      const bVotes = parseInt(teamBVotes) || 0;
      const total = parseInt(totalVotes) || (aVotes + bVotes);

      return {
        id: index,
        matchId: matchId || '',
        teamAVotes: aVotes,
        teamBVotes: bVotes,
        totalVotes: total,
        teamAPercentage: total > 0 ? Math.round((aVotes / total) * 100) : 0,
        teamBPercentage: total > 0 ? Math.round((bVotes / total) * 100) : 0,
        closed: closed?.toLowerCase() === 'true' || closed === '1',
        result: result || '',
      };
    });

    setPredictions(parsedPredictions);
  }, [data]);

  /**
   * Get prediction for a specific match
   */
  const getPredictionForMatch = (matchId) => {
    return predictions.find(
      prediction => prediction.matchId === matchId
    );
  };

  return {
    predictions,
    loading,
    error,
    refetch,
    getPredictionForMatch,
  };
}
