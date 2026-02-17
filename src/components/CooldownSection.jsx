import { Box, VStack, Heading, Text, Table, Badge, HStack } from '@chakra-ui/react';
import { Clock, Users } from 'lucide-react';
import { teamRosters } from '../data/teamRosters';
import { emlColors } from '../theme/colors';

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
  const cooldownList = generateCooldownList();

  return (
    <Box
      as="section"
      id="cooldown"
      py="20"
      bg={emlColors.bgPrimary}
      minH="100vh"
    >
      <VStack maxW="6xl" mx="auto" px="6" gap="8">
        <VStack gap="3" textAlign="center">
          <HStack gap="2" color={emlColors.accentOrange}>
            <Clock size={24} />
            <Heading
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="800"
              bgGradient={`linear(to-r, ${emlColors.accentOrange}, ${emlColors.accentRose})`}
              bgClip="text"
            >
              Player Cooldown List
            </Heading>
          </HStack>
          <Text color={emlColors.textMuted} maxW="2xl">
            Players who recently left a team must wait until their cooldown expires before joining another team
          </Text>
        </VStack>

        <Box
          w="full"
          bg={emlColors.bgSecondary}
          border="1px solid"
          borderColor={emlColors.borderMedium}
          rounded="2xl"
          overflow="hidden"
          backdropFilter="blur(10px)"
        >
          <Table.Root size="md" variant="outline">
            <Table.Header>
              <Table.Row bg={`${emlColors.bgElevated}80`}>
                <Table.ColumnHeader
                  fontWeight="700"
                  color={emlColors.textMuted}
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Player Name
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  fontWeight="700"
                  color={emlColors.textMuted}
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Previous Team
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  fontWeight="700"
                  color={emlColors.textMuted}
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Status
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  fontWeight="700"
                  color={emlColors.textMuted}
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
                  _hover={{ bg: `${emlColors.bgElevated}99` }}
                  transition="background 0.2s"
                >
                  <Table.Cell>
                    <HStack gap="2">
                      <Users size={16} color={emlColors.accentBlue} />
                      <Text fontSize="sm" fontWeight="600" color={emlColors.textPrimary}>
                        {player.name}
                      </Text>
                    </HStack>
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
