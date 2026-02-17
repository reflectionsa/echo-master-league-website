import { Box, Dialog, Portal, Text, HStack, VStack, Badge, CloseButton, SimpleGrid, Input, InputGroup, Button, Table } from '@chakra-ui/react';
import { Users, Shield, Star, Radio, Video, Clock, UserX, Search, ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { teamRosters } from '../data/teamRosters';
import PlayerProfileModal from './PlayerProfileModal';
import { emlColors } from '../theme/colors';

const casters = ['trodd-', 'Dano McFabulous', 'Azalea', 'Cool-Whip', 'Sweetlyfe', 'Phaenom', 'Palidore', 'MyGuyChromium', 'Orthrua', 'Mountainous', 'Martiney_', 'hpenney2'];
const moderators = ['caroline', 'aaliyah', 'arii', 'azalea', 'trodd', 'waffledlife', 'sam', 'ryanjs1020', 'CyanoTex', 'cole', 'coastermaster77', 'krogers', 'Dano McFabulous'];

const generateRandomPlayers = (count) => {
  const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Skyler', 'Quinn', 'Avery', 'Drew', 'Phoenix', 'River'];
  const lastNames = ['Storm', 'Blade', 'Echo', 'Nova', 'Frost', 'Ace', 'Viper', 'Shadow', 'Blaze', 'Knight'];
  const players = [];

  for (let i = 0; i < count; i++) {
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    players.push(`${first}${last}${Math.floor(Math.random() * 99)}`);
  }

  return players;
};

const MembersView = ({ theme, open, onClose, initialCategory }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const activeTeams = teamRosters.filter(t => t.status === 'Active');
  const activePlayers = activeTeams.reduce((acc, t) => acc + 1 + (t.coCaptain ? 1 : 0) + t.players.filter(Boolean).length, 0);
  const subs = generateRandomPlayers(Math.floor(activePlayers * 0.3));
  const creators = generateRandomPlayers(15);
  const connoisseurs = generateRandomPlayers(10);

  const inactiveTeams = teamRosters.filter(t => t.status === 'Inactive');
  const inactivePlayers = inactiveTeams.reduce((acc, t) => acc + 1 + (t.coCaptain ? 1 : 0) + t.players.filter(Boolean).length, 0);
  const cooldownPlayers = generateRandomPlayers(7);

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
  subs.forEach(name => playersByCategory.subs.push({ name, team: 'Substitute Pool', role: 'Substitute', status: 'Active' }));
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
          <Dialog.Backdrop bg={`${emlColors.bgPrimary}b3`} backdropFilter="blur(10px)" />
          <Dialog.Positioner>
            <Dialog.Content
              maxW="1200px"
              maxH="90vh"
              bg={emlColors.bgSecondary}
              border="1px solid"
              borderColor={emlColors.borderMedium}
              rounded="2xl"
              overflow="hidden"
            >
              <Dialog.Header bg={emlColors.bgTertiary} borderBottom="1px solid" borderColor={emlColors.borderMedium}>
                <HStack justify="space-between">
                  <HStack gap="2">
                    <Users size={24} color={emlColors.accentOrange} />
                    <Dialog.Title fontSize="2xl" fontWeight="800" color={emlColors.textPrimary}>
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
                      color={emlColors.textPrimary}
                    >
                      <ChevronLeft size={16} /> Back to Categories
                    </Button>
                  )}

                  {!selectedCategory && (
                    <InputGroup startElement={<Search size={16} color={emlColors.textPrimary} />}>
                      <Input
                        placeholder="Search players, teams, or roles..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        bg={emlColors.bgTertiary}
                        borderColor={emlColors.borderMedium}
                        color={emlColors.textPrimary}
                        _placeholder={{ color: emlColors.textMuted }}
                        size="lg"
                      />
                    </InputGroup>
                  )}

                  {search && !selectedCategory ? (
                    <VStack align="stretch" gap="2">
                      <Text fontSize="sm" color={emlColors.textMuted} fontWeight="600">
                        {filtered.length} results found
                      </Text>
                      <SimpleGrid columns={{ base: 1, md: 2 }} gap="3">
                        {filtered.slice(0, 20).map((player, idx) => (
                          <Box
                            key={idx}
                            as="button"
                            onClick={() => setSelectedPlayer(player.name)}
                            bg={`${emlColors.textPrimary}0a`}
                            border="1px solid"
                            borderColor={emlColors.borderMedium}
                            p="4"
                            rounded="xl"
                            textAlign="left"
                            _hover={{ borderColor: emlColors.accentOrange, transform: 'translateY(-2px)' }}
                            transition="all 0.2s"
                          >
                            <VStack align="start" gap="2">
                              <HStack justify="space-between" w="full">
                                <Text fontWeight="700" fontSize="md" color={emlColors.textPrimary}>
                                  {player.name}
                                </Text>
                                <Badge colorPalette={player.role === 'Captain' ? 'yellow' : player.role === 'Co-Captain' ? 'orange' : player.role === 'Caster' ? 'purple' : player.role === 'Moderator' ? 'red' : 'blue'} size="sm">
                                  {player.role}
                                </Badge>
                              </HStack>
                              <Text fontSize="sm" color={emlColors.textMuted}>
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
                        bg={emlColors.bgCard}
                        border="1px solid"
                        borderColor={emlColors.borderMedium}
                        rounded="xl"
                        overflow="hidden"
                      >
                        <Table.Root size="md" variant="outline">
                          <Table.Header>
                            <Table.Row bg={emlColors.bgTertiary}>
                              <Table.ColumnHeader fontWeight="700" color={emlColors.textMuted} fontSize="xs" textTransform="uppercase">
                                Player Name
                              </Table.ColumnHeader>
                              <Table.ColumnHeader fontWeight="700" color={emlColors.textMuted} fontSize="xs" textTransform="uppercase">
                                Previous Team
                              </Table.ColumnHeader>
                              <Table.ColumnHeader fontWeight="700" color={emlColors.textMuted} fontSize="xs" textTransform="uppercase">
                                Status
                              </Table.ColumnHeader>
                              <Table.ColumnHeader fontWeight="700" color={emlColors.textMuted} fontSize="xs" textTransform="uppercase">
                                Expires
                              </Table.ColumnHeader>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {categoryPlayers.map((player, idx) => (
                              <Table.Row key={idx} _hover={{ bg: emlColors.bgElevated }}>
                                <Table.Cell>
                                  <Text
                                    as="button"
                                    fontSize="sm"
                                    fontWeight="600"
                                    color={emlColors.accentBlue}
                                    _hover={{ textDecoration: 'underline' }}
                                    onClick={() => setSelectedPlayer(player.name)}
                                  >
                                    {player.name}
                                  </Text>
                                </Table.Cell>
                                <Table.Cell>
                                  <Text fontSize="sm" color={emlColors.textMuted}>
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
                                    <Clock size={14} color={emlColors.accentOrange} />
                                    <Text fontSize="sm" fontWeight="600" color={emlColors.accentOrange}>
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
                            bg={emlColors.bgElevated}
                            border="1px solid"
                            borderColor={emlColors.borderMedium}
                            p="4"
                            rounded="xl"
                            textAlign="left"
                            _hover={{ borderColor: emlColors.accentOrange, transform: 'translateY(-2px)' }}
                            transition="all 0.2s"
                          >
                            <VStack align="start" gap="2">
                              <Text fontWeight="700" fontSize="md" color={emlColors.textPrimary}>
                                {player.name}
                              </Text>
                              {player.subtitle && (
                                <Text fontSize="xs" color={emlColors.accentYellow} fontWeight="600">
                                  {player.subtitle}
                                </Text>
                              )}
                              <Text fontSize="sm" color={emlColors.textMuted}>
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
                            bg={emlColors.bgElevated}
                            border="1px solid"
                            borderColor={emlColors.borderMedium}
                            p="5"
                            rounded="xl"
                            textAlign="left"
                            _hover={{ borderColor: emlColors.accentOrange, transform: 'translateY(-2px)' }}
                            transition="all 0.2s"
                          >
                            <HStack justify="space-between" mb="2">
                              <HStack gap="3">
                                <Box bg={`${emlColors.bgTertiary}`} p="2" rounded="lg">
                                  <category.icon size={20} color={emlColors.accentOrange} />
                                </Box>
                                <Text fontWeight="700" fontSize="md" color={emlColors.textPrimary}>
                                  {category.label}
                                </Text>
                              </HStack>
                              <Badge colorPalette={category.color} px="3" py="1" rounded="full" fontSize="sm" fontWeight="700">
                                {category.count}
                              </Badge>
                            </HStack>
                            <Text fontSize="sm" color={emlColors.textMuted}>
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
                            bg={emlColors.bgElevated}
                            border="1px solid"
                            borderColor={emlColors.borderMedium}
                            p="5"
                            rounded="xl"
                            textAlign="left"
                            _hover={{ borderColor: emlColors.accentOrange, transform: 'translateY(-2px)' }}
                            transition="all 0.2s"
                          >
                            <HStack justify="space-between" mb="2">
                              <HStack gap="3">
                                <Box bg={`${category.color}.900`} p="2" rounded="lg">
                                  <category.icon size={20} color={`var(--chakra-colors-${category.color}-400)`} />
                                </Box>
                                <Text fontWeight="700" fontSize="md" color={emlColors.textPrimary}>
                                  {category.label}
                                </Text>
                              </HStack>
                              <Badge colorPalette={category.color} px="3" py="1" rounded="full" fontSize="sm" fontWeight="700">
                                {category.count}
                              </Badge>
                            </HStack>
                            <Text fontSize="sm" color={emlColors.textMuted}>
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
