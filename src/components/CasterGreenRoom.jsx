import { Dialog, Portal, Box, VStack, HStack, Text, CloseButton, Badge, Center, Spinner, Button } from '@chakra-ui/react';
import { Radio, ExternalLink, Play, Clock, Tv } from 'lucide-react';
import { getThemedColors } from '../theme/colors';
import { useSchedule } from '../hooks/useSchedule';
import { useAuth } from '../hooks/useAuth';

const READY_STATUSES = ['Scheduled', 'Live', 'In Progress'];

const CasterGreenRoom = ({ open, onClose, theme }) => {
  const colors = getThemedColors(theme);
  const { matches, loading } = useSchedule();
  const { user, isLoggedIn, isCaster } = useAuth();

  // Matches that are "ready to cast" — scheduled for today or live
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  const readyMatches = (matches || []).filter(m => {
    const isToday = m.matchDate && m.matchDate >= todayStart && m.matchDate < todayEnd;
    const isLive = m.status === 'Live' || m.status === 'In Progress';
    return isLive || isToday;
  });

  const liveMatches = readyMatches.filter(m => m.status === 'Live' || m.status === 'In Progress');
  const upcomingToday = readyMatches.filter(m => m.status !== 'Live' && m.status !== 'In Progress');

  const getStatusDot = (status) => {
    if (status === 'Live' || status === 'In Progress') return '#ef4444';
    return '#22c55e';
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="lg">
      <Portal>
        <Dialog.Backdrop bg="rgba(0,0,0,0.85)" backdropFilter="blur(12px)" />
        <Dialog.Positioner>
          <Dialog.Content
            bg="#0d0d0d"
            border="1px solid rgba(0,191,255,0.25)"
            rounded="2xl"
            maxH="90vh"
            boxShadow="0 0 60px rgba(0,191,255,0.12)"
          >
            <Dialog.Header bg="#111111" borderBottom="1px solid rgba(255,255,255,0.08)" px="6" py="4">
              <HStack justify="space-between">
                <HStack gap="3">
                  <Box bg="rgba(0,191,255,0.12)" border="1px solid rgba(0,191,255,0.3)" p="2" rounded="lg">
                    <Tv size={20} color="#00bfff" />
                  </Box>
                  <VStack align="start" gap="0">
                    <Dialog.Title fontSize="lg" fontWeight="800" color={colors.textPrimary}>
                      Caster Green Room
                    </Dialog.Title>
                    <Text fontSize="xs" color="#00bfff" fontWeight="600">
                      Matches ready to cast today
                    </Text>
                  </VStack>
                </HStack>
                <HStack gap="2">
                  {liveMatches.length > 0 && (
                    <HStack gap="1.5" bg="rgba(239,68,68,0.12)" border="1px solid rgba(239,68,68,0.35)" px="3" py="1" rounded="full">
                      <Box w="6px" h="6px" rounded="full" bg="#ef4444" />
                      <Text fontSize="xs" fontWeight="800" color="#ef4444">
                        {liveMatches.length} LIVE
                      </Text>
                    </HStack>
                  )}
                  <Dialog.CloseTrigger asChild>
                    <CloseButton size="sm" color={colors.textMuted} />
                  </Dialog.CloseTrigger>
                </HStack>
              </HStack>
            </Dialog.Header>

            <Dialog.Body p="6" overflowY="auto">
              {loading ? (
                <Center py="16">
                  <Spinner size="lg" color="#00bfff" />
                </Center>
              ) : readyMatches.length === 0 ? (
                <Center py="16">
                  <VStack gap="3">
                    <Clock size={36} color={colors.textSubtle} />
                    <Text color={colors.textMuted} fontSize="sm" textAlign="center">
                      No matches scheduled for today.
                    </Text>
                    <Text color={colors.textSubtle} fontSize="xs" textAlign="center">
                      Check back on match day — all scheduled matches will appear here.
                    </Text>
                  </VStack>
                </Center>
              ) : (
                <VStack gap="6" align="stretch">
                  {/* LIVE NOW section */}
                  {liveMatches.length > 0 && (
                    <VStack align="stretch" gap="3">
                      <HStack gap="2">
                        <Box w="8px" h="8px" rounded="full" bg="#ef4444" />
                        <Text fontSize="xs" fontWeight="800" color="#ef4444" textTransform="uppercase" letterSpacing="wider">
                          Live Now
                        </Text>
                      </HStack>
                      {liveMatches.map(match => {
                        const teams = match.participatingTeams?.linkedItems || [];
                        const t1 = teams[0]?.name || match.team1 || 'Team A';
                        const t2 = teams[1]?.name || match.team2 || 'Team B';
                        return (
                          <Box
                            key={match.id}
                            bg="rgba(239,68,68,0.06)"
                            border="1px solid rgba(239,68,68,0.3)"
                            rounded="xl"
                            p="4"
                          >
                            <HStack justify="space-between" flexWrap="wrap" gap="3">
                              <VStack align="start" gap="1">
                                <HStack gap="2">
                                  <Radio size={14} color="#ef4444" />
                                  <Text fontSize="sm" fontWeight="800" color={colors.textPrimary} textTransform="uppercase">
                                    {t1} <Text as="span" color={colors.textMuted} fontWeight="400">vs</Text> {t2}
                                  </Text>
                                </HStack>
                                {match.matchDate && (
                                  <Text fontSize="xs" color={colors.textMuted}>
                                    Started at {match.matchDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                  </Text>
                                )}
                              </VStack>
                              {match.streamLink?.url && (
                                <Button
                                  size="sm"
                                  bg="rgba(239,68,68,0.15)"
                                  color="#ef4444"
                                  border="1px solid rgba(239,68,68,0.4)"
                                  _hover={{ bg: 'rgba(239,68,68,0.25)' }}
                                  onClick={() => window.open(match.streamLink.url, '_blank')}
                                >
                                  <Play size={12} fill="#ef4444" /> Join Stream
                                </Button>
                              )}
                            </HStack>
                          </Box>
                        );
                      })}
                    </VStack>
                  )}

                  {/* READY TO CAST section */}
                  {upcomingToday.length > 0 && (
                    <VStack align="stretch" gap="3">
                      <HStack gap="2">
                        <Box w="8px" h="8px" rounded="full" bg="#22c55e" />
                        <Text fontSize="xs" fontWeight="800" color="#22c55e" textTransform="uppercase" letterSpacing="wider">
                          Ready to Cast Today
                        </Text>
                      </HStack>
                      {upcomingToday.map(match => {
                        const teams = match.participatingTeams?.linkedItems || [];
                        const t1 = teams[0]?.name || match.team1 || 'Team A';
                        const t2 = teams[1]?.name || match.team2 || 'Team B';
                        const timeStr = match.matchDate
                          ? match.matchDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                          : 'TBA';
                        return (
                          <Box
                            key={match.id}
                            bg="#111111"
                            border="1px solid rgba(34,197,94,0.2)"
                            rounded="xl"
                            p="4"
                            _hover={{ borderColor: 'rgba(34,197,94,0.4)' }}
                            transition="border-color 0.2s"
                          >
                            <HStack justify="space-between" flexWrap="wrap" gap="3">
                              <VStack align="start" gap="1">
                                <Text fontSize="sm" fontWeight="700" color={colors.textPrimary} textTransform="uppercase">
                                  {t1} <Text as="span" color={colors.textMuted} fontWeight="400">vs</Text> {t2}
                                </Text>
                                <HStack gap="2">
                                  <Clock size={11} color={colors.textMuted} />
                                  <Text fontSize="xs" color={colors.textMuted}>{timeStr} ET</Text>
                                  {match.week && (
                                    <Badge
                                      bg="rgba(168,85,247,0.12)"
                                      color="#a855f7"
                                      border="1px solid rgba(168,85,247,0.25)"
                                      fontSize="2xs"
                                      px="2"
                                      rounded="md"
                                    >
                                      Week {match.week}
                                    </Badge>
                                  )}
                                </HStack>
                              </VStack>
                              <HStack gap="2">
                                <Box
                                  px="3"
                                  py="1"
                                  bg="rgba(34,197,94,0.1)"
                                  border="1px solid rgba(34,197,94,0.3)"
                                  rounded="full"
                                >
                                  <Text fontSize="xs" fontWeight="700" color="#22c55e">Ready to Cast</Text>
                                </Box>
                                {match.streamLink?.url && (
                                  <Button
                                    size="sm"
                                    bg="rgba(0,191,255,0.12)"
                                    color="#00bfff"
                                    border="1px solid rgba(0,191,255,0.3)"
                                    _hover={{ bg: 'rgba(0,191,255,0.2)' }}
                                    onClick={() => window.open(match.streamLink.url, '_blank')}
                                  >
                                    <ExternalLink size={12} /> Stream Link
                                  </Button>
                                )}
                              </HStack>
                            </HStack>
                          </Box>
                        );
                      })}
                    </VStack>
                  )}

                  {/* Caster tips */}
                  <Box
                    bg="rgba(0,191,255,0.05)"
                    border="1px solid rgba(0,191,255,0.15)"
                    rounded="xl"
                    p="4"
                  >
                    <Text fontSize="xs" fontWeight="700" color="#00bfff" mb="2" textTransform="uppercase" letterSpacing="wider">
                      Caster Notes
                    </Text>
                    <VStack align="start" gap="1">
                      {[
                        'Coordinate with both team captains before going live.',
                        'Use the relay code provided by the match coordinator.',
                        'Submit VOD link to the sheet\'s "Media" column after the cast.',
                        'Ping @Moderator in Discord if a match is disputed.',
                      ].map((note, i) => (
                        <HStack key={i} gap="2" align="start">
                          <Text fontSize="xs" color="#00bfff">•</Text>
                          <Text fontSize="xs" color={colors.textMuted}>{note}</Text>
                        </HStack>
                      ))}
                    </VStack>
                  </Box>
                </VStack>
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default CasterGreenRoom;
