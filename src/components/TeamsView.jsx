import {
  Box,
  Dialog,
  Portal,
  CloseButton,
  HStack,
  VStack,
  Text,
  Input,
  InputGroup,
  Button,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { Users, Search, Shield, Crown } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import TeamProfileModal from './TeamProfileModal';
import { useTeamRoles } from '../hooks/useTeamRoles';
import { getThemedColors } from '../theme/colors';
import { getBaseTier, tierInfo } from '../utils/tierUtils';
import { emlApi } from '../hooks/useEmlApi';
import RoutePageLayout from './RoutePageLayout';

const STATUS_FILTERS = ['All', 'Active', 'Inactive'];

const slug = s => (s || '').replace(/\s+/g, '_').toLowerCase();
const getLsLogo = name => {
  try {
    return localStorage.getItem(`eml_team_logo_${slug(name)}`);
  } catch {
    return null;
  }
};

const TeamAvatar = ({ name, color }) => {
  const [logo, setLogo] = useState(() => getLsLogo(name));
  const initials = (name || '?')
    .split(/\s+/)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    emlApi('GET', `/team/assets/${encodeURIComponent(slug(name))}`)
      .then(d => {
        if (d.logoUrl) {
          setLogo(d.logoUrl);
          try {
            localStorage.setItem(`eml_team_logo_${slug(name)}`, d.logoUrl);
          } catch {}
        }
      })
      .catch(() => {});
  }, [name]);
  return (
    <Box
      w="38px"
      h="38px"
      minW="38px"
      bg={`${color}1a`}
      border="1px solid"
      borderColor={`${color}44`}
      rounded="md"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
      overflow="hidden"
    >
      {logo ? (
        <Box
          as="img"
          src={logo}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <Text fontSize="sm" fontWeight="900" color={color} lineHeight="1">
          {initials}
        </Text>
      )}
    </Box>
  );
};

const TeamsView = ({ theme }) => {
  const colors = getThemedColors(theme);
  const { teams, loading } = useTeamRoles();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Active');
  const [selectedTeam, setSelectedTeam] = useState(null);

  const filtered = useMemo(
    () =>
      teams.filter(team => {
        const q = search.toLowerCase();
        const matchesSearch =
          !q ||
          team.name?.toLowerCase().includes(q) ||
          team.captain?.toLowerCase().includes(q) ||
          team.coCaptain?.toLowerCase().includes(q) ||
          team.players?.some(p => p?.toLowerCase().includes(q));
        const matchesStatus = statusFilter === 'All' || team.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [teams, search, statusFilter]
  );

  const activeCount = teams.filter(t => t.status === 'Active').length;

  return (
    <>
      <RoutePageLayout
        maxW="900px"
        bg={colors.bgPrimary}
        border="1px solid"
        borderColor={colors.borderMedium}
        rounded="2xl"
        overflow="hidden"
      >
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
                const accent =
                  f === 'Active' ? '#22c55e' : f === 'Inactive' ? '#ef4444' : colors.accentOrange;
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
                onChange={e => setSearch(e.target.value)}
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
            <Center py="16">
              <Spinner size="xl" color={colors.accentOrange} />
            </Center>
          ) : filtered.length === 0 ? (
            <Center py="16">
              <Text fontSize="sm" color={colors.textMuted}>
                No teams found
              </Text>
            </Center>
          ) : (
            <Box
              bg={colors.bgCard}
              border="1px solid"
              borderColor={colors.borderMedium}
              rounded="xl"
              overflow="hidden"
              p="3"
            >
              <VStack align="stretch" gap="2">
                {filtered.map(team => {
                  const base = getBaseTier(team.tier);
                  const tInfo = tierInfo[base] || {};
                  const avatarColor = tInfo.color || colors.accentOrange;
                  const isActive = team.status === 'Active';
                  const playerCount = [
                    team.captain,
                    team.coCaptain,
                    ...(team.players || []),
                  ].filter(Boolean).length;

                  return (
                    <Box
                      key={team.id || team.name}
                      bg={colors.bgSecondary}
                      border="1px solid"
                      borderColor={`${colors.borderMedium}55`}
                      rounded="lg"
                      p="4"
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      _hover={{ bg: `${colors.textPrimary}0c`, cursor: 'pointer' }}
                      onClick={() => setSelectedTeam(team.name)}
                    >
                      <HStack gap="3" minW="0" overflow="hidden">
                        <TeamAvatar name={team.name} color={avatarColor} />
                        <Box minW="0">
                          <Text
                            fontSize="md"
                            fontWeight="800"
                            color={colors.textPrimary}
                            noOfLines={1}
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                          >
                            {team.name}
                          </Text>
                          {team.tier && (
                            <HStack gap="2" mt="1">
                              <Text fontSize="10px" color={avatarColor} fontWeight="700">
                                {team.tier}
                              </Text>
                              <Text fontSize="10px" color={colors.textMuted}>
                                {playerCount} players
                              </Text>
                            </HStack>
                          )}
                        </Box>
                      </HStack>

                      <HStack gap="4">
                        <Box display={{ base: 'none', md: 'block' }}>
                          <HStack>
                            <Crown size={14} color={colors.accentOrange} />
                            <Text fontSize="sm" color={colors.textSecondary}>
                              {team.captain || '—'}
                            </Text>
                          </HStack>
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="700" color={colors.textSecondary}>
                            {playerCount}
                          </Text>
                          <Text fontSize="xs" color={colors.textMuted}>
                            players
                          </Text>
                        </Box>
                        <Box>
                          <Box
                            px="3"
                            py="1"
                            rounded="full"
                            fontSize="12px"
                            fontWeight="800"
                            bg={isActive ? '#22c55e22' : '#ef444422'}
                            color={isActive ? '#22c55e' : '#ef4444'}
                            border="1px solid"
                            borderColor={isActive ? '#22c55e44' : '#ef444444'}
                          >
                            {team.status || 'Active'}
                          </Box>
                        </Box>
                      </HStack>
                    </Box>
                  );
                })}
              </VStack>
            </Box>
          )}
        </Box>
      </RoutePageLayout>

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
