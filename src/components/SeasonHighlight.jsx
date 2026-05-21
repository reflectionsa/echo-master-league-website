/**
 * SeasonHighlight — rotating "notable match result" card on the homepage.
 * Pulls from matchResults, picks standout matches (biggest scoreline difference,
 * or manually curated via the `highlights` prop), and rotates every 8 seconds.
 */
import { useState, useEffect, useCallback } from 'react';
import { Box, HStack, Text, VStack, Badge } from '@chakra-ui/react';
import { Star, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { getThemedColors } from '../theme/colors';
import { useMatchResults } from '../hooks/useMatchResults';
import { CURRENT_SEASON_ACTIVE } from '../utils/seasonConfig';

const pickHighlights = (matchResults, max = 5) => {
  const completed = matchResults.filter(
    m => (m.team1Score > 0 || m.team2Score > 0) && !m.isForfeit
  );
  if (completed.length === 0) return [];

  // Sort by score margin descending (most dramatic wins)
  return [...completed]
    .sort((a, b) => Math.abs(b.team1Score - b.team2Score) - Math.abs(a.team1Score - a.team2Score))
    .slice(0, max);
};

const HighlightCard = ({ match, colors, visible }) => {
  if (!match) return null;
  const t1Won = match.team1Score > match.team2Score;
  const winner = t1Won ? match.team1 : match.team2;
  const loser  = t1Won ? match.team2 : match.team1;
  const wScore = t1Won ? match.team1Score : match.team2Score;
  const lScore = t1Won ? match.team2Score : match.team1Score;
  const margin = Math.abs(wScore - lScore);

  return (
    <Box
      key={match.id}
      className={visible ? 'eml-highlight-enter' : ''}
      bg={`linear-gradient(135deg, ${colors.accentOrange}0e, ${colors.accentBlue}08)`}
      border="1px solid"
      borderColor={`${colors.accentOrange}40`}
      rounded="2xl"
      p={{ base: '5', md: '7' }}
      w="full"
      position="relative"
      overflow="hidden"
    >
      {/* Top accent line */}
      <Box position="absolute" top="0" left="0" right="0" h="2px"
        bg={`linear-gradient(90deg, ${colors.accentOrange}, ${colors.accentBlue}, ${colors.accentPurple})`} />

      <VStack gap="4" align="start">
        <HStack gap="2" flexWrap="wrap">
          <Trophy size={14} color={colors.accentOrange} />
          <Text fontSize="xs" fontWeight="800" color={colors.accentOrange} textTransform="uppercase" letterSpacing="wider">
            Season Highlight
          </Text>
          {match.week && (
            <Badge
              bg="rgba(255,255,255,0.15)"
              color="white"
              border="1px solid rgba(255,255,255,0.35)"
              fontSize="2xs"
              fontWeight="800"
              px="2"
              py="0.5"
              rounded="full"
            >
              Week {match.week}
            </Badge>
          )}
        </HStack>

        {/* Score block */}
        <HStack gap="4" align="center" flexWrap="wrap">
          <VStack gap="0" align="start">
            <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="900" color="#22c55e">
              {winner}
            </Text>
            <Text fontSize="xs" color={colors.textMuted}>Winner</Text>
          </VStack>

          <VStack gap="0" align="center" minW="70px">
            <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="900" color="white">
              {wScore} — {lScore}
            </Text>
            <Text fontSize="2xs" color={colors.textSubtle}>
              +{margin} margin
            </Text>
          </VStack>

          <VStack gap="0" align="end">
            <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="900" color={colors.textMuted}>
              {loser}
            </Text>
            <Text fontSize="xs" color={colors.textMuted}>Opponent</Text>
          </VStack>
        </HStack>

        {match.matchType && (
          <Text fontSize="xs" color={colors.textSubtle}>{match.matchType}</Text>
        )}
      </VStack>
    </Box>
  );
};

const SeasonHighlight = ({ theme }) => {
  const colors = getThemedColors(theme);
  const { matchResults = [], loading } = useMatchResults();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const highlights = pickHighlights(matchResults);

  const goTo = useCallback((next) => {
    setVisible(false);
    setTimeout(() => {
      setIndex(next);
      setVisible(true);
    }, 180);
  }, []);

  const prev = () => goTo((index - 1 + highlights.length) % highlights.length);
  const next = useCallback(() => goTo((index + 1) % highlights.length), [goTo, index, highlights.length]);

  // Auto-rotate every 8s
  useEffect(() => {
    if (highlights.length < 2) return;
    const t = setInterval(next, 8000);
    return () => clearInterval(t);
  }, [next, highlights.length]);

  if (!CURRENT_SEASON_ACTIVE || loading || highlights.length === 0) return null;

  return (
    <Box py="10" bg={colors.bgSecondary} position="relative">
      <style>{`
        @keyframes eml-slide-in {
          from { opacity: 0; transform: translateX(32px) scale(0.97); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        .eml-highlight-enter { animation: eml-slide-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
      `}</style>
      <Box maxW="3xl" mx="auto" px={{ base: '4', md: '8' }}>
        <VStack gap="5">
          <HStack gap="2" justify="center">
            <Star size={16} color={colors.accentOrange} />
            <Text fontSize="xs" fontWeight="800" color={colors.accentOrange} textTransform="uppercase" letterSpacing="wider">
              Notable Results
            </Text>
          </HStack>

          <Box w="full" position="relative">
            <HighlightCard match={highlights[index]} colors={colors} visible={visible} />

            {highlights.length > 1 && (
              <HStack justify="center" mt="4" gap="3">
                <Box
                  as="button" onClick={prev} aria-label="Previous highlight"
                  bg={colors.bgElevated} border="1px solid" borderColor={colors.borderLight}
                  rounded="full" p="1.5" cursor="pointer" transition="all 0.2s"
                  _hover={{ borderColor: colors.accentOrange }}
                >
                  <ChevronLeft size={16} color={colors.textMuted} />
                </Box>

                <HStack gap="1.5">
                  {highlights.map((_, i) => (
                    <Box
                      key={i}
                      as="button"
                      onClick={() => goTo(i)}
                      aria-label={`Go to highlight ${i + 1}`}
                      w={i === index ? '20px' : '8px'} h="8px"
                      rounded="full"
                      bg={i === index ? colors.accentOrange : colors.borderMedium}
                      transition="all 0.3s"
                      cursor="pointer"
                    />
                  ))}
                </HStack>

                <Box
                  as="button" onClick={next} aria-label="Next highlight"
                  bg={colors.bgElevated} border="1px solid" borderColor={colors.borderLight}
                  rounded="full" p="1.5" cursor="pointer" transition="all 0.2s"
                  _hover={{ borderColor: colors.accentOrange }}
                >
                  <ChevronRight size={16} color={colors.textMuted} />
                </Box>
              </HStack>
            )}
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default SeasonHighlight;
