import { Box, Table, Badge, Text } from '@chakra-ui/react';
import { useState } from 'react';
import TeamProfileModal from './TeamProfileModal';
import PlayerProfileModal from './PlayerProfileModal';
import { useAccessibility } from '../hooks/useAccessibility';
import { getThemedColors } from '../theme/colors';

const TeamRosterTable = ({ teams, theme }) => {
  const { needsColorBlindSupport } = useAccessibility();
  const themedColors = getThemedColors(theme, needsColorBlindSupport);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Pad players array to exactly 4 slots to match header columns
  const padPlayers = (players) => {
    const padded = [...(players || [])];
    while (padded.length < 4) padded.push(null);
    return padded.slice(0, 4);
  };

  return (
    <>
      <Box
        bg={themedColors.bgSecondary}
        border="1px solid"
        borderColor={themedColors.borderMedium}
        rounded="2xl"
        overflow="hidden"
      >
        <Table.ScrollArea maxW="full" borderRadius="2xl">
          <Table.Root size="md" variant="outline">
            <Table.Header>
              <Table.Row bg={themedColors.bgTertiary}>
                <Table.ColumnHeader
                  minW="180px"
                  fontWeight="700"
                  color={themedColors.textMuted}
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Team Name
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  minW="140px"
                  fontWeight="700"
                  color={themedColors.textMuted}
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  display={{ base: 'none', md: 'table-cell' }}
                >
                  Captain
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  minW="140px"
                  fontWeight="700"
                  color={themedColors.textMuted}
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  display={{ base: 'none', md: 'table-cell' }}
                >
                  Co-Captain
                </Table.ColumnHeader>
                {[1, 2, 3, 4].map(num => (
                  <Table.ColumnHeader
                    key={num}
                    minW="130px"
                    fontWeight="700"
                    color={themedColors.textMuted}
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    display={{ base: 'none', md: 'table-cell' }}
                  >
                    Player {num}
                  </Table.ColumnHeader>
                ))}
                <Table.ColumnHeader
                  minW="100px"
                  fontWeight="700"
                  color={themedColors.textMuted}
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Status
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {teams.map(team => (
                <Table.Row
                  key={team.id}
                  bg={team.status === 'Inactive' ? `${themedColors.bgElevated}80` : 'transparent'}
                  _hover={{ bg: themedColors.bgHover }}
                  transition="background 0.2s"
                  opacity={team.status === 'Inactive' ? 0.6 : 1}
                >
                  <Table.Cell>
                    <Text
                      as="button"
                      fontSize="sm"
                      fontWeight="700"
                      color={themedColors.accentPurple}
                      _hover={{ textDecoration: 'underline' }}
                      onClick={() => setSelectedTeam(team.name)}
                      cursor="pointer"
                    >
                      {team.name}
                    </Text>
                  </Table.Cell>
                  <Table.Cell display={{ base: 'none', md: 'table-cell' }}>
                    {team.captain ? (
                      <Text
                        as="button"
                        fontSize="sm"
                        color={themedColors.accentBlue}
                        textTransform="uppercase"
                        _hover={{ textDecoration: 'underline' }}
                        onClick={() => setSelectedPlayer(team.captain)}
                        cursor="pointer"
                      >
                        {team.captain}
                      </Text>
                    ) : (
                      <Text fontSize="sm" color={themedColors.textSubtle}>—</Text>
                    )}
                  </Table.Cell>
                  <Table.Cell display={{ base: 'none', md: 'table-cell' }}>
                    {team.coCaptain ? (
                      <Text
                        as="button"
                        fontSize="sm"
                        color={themedColors.accentBlue}
                        textTransform="uppercase"
                        _hover={{ textDecoration: 'underline' }}
                        onClick={() => setSelectedPlayer(team.coCaptain)}
                        cursor="pointer"
                      >
                        {team.coCaptain}
                      </Text>
                    ) : (
                      <Text fontSize="sm" color={themedColors.textSubtle}>—</Text>
                    )}
                  </Table.Cell>
                  {padPlayers(team.players).map((player, idx) => (
                    <Table.Cell key={idx} display={{ base: 'none', md: 'table-cell' }}>
                      {player ? (
                        <Text
                          as="button"
                          fontSize="sm"
                          color={themedColors.accentBlue}
                          textTransform="uppercase"
                          _hover={{ textDecoration: 'underline' }}
                          onClick={() => setSelectedPlayer(player)}
                          cursor="pointer"
                        >
                          {player}
                        </Text>
                      ) : (
                        <Text fontSize="sm" color={themedColors.textSubtle}>—</Text>
                      )}
                    </Table.Cell>
                  ))}
                  <Table.Cell>
                    <Badge
                      colorPalette={team.status === 'Active' ? themedColors.semantic.active : themedColors.semantic.inactive}
                      px="2.5"
                      py="1"
                      rounded="full"
                      fontSize="xs"
                      fontWeight="700"
                    >
                      {team.status}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Box>

      <TeamProfileModal
        open={!!selectedTeam}
        onClose={() => setSelectedTeam(null)}
        teamName={selectedTeam}
        theme={theme}
      />

      <PlayerProfileModal
        open={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        playerName={selectedPlayer}
        theme={theme}
      />
    </>
  );
};

export default TeamRosterTable;