/**
 * LiveMatchPulse — animated "LIVE" banner on the Hero when a match is active.
 * Polls the schedule and shows team names + a pulsing live indicator.
 */
import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { Radio, ExternalLink } from 'lucide-react';
import ParticlePulseDot from './ParticlePulseDot';
import { useSchedule } from '../hooks/useSchedule';
import { getThemedColors } from '../theme/colors';

const LiveMatchPulse = ({ theme, onMatchesClick }) => {
  const { matches, loading } = useSchedule();
  const colors = getThemedColors(theme);

  if (loading) return null;

  const liveMatches = (matches || []).filter(
    m => m.status === 'Live' || m.status === 'In Progress'
  );

  if (liveMatches.length === 0) return null;

  const first = liveMatches[0];
  const teams = first.participatingTeams?.linkedItems || [];
  const t1 = teams[0]?.name || first.name?.split(' vs ')[0] || '—';
  const t2 = teams[1]?.name || first.name?.split(' vs ')[1] || '—';

  return (
    <Box
      as="button"
      onClick={onMatchesClick}
      display="inline-flex"
      alignItems="center"
      gap="3"
      bg="rgba(239,68,68,0.10)"
      border="1px solid rgba(239,68,68,0.40)"
      px={{ base: '4', md: '6' }}
      py={{ base: '2.5', md: '3' }}
      rounded="2xl"
      cursor="pointer"
      transition="all 0.25s"
      _hover={{ bg: 'rgba(239,68,68,0.18)', transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(239,68,68,0.25)' }}
      role="alert"
      aria-live="polite"
    >
      {/* Pulse dot */}
      <ParticlePulseDot size={10} />

      <VStack gap="0" align="start">
        <HStack gap="2">
          <Radio size={12} color="#ef4444" />
          <Text fontSize="2xs" fontWeight="800" color="#ef4444" textTransform="uppercase" letterSpacing="widest">
            Match In Progress
          </Text>
        </HStack>
        <HStack gap="2" flexWrap="wrap">
          <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="800" color="white">
            {t1}
          </Text>
          <Text fontSize="xs" color="rgba(255,255,255,0.5)" fontWeight="700">VS</Text>
          <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="800" color="white">
            {t2}
          </Text>
          {liveMatches.length > 1 && (
            <Text fontSize="xs" color="rgba(255,255,255,0.4)">+{liveMatches.length - 1} more</Text>
          )}
        </HStack>
      </VStack>

      <ExternalLink size={14} color="rgba(255,255,255,0.4)" />
    </Box>
  );
};

export default LiveMatchPulse;
