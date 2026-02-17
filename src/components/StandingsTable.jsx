import { Box, HStack, VStack, Text, Badge, Table, Image } from '@chakra-ui/react';
import { Trophy } from 'lucide-react';
import { useState } from 'react';
import TeamProfileModal from './TeamProfileModal';
import { useAccessibility } from '../hooks/useAccessibility';
import { getThemedColors } from '../theme/colors';
import { getTierImage, getBaseTier } from '../utils/tierUtils';

const tierColors = {
  Master: 'yellow',
  Diamond: 'cyan',
  Platinum: 'gray',
  Gold: 'orange',
};

const StandingsTable = ({ teams, theme }) => {
  const { needsColorBlindSupport } = useAccessibility();
  const themedColors = getThemedColors(theme, needsColorBlindSupport);
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
      <Box bg={themedColors.bgSecondary} border="1px solid" borderColor={themedColors.borderMedium} rounded="2xl" overflow="hidden">
        <Box bg={themedColors.bgTertiary} px="6" py="4" borderBottom="1px solid" borderColor={themedColors.borderMedium}>
          <HStack gap="2">
            <Trophy size={20} color={themedColors.accentPurple} />
            <Text fontSize="lg" fontWeight="800" color={themedColors.textPrimary}>League Standings</Text>
          </HStack>
        </Box>

        <Table.Root size="lg" variant="outline">
          <Table.Header bg={themedColors.bgCard}>
            <Table.Row>
              <Table.ColumnHeader color={themedColors.textMuted} fontWeight="700" fontSize="xs" textTransform="uppercase">
                Rank
              </Table.ColumnHeader>
              <Table.ColumnHeader color={themedColors.textMuted} fontWeight="700" fontSize="xs" textTransform="uppercase">
                Team
              </Table.ColumnHeader>
              <Table.ColumnHeader color={themedColors.textMuted} fontWeight="700" fontSize="xs" textTransform="uppercase">
                Tier
              </Table.ColumnHeader>
              <Table.ColumnHeader color={themedColors.textMuted} fontWeight="700" fontSize="xs" textTransform="uppercase">
                Status
              </Table.ColumnHeader>
              <Table.ColumnHeader color={themedColors.textMuted} fontWeight="700" fontSize="xs" textTransform="uppercase">
                Region
              </Table.ColumnHeader>
              <Table.ColumnHeader color={themedColors.textMuted} fontWeight="700" fontSize="xs" textTransform="uppercase" textAlign="right">
                Points
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sortedTeams.map((team, index) => (
              <Table.Row
                key={team.id}
                bg={index < 3 ? `${themedColors.textPrimary}08` : 'transparent'}
                _hover={{ bg: `${themedColors.textPrimary}0c` }}
                transition="background 0.2s"
              >
                <Table.Cell>
                  <HStack gap="2">
                    {getRankIcon(index) || (
                      <Text fontSize="md" fontWeight="700" color={themedColors.textSubtle} w="18px" textAlign="center">
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
                    color={themedColors.accentPurple}
                    _hover={{ textDecoration: 'underline', color: themedColors.accentOrange }}
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
                    colorPalette={team.active === 'Yes' || team.active === 'Active' || team.active === true ? themedColors.semantic.active : themedColors.semantic.inactive}
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
                  <Text fontSize="sm" color={themedColors.textSecondary} fontWeight="600">
                    {team.region || 'NA'}
                  </Text>
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <Text fontSize="lg" fontWeight="800" color={themedColors.accentPurple}>
                    {team.leaguePoints ?? 0}
                  </Text>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        {sortedTeams.length === 0 && (
          <Box py="12" textAlign="center">
            <Text color={themedColors.textMuted}>No teams to display</Text>
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
