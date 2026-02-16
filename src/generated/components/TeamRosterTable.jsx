import { Box, Table, Badge, Text } from '@chakra-ui/react';
import { useState } from 'react';
import TeamProfileModal from './TeamProfileModal';
import PlayerProfileModal from './PlayerProfileModal';

const TeamRosterTable = ({ teams, theme }) => {
  const isDark = theme === 'dark';
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  return (
    <>
      <Box
        bg={isDark ? 'gray.900' : 'white'}
        border="1px solid"
        borderColor={isDark ? 'gray.800' : 'gray.200'}
        rounded="2xl"
        overflow="hidden"
      >
        <Table.ScrollArea maxW="full" borderRadius="2xl">
          <Table.Root size="md" variant="outline">
            <Table.Header>
              <Table.Row bg={isDark ? 'gray.800' : 'gray.50'}>
                <Table.ColumnHeader
                  minW="180px"
                  fontWeight="700"
                  color={isDark ? 'gray.400' : 'gray.600'}
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Team Name
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  minW="140px"
                  fontWeight="700"
                  color={isDark ? 'gray.400' : 'gray.600'}
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  hideBelow="md"
                >
                  Captain
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  minW="140px"
                  fontWeight="700"
                  color={isDark ? 'gray.400' : 'gray.600'}
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  hideBelow="md"
                >
                  Co-Captain
                </Table.ColumnHeader>
                {[1, 2, 3, 4].map(num => (
                  <Table.ColumnHeader
                    key={num}
                    minW="130px"
                    fontWeight="700"
                    color={isDark ? 'gray.400' : 'gray.600'}
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    hideBelow="md"
                  >
                    Player {num}
                  </Table.ColumnHeader>
                ))}
                <Table.ColumnHeader
                  minW="100px"
                  fontWeight="700"
                  color={isDark ? 'gray.400' : 'gray.600'}
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
                  bg={team.status === 'Inactive' ? (isDark ? 'gray.850' : 'gray.100') : 'transparent'}
                  _hover={{ bg: isDark ? 'gray.800' : 'gray.50' }}
                  transition="background 0.2s"
                  opacity={team.status === 'Inactive' ? 0.6 : 1}
                >
                  <Table.Cell>
                    <Text
                      as="button"
                      fontSize="sm"
                      fontWeight="700"
                      color={isDark ? 'purple.400' : 'purple.600'}
                      _hover={{ textDecoration: 'underline', color: isDark ? 'purple.300' : 'purple.700' }}
                      onClick={() => setSelectedTeam(team.name)}
                      cursor="pointer"
                    >
                      {team.name}
                    </Text>
                  </Table.Cell>
                  <Table.Cell hideBelow="md">
                    {team.captain ? (
                      <Text
                        as="button"
                        fontSize="sm"
                        color={isDark ? 'blue.400' : 'blue.600'}
                        _hover={{ textDecoration: 'underline', color: isDark ? 'blue.300' : 'blue.700' }}
                        onClick={() => setSelectedPlayer(team.captain)}
                        cursor="pointer"
                      >
                        {team.captain}
                      </Text>
                    ) : (
                      <Text fontSize="sm" color={isDark ? 'gray.500' : 'gray.400'}>—</Text>
                    )}
                  </Table.Cell>
                  <Table.Cell hideBelow="md">
                    {team.coCaptain ? (
                      <Text
                        as="button"
                        fontSize="sm"
                        color={isDark ? 'blue.400' : 'blue.600'}
                        _hover={{ textDecoration: 'underline', color: isDark ? 'blue.300' : 'blue.700' }}
                        onClick={() => setSelectedPlayer(team.coCaptain)}
                        cursor="pointer"
                      >
                        {team.coCaptain}
                      </Text>
                    ) : (
                      <Text fontSize="sm" color={isDark ? 'gray.500' : 'gray.400'}>—</Text>
                    )}
                  </Table.Cell>
                  {team.players.map((player, idx) => (
                    <Table.Cell key={idx} hideBelow="md">
                      {player ? (
                        <Text
                          as="button"
                          fontSize="sm"
                          color={isDark ? 'blue.400' : 'blue.600'}
                          _hover={{ textDecoration: 'underline', color: isDark ? 'blue.300' : 'blue.700' }}
                          onClick={() => setSelectedPlayer(player)}
                          cursor="pointer"
                        >
                          {player}
                        </Text>
                      ) : (
                        <Text fontSize="sm" color={isDark ? 'gray.500' : 'gray.400'}>—</Text>
                      )}
                    </Table.Cell>
                  ))}
                  <Table.Cell>
                    <Badge
                      colorPalette={team.status === 'Active' ? 'green' : 'red'}
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