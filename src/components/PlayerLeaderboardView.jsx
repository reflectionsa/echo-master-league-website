import { Box, Dialog, Portal, Table, Text, HStack, Spinner, Center, Badge, CloseButton, Input, InputGroup, For, Switch } from '@chakra-ui/react';
import { TrendingUp, Search, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { usePlayerLeaderboard } from '../hooks/usePlayerLeaderboard';
import { useAccessibility } from '../hooks/useAccessibility';
import PlayerProfileModal from './PlayerProfileModal';
import { getThemedColors } from '../theme/colors';

const PlayerLeaderboardView = ({ theme, open, onClose }) => {
  const { needsColorBlindSupport } = useAccessibility();
  const emlColors = getThemedColors(theme, needsColorBlindSupport);
  const { players, loading, error } = usePlayerLeaderboard();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('winRate'); // winRate, goals, assists, saves, mvps
  const [sortDesc, setSortDesc] = useState(true);
  const [visible, setVisible] = useState(true); // Visibility toggle for end-of-season

  const filtered = players.filter(player =>
    player.playerName.toLowerCase().includes(search.toLowerCase()) ||
    player.team.toLowerCase().includes(search.toLowerCase())
  );

  // Sort players based on selected metric
  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    return sortDesc ? bVal - aVal : aVal - bVal;
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(column);
      setSortDesc(true);
    }
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="full">
        <Portal>
          <Dialog.Backdrop bg={`${emlColors.bgPrimary}b3`} backdropFilter="blur(10px)" />
          <Dialog.Positioner>
            <Dialog.Content
              maxW="90vw"
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
                    <TrendingUp size={24} color={emlColors.accentCyan} />
                    <Dialog.Title fontSize="2xl" fontWeight="800" color={emlColors.textPrimary}>
                      Player Leaderboard
                    </Dialog.Title>
                  </HStack>
                  <HStack gap="4">
                    {/* Admin visibility toggle - can be hidden until finals/end-of-season */}
                    <HStack gap="2">
                      {visible ? <Eye size={18} color={emlColors.textMuted} /> : <EyeOff size={18} color={emlColors.textMuted} />}
                      <Text fontSize="sm" color={emlColors.textMuted}>Public</Text>
                      <Switch
                        checked={visible}
                        onCheckedChange={(e) => setVisible(e.checked)}
                        colorPalette="cyan"
                      />
                    </HStack>
                    <Dialog.CloseTrigger asChild>
                      <CloseButton size="lg" />
                    </Dialog.CloseTrigger>
                  </HStack>
                </HStack>
              </Dialog.Header>
              <Dialog.Body p="6" overflowY="auto">
                {!visible ? (
                  <Center py="20">
                    <Box textAlign="center">
                      <EyeOff size={48} color={emlColors.textMuted} style={{ margin: '0 auto 16px' }} />
                      <Text color={emlColors.textPrimary} fontSize="xl" fontWeight="700" mb="2">
                        Leaderboard Hidden
                      </Text>
                      <Text color={emlColors.textMuted} fontSize="sm">
                        Player leaderboard will be visible after finals / end of season
                      </Text>
                    </Box>
                  </Center>
                ) : (
                  <>
                    <Box mb="4">
                      <InputGroup startElement={<Search size={16} />}>
                        <Input
                          placeholder="Search players or teams..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          bg={emlColors.bgTertiary}
                          borderColor={emlColors.borderMedium}
                          color={emlColors.textPrimary}
                        />
                      </InputGroup>
                    </Box>

                    {loading ? (
                      <Center py="20"><Spinner size="xl" color={emlColors.accentCyan} /></Center>
                    ) : error ? (
                      <Center py="20">
                        <Box textAlign="center">
                          <Text color={emlColors.semantic.error} fontSize="lg" fontWeight="600" mb="2">
                            Error loading player statistics
                          </Text>
                          <Text color={emlColors.textMuted} fontSize="sm">
                            {error}
                          </Text>
                          <Text color={emlColors.textMuted} fontSize="xs" mt="4">
                            Check that the "Player Stats" sheet exists in Google Sheets
                          </Text>
                        </Box>
                      </Center>
                    ) : sorted.length === 0 ? (
                      <Center py="20">
                        <Text color={emlColors.textMuted}>
                          {search ? 'No players match your search' : 'No player statistics available'}
                        </Text>
                      </Center>
                    ) : (
                      <>
                        <Text fontSize="xs" color={emlColors.textMuted} mb="3" textAlign="center">
                          ⚠️ Stats may be inflated due to team aggregation • Click column headers to sort
                        </Text>
                        <Box overflowX="auto">
                          <Table.Root size="sm" variant="outline">
                            <Table.Header bg={emlColors.bgTertiary}>
                              <Table.Row>
                                <Table.ColumnHeader fontSize="xs" fontWeight="600" color={emlColors.textMuted} textTransform="uppercase">RANK</Table.ColumnHeader>
                                <Table.ColumnHeader fontSize="xs" fontWeight="600" color={emlColors.textMuted} textTransform="uppercase">PLAYER</Table.ColumnHeader>
                                <Table.ColumnHeader fontSize="xs" fontWeight="600" color={emlColors.textMuted} textTransform="uppercase">TEAM</Table.ColumnHeader>
                                <Table.ColumnHeader 
                                  fontSize="xs" 
                                  fontWeight="600" 
                                  color={sortBy === 'winRate' ? emlColors.accentCyan : emlColors.textMuted} 
                                  textTransform="uppercase" 
                                  textAlign="center"
                                  cursor="pointer"
                                  onClick={() => handleSort('winRate')}
                                >
                                  WIN%
                                </Table.ColumnHeader>
                                <Table.ColumnHeader 
                                  fontSize="xs" 
                                  fontWeight="600" 
                                  color={sortBy === 'goals' ? emlColors.accentCyan : emlColors.textMuted} 
                                  textTransform="uppercase" 
                                  textAlign="center"
                                  cursor="pointer"
                                  onClick={() => handleSort('goals')}
                                >
                                  GOALS
                                </Table.ColumnHeader>
                                <Table.ColumnHeader 
                                  fontSize="xs" 
                                  fontWeight="600" 
                                  color={sortBy === 'assists' ? emlColors.accentCyan : emlColors.textMuted} 
                                  textTransform="uppercase" 
                                  textAlign="center"
                                  cursor="pointer"
                                  onClick={() => handleSort('assists')}
                                >
                                  ASSISTS
                                </Table.ColumnHeader>
                                <Table.ColumnHeader 
                                  fontSize="xs" 
                                  fontWeight="600" 
                                  color={sortBy === 'saves' ? emlColors.accentCyan : emlColors.textMuted} 
                                  textTransform="uppercase" 
                                  textAlign="center"
                                  cursor="pointer"
                                  onClick={() => handleSort('saves')}
                                >
                                  SAVES
                                </Table.ColumnHeader>
                                <Table.ColumnHeader 
                                  fontSize="xs" 
                                  fontWeight="600" 
                                  color={sortBy === 'mvps' ? emlColors.accentCyan : emlColors.textMuted} 
                                  textTransform="uppercase" 
                                  textAlign="center"
                                  cursor="pointer"
                                  onClick={() => handleSort('mvps')}
                                >
                                  MVP
                                </Table.ColumnHeader>
                                <Table.ColumnHeader fontSize="xs" fontWeight="600" color={emlColors.textMuted} textTransform="uppercase" textAlign="center">GP</Table.ColumnHeader>
                              </Table.Row>
                            </Table.Header>
                            <Table.Body>
                              <For each={sorted}>
                                {(player, index) => (
                                  <Table.Row
                                    key={player.id}
                                    bg={index() < 3 ? `${emlColors.textPrimary}0c` : 'transparent'}
                                    _hover={{ bg: `${emlColors.textPrimary}14` }}
                                    transition="background 0.2s"
                                  >
                                    <Table.Cell>
                                      <Text fontWeight="700" color={emlColors.textPrimary}>#{index() + 1}</Table.Cell>
                                    </Table.Cell>
                                    <Table.Cell>
                                      <Text
                                        fontWeight="600"
                                        color={emlColors.accentCyan}
                                        cursor="pointer"
                                        _hover={{ textDecoration: 'underline' }}
                                        onClick={() => setSelectedPlayer(player.playerName)}
                                      >
                                        {player.playerName}
                                      </Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                      <Text fontSize="sm" color={emlColors.textMuted}>{player.team}</Text>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                      <Badge 
                                        colorPalette={player.winRate >= 60 ? "green" : player.winRate >= 40 ? "yellow" : "red"}
                                        size="sm"
                                      >
                                        {player.winRate.toFixed(0)}%
                                      </Badge>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                      <Text fontWeight="600" color={emlColors.textPrimary}>{player.goals}</Text>
                                      <Text fontSize="xs" color={emlColors.textMuted}>({player.goalsPerGame.toFixed(1)}/g)</Text>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                      <Text fontWeight="600" color={emlColors.textPrimary}>{player.assists}</Text>
                                      <Text fontSize="xs" color={emlColors.textMuted}>({player.assistsPerGame.toFixed(1)}/g)</Text>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                      <Text fontWeight="600" color={emlColors.textPrimary}>{player.saves}</Text>
                                      <Text fontSize="xs" color={emlColors.textMuted}>({player.savesPerGame.toFixed(1)}/g)</Text>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                      <Text fontWeight="700" fontSize="lg" color={emlColors.accentOrange}>{player.mvps}</Text>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                      <Text color={emlColors.textMuted}>{player.gamesPlayed}</Text>
                                    </Table.Cell>
                                  </Table.Row>
                                )}
                              </For>
                            </Table.Body>
                          </Table.Root>
                        </Box>
                      </>
                    )}
                  </>
                )}
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

export default PlayerLeaderboardView;
