import { Dialog, Portal, Box, VStack, HStack, Text, CloseButton, Badge, Center, Spinner, Button, Input } from '@chakra-ui/react';
import { Radio, ExternalLink, Play, Clock, Tv, Mic } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import { getThemedColors } from '../theme/colors';
import { useSchedule } from '../hooks/useSchedule';
import { useAuth } from '../hooks/useAuth';
import { emlApi } from '../hooks/useEmlApi';

const READY_STATUSES = ['Scheduled', 'Live', 'In Progress'];

const CasterGreenRoom = ({ open, onClose, theme }) => {
  const colors = getThemedColors(theme);
  const { matches, loading } = useSchedule();
  const { user, isLoggedIn, isCaster } = useAuth();
  const [twitchChannel, setTwitchChannel] = useState('');
  const [claimedMatches, setClaimedMatches] = useState([]);

  const fetchClaims = useCallback(async () => {
    if (!open) return;
    try {
      const data = await emlApi('GET', '/caster/matches');
      setClaimedMatches(data.matches || []);
    } catch { /* non-critical */ }
  }, [open]);

  useEffect(() => { fetchClaims(); }, [fetchClaims]);

  const handleClaim = async (matchId) => {
    try {
      await emlApi('POST', '/caster/claim', { matchId, discordId: user.id, username: user.username, twitchChannel: twitchChannel.trim() });
      await fetchClaims();
    } catch { /* ignore */ }
  };

  const handleUnclaim = async (matchId) => {
    try {
      await emlApi('POST', '/caster/unclaim', { matchId, discordId: user.id });
      await fetchClaims();
    } catch { /* ignore */ }
  };

  const getClaimInfo = (matchId) => claimedMatches.find(c => c.matchId === matchId);
  const isMyClaim = (matchId) => getClaimInfo(matchId)?.discordId === user?.id;

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
            overflow="hidden"
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
                    <CloseButton size="sm" color={colors.textPrimary} _hover={{ color: colors.accentOrange }} />
                  </Dialog.CloseTrigger>
                </HStack>
              </HStack>
            </Dialog.Header>

            <Dialog.Body p="6" overflowY="auto">
              {/* Twitch channel */}
              <Box bg="#111111" border="1px solid rgba(255,255,255,0.08)" rounded="xl" p="3" mb="4">
                <HStack gap="2" mb="2">
                  <Mic size={13} color="#9146ff" />
                  <Text fontSize="xs" fontWeight="700" color="#9146ff" textTransform="uppercase" letterSpacing="wider">Your Twitch Channel</Text>
                </HStack>
                <HStack gap="2">
                  <Input value={twitchChannel} onChange={e => setTwitchChannel(e.target.value)} placeholder="yourchannelname"
                    bg="#0a0a0a" border="1px solid rgba(255,255,255,0.1)" color="white" rounded="lg" size="sm"
                    _placeholder={{ color: 'rgba(255,255,255,0.25)' }} _focus={{ borderColor: '#9146ff', outline: 'none' }} />
                  {twitchChannel && (
                    <Button as="a" href={`https://twitch.tv/${twitchChannel}`} target="_blank" size="sm"
                      bg="rgba(145,70,255,0.1)" border="1px solid rgba(145,70,255,0.3)" color="#9146ff" rounded="lg">
                      <ExternalLink size={12} />
                    </Button>
                  )}
                </HStack>
              </Box>
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
                        const matchId = match.id || match.matchId;
                        const claimInfo = getClaimInfo(matchId);
                        const mine = isMyClaim(matchId);
                        return (
                          <Box
                            key={match.id}
                            bg="#111111"
                            border="1px solid"
                            borderColor={claimInfo ? 'rgba(0,191,255,0.3)' : 'rgba(34,197,94,0.2)'}
                            rounded="xl"
                            p="4"
                            _hover={{ borderColor: claimInfo ? 'rgba(0,191,255,0.5)' : 'rgba(34,197,94,0.4)' }}
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
                                  {claimInfo && (
                                    <Badge bg="rgba(0,191,255,0.1)" color="#00bfff" border="1px solid rgba(0,191,255,0.25)" fontSize="2xs">
                                      <Radio size={8} /> {claimInfo.username}
                                    </Badge>
                                  )}
                                </HStack>
                              </VStack>
                              <HStack gap="2">
                                {claimInfo?.twitchChannel && (
                                  <Button size="sm" as="a" href={`https://twitch.tv/${claimInfo.twitchChannel}`} target="_blank"
                                    bg="rgba(145,70,255,0.1)" border="1px solid rgba(145,70,255,0.3)" color="#9146ff">
                                    <ExternalLink size={12} /> Twitch
                                  </Button>
                                )}
                                {mine ? (
                                  <Button size="sm" bg="rgba(239,68,68,0.1)" border="1px solid rgba(239,68,68,0.3)" color="#ef4444" rounded="lg" fontWeight="700"
                                    onClick={() => handleUnclaim(matchId)}>Unclaim</Button>
                                ) : !claimInfo ? (
                                  <Button size="sm" bg="rgba(0,191,255,0.1)" border="1px solid rgba(0,191,255,0.3)" color="#00bfff" rounded="lg" fontWeight="700"
                                    onClick={() => handleClaim(matchId)}>
                                    <Radio size={12} /> Claim
                                  </Button>
                                ) : (
                                  <Badge bg="rgba(255,255,255,0.05)" color={colors.textMuted} fontSize="xs">Claimed</Badge>
                                )}
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
