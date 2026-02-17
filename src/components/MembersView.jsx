import { Box, Dialog, Portal, Text, HStack, VStack, Badge, CloseButton, SimpleGrid, Input, InputGroup, Button, Table } from '@chakra-ui/react';
import { Users, Shield, Star, Radio, Video, Clock, UserX, Search, ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { useTeamRoles } from '../hooks/useTeamRoles';
import { useLeagueSubs } from '../hooks/useLeagueSubs';
import PlayerProfileModal from './PlayerProfileModal';
import { getThemedColors } from '../theme/colors';

const casters = ['trodd-', 'Dano McFabulous', 'Azalea', 'Cool-Whip', 'Sweetlyfe', 'Phaenom', 'Palidore', 'MyGuyChromium', 'Orthrua', 'Mountainous', 'Martiney_', 'hpenney2'];
const moderators = ['caroline', 'aaliyah', 'arii', 'azalea', 'trodd', 'waffledlife', 'sam', 'ryanjs1020', 'CyanoTex', 'cole', 'coastermaster77', 'krogers', 'Dano McFabulous'];

// Actual player lists from EML data
const subs = [];
const creators = [];
const connoisseurs = [];
const cooldownPlayers = [];

const MembersView = ({ theme, open, onClose, initialCategory }) => {
  const colors = getThemedColors(theme);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const { teams } = useTeamRoles();
  const { subs: leagueSubs } = useLeagueSubs();

  const activeTeams = teams.filter(t => t.status === 'Active');
  const activePlayers = activeTeams.reduce((acc, t) => acc + 1 + (t.coCaptain ? 1 : 0) + t.players.filter(Boolean).length, 0);

  const inactiveTeams = teams.filter(t => t.status === 'Inactive');
  const inactivePlayers = inactiveTeams.reduce((acc, t) => acc + 1 + (t.coCaptain ? 1 : 0) + t.players.filter(Boolean).length, 0);

  // Build player database by category
  const playersByCategory = {
    active: [],
    subs: [],
    connoisseurs: [],
    casters: [],
    creators: [],
    moderators: [],
    cooldown: [],
    inactive: []
  };

  activeTeams.forEach(team => {
    if (team.captain) playersByCategory.active.push({ name: team.captain, team: team.name, role: 'Captain', status: 'Active' });
    if (team.coCaptain) playersByCategory.active.push({ name: team.coCaptain, team: team.name, role: 'Co-Captain', status: 'Active' });
    team.players.filter(Boolean).forEach(p => playersByCategory.active.push({ name: p, team: team.name, role: 'Player', status: 'Active' }));
  });

  casters.forEach(name => playersByCategory.casters.push({ name, team: 'EML Staff', role: 'Caster', status: 'Active' }));

  const commissioners = ['caroline', 'aaliyah', 'dano mcfabulous'];
  const moderatorPlayers = moderators.map(name => {
    const isCommissioner = commissioners.includes(name.toLowerCase());
    return {
      name,
      team: 'EML Staff',
      role: 'Moderator',
      subtitle: isCommissioner ? 'Commissioner' : undefined,
      status: 'Active',
      isCommissioner
    };
  });

  // Sort to put Commissioners first
  moderatorPlayers.sort((a, b) => {
    if (a.isCommissioner && !b.isCommissioner) return -1;
    if (!a.isCommissioner && b.isCommissioner) return 1;
    return 0;
  });

  playersByCategory.moderators = moderatorPlayers;
  leagueSubs.forEach(name => playersByCategory.subs.push({ name, team: 'Substitute Pool', role: 'Substitute', status: 'Active' }));
  creators.forEach(name => playersByCategory.creators.push({ name, team: 'Content Team', role: 'Creator', status: 'Active' }));
  connoisseurs.forEach(name => playersByCategory.connoisseurs.push({ name, team: 'Advisory Board', role: 'Connoisseur', status: 'Active' }));
  cooldownPlayers.forEach(name => playersByCategory.cooldown.push({ name, team: 'Transfer Cooldown', role: 'Player', status: 'Cooldown' }));

  inactiveTeams.forEach(team => {
    if (team.captain) playersByCategory.inactive.push({ name: team.captain, team: team.name, role: 'Captain', status: 'Inactive' });
    if (team.coCaptain) playersByCategory.inactive.push({ name: team.coCaptain, team: team.name, role: 'Co-Captain', status: 'Inactive' });
    team.players.filter(Boolean).forEach(p => playersByCategory.inactive.push({ name: p, team: team.name, role: 'Player', status: 'Inactive' }));
  });

  const allPlayers = Object.values(playersByCategory).flat();

  const filtered = search ? allPlayers.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.team.toLowerCase().includes(search.toLowerCase()) ||
    p.role.toLowerCase().includes(search.toLowerCase())
  ) : [];

  const playerStatusCategories = [
    { id: 'active', label: 'Active Players', icon: Users, color: 'green', count: playersByCategory.active.length },
    { id: 'inactive', label: 'Inactive Players', icon: UserX, color: 'gray', count: playersByCategory.inactive.length },
    { id: 'subs', label: 'Substitutes', icon: Users, color: 'blue', count: playersByCategory.subs.length },
    { id: 'cooldown', label: 'Players on Cooldown', icon: Clock, color: 'yellow', count: playersByCategory.cooldown.length },
  ];

  const roleCategories = [
    { id: 'moderators', label: 'Moderators', icon: Shield, color: 'red', count: playersByCategory.moderators.length },
    { id: 'casters', label: 'Casters', icon: Radio, color: 'orange', count: playersByCategory.casters.length },
    { id: 'creators', label: 'Creators', icon: Video, color: 'pink', count: playersByCategory.creators.length },
    { id: 'connoisseurs', label: 'Connoisseurs', icon: Star, color: 'purple', count: playersByCategory.connoisseurs.length },
  ];

  const memberCategories = [...playerStatusCategories, ...roleCategories];

  const currentCategory = memberCategories.find(c => c.id === selectedCategory);
  const categoryPlayers = selectedCategory ? playersByCategory[selectedCategory] : [];

  return (
    <>
      <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="xl">
        <Portal>
          <Dialog.Backdrop bg={`${colors.bgPrimary}b3`} backdropFilter="blur(10px)" />
          <Dialog.Positioner>
            <Dialog.Content
              maxW="1200px"
              maxH="90vh"
              bg={colors.bgSecondary}
              border="1px solid"
              borderColor={colors.borderMedium}
              rounded="2xl"
              overflow="hidden"
            >
              <Dialog.Header bg={colors.bgTertiary} borderBottom="1px solid" borderColor={colors.borderMedium}>
                <HStack justify="space-between">
                  <HStack gap="2">
                    <Users size={24} color={colors.accentOrange} />
                    <Dialog.Title fontSize="2xl" fontWeight="800" color={colors.textPrimary}>
                      {selectedCategory ? currentCategory?.label : 'Members Directory'}
                    </Dialog.Title>
                  </HStack>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton size="lg" />
                  </Dialog.CloseTrigger>
                </HStack>
              </Dialog.Header>
              <Dialog.Body p="6" overflowY="auto">
                <VStack align="stretch" gap="6">
                  {selectedCategory && (
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedCategory(null)}
                      alignSelf="flex-start"
                      size="sm"
                      color={colors.textPrimary}
                    >
                      <ChevronLeft size={16} /> Back to Categories
                    </Button>
                  )}

                  {!selectedCategory && (
                    <InputGroup startElement={<Search size={16} color={colors.textPrimary} />}>
                      <Input
                        placeholder="Search players, teams, or roles..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        bg={colors.bgTertiary}
                        borderColor={colors.borderMedium}
                        color={colors.textPrimary}
                        _placeholder={{ color: colors.textMuted }}
                        size="lg"
                      />
                    </InputGroup>
                  )}

                  {search && !selectedCategory ? (
                    <VStack align="stretch" gap="2">
                      <Text fontSize="sm" color={colors.textMuted} fontWeight="600">
                        {filtered.length} results found
                      </Text>
                      <SimpleGrid columns={{ base: 1, md: 2 }} gap="3">
                        {filtered.slice(0, 20).map((player, idx) => (
                          <Box
                            key={idx}
                            as="button"
                            onClick={() => setSelectedPlayer(player.name)}
                            bg={`${colors.textPrimary}0a`}
                            border="1px solid"
                            borderColor={colors.borderMedium}
                            p="4"
                            rounded="xl"
                            textAlign="left"
                            _hover={{ borderColor: colors.accentOrange, transform: 'translateY(-2px)' }}
                            transition="all 0.2s"
                          >
                            <VStack align="start" gap="2">
                              <HStack justify="space-between" w="full">
                                <Text fontWeight="700" fontSize="md" color={colors.textPrimary}>
                                  {player.name}
                                </Text>
                                <Badge colorPalette={player.role === 'Captain' ? 'yellow' : player.role === 'Co-Captain' ? 'orange' : player.role === 'Caster' ? 'purple' : player.role === 'Moderator' ? 'red' : 'blue'} size="sm">
                                  {player.role}
                                </Badge>
                              </HStack>
                              <Text fontSize="sm" color={colors.textMuted}>
                                Team: <strong>{player.team}</strong>
                              </Text>
                              <Badge colorPalette={player.status === 'Active' ? 'green' : 'yellow'} size="xs">
                                {player.status}
                              </Badge>
                            </VStack>
                          </Box>
                        ))}
                      </SimpleGrid>
                    </VStack>
                  ) : selectedCategory ? (
                    selectedCategory === 'cooldown' ? (
                      <Box
                        w="full"
                        bg={colors.bgCard}
                        border="1px solid"
                        borderColor={colors.borderMedium}
                        rounded="xl"
                        overflow="hidden"
                      >
                        <Table.Root size="md" variant="outline">
                          <Table.Header>
                            <Table.Row bg={colors.bgTertiary}>
                              <Table.ColumnHeader fontWeight="700" color={colors.textMuted} fontSize="xs" textTransform="uppercase">
                                Player Name
                              </Table.ColumnHeader>
                              <Table.ColumnHeader fontWeight="700" color={colors.textMuted} fontSize="xs" textTransform="uppercase">
                                Previous Team
                              </Table.ColumnHeader>
                              <Table.ColumnHeader fontWeight="700" color={colors.textMuted} fontSize="xs" textTransform="uppercase">
                                Status
                              </Table.ColumnHeader>
                              <Table.ColumnHeader fontWeight="700" color={colors.textMuted} fontSize="xs" textTransform="uppercase">
                                Expires
                              </Table.ColumnHeader>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {categoryPlayers.map((player, idx) => (
                              <Table.Row key={idx} _hover={{ bg: colors.bgElevated }}>
                                <Table.Cell>
                                  <Text
                                    as="button"
                                    fontSize="sm"
                                    fontWeight="600"
                                    color={colors.accentBlue}
                                    _hover={{ textDecoration: 'underline' }}
                                    onClick={() => setSelectedPlayer(player.name)}
                                  >
                                    {player.name}
                                  </Text>
                                </Table.Cell>
                                <Table.Cell>
                                  <Text fontSize="sm" color={colors.textMuted}>
                                    {player.team}
                                  </Text>
                                </Table.Cell>
                                <Table.Cell>
                                  <Badge colorPalette="green" px="2.5" py="1" rounded="full" fontSize="xs" fontWeight="700">
                                    Active
                                  </Badge>
                                </Table.Cell>
                                <Table.Cell>
                                  <HStack gap="1">
                                    <Clock size={14} color={colors.accentOrange} />
                                    <Text fontSize="sm" fontWeight="600" color={colors.accentOrange}>
                                      2/20/26
                                    </Text>
                                  </HStack>
                                </Table.Cell>
                              </Table.Row>
                            ))}
                          </Table.Body>
                        </Table.Root>
                      </Box>
                    ) : (
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="3">
                        {categoryPlayers.map((player, idx) => (
                          <Box
                            key={idx}
                            as="button"
                            onClick={() => setSelectedPlayer(player.name)}
                            bg={colors.bgElevated}
                            border="1px solid"
                            borderColor={colors.borderMedium}
                            p="4"
                            rounded="xl"
                            textAlign="left"
                            _hover={{ borderColor: colors.accentOrange, transform: 'translateY(-2px)' }}
                            transition="all 0.2s"
                          >
                            <VStack align="start" gap="2">
                              <Text fontWeight="700" fontSize="md" color={colors.textPrimary}>
                                {player.name}
                              </Text>
                              {player.subtitle && (
                                <Text fontSize="xs" color={colors.accentOrange} fontWeight="600">
                                  {player.subtitle}
                                </Text>
                              )}
                              <Text fontSize="sm" color={colors.textMuted}>
                                {player.team}
                              </Text>
                              <Badge colorPalette={currentCategory.color} size="xs">
                                {player.role}
                              </Badge>
                            </VStack>
                          </Box>
                        ))}
                      </SimpleGrid>
                    )
                  ) : (
                    <SimpleGrid columns={{ base: 1, lg: 2 }} gap="6">
                      <VStack align="stretch" gap="4">
                        {playerStatusCategories.map(category => (
                          <Box
                            key={category.id}
                            as="button"
                            onClick={() => setSelectedCategory(category.id)}
                            bg={colors.bgElevated}
                            border="1px solid"
                            borderColor={colors.borderMedium}
                            p="5"
                            rounded="xl"
                            textAlign="left"
                            _hover={{ borderColor: colors.accentOrange, transform: 'translateY(-2px)' }}
                            transition="all 0.2s"
                          >
                            <HStack justify="space-between" mb="2">
                              <HStack gap="3">
                                <Box bg={`${category.color}.900`} p="2" rounded="lg">
                                  <category.icon size={20} color={`var(--chakra-colors-${category.color}-400)`} />
                                </Box>
                                <Text fontWeight="700" fontSize="md" color={colors.textPrimary}>
                                  {category.label}
                                </Text>
                              </HStack>
                              <Badge colorPalette={category.color} px="3" py="1" rounded="full" fontSize="sm" fontWeight="700">
                                {category.count}
                              </Badge>
                            </HStack>
                            <Text fontSize="sm" color={colors.textMuted}>
                              {category.id === 'active' && 'Current roster players across all teams'}
                              {category.id === 'subs' && 'Registered substitute players'}
                              {category.id === 'cooldown' && 'Players in transfer cooldown period'}
                              {category.id === 'inactive' && 'Former league participants'}
                            </Text>
                          </Box>
                        ))}
                      </VStack>
                      <VStack align="stretch" gap="4">
                        {roleCategories.map(category => (
                          <Box
                            key={category.id}
                            as="button"
                            onClick={() => setSelectedCategory(category.id)}
                            bg={colors.bgElevated}
                            border="1px solid"
                            borderColor={colors.borderMedium}
                            p="5"
                            rounded="xl"
                            textAlign="left"
                            _hover={{ borderColor: colors.accentOrange, transform: 'translateY(-2px)' }}
                            transition="all 0.2s"
                          >
                            <HStack justify="space-between" mb="2">
                              <HStack gap="3">
                                <Box bg={`${category.color}.900`} p="2" rounded="lg">
                                  <category.icon size={20} color={`var(--chakra-colors-${category.color}-400)`} />
                                </Box>
                                <Text fontWeight="700" fontSize="md" color={colors.textPrimary}>
                                  {category.label}
                                </Text>
                              </HStack>
                              <Badge colorPalette={category.color} px="3" py="1" rounded="full" fontSize="sm" fontWeight="700">
                                {category.count}
                              </Badge>
                            </HStack>
                            <Text fontSize="sm" color={colors.textMuted}>
                              {category.id === 'connoisseurs' && 'Expert community advisors'}
                              {category.id === 'casters' && 'Official match commentators'}
                              {category.id === 'creators' && 'Content creators and streamers'}
                              {category.id === 'moderators' && 'Community moderators and admins'}
                            </Text>
                          </Box>
                        ))}
                      </VStack>
                    </SimpleGrid>
                  )}
                </VStack>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <PlayerProfileModal
        open={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        playerName={selectedPlayer}
        theme={theme}
      />
    </>
  );
};

export default MembersView;
