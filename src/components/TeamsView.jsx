import { Box, Dialog, Portal, CloseButton, HStack, Text, Input, InputGroup, Button, Spinner, Center } from '@chakra-ui/react';
import { Users, Search, Shield, Crown } from 'lucide-react';
import { useState, useMemo } from 'react';
import TeamProfileModal from './TeamProfileModal';
import { useTeamRoles } from '../hooks/useTeamRoles';
import { getThemedColors } from '../theme/colors';
import { getBaseTier, tierInfo } from '../utils/tierUtils';

const STATUS_FILTERS = ['All', 'Active', 'Inactive'];

const TeamAvatar = ({ name, color }) => {
  const initials = (name || '?').split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <Box
      w="38px" h="38px" minW="38px"
      bg={`${color}1a`}
      border="1px solid"
      borderColor={`${color}44`}
      rounded="md"
      display="flex" alignItems="center" justifyContent="center"
      flexShrink={0}
    >
      <Text fontSize="sm" fontWeight="900" color={color} lineHeight="1">{initials}</Text>
    </Box>
  );
};

const TeamsView = ({ theme, open, onClose }) => {
  const colors = getThemedColors(theme);
  const { teams, loading } = useTeamRoles();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Active');
  const [selectedTeam, setSelectedTeam] = useState(null);

  const filtered = useMemo(() => teams.filter(team => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      team.name?.toLowerCase().includes(q) ||
      team.captain?.toLowerCase().includes(q) ||
      team.coCaptain?.toLowerCase().includes(q) ||
      team.players?.some(p => p?.toLowerCase().includes(q));
    const matchesStatus = statusFilter === 'All' || team.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [teams, search, statusFilter]);

  const activeCount = teams.filter(t => t.status === 'Active').length;

  return (
    <>
      <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="full">
        <Portal>
          <Dialog.Backdrop bg={`${colors.bgPrimary}cc`} backdropFilter="blur(12px)" />
          <Dialog.Positioner>
            <Dialog.Content
              maxW="900px"
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
              {/* Close */}
              <Box position="absolute" top="4" right="4" zIndex="2">
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" color={colors.textMuted} _hover={{ color: colors.textPrimary }} />
                </Dialog.CloseTrigger>
              </Box>

              {/* Header */}
              <Box px={{ base: '5', md: '8' }} pt="8" pb="5" flexShrink={0}>
                <Text fontSize={{ base: '3xl', md: '4xl' }} fontWeight="900" color={colors.textPrimary} letterSpacing="-0.02em" lineHeight="1" mb="1">
                  League Teams
                </Text>
                <Text fontSize="sm" color={colors.textMuted} mb="6">
                  {activeCount} active teams
                </Text>

                {/* Filters + search */}
                <HStack justify="space-between" flexWrap="wrap" gap="3">
                  <HStack gap="2" flexWrap="wrap">
                    {STATUS_FILTERS.map(f => {
                      const active = statusFilter === f;
                      const accent = f === 'Active' ? '#22c55e' : f === 'Inactive' ? '#ef4444' : colors.accentOrange;
                      return (
                        <Button
                          key={f}
                          size="sm"
                          onClick={() => setStatusFilter(f)}
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
                          {f}
                        </Button>
                      );
                    })}
                  </HStack>
                  <InputGroup maxW="200px" startElement={<Search size={13} color={colors.textMuted} />}>
                    <Input
                      placeholder="Search teams, players..."
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

              {/* Team list */}
              <Box flexGrow={1} overflowY="auto" px={{ base: '5', md: '8' }} pb="8">
                {loading ? (
                  <Center py="16"><Spinner size="xl" color={colors.accentOrange} /></Center>
                ) : filtered.length === 0 ? (
                  <Center py="16">
                    <Text fontSize="sm" color={colors.textMuted}>No teams found</Text>
                  </Center>
                ) : (
                  <Box bg={colors.bgCard} border="1px solid" borderColor={colors.borderMedium} rounded="xl" overflow="hidden">
                    {/* Column headers */}
                    <Box
                      display="grid"
                      gridTemplateColumns={{ base: '1fr 80px', md: '1fr 200px 140px 80px' }}
                      px="4" py="2"
                      bg={colors.bgSecondary}
                      borderBottom="1px solid"
                      borderColor={colors.borderMedium}
                    >
                      {[
                        { label: 'TEAM', show: 'all' },
                        { label: 'CAPTAIN', show: 'md' },
                        { label: 'PLAYERS', show: 'md' },
                        { label: 'STATUS', show: 'all' },
                      ].map(({ label, show }) => (
                        <Text
                          key={label}
                          fontSize="10px"
                          fontWeight="700"
                          color={colors.textMuted}
                          letterSpacing="wider"
                          textTransform="uppercase"
                          display={show === 'md' ? { base: 'none', md: 'block' } : 'block'}
                        >
                          {label}
                        </Text>
                      ))}
                    </Box>

                    {/* Rows */}
                    {filtered.map((team) => {
                      const base = getBaseTier(team.tier);
                      const tInfo = tierInfo[base] || {};
                      const avatarColor = tInfo.color || colors.accentOrange;
                      const isActive = team.status === 'Active';
                      const playerCount = [team.captain, team.coCaptain, ...(team.players || [])].filter(Boolean).length;

                      return (
                        <Box
                          key={team.id || team.name}
                          display="grid"
                          gridTemplateColumns={{ base: '1fr 80px', md: '1fr 200px 140px 80px' }}
                          px="4" py="3"
                          borderBottom="1px solid"
                          borderColor={`${colors.borderMedium}55`}
                          opacity={isActive ? 1 : 0.5}
                          _hover={{ bg: `${colors.textPrimary}0c`, cursor: 'pointer' }}
                          transition="background 0.15s"
                          _last={{ borderBottom: 'none' }}
                          onClick={() => setSelectedTeam(team.name)}
                        >
                          {/* Team name + avatar */}
                          <HStack gap="3" minW="0" overflow="hidden">
                            <TeamAvatar name={team.name} color={avatarColor} />
                            <Box minW="0">
                              <Text fontSize="sm" fontWeight="700" color={colors.textPrimary} noOfLines={1} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                                {team.name}
                              </Text>
                              {team.tier && (
                                <HStack gap="1" mt="0.5">
                                  <Box as="span" color={avatarColor} fontSize="9px">◆</Box>
                                  <Text fontSize="10px" color={avatarColor} fontWeight="600">{team.tier}</Text>
                                </HStack>
                              )}
                            </Box>
                          </HStack>

                          {/* Captain */}
                          <Box display={{ base: 'none', md: 'flex' }} alignItems="center" gap="2" minW="0" overflow="hidden">
                            {team.captain ? (
                              <>
                                <Crown size={12} color={colors.accentOrange} style={{ flexShrink: 0 }} />
                                <Text fontSize="xs" color={colors.textSecondary} noOfLines={1} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                                  {team.captain}
                                </Text>
                              </>
                            ) : (
                              <Text fontSize="xs" color={colors.textSubtle}>—</Text>
                            )}
                          </Box>

                          {/* Player count */}
                          <Box display={{ base: 'none', md: 'flex' }} alignItems="center" gap="1.5">
                            <Users size={12} color={colors.textMuted} />
                            <Text fontSize="xs" fontWeight="700" color={colors.textSecondary}>{playerCount}</Text>
                            <Text fontSize="xs" color={colors.textSubtle}>players</Text>
                          </Box>

                          {/* Status */}
                          <Box display="flex" alignItems="center">
                            <Box
                              px="2" py="0.5"
                              rounded="full"
                              fontSize="10px"
                              fontWeight="700"
                              bg={isActive ? '#22c55e22' : '#ef444422'}
                              color={isActive ? '#22c55e' : '#ef4444'}
                              border="1px solid"
                              borderColor={isActive ? '#22c55e44' : '#ef444444'}
                            >
                              {team.status || 'Active'}
                            </Box>
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

export default TeamsView;
