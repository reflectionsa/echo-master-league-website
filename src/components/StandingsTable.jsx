import { Box, HStack, VStack, Text, Badge, Table, Image } from '@chakra-ui/react';
import { Trophy, TrendingUp, Minus, TrendingDown } from 'lucide-react';
import { useState } from 'react';
import TeamProfileModal from './TeamProfileModal';
import { emlColors } from '../theme/colors';

const tierColors = {
  Master: 'yellow',
  Diamond: 'cyan',
  Platinum: 'gray',
  Gold: 'orange',
};

const tierImages = {
  Master: 'https://media.discordapp.net/attachments/1241825775414677536/1473148628246986773/Untitled_design.png?ex=69952812&is=6993d692&hm=cb884e6b000e496a4fd0f5d2dd2ae10745cb2f05165b23616bed6b3a16c00ac2&animated=true',
  Diamond: 'https://media.discordapp.net/attachments/1241825775414677536/1473148627722440832/47d4a6da-edc5-4199-839b-57d41a7528f2.png?ex=69952812&is=6993d692&hm=637e229972387e1c434b33e87755dd754eb72ffbd185568eb2016a57bfa6c265&animated=true',
  Platinum: 'https://media.discordapp.net/attachments/1241825775414677536/1473148627236028509/platniumtriangle.eml.png?ex=69952812&is=6993d692&hm=bba6b394c750debadb3619aeddcd88c8859917d28be07ff93fa9a5f5cc2a18c6&animated=true',
  Gold: 'https://media.discordapp.net/attachments/1241825775414677536/1473148626732585162/goldtriangle.eml.png?ex=69952812&is=6993d692&hm=47765da999614de2be3329c65f73b51b190b9bfae82f685a591087225c0f8653&animated=true',
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
