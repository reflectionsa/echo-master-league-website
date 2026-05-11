/**
 * SeasonCountdown — between-seasons hype builder.
 * Set NEXT_SEASON_DATE to the anticipated start of the next season.
 * During an active season the component renders nothing (returns null).
 */
import { useState, useEffect } from 'react';
import { Box, Container, VStack, HStack, Text } from '@chakra-ui/react';
import { Zap, Calendar } from 'lucide-react';
import { getThemedColors } from '../theme/colors';

// ── Update this when Season 5 is announced ────────────────────────────────────
const NEXT_SEASON_DATE = new Date('2026-06-29T00:00:00-05:00'); // Jun 29 2026
const NEXT_SEASON_LABEL = 'Season 5';
// ─────────────────────────────────────────────────────────────────────────────

const pad = (n) => String(n).padStart(2, '0');

const calcRemaining = () => {
  const diff = NEXT_SEASON_DATE.getTime() - Date.now();
  if (diff <= 0) return null;
  const totalSecs = Math.floor(diff / 1000);
  const days    = Math.floor(totalSecs / 86400);
  const hours   = Math.floor((totalSecs % 86400) / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;
  return { days, hours, minutes, seconds };
};

const TimeUnit = ({ value, label, colors }) => (
  <VStack gap="1" align="center" minW={{ base: '60px', md: '80px' }}>
    <Box
      className="eml-countdown-card"
      bg={colors.bgElevated}
      border="1px solid"
      borderColor={`${colors.accentOrange}44`}
      rounded="2xl"
      px={{ base: '4', md: '6' }}
      py={{ base: '3', md: '5' }}
      minW={{ base: '60px', md: '80px' }}
      textAlign="center"
    >
      <Text
        fontSize={{ base: '2xl', md: '4xl' }}
        fontWeight="900"
        bg={`linear-gradient(to bottom right, #ff6b2b, #00bfff)`}
        bgClip="text"
        color="transparent"
        letterSpacing="-0.02em"
      >
        {pad(value)}
      </Text>
    </Box>
    <Text fontSize="2xs" fontWeight="700" color={colors.textSubtle} textTransform="uppercase" letterSpacing="wider">
      {label}
    </Text>
  </VStack>
);

const SeasonCountdown = ({ theme }) => {
  const colors = getThemedColors(theme);
  const [remaining, setRemaining] = useState(calcRemaining);

  useEffect(() => {
    const t = setInterval(() => setRemaining(calcRemaining()), 1000);
    return () => clearInterval(t);
  }, []);

  // Don't show during an active season (or after the date has passed)
  if (!remaining) return null;

  // Only show if more than 7 days out (assume season is between-seasons)
  // Remove this guard if you always want it visible
  if (remaining.days < 0) return null;

  const dateStr = NEXT_SEASON_DATE.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/New_York'
  });

  return (
    <Box
      py="20"
      bg={`linear-gradient(160deg, ${colors.bgPrimary} 0%, ${colors.bgSecondary} 50%, ${colors.bgPrimary} 100%)`}
      position="relative"
      overflow="hidden"
    >
      {/* Ambient glow */}
      <Box position="absolute" top="50%" left="50%" transform="translate(-50%,-50%)"
        w="600px" h="300px" bg={`${colors.accentOrange}10`} rounded="full" filter="blur(80px)" pointerEvents="none" />

      <Container maxW="4xl" position="relative" zIndex="1">
        <VStack gap="10" textAlign="center">
          {/* Header */}
          <VStack gap="3">
            <HStack gap="2" justify="center">
              <Zap size={18} color={colors.accentOrange} />
              <Text fontSize="xs" fontWeight="800" color={colors.accentOrange} textTransform="uppercase" letterSpacing="wider">
                Coming Soon
              </Text>
            </HStack>
            <Text
              fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }}
              fontWeight="900"
              bg={`linear-gradient(to right, ${colors.accentOrange}, ${colors.accentBlue})`}
              bgClip="text"
              color="transparent"
              letterSpacing="-0.02em"
            >
              {NEXT_SEASON_LABEL}
            </Text>
            <Text fontSize="sm" color={colors.textMuted}>
              The next chapter of competitive Echo VR begins…
            </Text>
            <HStack gap="1.5" fontSize="xs" color={colors.textSubtle}>
              <Calendar size={12} />
              <Text>Estimated start: {dateStr} ET</Text>
            </HStack>
          </VStack>

          {/* Countdown tiles */}
          <HStack gap={{ base: '3', md: '6' }} justify="center" flexWrap="wrap">
            <TimeUnit value={remaining.days}    label="Days"    colors={colors} />
            <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color={`${colors.accentOrange}66`} mt="-8px">:</Text>
            <TimeUnit value={remaining.hours}   label="Hours"   colors={colors} />
            <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color={`${colors.accentOrange}66`} mt="-8px">:</Text>
            <TimeUnit value={remaining.minutes} label="Minutes" colors={colors} />
            <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color={`${colors.accentOrange}66`} mt="-8px">:</Text>
            <TimeUnit value={remaining.seconds} label="Seconds" colors={colors} />
          </HStack>

          <Text fontSize="xs" color={colors.textSubtle}>
            Date subject to change — follow <Text as="span" color={colors.accentOrange} fontWeight="700">#announcements</Text> in Discord for updates
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default SeasonCountdown;
