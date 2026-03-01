import { useDataJson } from './useDataJson';
import { useState, useMemo } from 'react';

/**
 * Hook to manage and retrieve production statistics
 * Casters: tracks number of events/matches cast
 * Camera Ops: tracks number of events/matches operated
 */
export const useProductionStats = () => {
    const { data: jsonData, loading: jsonLoading, error: jsonError } = useDataJson('productionStats');

    // Aggregate caster stats from data
    const casterStats = useMemo(() => {
        if (!jsonData?.casters) return [];
        return (jsonData.casters || [])
            .map(caster => ({
                id: caster.id || caster.name,
                name: caster.name || '',
                events: parseInt(caster.events || 0),
                matches: parseInt(caster.matches || 0),
                role: 'Caster',
            }))
            .filter(c => c.name)
            .sort((a, b) => b.matches - a.matches); // Sort by matches cast
    }, [jsonData]);

    // Aggregate camera operator stats from data
    const cameraStats = useMemo(() => {
        if (!jsonData?.cameraOperators) return [];
        return (jsonData.cameraOperators || [])
            .map(camera => ({
                id: camera.id || camera.name,
                name: camera.name || '',
                events: parseInt(camera.events || 0),
                matches: parseInt(camera.matches || 0),
                role: 'Camera Operator',
            }))
            .filter(c => c.name)
            .sort((a, b) => b.matches - a.matches); // Sort by matches operated
    }, [jsonData]);

    // Combined stats with all production crew
    const allStats = useMemo(() => {
        return [...casterStats, ...cameraStats].sort((a, b) => b.matches - a.matches);
    }, [casterStats, cameraStats]);

    return {
        casterStats,
        cameraStats,
        allStats,
        loading: jsonLoading,
        error: jsonError,
        total: {
            casters: casterStats.length,
            cameraOps: cameraStats.length,
            totalEvents: allStats.reduce((sum, s) => sum + s.events, 0),
            totalMatches: allStats.reduce((sum, s) => sum + s.matches, 0),
        },
    };
};
