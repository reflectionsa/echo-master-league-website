import { Box, VStack, Heading, Text, Table, Badge, HStack } from '@chakra-ui/react';
import { Clock, Users } from 'lucide-react';
import { teamRosters } from '../data/teamRosters';

const generateCooldownList = () => {
  const activeTeams = teamRosters.filter(t => t.status === 'Active');
  const players = [];

  // Collect all players from all teams
  activeTeams.forEach(team => {
    if (team.captain) players.push({ name: team.captain, team: team.name });
    if (team.coCaptain) players.push({ name: team.coCaptain, team: team.name });
    team.players.forEach(player => {
      if (player) players.push({ name: player, team: team.name });
    });
  });

  // Randomly select 7-12 players for cooldown list
  const cooldownCount = Math.floor(Math.random() * 6) + 7;
  const shuffled = players.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, cooldownCount).map((p, idx) => ({
    id: idx,
    ...p,
    status: 'Active',
    expires: '2/20/26'
  }));
};

const CooldownSection = ({ theme }) => {
  const isDark = theme === 'dark';
  const cooldownList = generateCooldownList();

  return (
    <Box
      as="section"
      id="cooldown"
      py="20"
      bg={isDark ? 'gray.950' : 'gray.50'}
      minH="100vh"
    >
      <VStack maxW="6xl" mx="auto" px="6" gap="8">
        <VStack gap="3" textAlign="center">
          <HStack gap="2" color={isDark ? 'orange.400' : 'blue.600'}>
            <Clock size={24} />
            <Heading
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="800"
              bgGradient={isDark ? 'linear(to-r, orange.400, orange.600)' : 'linear(to-r, blue.500, blue.700)'}
              bgClip="text"
            >
              Player Cooldown List
            </Heading>
          </HStack>
          <Text color={isDark ? 'gray.400' : 'gray.600'} maxW="2xl">
            Players who recently left a team must wait until their cooldown expires before joining another team
          </Text>
        </VStack>

        <Box
          w="full"
          bg={isDark ? 'gray.900' : 'white'}
          border="1px solid"
          borderColor={isDark ? 'gray.800' : 'gray.200'}
          rounded="2xl"
          overflow="hidden"
          backdropFilter="blur(10px)"
        >
          <Table.Root size="md" variant="outline">
            <Table.Header>
              <Table.Row bg={isDark ? 'gray.850' : 'gray.50'}>
                <Table.ColumnHeader
                  fontWeight="700"
                  color={isDark ? 'gray.400' : 'gray.600'}
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Player Name
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  fontWeight="700"
                  color={isDark ? 'gray.400' : 'gray.600'}
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Previous Team
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  fontWeight="700"
                  color={isDark ? 'gray.400' : 'gray.600'}
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Status
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  fontWeight="700"
                  color={isDark ? 'gray.400' : 'gray.600'}
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Expires
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {cooldownList.map(player => (
                <Table.Row
                  key={player.id}
                  _hover={{ bg: isDark ? 'gray.800' : 'gray.50' }}
                  transition="background 0.2s"
                >
                  <Table.Cell>
                    <HStack gap="2">
                      <Users size={16} color={isDark ? 'var(--chakra-colors-blue-400)' : 'var(--chakra-colors-blue-600)'} />
                      <Text fontSize="sm" fontWeight="600" color={isDark ? 'white' : 'gray.900'}>
                        {player.name}
                      </Text>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
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
                      <Clock size={14} color={isDark ? 'var(--chakra-colors-orange-500)' : 'var(--chakra-colors-orange-600)'} />
                      <Text fontSize="sm" fontWeight="600" color={isDark ? 'orange.400' : 'orange.600'}>
                        {player.expires}
                      </Text>
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </VStack>
    </Box>
  );
};

export default CooldownSection;
