import { Box, Dialog, Portal, Table, Text, HStack, VStack, Spinner, Center, Badge, Button, CloseButton, Tabs, Collapse } from '@chakra-ui/react';
import { Calendar, ExternalLink, Play, Clock, CheckCircle, AlertCircle, Loader, Radio } from 'lucide-react';
import { useState } from 'react';
import { useSchedule } from '../hooks/useSchedule';
import { useMatchResults } from '../hooks/useMatchResults';
import { useAccessibility } from '../hooks/useAccessibility';
import { getThemedColors } from '../theme/colors';
import { getCurrentSeasonWeek } from '../utils/weekUtils';

/** Extract YouTube video ID from various URL formats */
const getYouTubeId = (url) => {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
};

/** Extract Twitch channel or VOD from URL */
const getTwitchEmbed = (url) => {
  if (!url) return null;
  const vodMatch = url.match(/twitch\.tv\/videos\/(\d+)/);
  if (vodMatch) return { type: 'vod', id: vodMatch[1] };
  const channelMatch = url.match(/twitch\.tv\/([A-Za-z0-9_]+)/);
  if (channelMatch) return { type: 'channel', id: channelMatch[1] };
  return null;
};

/** Match status badge with visual indicator */
const MatchStatusBadge = ({ status }) => {
  const statusMap = {
    Live: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)', label: 'LIVE', icon: Radio, pulse: true },
    'In Progress': { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)', label: 'IN PROGRESS', icon: Radio, pulse: true },
    'Waiting for Score': { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)', label: 'AWAITING SCORE', icon: Clock, pulse: false },
    Disputed: { color: '#a855f7', bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.35)', label: 'DISPUTED', icon: AlertCircle, pulse: false },
    Scheduled: { color: '#9ca3af', bg: 'rgba(156,163,175,0.1)', border: 'rgba(156,163,175,0.25)', label: 'SCHEDULED', icon: Clock, pulse: false },
    Completed: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', label: 'COMPLETED', icon: CheckCircle, pulse: false },
  };
  const cfg = statusMap[status] || statusMap.Scheduled;
  const Icon = cfg.icon;
  return (
    <Box
      display="inline-flex"
      alignItems="center"
      gap="1.5"
      px="2.5"
      py="1"
      rounded="full"
      bg={cfg.bg}
      border="1px solid"
      borderColor={cfg.border}
      position="relative"
    >
      {cfg.pulse && (
        <Box
          position="absolute"
          top="50%"
          left="8px"
          transform="translateY(-50%)"
          w="6px"
          h="6px"
          rounded="full"
          bg={cfg.color}
          animation="pulse 1.5s ease-in-out infinite"
        />
      )}
      <Icon size={10} color={cfg.color} style={{ marginLeft: cfg.pulse ? '10px' : 0 }} />
      <Text fontSize="2xs" fontWeight="800" color={cfg.color} letterSpacing="wider">
        {cfg.label}
      </Text>
    </Box>
  );
};

/** Inline VOD embed for a match */
const VodEmbed = ({ url, matchLabel }) => {
  const [expanded, setExpanded] = useState(false);
  const ytId = getYouTubeId(url);
  const twitchInfo = !ytId ? getTwitchEmbed(url) : null;

  if (!ytId && !twitchInfo) {
    return (
      <Button size="xs" variant="outline" borderColor="rgba(255,255,255,0.15)" color="#9ca3af"
        onClick={() => window.open(url, '_blank')}>
        <ExternalLink size={11} /> Watch
      </Button>
    );
  }

  const embedUrl = ytId
    ? `https://www.youtube.com/embed/${ytId}?autoplay=0`
    : twitchInfo.type === 'vod'
      ? `https://player.twitch.tv/?video=${twitchInfo.id}&parent=${window.location.hostname}`
      : `https://player.twitch.tv/?channel=${twitchInfo.id}&parent=${window.location.hostname}`;

  return (
    <VStack gap="2" align="start">
      <Button
        size="xs"
        bg="rgba(255,107,43,0.15)"
        color="#ff6b2b"
        border="1px solid rgba(255,107,43,0.3)"
        _hover={{ bg: 'rgba(255,107,43,0.25)' }}
        onClick={() => setExpanded(e => !e)}
      >
        <Play size={11} fill="#ff6b2b" /> {expanded ? 'Hide' : 'Watch Replay'}
      </Button>
      {expanded && (
        <Box
          w="full"
          maxW="560px"
          rounded="xl"
          overflow="hidden"
          border="1px solid rgba(255,107,43,0.25)"
          bg="rgba(0,0,0,0.6)"
        >
          <Box position="relative" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={embedUrl}
              title={`VOD: ${matchLabel}`}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Box>
        </Box>
      )}
    </VStack>
  );
};

const MatchesView = ({ theme, open, onClose }) => {
  const { needsColorBlindSupport } = useAccessibility();
  const emlColors = getThemedColors(theme, needsColorBlindSupport);
  const { matches, loading } = useSchedule();
  const { matchResults, loading: resultsLoading } = useMatchResults();

  const upcoming = matches.filter(m => m.status === 'Scheduled' || m.status === 'Live');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const overdueMatches = upcoming.filter(m => m.matchDate && m.matchDate < today && m.status === 'Scheduled');
  const futureMatches = upcoming.filter(m => !m.matchDate || m.matchDate >= today || m.status === 'Live');
  const scheduled = matches.filter(m => m.status === 'Scheduled');

  // Dynamically find the most recent week that has results
  const weekNumbers = matchResults
    .map(m => parseInt(m.week))
    .filter(n => !isNaN(n));
  const latestWeek = weekNumbers.length > 0 ? Math.max(...weekNumbers) : getCurrentSeasonWeek();
  const latestWeekResults = matchResults.filter(m => m.week && parseInt(m.week) === latestWeek);

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
                  <CloseButton size="lg" color={emlColors.textPrimary} _hover={{ color: emlColors.accentOrange }} />
                </Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>
            <Dialog.Body p="6" overflowY="auto">
              {loading || resultsLoading ? (
                <Center py="20"><Spinner size="xl" color={emlColors.accentOrange} /></Center>
              ) : (
                <Tabs.Root defaultValue="results">
                  <Tabs.List
                    mb="6"
                    bg={emlColors.bgSecondary}
                    border="1px solid"
                    borderColor={emlColors.borderMedium}
                    p="1"
                    rounded="xl"
                  >
                    <Tabs.Trigger
                      value="results"
                      fontWeight="600"
                      color={emlColors.textSecondary}
                      _selected={{ color: emlColors.accentOrange, bg: `${emlColors.accentOrange}22`, rounded: 'lg' }}
                      _hover={{ color: emlColors.textPrimary }}
                    >
                      Match Results (Week {latestWeek})
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="upcoming"
                      fontWeight="600"
                      color={emlColors.textSecondary}
                      _selected={{ color: emlColors.accentOrange, bg: `${emlColors.accentOrange}22`, rounded: 'lg' }}
                      _hover={{ color: emlColors.textPrimary }}
                    >
                      Upcoming Matches
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="scheduled"
                      fontWeight="600"
                      color={emlColors.textSecondary}
                      _selected={{ color: emlColors.accentOrange, bg: `${emlColors.accentOrange}22`, rounded: 'lg' }}
                      _hover={{ color: emlColors.textPrimary }}
                    >
                      Scheduled
                    </Tabs.Trigger>
                  </Tabs.List>

                  {/* Match Results Tab */}
                  <Tabs.Content value="results">
                    <Box overflowX="auto">
                      <Table.Root size="md" variant="outline">
                        <Table.Header bg={emlColors.bgTertiary}>
                          <Table.Row>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted}>TEAM 1</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted} textAlign="center">SCORE</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted}>TEAM 2</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted}>STATUS</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted}>DATE</Table.ColumnHeader>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {latestWeekResults.map(match => (
                            <Table.Row key={match.id} _hover={{ bg: 'rgba(255,255,255,0.03)' }}>
                              <Table.Cell>
                                <Badge bg="rgba(168,85,247,0.15)" color="#a855f7" border="1px solid rgba(168,85,247,0.3)" size="sm" px="2" rounded="md">{match.week}</Badge>
                              </Table.Cell>
                              <Table.Cell>
                                <Text fontWeight="700" color={emlColors.textPrimary} textTransform="uppercase" fontSize="sm">{match.team1}</Text>
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
                                  <Text fontSize="sm" color={emlColors.textMuted} fontWeight="700">—</Text>
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
                                <MatchStatusBadge status={match.isForfeit ? 'Completed' : 'Completed'} />
                              </Table.Cell>
                              <Table.Cell>
                                <Text fontSize="sm" color={emlColors.textMuted}>{match.matchDate}</Text>
                              </Table.Cell>
                            </Table.Row>
                          ))}
                          {latestWeekResults.length === 0 && (
                            <Table.Row>
                              <Table.Cell colSpan={6}>
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
                      {/* ── Overdue matches (past date, not yet submitted) ── */}
                      {overdueMatches.length > 0 && (
                        <Box mb="4">
                          <HStack gap="2" px="1" mb="2">
                            <Box w="2" h="2" rounded="full" bg={emlColors.semantic.loss} />
                            <Text fontSize="xs" fontWeight="700" color={emlColors.semantic.loss} textTransform="uppercase" letterSpacing="wider">
                              Overdue — Score must be submitted by Sunday 11:59 PM EST
                            </Text>
                          </HStack>
                          <Table.Root size="md" variant="outline">
                            <Table.Header bg={`${emlColors.semantic.loss}18`}>
                              <Table.Row>
                                <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.semantic.loss}>DATE</Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.semantic.loss}>HOME</Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.semantic.loss} textAlign="center">STATUS</Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.semantic.loss}>AWAY</Table.ColumnHeader>
                              </Table.Row>
                            </Table.Header>
                            <Table.Body>
                              {overdueMatches.map(match => {
                                const teams = match.participatingTeams?.linkedItems || [];
                                return (
                                  <Table.Row key={match.id} bg={`${emlColors.semantic.loss}08`} _hover={{ bg: `${emlColors.semantic.loss}14` }}>
                                    <Table.Cell>
                                      <VStack align="start" gap="0">
                                        <Text fontSize="sm" fontWeight="600" color={emlColors.textPrimary}>
                                          {match.matchDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </Text>
                                        <Badge bg={`${emlColors.semantic.loss}22`} color={emlColors.semantic.loss} fontSize="2xs" px="1.5" rounded="sm">OVERDUE</Badge>
                                      </VStack>
                                    </Table.Cell>
                                    <Table.Cell><Text fontWeight="700" color={emlColors.textPrimary} textTransform="uppercase" fontSize="sm">{teams[0]?.name || 'TBA'}</Text></Table.Cell>
                                    <Table.Cell textAlign="center">
                                      <Badge bg={`${emlColors.semantic.loss}22`} color={emlColors.semantic.loss} border={`1px solid ${emlColors.semantic.loss}44`} px="2" rounded="md" fontSize="xs" fontWeight="700">
                                        Awaiting Score
                                      </Badge>
                                    </Table.Cell>
                                    <Table.Cell><Text fontWeight="700" color={emlColors.textPrimary} textTransform="uppercase" fontSize="sm">{teams[1]?.name || 'TBA'}</Text></Table.Cell>
                                  </Table.Row>
                                );
                              })}
                            </Table.Body>
                          </Table.Root>
                        </Box>
                      )}

                      <Table.Root size="md" variant="outline">
                        <Table.Header bg={emlColors.bgTertiary}>
                          <Table.Row>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted}>DATE</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted}>HOME</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted} textAlign="center">STATUS</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted}>AWAY</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted}>REPLAY / STREAM</Table.ColumnHeader>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {futureMatches.map(match => {
                            const teams = match.participatingTeams?.linkedItems || [];
                            return (
                              <Table.Row key={match.id} _hover={{ bg: emlColors.bgHover }}>
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
                                <Table.Cell><Text fontWeight="700" color={emlColors.textPrimary} textTransform="uppercase" fontSize="sm">{teams[0]?.name || 'TBA'}</Text></Table.Cell>
                                <Table.Cell textAlign="center">
                                  <MatchStatusBadge status={match.status || 'Scheduled'} />
                                </Table.Cell>
                                <Table.Cell><Text fontWeight="700" color={emlColors.textPrimary} textTransform="uppercase" fontSize="sm">{teams[1]?.name || 'TBA'}</Text></Table.Cell>
                                <Table.Cell>
                                  {match.streamLink?.url ? (
                                    <VodEmbed
                                      url={match.streamLink.url}
                                      matchLabel={`${teams[0]?.name || 'TBA'} vs ${teams[1]?.name || 'TBA'}`}
                                    />
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
                        <Table.Header bg={emlColors.bgTertiary}>
                          <Table.Row>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted}>SCHEDULED</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted}>HOME</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted} textAlign="center">STATUS</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted}>AWAY</Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="700" fontSize="xs" textTransform="uppercase" color={emlColors.textMuted}>STREAM</Table.ColumnHeader>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {scheduled.map(match => {
                            const teams = match.participatingTeams?.linkedItems || [];
                            return (
                              <Table.Row key={match.id} _hover={{ bg: emlColors.bgElevated }}>
                                <Table.Cell>
                                  <Text fontSize="sm" fontWeight="600" color={emlColors.textPrimary}>
                                    {match.matchDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </Text>
                                </Table.Cell>
                                <Table.Cell><Text fontWeight="700" color={emlColors.textPrimary} textTransform="uppercase" fontSize="sm">{teams[0]?.name || 'TBA'}</Text></Table.Cell>
                                <Table.Cell textAlign="center">
                                  <MatchStatusBadge status="Scheduled" />
                                </Table.Cell>
                                <Table.Cell><Text fontWeight="700" color={emlColors.textPrimary} textTransform="uppercase" fontSize="sm">{teams[1]?.name || 'TBA'}</Text></Table.Cell>
                                <Table.Cell>
                                  <Text fontSize="xs" color={emlColors.textMuted}>TBD</Text>
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
