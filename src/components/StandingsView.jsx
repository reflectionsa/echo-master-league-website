import { Box, Dialog, Portal, Text, HStack, Spinner, Center, CloseButton, Input, InputGroup, Button } from '@chakra-ui/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useStandings } from '../hooks/useStandings';
import { useAccessibility } from '../hooks/useAccessibility';
import TeamProfileModal from './TeamProfileModal';
import { getThemedColors } from '../theme/colors';
import { getBaseTier, tierInfo } from '../utils/tierUtils';

const TIER_FILTERS = ['All', 'Master', 'Diamond', 'Platinum', 'Gold'];

// Colored ◆ icon per tier using tierInfo colors
const TierDot = ({ tier, size = 'sm' }) => {
  const base = getBaseTier(tier);
  const info = tierInfo[base];
  const color = info?.color || '#888';
  return <Box as="span" color={color} fontSize={size === 'sm' ? '10px' : '12px'} lineHeight="1">◆</Box>;
};

// Square initials avatar matching the reference
const TeamAvatar = ({ name, color }) => {
  const initials = (name || '?')
    .split(/\s+/)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <Box
      w="32px" h="32px" minW="32px"
      bg={`${color}1a`}
      border="1px solid"
      borderColor={`${color}44`}
      rounded="md"
      display="flex" alignItems="center" justifyContent="center"
      flexShrink={0}
    >
      <Text fontSize="xs" fontWeight="900" color={color} lineHeight="1">{initials}</Text>
    </Box>
  );
};

const StandingsView = ({ theme, open, onClose }) => {
  const { needsColorBlindSupport } = useAccessibility();
  const colors = getThemedColors(theme, needsColorBlindSupport);
  const { standings, loading, error } = useStandings();
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('All');

  const filtered = standings.filter(team => {
    const matchesSearch = team.team.toLowerCase().includes(search.toLowerCase());
    const matchesTier = tierFilter === 'All' || getBaseTier(team.tier) === tierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <>
      <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="full">
        <Portal>
          <Dialog.Backdrop bg={`${colors.bgPrimary}cc`} backdropFilter="blur(12px)" />
          <Dialog.Positioner>
            <Dialog.Content
              maxW="860px"
              w="95vw"
              maxH="92vh"
              bg={colors.bgPrimary}
              border="1px solid"
              borderColor={colors.borderMedium}
              rounded="2xl"
              overflow="hidden"
              display="flex"
              flexDirection="column"
              position="relative"
            >
              {/* Close button */}
              <Box position="absolute" top="4" right="4" zIndex="2">
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" color={colors.textMuted} _hover={{ color: colors.textPrimary }} />
                </Dialog.CloseTrigger>
              </Box>

              {/* Header */}
              <Box px={{ base: '5', md: '8' }} pt="8" pb="5" flexShrink={0}>
                <Text
                  fontSize={{ base: '3xl', md: '4xl' }}
                  fontWeight="900"
                  color={colors.textPrimary}
                  letterSpacing="-0.02em"
                  lineHeight="1"
                  mb="1"
                >
                  Standings
                </Text>
                <Text fontSize="sm" color={colors.textMuted} mb="6">
                  {standings.length} teams ranked by MMR
                </Text>

                {/* Tier filter pills + search */}
                <HStack justify="space-between" flexWrap="wrap" gap="3">
                  <HStack gap="2" flexWrap="wrap">
                    {TIER_FILTERS.map(f => {
                      const active = tierFilter === f;
                      const tInfo = tierInfo[f];
                      const accent = tInfo?.color || colors.accentOrange;
                      return (
                        <Button
                          key={f}
                          size="sm"
                          onClick={() => setTierFilter(f)}
                          bg={active ? `${accent}22` : 'transparent'}
                          color={active ? accent : colors.textMuted}
                          border="1px solid"
                          borderColor={active ? `${accent}55` : colors.borderMedium}
                          rounded="full"
                          fontWeight="700"
                          px="4"
                          h="32px"
                          fontSize="xs"
                          _hover={{ bg: `${accent}18`, color: accent, borderColor: `${accent}44` }}
                          transition="all 0.15s"
                        >
                          {f !== 'All' && (
                            <Box as="span" mr="1.5" color={accent} fontSize="9px">◆</Box>
                          )}
                          {f}
                        </Button>
                      );
                    })}
                  </HStack>
                  <InputGroup maxW="200px" startElement={<Search size={13} color={colors.textMuted} />}>
                    <Input
                      placeholder="Search teams..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      bg={colors.bgCard}
                      borderColor={colors.borderMedium}
                      color={colors.textPrimary}
                      size="sm"
                      rounded="full"
                      fontSize="xs"
                      _placeholder={{ color: colors.textSubtle }}
                      _focus={{ borderColor: colors.accentOrange }}
                    />
                  </InputGroup>
                </HStack>
              </Box>

              {/* Table */}
              <Box flexGrow={1} overflowY="auto" px={{ base: '5', md: '8' }} pb="8">
                {loading ? (
                  <Center py="16"><Spinner size="xl" color={colors.accentOrange} /></Center>
                ) : error ? (
                  <Center py="16">
                    <Text color={colors.textMuted} fontSize="sm">Error loading standings</Text>
                  </Center>
                ) : filtered.length === 0 ? (
                  <Center py="16">
                    <Text color={colors.textMuted} fontSize="sm">
                      {search ? 'No teams match your search' : 'No standings data available'}
                    </Text>
                  </Center>
                ) : (
                  <Box
                    bg={colors.bgCard}
                    border="1px solid"
                    borderColor={colors.borderMedium}
                    rounded="xl"
                    overflow="hidden"
                  >
                    {/* Column headers */}
                    <Box
                      display="grid"
                      gridTemplateColumns="60px 1fr 160px 72px 72px"
                      px="4"
                      py="2"
                      bg={colors.bgSecondary}
                      borderBottom="1px solid"
                      borderColor={colors.borderMedium}
                    >
                      {[
                        { label: 'RANK', align: 'left' },
                        { label: 'TEAM', align: 'left' },
                        { label: 'TIER', align: 'left' },
                        { label: 'MMR', align: 'center' },
                        { label: 'W-L', align: 'center' },
                      ].map(({ label, align }) => (
                        <Text
                          key={label}
                          fontSize="10px"
                          fontWeight="700"
                          color={colors.textMuted}
                          letterSpacing="wider"
                          textTransform="uppercase"
                          textAlign={align}
                        >
                          {label}
                        </Text>
                      ))}
                    </Box>

                    {/* Rows */}
                    {filtered.map((team, index) => {
                      const base = getBaseTier(team.tier);
                      const tInfo = tierInfo[base] || {};
                      const tierColor = tInfo.color || colors.textMuted;
                      const pos = team.position || index + 1;
                      const rankNum = String(pos).padStart(2, '0');
                      const isTop3 = pos <= 3;

                      return (
                        <Box
                          key={team.id}
                          display="grid"
                          gridTemplateColumns="60px 1fr 160px 72px 72px"
                          px="4"
                          py="3"
                          borderBottom="1px solid"
                          borderColor={`${colors.borderMedium}55`}
                          bg={isTop3 ? `${colors.accentOrange}08` : 'transparent'}
                          _hover={{ bg: `${colors.textPrimary}0c`, cursor: 'pointer' }}
                          transition="background 0.15s"
                          _last={{ borderBottom: 'none' }}
                          onClick={() => setSelectedTeam(team.team)}
                        >
                          {/* Rank */}
                          <Box display="flex" alignItems="center">
                            <Text
                              fontSize="sm"
                              fontWeight="900"
                              color={isTop3 ? colors.accentOrange : colors.textSubtle}
                              fontFamily="mono"
                              letterSpacing="tight"
                            >
                              {rankNum}
                            </Text>
                          </Box>

                          {/* Team */}
                          <Box display="flex" alignItems="center" gap="3" minW="0" overflow="hidden">
                            <TeamAvatar name={team.team} color={tierColor} />
                            <Text
                              fontSize="sm"
                              fontWeight="700"
                              color={colors.textPrimary}
                              _hover={{ color: colors.accentOrange }}
                              noOfLines={1}
                              overflow="hidden"
                              textOverflow="ellipsis"
                              whiteSpace="nowrap"
                            >
                              {team.team}
                            </Text>
                          </Box>

                          {/* Tier */}
                          <Box display="flex" alignItems="center" gap="1.5">
                            <TierDot tier={team.tier} />
                            <Text fontSize="xs" fontWeight="600" color={tierColor}>
                              {team.tier || '—'}
                            </Text>
                          </Box>

                          {/* MMR */}
                          <Box display="flex" alignItems="center" justifyContent="center">
                            <Text fontSize="sm" fontWeight="800" color={colors.textPrimary}>
                              {team.mmr > 0 ? team.mmr : '—'}
                            </Text>
                          </Box>

                          {/* W-L */}
                          <Box display="flex" alignItems="center" justifyContent="center" gap="0.5">
                            <Text as="span" fontSize="sm" fontWeight="700" color={colors.semantic?.win || '#22c55e'}>
                              {team.wins ?? 0}
                            </Text>
                            <Text as="span" fontSize="sm" fontWeight="400" color={colors.textSubtle}>-</Text>
                            <Text as="span" fontSize="sm" fontWeight="700" color={colors.semantic?.loss || '#ef4444'}>
                              {team.losses ?? 0}
                            </Text>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <TeamProfileModal
        open={!!selectedTeam}
        onClose={() => setSelectedTeam(null)}
        teamName={selectedTeam}
        theme={theme}
      />
    </>
  );
};

export default StandingsView;