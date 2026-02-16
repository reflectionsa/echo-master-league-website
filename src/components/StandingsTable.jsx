import { Box, HStack, VStack, Text, Badge, Table, Image } from '@chakra-ui/react';
import { Trophy, TrendingUp, Minus, TrendingDown } from 'lucide-react';
import { useState } from 'react';
import TeamProfileModal from './TeamProfileModal';

const tierColors = {
  Master: 'yellow',
  Diamond: 'cyan',
  Platinum: 'gray',
  Gold: 'orange',
};

const tierImages = {
  Master: 'https://cdn.discordapp.com/emojis/1429992743207309462.webp?size=80',
  Diamond: 'https://cdn.discordapp.com/emojis/1429992740942385152.webp?size=80',
  Platinum: 'https://cdn.discordapp.com/attachments/1460754809064784014/1472871797820096555/content.png?ex=69942641&is=6992d4c1&hm=a4f6ec61690c89480c7235cf454f0ea37d325d40606b93da2b3867c304a59b4c&',
  Gold: 'https://cdn.discordapp.com/attachments/1460754809064784014/1472872310464712775/width240.png?ex=699426bb&is=6992d53b&hm=4e35d0dcaa7ab0d3df98faadaafe3c82b433bebe6456dc44ddd5860c6bd9b1dd&animated=true',
};

const StandingsTable = ({ teams, theme }) => {
  const isDark = theme === 'dark';
  const [selectedTeam, setSelectedTeam] = useState(null);
  const sortedTeams = [...teams].sort((a, b) => (b.leaguePoints ?? 0) - (a.leaguePoints ?? 0));

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy size={18} color="var(--chakra-colors-yellow-400)" />;
    if (index === 1) return <Trophy size={18} color="var(--chakra-colors-gray-400)" />;
    if (index === 2) return <Trophy size={18} color="var(--chakra-colors-orange-600)" />;
    return null;
  };

  return (
    <>
      <Box bg="gray.900" border="1px solid" borderColor="gray.800" rounded="2xl" overflow="hidden">
      <Box bg="purple.900" px="6" py="4" borderBottom="1px solid" borderColor="purple.800">
        <HStack gap="2">
          <Trophy size={20} color="var(--chakra-colors-purple-300)" />
          <Text fontSize="lg" fontWeight="800" color="white">League Standings</Text>
        </HStack>
      </Box>

      <Table.Root size="lg" variant="outline">
        <Table.Header bg="gray.800">
          <Table.Row>
            <Table.ColumnHeader color="gray.400" fontWeight="700" fontSize="xs" textTransform="uppercase">
              Rank
            </Table.ColumnHeader>
            <Table.ColumnHeader color="gray.400" fontWeight="700" fontSize="xs" textTransform="uppercase">
              Team
            </Table.ColumnHeader>
            <Table.ColumnHeader color="gray.400" fontWeight="700" fontSize="xs" textTransform="uppercase">
              Tier
            </Table.ColumnHeader>
            <Table.ColumnHeader color="gray.400" fontWeight="700" fontSize="xs" textTransform="uppercase" textAlign="right">
              Points
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedTeams.map((team, index) => (
            <Table.Row
              key={team.id}
              bg={index < 3 ? 'gray.850' : 'transparent'}
              _hover={{ bg: 'gray.800' }}
              transition="background 0.2s"
            >
              <Table.Cell>
                <HStack gap="2">
                  {getRankIcon(index) || (
                    <Text fontSize="md" fontWeight="700" color="gray.500" w="18px" textAlign="center">
                      {index + 1}
                    </Text>
                  )}
                </HStack>
              </Table.Cell>
              <Table.Cell>
                <Text
                  as="button"
                  fontSize="md"
                  fontWeight="700"
                  color="purple.400"
                  _hover={{ textDecoration: 'underline', color: 'purple.300' }}
                  onClick={() => setSelectedTeam(team.name)}
                  cursor="pointer"
                >
                  {team.name}
                </Text>
              </Table.Cell>
              <Table.Cell>
                {tierImages[team.tier] ? (
                  <Image src={tierImages[team.tier]} alt={team.tier} w="32px" h="32px" objectFit="contain" />
                ) : (
                  <Badge
                    colorPalette={tierColors[team.tier] || 'gray'}
                    px="2.5"
                    py="1"
                    rounded="full"
                    fontSize="xs"
                    fontWeight="700"
                  >
                    {team.tier}
                  </Badge>
                )}
              </Table.Cell>
              <Table.Cell textAlign="right">
                <Text fontSize="lg" fontWeight="800" color="purple.400">
                  {team.leaguePoints ?? 0}
                </Text>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {sortedTeams.length === 0 && (
        <Box py="12" textAlign="center">
          <Text color="gray.500">No teams to display</Text>
        </Box>
      )}
    </Box>

    <TeamProfileModal
      open={!!selectedTeam}
      onClose={() => setSelectedTeam(null)}
      teamName={selectedTeam}
      theme={theme}
    />
  </>);
};

export default StandingsTable;
