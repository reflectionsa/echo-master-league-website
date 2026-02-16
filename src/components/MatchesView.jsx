import { Box, Dialog, Portal, Table, Text, HStack, VStack, Spinner, Center, Badge, Button, CloseButton, Tabs } from '@chakra-ui/react';
import { Calendar, ExternalLink } from 'lucide-react';
import { useSchedule } from '../hooks/useSchedule';

const MatchesView = ({ theme, open, onClose }) => {
  const isDark = theme === 'dark';
  const { matches, loading } = useSchedule();

  const upcoming = matches.filter(m => m.status === 'Scheduled' || m.status === 'Live');
  const scheduled = matches.filter(m => m.status === 'Scheduled');

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="full">
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.700" backdropFilter="blur(10px)" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="90vw"
            maxH="90vh"
            bg={isDark ? 'gray.900' : 'white'}
            border="1px solid"
            borderColor={isDark ? 'gray.700' : 'gray.200'}
            rounded="2xl"
            overflow="hidden"
          >
            <Dialog.Header bg={isDark ? 'gray.850' : 'gray.50'} borderBottom="1px solid" borderColor={isDark ? 'gray.700' : 'gray.200'}>
              <HStack justify="space-between">
                <HStack gap="2">
                  <Calendar size={24} color={isDark ? 'var(--chakra-colors-orange-400)' : 'var(--chakra-colors-blue-600)'} />
                  <Dialog.Title fontSize="2xl" fontWeight="800" color={isDark ? 'white' : 'gray.900'}>
                    Match Schedule
                  </Dialog.Title>
                </HStack>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="lg" />
                </Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>
            <Dialog.Body p="6" overflowY="auto">
              {loading ? (
                <Center py="20"><Spinner size="xl" color={isDark ? 'orange.500' : 'blue.500'} /></Center>
              ) : (
                <Tabs.Root defaultValue="upcoming">
                  <Tabs.List mb="6" bg={isDark ? 'gray.850' : 'gray.100'} p="1" rounded="xl">
                    <Tabs.Trigger value="upcoming" fontWeight="600" color={isDark ? 'white' : 'gray.900'}>
                      Upcoming Matches
                    </Tabs.Trigger>
                    <Tabs.Trigger value="scheduled" fontWeight="600" color={isDark ? 'white' : 'gray.900'}>Scheduled</Tabs.Trigger>
                  </Tabs.List>

                  <Tabs.Content value="upcoming">
                    <Box overflowX="auto">
                      <Table.Root size="md" variant="outline">
                        <Table.Header bg={isDark ? 'gray.850' : 'gray.50'}>
                          <Table.Row>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={isDark ? 'gray.400' : 'gray.600'}>DATE</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={isDark ? 'gray.400' : 'gray.600'}>HOME</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={isDark ? 'gray.400' : 'gray.600'} textAlign="center">SCORE</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={isDark ? 'gray.400' : 'gray.600'}>AWAY</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={isDark ? 'gray.400' : 'gray.600'}>VOD</Table.ColumnHeader>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {upcoming.map(match => {
                            const teams = match.participatingTeams?.linkedItems || [];
                            return (
                              <Table.Row key={match.id} _hover={{ bg: isDark ? 'whiteAlpha.50' : 'gray.50' }}>
                                <Table.Cell>
                                  <VStack align="start" gap="0">
                                    <Text fontSize="sm" fontWeight="600" color={isDark ? 'white' : 'gray.900'}>
                                      {match.matchDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </Text>
                                    <Text fontSize="xs" color={isDark ? 'gray.500' : 'gray.600'}>
                                      {match.matchDate?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                  </VStack>
                                </Table.Cell>
                                <Table.Cell><Text fontWeight="600" color={isDark ? 'white' : 'gray.900'}>{teams[0]?.name || 'TBA'}</Text></Table.Cell>
                                <Table.Cell textAlign="center">
                                  {match.status === 'Live' ? (
                                    <Badge colorPalette="red" px="3" py="1" rounded="full" fontSize="xs" fontWeight="700">LIVE</Badge>
                                  ) : (
                                    <Text fontSize="sm" color={isDark ? 'gray.500' : 'gray.600'} fontWeight="700">VS</Text>
                                  )}
                                </Table.Cell>
                                <Table.Cell><Text fontWeight="600" color={isDark ? 'white' : 'gray.900'}>{teams[1]?.name || 'TBA'}</Text></Table.Cell>
                                <Table.Cell>
                                  {match.streamLink?.url ? (
                                    <Button size="xs" variant="outline" colorPalette={isDark ? 'orange' : 'blue'} onClick={() => window.open(match.streamLink.url, '_blank')}>
                                      <ExternalLink size={12} /> Watch
                                    </Button>
                                  ) : (
                                    <Text fontSize="xs" color={isDark ? 'gray.600' : 'gray.400'}>—</Text>
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
                        <Table.Header bg={isDark ? 'gray.850' : 'gray.50'}>
                          <Table.Row>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={isDark ? 'gray.400' : 'gray.600'}>SCHEDULED</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={isDark ? 'gray.400' : 'gray.600'}>HOME</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={isDark ? 'gray.400' : 'gray.600'} textAlign="center">SCORE</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={isDark ? 'gray.400' : 'gray.600'}>AWAY</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={isDark ? 'gray.400' : 'gray.600'}>VOD</Table.ColumnHeader>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {scheduled.map(match => {
                            const teams = match.participatingTeams?.linkedItems || [];
                            return (
                              <Table.Row key={match.id} _hover={{ bg: isDark ? 'whiteAlpha.50' : 'gray.50' }}>
                                <Table.Cell>
                                  <Text fontSize="sm" fontWeight="600" color={isDark ? 'white' : 'gray.900'}>
                                    {match.matchDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </Text>
                                </Table.Cell>
                                <Table.Cell><Text fontWeight="600" color={isDark ? 'white' : 'gray.900'}>{teams[0]?.name || 'TBA'}</Text></Table.Cell>
                                <Table.Cell textAlign="center">
                                  <Text fontSize="sm" color={isDark ? 'gray.500' : 'gray.600'} fontWeight="700">—</Text>
                                </Table.Cell>
                                <Table.Cell><Text fontWeight="600" color={isDark ? 'white' : 'gray.900'}>{teams[1]?.name || 'TBA'}</Text></Table.Cell>
                                <Table.Cell>
                                  <Text fontSize="xs" color={isDark ? 'gray.600' : 'gray.400'}>Upcoming</Text>
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
