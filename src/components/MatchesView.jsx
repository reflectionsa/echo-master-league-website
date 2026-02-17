import { Box, Dialog, Portal, Table, Text, HStack, VStack, Spinner, Center, Badge, Button, CloseButton, Tabs } from '@chakra-ui/react';
import { Calendar, ExternalLink } from 'lucide-react';
import { useSchedule } from '../hooks/useSchedule';
import { useMatchResults } from '../hooks/useMatchResults';
import { useAccessibility } from '../hooks/useAccessibility';
import { getThemedColors } from '../theme/colors';

const MatchesView = ({ theme, open, onClose }) => {
  const { needsColorBlindSupport } = useAccessibility();
  const emlColors = getThemedColors(theme, needsColorBlindSupport);
  const { matches, loading } = useSchedule();
  const { matchResults, loading: resultsLoading } = useMatchResults();

  const upcoming = matches.filter(m => m.status === 'Scheduled' || m.status === 'Live');
  const scheduled = matches.filter(m => m.status === 'Scheduled');

  // Filter match results for Week 3
  const week3Results = matchResults.filter(m => m.week && m.week.toString().includes('3'));

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="full">
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.700" backdropFilter="blur(10px)" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="90vw"
            maxH="90vh"
            bg={emlColors.bgPrimary}
            border="1px solid"
            borderColor={emlColors.borderMedium}
            rounded="2xl"
            overflow="hidden"
          >
            <Dialog.Header bg={emlColors.bgSecondary} borderBottom="1px solid" borderColor={emlColors.borderMedium}>
              <HStack justify="space-between">
                <HStack gap="2">
                  <Calendar size={24} color={emlColors.accentOrange} />
                  <Dialog.Title fontSize="2xl" fontWeight="800" color={emlColors.textPrimary}>
                    Match Schedule
                  </Dialog.Title>
                </HStack>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="lg" />
                </Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>
            <Dialog.Body p="6" overflowY="auto">
              {loading || resultsLoading ? (
                <Center py="20"><Spinner size="xl" color={emlColors.accentOrange} /></Center>
              ) : (
                <Tabs.Root defaultValue="results">
                  <Tabs.List mb="6" bg={emlColors.bgTertiary} p="1" rounded="xl">
                    <Tabs.Trigger value="results" fontWeight="600" color={emlColors.textPrimary}>
                      Match Results (Week 3)
                    </Tabs.Trigger>
                    <Tabs.Trigger value="upcoming" fontWeight="600" color={emlColors.textPrimary}>
                      Upcoming Matches
                    </Tabs.Trigger>
                    <Tabs.Trigger value="scheduled" fontWeight="600" color={emlColors.textPrimary}>Scheduled</Tabs.Trigger>
                  </Tabs.List>

                  {/* Match Results Tab */}
                  <Tabs.Content value="results">
                    <Box overflowX="auto">
                      <Table.Root size="md" variant="outline">
                        <Table.Header bg={emlColors.bgTertiary}>
                          <Table.Row>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted}>WEEK</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted}>TEAM 1</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted} textAlign="center">SCORE</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted}>TEAM 2</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted}>DATE</Table.ColumnHeader>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {week3Results.map(match => (
                            <Table.Row key={match.id} _hover={{ bg: `${emlColors.textPrimary}08` }}>
                              <Table.Cell>
                                <Badge colorPalette="purple" size="sm">{match.week}</Badge>
                              </Table.Cell>
                              <Table.Cell>
                                <Text fontWeight="600" color={emlColors.textPrimary} textTransform="uppercase">{match.team1}</Text>
                              </Table.Cell>
                              <Table.Cell textAlign="center">
                                <HStack justify="center" gap="2">
                                  <Text
                                    fontSize="md"
                                    fontWeight="800"
                                    color={match.team1Won ? emlColors.semantic.win : emlColors.semantic.loss}
                                  >
                                    {match.team1Score}
                                  </Text>
                                  <Text fontSize="sm" color={emlColors.textMuted} fontWeight="700">-</Text>
                                  <Text
                                    fontSize="md"
                                    fontWeight="800"
                                    color={match.team2Won ? emlColors.semantic.win : emlColors.semantic.loss}
                                  >
                                    {match.team2Score}
                                  </Text>
                                </HStack>
                                {match.isForfeit && (
                                  <Badge colorPalette="yellow" size="xs" mt="1">FORFEIT</Badge>
                                )}
                              </Table.Cell>
                              <Table.Cell>
                                <Text fontWeight="600" color={emlColors.textPrimary} textTransform="uppercase">{match.team2}</Text>
                              </Table.Cell>
                              <Table.Cell>
                                <Text fontSize="sm" color={emlColors.textMuted}>{match.matchDate}</Text>
                              </Table.Cell>
                            </Table.Row>
                          ))}
                          {week3Results.length === 0 && (
                            <Table.Row>
                              <Table.Cell colSpan={5}>
                                <Center py="8">
                                  <Text color={emlColors.textMuted}>No match results available yet</Text>
                                </Center>
                              </Table.Cell>
                            </Table.Row>
                          )}
                        </Table.Body>
                      </Table.Root>
                    </Box>
                  </Tabs.Content>

                  <Tabs.Content value="upcoming">
                    <Box overflowX="auto">
                      <Table.Root size="md" variant="outline">
                        <Table.Header bg={emlColors.bgTertiary}>
                          <Table.Row>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted}>DATE</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted}>HOME</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted} textAlign="center">SCORE</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted}>AWAY</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted}>VOD</Table.ColumnHeader>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {upcoming.map(match => {
                            const teams = match.participatingTeams?.linkedItems || [];
                            return (
                              <Table.Row key={match.id} _hover={{ bg: `${emlColors.textPrimary}08` }}>
                                <Table.Cell>
                                  <VStack align="start" gap="0">
                                    <Text fontSize="sm" fontWeight="600" color={emlColors.textPrimary}>
                                      {match.matchDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </Text>
                                    <Text fontSize="xs" color={emlColors.textMuted}>
                                      {match.matchDate?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                  </VStack>
                                </Table.Cell>
                                <Table.Cell><Text fontWeight="600" color={emlColors.textPrimary}>{teams[0]?.name || 'TBA'}</Text></Table.Cell>
                                <Table.Cell textAlign="center">
                                  {match.status === 'Live' ? (
                                    <Badge colorPalette="red" px="3" py="1" rounded="full" fontSize="xs" fontWeight="700">LIVE</Badge>
                                  ) : (
                                    <Text fontSize="sm" color={emlColors.textMuted} fontWeight="700">VS</Text>
                                  )}
                                </Table.Cell>
                                <Table.Cell><Text fontWeight="600" color={emlColors.textPrimary}>{teams[1]?.name || 'TBA'}</Text></Table.Cell>
                                <Table.Cell>
                                  {match.streamLink?.url ? (
                                    <Button size="xs" variant="outline" colorPalette="orange" onClick={() => window.open(match.streamLink.url, '_blank')}>
                                      <ExternalLink size={12} /> Watch
                                    </Button>
                                  ) : (
                                    <Text fontSize="xs" color={emlColors.textSubtle}>—</Text>
                                  )}
                                </Table.Cell>
                              </Table.Row>
                            );
                          })}
                        </Table.Body>
                      </Table.Root>
                    </Box>
                  </Tabs.Content>

                  <Tabs.Content value="scheduled">
                    <Box overflowX="auto">
                      <Table.Root size="md" variant="outline">
                        <Table.Header bg={emlColors.bgSecondary}>
                          <Table.Row>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted}>SCHEDULED</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted}>HOME</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted} textAlign="center">SCORE</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted}>AWAY</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted}>VOD</Table.ColumnHeader>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {scheduled.map(match => {
                            const teams = match.participatingTeams?.linkedItems || [];
                            return (
                              <Table.Row key={match.id} _hover={{ bg: emlColors.bgElevated }}>
                                <Table.Cell>
                                  <Text fontSize="sm" fontWeight="600" color={emlColors.textPrimary}>
                                    {match.matchDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </Text>
                                </Table.Cell>
                                <Table.Cell><Text fontWeight="600" color={emlColors.textPrimary}>{teams[0]?.name || 'TBA'}</Text></Table.Cell>
                                <Table.Cell textAlign="center">
                                  <Text fontSize="sm" color={emlColors.textMuted} fontWeight="700">—</Text>
                                </Table.Cell>
                                <Table.Cell><Text fontWeight="600" color={emlColors.textPrimary}>{teams[1]?.name || 'TBA'}</Text></Table.Cell>
                                <Table.Cell>
                                  <Text fontSize="xs" color={emlColors.textMuted}>Upcoming</Text>
                                </Table.Cell>
                              </Table.Row>
                            );
                          })}
                        </Table.Body>
                      </Table.Root>
                    </Box>
                  </Tabs.Content>
                </Tabs.Root>
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default MatchesView;
