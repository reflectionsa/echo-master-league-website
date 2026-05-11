/**
 * ChassisShowcase — spinning Echo VR chassis display for special events.
 * Shows TEAM A vs TEAM B with team colors/emblems, a CSS-animated chassis SVG,
 * and a VOD embed/link below.
 *
 * Usage:
 *   <ChassisShowcase theme={theme} event={eventObj} />
 *
 * eventObj: {
 *   team1: { name, color, logo },
 *   team2: { name, color, logo },
 *   title: string,
 *   subtitle: string,
 *   vodUrl: string,    // YouTube / Twitch VOD
 *   date: string,
 * }
 */
import { useState } from 'react';
import { Box, Container, VStack, HStack, Text, Badge } from '@chakra-ui/react';
import { Play, Trophy, Radio } from 'lucide-react';
import { getThemedColors } from '../theme/colors';

/* ─── Echo VR Visor SVG ─────────────────────────────────────────────────────── */
const ChassisSVG = ({ color1 = '#ff6b2b', color2 = '#00bfff', spin = true }) => (
  <svg
    viewBox="0 0 200 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: '100%', height: '100%', filter: `drop-shadow(0 0 18px ${color1}88)` }}
    className={spin ? 'eml-chassis-spin' : ''}
    aria-label="Echo VR chassis"
  >
    {/* Outer visor shell */}
    <path
      d="M20 70 Q20 30 100 25 Q180 30 180 70 Q180 110 100 115 Q20 110 20 70Z"
      fill={`url(#cg1)`}
      stroke={color1}
      strokeWidth="1.5"
    />
    {/* Inner lens */}
    <path
      d="M40 70 Q40 45 100 42 Q160 45 160 70 Q160 95 100 98 Q40 95 40 70Z"
      fill={`url(#cg2)`}
      opacity="0.85"
    />
    {/* Left accent stripe */}
    <path d="M22 58 Q30 48 55 46 L50 54 Q28 56 24 66Z" fill={color1} opacity="0.8" />
    {/* Right accent stripe */}
    <path d="M178 58 Q170 48 145 46 L150 54 Q172 56 176 66Z" fill={color2} opacity="0.8" />
    {/* Bridge */}
    <rect x="85" y="67" width="30" height="6" rx="3" fill={color1} opacity="0.9" />
    {/* Center lens glow */}
    <ellipse cx="100" cy="70" rx="30" ry="18" fill={`url(#cg3)`} opacity="0.6" />
    {/* Tech lines left */}
    <line x1="42" y1="62" x2="70" y2="58" stroke={color1} strokeWidth="0.8" opacity="0.5" />
    <line x1="42" y1="70" x2="68" y2="70" stroke={color1} strokeWidth="0.8" opacity="0.5" />
    <line x1="42" y1="78" x2="70" y2="82" stroke={color1} strokeWidth="0.8" opacity="0.5" />
    {/* Tech lines right */}
    <line x1="158" y1="62" x2="130" y2="58" stroke={color2} strokeWidth="0.8" opacity="0.5" />
    <line x1="158" y1="70" x2="132" y2="70" stroke={color2} strokeWidth="0.8" opacity="0.5" />
    <line x1="158" y1="78" x2="130" y2="82" stroke={color2} strokeWidth="0.8" opacity="0.5" />

    <defs>
      <linearGradient id="cg1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color1} stopOpacity="0.25" />
        <stop offset="100%" stopColor={color2} stopOpacity="0.15" />
      </linearGradient>
      <linearGradient id="cg2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1a1a2e" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#0d0d1a" stopOpacity="0.95" />
      </linearGradient>
      <radialGradient id="cg3" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={color2} stopOpacity="0.9" />
        <stop offset="100%" stopColor={color2} stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

/* ─── VOD Embed helper ───────────────────────────────────────────────────────── */
const getYtId = (url) => {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
};

const VodBlock = ({ url, colors }) => {
  const [expanded, setExpanded] = useState(false);
  const ytId = getYtId(url);

  if (!url) return null;

  return (
    <Box w="full" maxW="720px" mx="auto">
      <Box
        as="button"
        w="full"
        bg={colors.bgElevated}
        border="1px solid"
        borderColor={expanded ? colors.accentOrange : colors.borderLight}
        rounded="xl"
        px="5"
        py="3"
        onClick={() => setExpanded(v => !v)}
        transition="all 0.25s"
        _hover={{ borderColor: colors.accentOrange }}
      >
        <HStack gap="3" justify="center">
          <Play size={16} color={colors.accentOrange} />
          <Text fontSize="sm" fontWeight="700" color={colors.textPrimary}>
            {expanded ? 'Hide VOD' : 'Watch Match VOD'}
          </Text>
        </HStack>
      </Box>

      {expanded && (
        <Box mt="3" rounded="xl" overflow="hidden" border="1px solid" borderColor={colors.borderLight}>
          {ytId ? (
            <Box as="iframe"
              src={`https://www.youtube.com/embed/${ytId}?autoplay=0&rel=0`}
              title="Match VOD"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              w="full"
              h={{ base: '220px', md: '360px' }}
              border="0"
            />
          ) : (
            <Box as="a" href={url} target="_blank" rel="noopener noreferrer"
              display="block" p="6" textAlign="center" color={colors.accentOrange}
              fontWeight="600" fontSize="sm">
              Open VOD ↗
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

/* ─── Team Emblem ─────────────────────────────────────────────────────────── */
const TeamEmblem = ({ team, colors, align = 'left' }) => (
  <VStack gap="2" align={align === 'left' ? 'start' : 'end'} flex="1">
    <Box
      w="56px" h="56px"
      rounded="xl"
      bg={team.color ? `${team.color}22` : colors.bgElevated}
      border="2px solid"
      borderColor={team.color || colors.borderMedium}
      display="flex" alignItems="center" justifyContent="center"
      fontSize="xl" fontWeight="900" color={team.color || colors.textPrimary}
      boxShadow={team.color ? `0 4px 16px ${team.color}44` : 'none'}
      overflow="hidden"
    >
      {team.logo ? (
        <img src={team.logo} alt={team.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      ) : (
        (team.name || '?')[0]
      )}
    </Box>
    <Text fontSize="sm" fontWeight="800" color={colors.textPrimary} textAlign={align}>
      {team.name || 'TBD'}
    </Text>
  </VStack>
);

/* ─── Main Component ──────────────────────────────────────────────────────── */
const ChassisShowcase = ({ theme, event }) => {
  const colors = getThemedColors(theme);
  const [hovering, setHovering] = useState(false);

  if (!event) return null;

  const { team1 = {}, team2 = {}, title, subtitle, vodUrl, date, live = false } = event;
  const c1 = team1.color || colors.accentOrange;
  const c2 = team2.color || colors.accentBlue;

  return (
    <Box
      py="20"
      bg={colors.bgSecondary}
      position="relative"
      overflow="hidden"
    >
      {/* Ambient glow */}
      <Box position="absolute" top="50%" left="30%" transform="translate(-50%,-50%)"
        w="400px" h="400px" bg={`${c1}18`} rounded="full" filter="blur(80px)" pointerEvents="none" />
      <Box position="absolute" top="50%" right="20%" transform="translate(50%,-50%)"
        w="300px" h="300px" bg={`${c2}18`} rounded="full" filter="blur(60px)" pointerEvents="none" />

      <Container maxW="5xl" position="relative" zIndex="1">
        <VStack gap="10">
          {/* Header */}
          <VStack gap="3" textAlign="center">
            <HStack gap="2" justify="center">
              <Trophy size={16} color={colors.accentOrange} />
              <Text fontSize="xs" fontWeight="800" color={colors.accentOrange} textTransform="uppercase" letterSpacing="wider">
                Chassis Showcase
              </Text>
              {live && (
                <HStack gap="1.5" bg="rgba(239,68,68,0.12)" border="1px solid rgba(239,68,68,0.35)" px="2" py="0.5" rounded="full">
                  <span className="eml-live-dot" style={{ width: 7, height: 7 }} />
                  <Text fontSize="2xs" fontWeight="800" color="#ef4444" letterSpacing="wider">LIVE</Text>
                </HStack>
              )}
            </HStack>
            <Text fontSize={{ base: 'xl', md: '3xl' }} fontWeight="900" color={colors.textPrimary}>
              {title || 'Special Event Match'}
            </Text>
            {subtitle && <Text fontSize="sm" color={colors.textMuted}>{subtitle}</Text>}
            {date && <Badge variant="outline" colorPalette="gray" fontSize="xs">{date}</Badge>}
          </VStack>

          {/* Team vs Chassis vs Team */}
          <HStack gap="6" align="center" w="full" flexWrap={{ base: 'wrap', md: 'nowrap' }} justify="center">
            <TeamEmblem team={team1} colors={colors} align="left" />

            {/* VS + spinning chassis */}
            <VStack gap="2" flex="2" minW="200px" maxW="340px">
              <Box
                w="full"
                h={{ base: '160px', md: '200px' }}
                position="relative"
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                style={{ perspective: '800px' }}
              >
                <Box
                  position="absolute"
                  inset="0"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  className={hovering ? 'eml-chassis-paused' : ''}
                >
                  <ChassisSVG color1={c1} color2={c2} spin />
                </Box>
              </Box>
              <HStack gap="3">
                <Box h="1px" flex="1" bg={`linear-gradient(to right, transparent, ${c1})`} />
                <Text fontSize="lg" fontWeight="900" color="white" letterSpacing="widest">VS</Text>
                <Box h="1px" flex="1" bg={`linear-gradient(to left, transparent, ${c2})`} />
              </HStack>
              <Text fontSize="2xs" color={colors.textSubtle}>
                {hovering ? 'Hover to pause' : 'Hover to pause spin'}
              </Text>
            </VStack>

            <TeamEmblem team={team2} colors={colors} align="right" />
          </HStack>

          {/* VOD */}
          <VodBlock url={vodUrl} colors={colors} />
        </VStack>
      </Container>
    </Box>
  );
};

export default ChassisShowcase;
