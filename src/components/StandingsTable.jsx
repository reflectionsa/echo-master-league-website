import { Box, HStack, VStack, Text, Badge, Table, Image } from '@chakra-ui/react';
import { Trophy, TrendingUp, Minus, TrendingDown } from 'lucide-react';
import { useState } from 'react';
import TeamProfileModal from './TeamProfileModal';
import { emlColors } from '../theme/colors';
import { getTierImage, getBaseTier } from '../utils/tierUtils';

const tierColors = {
  Master: 'yellow',
  Diamond: 'cyan',
  Platinum: 'gray',
  Gold: 'orange',
};

const StandingsTable = ({ teams, theme }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const sortedTeams = [...teams].sort((a, b) => (b.leaguePoints ?? 0) - (a.leaguePoints ?? 0));

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy size={18} color="#fbbf24" />;
    if (index === 1) return <Trophy size={18} color="#d1d5db" />;
    if (index === 2) return <Trophy size={18} color="#cd7f32" />;
    return null;
  };

  return (
    <>
      <Box bg={emlColors.bgSecondary} border="1px solid" borderColor={emlColors.borderMedium} rounded="2xl" overflow="hidden">
        <Box bg={emlColors.bgTertiary} px="6" py="4" borderBottom="1px solid" borderColor={emlColors.borderMedium}>
          <HStack gap="2">
            <Trophy size={20} color={emlColors.accentPurple} />
            <Text fontSize="lg" fontWeight="800" color={emlColors.textPrimary}>League Standings</Text>
          </HStack>
        </Box>

        <Table.Root size="lg" variant="outline">
          <Table.Header bg={emlColors.bgCard}>
            <Table.Row>
              <Table.ColumnHeader color={emlColors.textMuted} fontWeight="700" fontSize="xs" textTransform="uppercase">
                Rank
              </Table.ColumnHeader>
              <Table.ColumnHeader color={emlColors.textMuted} fontWeight="700" fontSize="xs" textTransform="uppercase">
                Team
              </Table.ColumnHeader>
              <Table.ColumnHeader color={emlColors.textMuted} fontWeight="700" fontSize="xs" textTransform="uppercase">
                Tier
              </Table.ColumnHeader>
              <Table.ColumnHeader color={emlColors.textMuted} fontWeight="700" fontSize="xs" textTransform="uppercase">
                Status
              </Table.ColumnHeader>
              <Table.ColumnHeader color={emlColors.textMuted} fontWeight="700" fontSize="xs" textTransform="uppercase">
                Region
              </Table.ColumnHeader>
              <Table.ColumnHeader color={emlColors.textMuted} fontWeight="700" fontSize="xs" textTransform="uppercase" textAlign="right">
                Points
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sortedTeams.map((team, index) => (
              <Table.Row
                key={team.id}
                bg={index < 3 ? `${emlColors.textPrimary}08` : 'transparent'}
                _hover={{ bg: `${emlColors.textPrimary}0c` }}
                transition="background 0.2s"
              >
                <Table.Cell>
                  <HStack gap="2">
                    {getRankIcon(index) || (
                      <Text fontSize="md" fontWeight="700" color={emlColors.textSubtle} w="18px" textAlign="center">
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
                    color={emlColors.accentPurple}
                    _hover={{ textDecoration: 'underline', color: emlColors.accentOrange }}
                    onClick={() => setSelectedTeam(team.name)}
                    cursor="pointer"
                  >
                    {team.name}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  {getTierImage(team.tier) ? (
                    <Image src={getTierImage(team.tier)} alt={team.tier} w="32px" h="32px" minW="32px" minH="32px" />
                  ) : (
                    <Badge
                      colorPalette={tierColors[getBaseTier(team.tier)] || 'gray'}
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
                <Table.Cell>
                  <Badge
                    colorPalette={team.active === 'Yes' || team.active === 'Active' || team.active === true ? 'green' : 'red'}
                    px="2.5"
                    py="1"
                    rounded="full"
                    fontSize="xs"
                    fontWeight="700"
                  >
                    {team.active === 'Yes' || team.active === 'Active' || team.active === true ? 'Active' : 'Inactive'}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Text fontSize="sm" color={emlColors.textSecondary} fontWeight="600">
                    {team.region || 'NA'}
                  </Text>
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <Text fontSize="lg" fontWeight="800" color={emlColors.accentPurple}>
                    {team.leaguePoints ?? 0}
                  </Text>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        {sortedTeams.length === 0 && (
          <Box py="12" textAlign="center">
            <Text color={emlColors.textMuted}>No teams to display</Text>
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
