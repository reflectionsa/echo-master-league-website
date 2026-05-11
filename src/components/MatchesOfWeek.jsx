/**
 * MatchesOfWeek — featured match cards for the current/latest week.
 * Shows team vs team with score, status badge, and a collapsible VOD dropdown.
 * Data is pulled from useMatchResults (completed) + useSchedule (upcoming/live).
 */
import { useState } from 'react';
import { Box, Container, VStack, HStack, Text, Badge, Grid } from '@chakra-ui/react';
import { Swords, ChevronDown, ChevronUp, Play, ExternalLink, Calendar } from 'lucide-react';
import { getThemedColors } from '../theme/colors';
import { useMatchResults } from '../hooks/useMatchResults';
import { useSchedule } from '../hooks/useSchedule';
import { getCurrentSeasonWeek, getWeekName } from '../utils/weekUtils';

const getYtId = (url) => {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
};
const getTwitchEmbed = (url) => {
  if (!url) return null;
  const vod = url.match(/twitch\.tv\/videos\/(\d+)/);
  if (vod) return { type: 'vod', id: vod[1] };
  const ch = url.match(/twitch\.tv\/([A-Za-z0-9_]+)/);
  if (ch) return { type: 'channel', id: ch[1] };
  return null;
};

const STATUS_CFG = {
  Live:        { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.4)',  label: 'LIVE', pulse: true },
  Completed:   { color: '#22c55e', bg: 'rgba(34,197,94,0.10)', border: 'rgba(34,197,94,0.3)',  label: 'FINAL', pulse: false },
  Scheduled:   { color: '#9ca3af', bg: 'rgba(156,163,175,0.1)', border: 'rgba(156,163,175,0.25)', label: 'SCHEDULED', pulse: false },
  Disputed:    { color: '#a855f7', bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.35)', label: 'DISPUTED', pulse: false },
};

/* ─── VOD Dropdown ─────────────────────────────────────────────────────────── */
const VodDropdown = ({ url, colors }) => {
  const [open, setOpen] = useState(false);
  const ytId = getYtId(url);
  const twitch = getTwitchEmbed(url);

  if (!url) return (
    <HStack gap="1.5" justify="center" opacity="0.35">
      <Play size={12} color={colors.textMuted} />
      <Text fontSize="xs" color={colors.textMuted}>No VOD available</Text>
    </HStack>
  );

  return (
    <Box>
      <Box
        as="button"
        w="full"
        display="flex" alignItems="center" justifyContent="center" gap="6px"
        bg={open ? `${colors.accentOrange}15` : `${colors.bgPrimary}88`}
        border="1px solid"
        borderColor={open ? colors.accentOrange : colors.borderLight}
        rounded="lg"
        px="4" py="2"
        fontSize="xs" fontWeight="700" color={open ? colors.accentOrange : colors.textMuted}
        cursor="pointer"
        transition="all 0.2s"
        onClick={() => setOpen(v => !v)}
        _hover={{ borderColor: colors.accentOrange, color: colors.accentOrange }}
      >
        <Play size={12} />
        {open ? 'Hide VOD' : 'Watch VOD'}
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </Box>
      {open && (
        <Box mt="2" rounded="xl" overflow="hidden" border="1px solid" borderColor={colors.borderLight}>
          {ytId && (
            <Box as="iframe"
              src={`https://www.youtube.com/embed/${ytId}?autoplay=0&rel=0`}
              title="Match VOD"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              w="full" h={{ base: '180px', md: '250px' }}
              border="0"
            />
          )}
          {!ytId && twitch && (
            <Box as="iframe"
              src={twitch.type === 'vod'
                ? `https://player.twitch.tv/?video=${twitch.id}&parent=${window.location.hostname}&autoplay=false`
                : `https://player.twitch.tv/?channel=${twitch.id}&parent=${window.location.hostname}&autoplay=false`}
              title="Match VOD"
              allow="autoplay"
              allowFullScreen
              w="full" h={{ base: '180px', md: '250px' }}
              border="0"
            />
          )}
          {!ytId && !twitch && (
            <Box as="a" href={url} target="_blank" rel="noopener noreferrer"
              display="flex" alignItems="center" justifyContent="center" gap="2"
              p="4" color={colors.accentOrange} fontWeight="600" fontSize="sm">
              Open VOD <ExternalLink size={14} />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

/* ─── Single Match Card ────────────────────────────────────────────────────── */
const MatchCard = ({ match, colors, featured = false }) => {
  const cfg = STATUS_CFG[match.status] || STATUS_CFG.Scheduled;
  const t1Won = match.team1Won || (match.team1Score > match.team2Score);
  const t2Won = match.team2Won || (match.team2Score > match.team1Score);

  return (
    <Box
      bg={featured
        ? `linear-gradient(135deg, ${colors.accentOrange}0d, ${colors.accentBlue}08)`
        : colors.bgElevated}
      border="1px solid"
      borderColor={featured ? `${colors.accentOrange}44` : colors.borderLight}
      rounded="2xl"
      p="5"
      transition="all 0.25s"
      _hover={{ transform: 'translateY(-3px)', borderColor: colors.accentOrange, boxShadow: `0 12px 28px ${colors.accentOrange}22` }}
      position="relative"
      overflow="hidden"
    >
      {featured && (
        <Box position="absolute" top="0" left="0" right="0" h="2px"
          bg={`linear-gradient(90deg, ${colors.accentOrange}, ${colors.accentBlue})`} />
      )}

      {/* Status + week */}
      <HStack justify="space-between" mb="4" flexWrap="wrap" gap="2">
        <Box
          display="inline-flex" alignItems="center" gap="1.5"
          bg={cfg.bg} border={`1px solid ${cfg.border}`}
          px="2.5" py="1" rounded="full"
        >
          {cfg.pulse && <span className="eml-live-dot" style={{ width: 7, height: 7 }} />}
          <Text fontSize="2xs" fontWeight="800" color={cfg.color} letterSpacing="wider">{cfg.label}</Text>
        </Box>
        <HStack gap="1" fontSize="xs" color={colors.textMuted}>
          <Calendar size={11} />
          <Text>{match.week ? `Week ${match.week}` : match.matchType || 'Match'}</Text>
        </HStack>
      </HStack>

      {/* Teams + score */}
      <HStack gap="3" justify="space-between" align="center" mb="4" flexWrap="wrap">
        <Text
          fontSize="md" fontWeight="800"
          color={t1Won ? '#22c55e' : colors.textPrimary}
          flex="1" noOfLines={2}
        >
          {match.team1 || '?'}
        </Text>

        <VStack gap="0" minW="70px" align="center">
          {(match.team1Score !== undefined && match.team2Score !== undefined &&
            (match.team1Score > 0 || match.team2Score > 0)) ? (
            <Text fontSize="xl" fontWeight="900" color="white" letterSpacing="wider">
              {match.team1Score} — {match.team2Score}
            </Text>
          ) : (
            <Text fontSize="sm" fontWeight="800" color={colors.textSubtle}>VS</Text>
          )}
        </VStack>

        <Text
          fontSize="md" fontWeight="800"
          color={t2Won ? '#22c55e' : colors.textPrimary}
          flex="1" textAlign="right" noOfLines={2}
        >
          {match.team2 || '?'}
        </Text>
      </HStack>

      {/* VOD */}
      <VodDropdown url={match.streamLink?.url || match.vodUrl} colors={colors} />
    </Box>
  );
};

/* ─── Main Component ────────────────────────────────────────────────────────── */
const MatchesOfWeek = ({ theme }) => {
  const colors = getThemedColors(theme);
  const { matchResults = [], loading: resultsLoading } = useMatchResults();
  const { matches: schedule = [], loading: scheduleLoading } = useSchedule();
  const loading = resultsLoading || scheduleLoading;

  const currentWeek = getCurrentSeasonWeek();
  const weekName = getWeekName(currentWeek);

  // Prefer current week; fall back to most recent week with data
  const weekKey = String(currentWeek);
  let featured = matchResults.filter(m => String(m.week) === weekKey);
  if (featured.length === 0 && matchResults.length > 0) {
    // Fall back to most recent week
    const latestWeek = matchResults[matchResults.length - 1]?.week;
    featured = matchResults.filter(m => String(m.week) === String(latestWeek));
  }

  // Also include live/scheduled from schedule for this week
  const liveThisWeek = schedule.filter(m =>
    (m.status === 'Live' || m.status === 'In Progress') &&
    String(m.week) === weekKey
  );

  const allMatches = [
    ...liveThisWeek,
    ...featured.map(m => ({ ...m, status: m.status || 'Completed' })),
  ].slice(0, 6);

  if (!loading && allMatches.length === 0) return null;

  return (
    <Box py="20" bg={colors.bgPrimary} position="relative">
      <Container maxW="6xl">
        <VStack gap="10">
          {/* Header */}
          <VStack gap="3" textAlign="center">
            <HStack gap="2" justify="center">
              <Swords size={18} color={colors.accentOrange} />
              <Text fontSize="xs" fontWeight="800" color={colors.accentOrange} textTransform="uppercase" letterSpacing="wider">
                This Week
              </Text>
            </HStack>
            <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color={colors.textPrimary}>
              Matches of the Week
            </Text>
            <Text fontSize="sm" color={colors.textMuted}>
              Season 4 · Week {weekName}
            </Text>
          </VStack>

          {loading && (
            <Box py="12" textAlign="center">
              <Text color={colors.textMuted} fontSize="sm">Loading matches…</Text>
            </Box>
          )}

          {!loading && allMatches.length > 0 && (
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
              gap="6"
              w="full"
            >
              {allMatches.map((m, i) => (
                <MatchCard key={m.id || i} match={m} colors={colors} featured={i === 0} />
              ))}
            </Grid>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default MatchesOfWeek;
