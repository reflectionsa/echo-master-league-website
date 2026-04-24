import {
  Box, Dialog, Portal, CloseButton, HStack, VStack, Text, Badge,
  Button, Tabs, Input, Textarea, Select, Spinner, createListCollection
} from '@chakra-ui/react';
import { Shield, FileText, Users, Trophy, Terminal, Zap, Video, UserX, AlertTriangle, ClipboardList } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getThemedColors } from '../theme/colors';

const ticketTypeCollection = createListCollection({
  items: [
    { label: '🎥 Production / Cast Request', value: 'production' },
    { label: '⚙️ Tech Support', value: 'tech-support' },
    { label: '🏆 Match Support', value: 'match-support' },
    { label: '📋 League Support', value: 'league-support' },
    { label: '🖥️ Server Request', value: 'server-request' },
  ],
});
import { emlApi } from '../hooks/useEmlApi';

const WORKER_URL = import.meta.env.VITE_WORKER_URL;

const AdminPanel = ({ theme, open, onClose }) => {
  const colors = getThemedColors(theme);
  const { user, isAdmin, isMod } = useAuth();

  // Production form state
  const [ticketMatchId, setTicketMatchId] = useState('');
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketType, setTicketType] = useState('production');
  const [ticketLoading, setTicketLoading] = useState(false);

  const [casterName, setCasterName] = useState('');
  const [casterStats, setCasterStats] = useState({ events: 0, matches: 0 });
  const [casterLoading, setCasterLoading] = useState(false);

  const [cameraName, setCameraName] = useState('');
  const [cameraStats, setCameraStats] = useState({ events: 0, matches: 0 });
  const [cameraLoading, setCameraLoading] = useState(false);

  // Team admin
  const [teamAdminId, setTeamAdminId] = useState('');
  const [teamAdminTier, setTeamAdminTier] = useState('');
  const [teamAdminElo, setTeamAdminElo] = useState('');
  const [teamAdminLoading, setTeamAdminLoading] = useState(false);
  const [teamAdminMsg, setTeamAdminMsg] = useState('');

  // Player admin
  const [playerAdminId, setPlayerAdminId] = useState('');
  const [playerAdminAction, setPlayerAdminAction] = useState('ban');
  const [playerAdminReason, setPlayerAdminReason] = useState('');
  const [playerAdminLoading, setPlayerAdminLoading] = useState(false);
  const [playerAdminMsg, setPlayerAdminMsg] = useState('');

  // Match admin
  const [matchAdminId, setMatchAdminId] = useState('');
  const [matchAdminAction, setMatchAdminAction] = useState('force_report');
  const [matchAdminWinner, setMatchAdminWinner] = useState('');
  const [matchAdminNote, setMatchAdminNote] = useState('');
  const [matchAdminLoading, setMatchAdminLoading] = useState(false);
  const [matchAdminMsg, setMatchAdminMsg] = useState('');

  // Audit log
  const [auditLog, setAuditLog] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);

  const handleAdminTeam = async () => {
    if (!teamAdminId) return;
    setTeamAdminLoading(true);
    setTeamAdminMsg('');
    try {
      const updates = {};
      if (teamAdminTier) updates.tier = teamAdminTier;
      if (teamAdminElo) updates.elo = parseInt(teamAdminElo);
      await emlApi('POST', '/admin/team', { adminDiscordId: user.id, teamId: teamAdminId, updates });
      setTeamAdminMsg('Team updated.');
    } catch (e) { setTeamAdminMsg(e.message); } finally { setTeamAdminLoading(false); }
  };

  const handleAdminPlayer = async () => {
    if (!playerAdminId) return;
    setPlayerAdminLoading(true);
    setPlayerAdminMsg('');
    try {
      await emlApi('POST', '/admin/player', { adminDiscordId: user.id, targetDiscordId: playerAdminId, action: playerAdminAction, reason: playerAdminReason });
      setPlayerAdminMsg(`Player ${playerAdminAction === 'ban' ? 'banned' : 'unbanned'}.`);
    } catch (e) { setPlayerAdminMsg(e.message); } finally { setPlayerAdminLoading(false); }
  };

  const handleAdminMatch = async () => {
    if (!matchAdminId) return;
    setMatchAdminLoading(true);
    setMatchAdminMsg('');
    try {
      await emlApi('POST', '/admin/match', { adminDiscordId: user.id, matchId: matchAdminId, action: matchAdminAction, winner: matchAdminWinner, note: matchAdminNote });
      setMatchAdminMsg('Match updated.');
    } catch (e) { setMatchAdminMsg(e.message); } finally { setMatchAdminLoading(false); }
  };

  const loadAuditLog = useCallback(async () => {
    setAuditLoading(true);
    try {
      const data = await emlApi('GET', '/audit-log');
      setAuditLog(data.log || []);
    } catch { } finally { setAuditLoading(false); }
  }, []);

  const handleCreateTicket = async () => {
    if (!ticketMatchId.trim()) {
      alert('Please enter a match ID');
      return;
    }
    setTicketLoading(true);
    try {
      const res = await fetch(`${WORKER_URL}/production/ticket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: ticketMatchId,
          ticketType: ticketType,
          title: ticketTitle || `Production - ${ticketMatchId}`,
        }),
      });
      if (res.ok) {
        alert('Discord ticket created successfully!');
        setTicketMatchId('');
        setTicketTitle('');
        setTicketType('production');
      } else {
        alert('Failed to create ticket');
      }
    } catch (err) {
      console.error('Ticket creation error:', err);
      alert('Error creating ticket');
    } finally {
      setTicketLoading(false);
    }
  };

  const handleAddCasterStats = async () => {
    if (!casterName.trim()) {
      alert('Please enter caster name');
      return;
    }
    setCasterLoading(true);
    try {
      const res = await fetch(`${WORKER_URL}/production/caster-stats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: casterName,
          events: parseInt(casterStats.events) || 0,
          matches: parseInt(casterStats.matches) || 0,
        }),
      });
      if (res.ok) {
        alert('Caster stats updated!');
        setCasterName('');
        setCasterStats({ events: 0, matches: 0 });
      } else {
        alert('Failed to update caster stats');
      }
    } catch (err) {
      console.error('Caster stats error:', err);
      alert('Error updating stats');
    } finally {
      setCasterLoading(false);
    }
  };

  const handleAddCameraStats = async () => {
    if (!cameraName.trim()) {
      alert('Please enter camera operator name');
      return;
    }
    setCameraLoading(true);
    try {
      const res = await fetch(`${WORKER_URL}/production/camera-stats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cameraName,
          events: parseInt(cameraStats.events) || 0,
          matches: parseInt(cameraStats.matches) || 0,
        }),
      });
      if (res.ok) {
        alert('Camera operator stats updated!');
        setCameraName('');
        setCameraStats({ events: 0, matches: 0 });
      } else {
        alert('Failed to update camera stats');
      }
    } catch (err) {
      console.error('Camera stats error:', err);
      alert('Error updating stats');
    } finally {
      setCameraLoading(false);
    }
  };

  if (!isAdmin && !isMod) return null;

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.700" backdropFilter="blur(10px)" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="960px"
            maxH="90vh"
            bg={colors.bgPrimary}
            border="1px solid"
            borderColor={colors.borderMedium}
            rounded="2xl"
            overflow="hidden"
          >
            <Dialog.Header
              bg={colors.bgSecondary}
              borderBottom="1px solid"
              borderColor={colors.borderMedium}
              px="6"
              py="4"
            >
              <HStack justify="space-between">
                <HStack gap="2">
                  <Shield size={22} color={colors.accentPurple} />
                  <Dialog.Title fontSize="xl" fontWeight="800" color={colors.textPrimary}>
                    Admin Panel
                  </Dialog.Title>
                  <Badge colorPalette={isAdmin ? 'red' : 'purple'} size="sm">
                    {isAdmin ? 'Admin' : 'Mod'}
                  </Badge>
                </HStack>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="md" color={colors.textMuted} />
                </Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>

            <Dialog.Body p="0" overflowY="auto">
              <Tabs.Root defaultValue="matches" orientation="vertical" h="full">
                <HStack h="full" align="stretch" gap="0">
                  {/* Sidebar */}
                  <Tabs.List
                    flexDirection="column"
                    w="170px"
                    flexShrink={0}
                    bg={colors.bgSecondary}
                    borderRight="1px solid"
                    borderColor={colors.borderMedium}
                    p="3"
                    gap="1"
                    alignItems="stretch"
                  >
                    <Tabs.Trigger
                      value="matches"
                      justifyContent="flex-start"
                      gap="2"
                      rounded="lg"
                      px="3"
                      py="2"
                      fontSize="sm"
                      color={colors.textSecondary}
                      _selected={{ bg: colors.bgHover, color: colors.accentOrange }}
                      _hover={{ bg: colors.bgHover }}
                    >
                      <Trophy size={14} /> Match Scores
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="roster"
                      justifyContent="flex-start"
                      gap="2"
                      rounded="lg"
                      px="3"
                      py="2"
                      fontSize="sm"
                      color={colors.textSecondary}
                      _selected={{ bg: colors.bgHover, color: colors.accentOrange }}
                      _hover={{ bg: colors.bgHover }}
                    >
                      <Users size={14} /> Roster
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="announcements"
                      justifyContent="flex-start"
                      gap="2"
                      rounded="lg"
                      px="3"
                      py="2"
                      fontSize="sm"
                      color={colors.textSecondary}
                      _selected={{ bg: colors.bgHover, color: colors.accentOrange }}
                      _hover={{ bg: colors.bgHover }}
                    >
                      <FileText size={14} /> Announcements
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="production"
                      justifyContent="flex-start"
                      gap="2"
                      rounded="lg"
                      px="3"
                      py="2"
                      fontSize="sm"
                      color={colors.textSecondary}
                      _selected={{ bg: colors.bgHover, color: colors.accentOrange }}
                      _hover={{ bg: colors.bgHover }}
                    >
                      <Zap size={14} /> Production
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="botcommands"
                      justifyContent="flex-start"
                      gap="2"
                      rounded="lg"
                      px="3"
                      py="2"
                      fontSize="sm"
                      color={colors.textSecondary}
                      _selected={{ bg: colors.bgHover, color: colors.accentOrange }}
                      _hover={{ bg: colors.bgHover }}
                    >
                      <Terminal size={14} /> Bot Commands
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="team-ctrl"
                      justifyContent="flex-start"
                      gap="2"
                      rounded="lg"
                      px="3"
                      py="2"
                      fontSize="sm"
                      color={colors.textSecondary}
                      _selected={{ bg: colors.bgHover, color: colors.accentOrange }}
                      _hover={{ bg: colors.bgHover }}
                    >
                      <Users size={14} /> Teams
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="player-ctrl"
                      justifyContent="flex-start"
                      gap="2"
                      rounded="lg"
                      px="3"
                      py="2"
                      fontSize="sm"
                      color={colors.textSecondary}
                      _selected={{ bg: colors.bgHover, color: colors.accentOrange }}
                      _hover={{ bg: colors.bgHover }}
                    >
                      <UserX size={14} /> Players
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="match-ctrl"
                      justifyContent="flex-start"
                      gap="2"
                      rounded="lg"
                      px="3"
                      py="2"
                      fontSize="sm"
                      color={colors.textSecondary}
                      _selected={{ bg: colors.bgHover, color: colors.accentOrange }}
                      _hover={{ bg: colors.bgHover }}
                    >
                      <AlertTriangle size={14} /> Match Ctrl
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="audit"
                      justifyContent="flex-start"
                      gap="2"
                      rounded="lg"
                      px="3"
                      py="2"
                      fontSize="sm"
                      color={colors.textSecondary}
                      _selected={{ bg: colors.bgHover, color: colors.accentOrange }}
                      _hover={{ bg: colors.bgHover }}
                      onClick={loadAuditLog}
                    >
                      <ClipboardList size={14} /> Audit Log
                    </Tabs.Trigger>
                  </Tabs.List>

                  {/* Tab Content */}
                  <Box flex="1" overflow="auto">

                    {/* Match Scores */}
                    <Tabs.Content value="matches" p="6">
                      <VStack align="start" gap="5">
                        <VStack align="start" gap="1">
                          <Text fontWeight="700" fontSize="lg" color={colors.textPrimary}>
                            Match Score Management
                          </Text>
                          <Text fontSize="sm" color={colors.textMuted}>
                            Submit or update match results. Changes are pushed to the Google Sheet via the GAS endpoint.
                          </Text>
                        </VStack>

                        <Box
                          w="full"
                          p="5"
                          rounded="xl"
                          bg={colors.bgSecondary}
                          border="1px solid"
                          borderColor={colors.borderMedium}
                        >
                          <VStack gap="4" align="stretch">
                            <Text fontWeight="600" color={colors.textSecondary} fontSize="sm">
                              Record Match Result
                            </Text>
                            <Input
                              placeholder="Match ID (e.g. match-week4-1)"
                              bg={colors.bgPrimary}
                              color={colors.textPrimary}
                              border="1px solid"
                              borderColor={colors.borderMedium}
                              _placeholder={{ color: colors.textSubtle }}
                              _focus={{ borderColor: colors.accentOrange }}
                              size="sm"
                            />
                            <HStack gap="3">
                              <Input
                                placeholder="Team 1 Score"
                                type="number"
                                min={0}
                                bg={colors.bgPrimary}
                                color={colors.textPrimary}
                                border="1px solid"
                                borderColor={colors.borderMedium}
                                _placeholder={{ color: colors.textSubtle }}
                                _focus={{ borderColor: colors.accentOrange }}
                                size="sm"
                              />
                              <Text color={colors.textMuted} fontWeight="700">vs</Text>
                              <Input
                                placeholder="Team 2 Score"
                                type="number"
                                min={0}
                                bg={colors.bgPrimary}
                                color={colors.textPrimary}
                                border="1px solid"
                                borderColor={colors.borderMedium}
                                _placeholder={{ color: colors.textSubtle }}
                                _focus={{ borderColor: colors.accentOrange }}
                                size="sm"
                              />
                            </HStack>
                            <Text fontSize="xs" color={colors.textSubtle} fontStyle="italic">
                              GAS write endpoint integration coming soon. Scores will sync to data.json on next build.
                            </Text>
                            <Button colorPalette="orange" size="sm" alignSelf="flex-end" disabled>
                              Submit Score
                            </Button>
                          </VStack>
                        </Box>
                      </VStack>
                    </Tabs.Content>

                    {/* Roster */}
                    <Tabs.Content value="roster" p="6">
                      <VStack align="start" gap="5">
                        <VStack align="start" gap="1">
                          <Text fontWeight="700" fontSize="lg" color={colors.textPrimary}>
                            Roster Management
                          </Text>
                          <Text fontSize="sm" color={colors.textMuted}>
                            Add, remove, or transfer players. Changes sync to the Google Sheet via GAS.
                          </Text>
                        </VStack>

                        <Box
                          w="full"
                          p="5"
                          rounded="xl"
                          bg={colors.bgSecondary}
                          border="1px solid"
                          borderColor={colors.borderMedium}
                        >
                          <VStack gap="3" align="stretch">
                            <HStack gap="3">
                              <Input
                                placeholder="Player username"
                                bg={colors.bgPrimary}
                                color={colors.textPrimary}
                                border="1px solid"
                                borderColor={colors.borderMedium}
                                _placeholder={{ color: colors.textSubtle }}
                                _focus={{ borderColor: colors.accentOrange }}
                                size="sm"
                              />
                              <Input
                                placeholder="Team name"
                                bg={colors.bgPrimary}
                                color={colors.textPrimary}
                                border="1px solid"
                                borderColor={colors.borderMedium}
                                _placeholder={{ color: colors.textSubtle }}
                                _focus={{ borderColor: colors.accentOrange }}
                                size="sm"
                              />
                            </HStack>
                            <Text fontSize="xs" color={colors.textSubtle} fontStyle="italic">
                              GAS write endpoint integration coming soon.
                            </Text>
                            <Button colorPalette="blue" size="sm" alignSelf="flex-end" disabled>
                              Update Roster
                            </Button>
                          </VStack>
                        </Box>
                      </VStack>
                    </Tabs.Content>

                    {/* Announcements */}
                    <Tabs.Content value="announcements" p="6">
                      <VStack align="start" gap="5">
                        <VStack align="start" gap="1">
                          <Text fontWeight="700" fontSize="lg" color={colors.textPrimary}>
                            Post Announcement
                          </Text>
                          <Text fontSize="sm" color={colors.textMuted}>
                            New announcements are pushed via GAS and appear on the next data sync.
                          </Text>
                        </VStack>

                        <Box
                          w="full"
                          p="5"
                          rounded="xl"
                          bg={colors.bgSecondary}
                          border="1px solid"
                          borderColor={colors.borderMedium}
                        >
                          <VStack gap="4" align="stretch">
                            <Input
                              placeholder="Announcement title"
                              bg={colors.bgPrimary}
                              color={colors.textPrimary}
                              border="1px solid"
                              borderColor={colors.borderMedium}
                              _placeholder={{ color: colors.textSubtle }}
                              _focus={{ borderColor: colors.accentPurple }}
                              size="sm"
                            />
                            <Textarea
                              placeholder="Announcement body..."
                              rows={6}
                              bg={colors.bgPrimary}
                              color={colors.textPrimary}
                              border="1px solid"
                              borderColor={colors.borderMedium}
                              _placeholder={{ color: colors.textSubtle }}
                              _focus={{ borderColor: colors.accentPurple }}
                              size="sm"
                              resize="vertical"
                            />
                            <Text fontSize="xs" color={colors.textSubtle} fontStyle="italic">
                              GAS write endpoint integration coming soon.
                            </Text>
                            <Button colorPalette="purple" size="sm" alignSelf="flex-end" disabled>
                              Post Announcement
                            </Button>
                          </VStack>
                        </Box>
                      </VStack>
                    </Tabs.Content>

                    {/* Production Management */}
                    <Tabs.Content value="production" p="6">
                      <VStack align="start" gap="8">
                        {/* Discord Ticket Creation */}
                        <VStack align="start" gap="5" w="full">
                          <VStack align="start" gap="1">
                            <HStack gap="2">
                              <Zap size={16} color={colors.accentOrange} />
                              <Text fontWeight="700" fontSize="lg" color={colors.textPrimary}>
                                Create Discord Ticket
                              </Text>
                            </HStack>
                            <Text fontSize="sm" color={colors.textMuted}>
                              Manually create a Discord ticket for production planning and coordination.
                            </Text>
                          </VStack>

                          <Box
                            w="full"
                            p="5"
                            rounded="xl"
                            bg={colors.bgSecondary}
                            border="1px solid"
                            borderColor={colors.borderMedium}
                          >
                            <VStack gap="4" align="stretch">
                              <Select.Root
                                collection={ticketTypeCollection}
                                value={[ticketType]}
                                onValueChange={(details) => setTicketType(details.value[0] ?? details.value)}
                                size="sm"
                              >
                                <Select.HiddenSelect />
                                <Select.Control bg={colors.bgPrimary} rounded="lg">
                                  <Select.Trigger
                                    color={colors.textPrimary}
                                    border="1px solid"
                                    borderColor={colors.borderMedium}
                                    _focus={{ borderColor: colors.accentOrange }}
                                  >
                                    <Select.ValueText />
                                  </Select.Trigger>
                                  <Select.IndicatorGroup>
                                    <Select.Indicator />
                                  </Select.IndicatorGroup>
                                </Select.Control>
                                <Portal>
                                  <Select.Positioner>
                                    <Select.Content bg={colors.bgSecondary}>
                                      {ticketTypeCollection.items.map((item) => (
                                        <Select.Item item={item} key={item.value}>
                                          {item.label}
                                          <Select.ItemIndicator />
                                        </Select.Item>
                                      ))}
                                    </Select.Content>
                                  </Select.Positioner>
                                </Portal>
                              </Select.Root>
                              <Input
                                placeholder="Match ID (e.g., match-week4-1)"
                                value={ticketMatchId}
                                onChange={(e) => setTicketMatchId(e.target.value)}
                                bg={colors.bgPrimary}
                                color={colors.textPrimary}
                                border="1px solid"
                                borderColor={colors.borderMedium}
                                _placeholder={{ color: colors.textSubtle }}
                                _focus={{ borderColor: colors.accentOrange }}
                                size="sm"
                              />
                              <Input
                                placeholder="Ticket title (optional)"
                                value={ticketTitle}
                                onChange={(e) => setTicketTitle(e.target.value)}
                                bg={colors.bgPrimary}
                                color={colors.textPrimary}
                                border="1px solid"
                                borderColor={colors.borderMedium}
                                _placeholder={{ color: colors.textSubtle }}
                                _focus={{ borderColor: colors.accentOrange }}
                                size="sm"
                              />
                              <Button
                                colorPalette="orange"
                                size="sm"
                                alignSelf="flex-end"
                                onClick={handleCreateTicket}
                                loading={ticketLoading}
                              >
                                Create Ticket
                              </Button>
                            </VStack>
                          </Box>
                        </VStack>

                        {/* Caster Stats */}
                        <VStack align="start" gap="5" w="full">
                          <VStack align="start" gap="1">
                            <HStack gap="2">
                              <Video size={16} color={colors.accentPurple} />
                              <Text fontWeight="700" fontSize="lg" color={colors.textPrimary}>
                                Caster Statistics
                              </Text>
                            </HStack>
                            <Text fontSize="sm" color={colors.textMuted}>
                              Add or update caster event and match statistics.
                            </Text>
                          </VStack>

                          <Box
                            w="full"
                            p="5"
                            rounded="xl"
                            bg={colors.bgSecondary}
                            border="1px solid"
                            borderColor={colors.borderMedium}
                          >
                            <VStack gap="4" align="stretch">
                              <Input
                                placeholder="Caster name"
                                value={casterName}
                                onChange={(e) => setCasterName(e.target.value)}
                                bg={colors.bgPrimary}
                                color={colors.textPrimary}
                                border="1px solid"
                                borderColor={colors.borderMedium}
                                _placeholder={{ color: colors.textSubtle }}
                                _focus={{ borderColor: colors.accentPurple }}
                                size="sm"
                              />
                              <HStack gap="3">
                                <Input
                                  placeholder="Events"
                                  type="number"
                                  min={0}
                                  value={casterStats.events}
                                  onChange={(e) => setCasterStats({ ...casterStats, events: e.target.value })}
                                  bg={colors.bgPrimary}
                                  color={colors.textPrimary}
                                  border="1px solid"
                                  borderColor={colors.borderMedium}
                                  _placeholder={{ color: colors.textSubtle }}
                                  _focus={{ borderColor: colors.accentPurple }}
                                  size="sm"
                                />
                                <Input
                                  placeholder="Matches"
                                  type="number"
                                  min={0}
                                  value={casterStats.matches}
                                  onChange={(e) => setCasterStats({ ...casterStats, matches: e.target.value })}
                                  bg={colors.bgPrimary}
                                  color={colors.textPrimary}
                                  border="1px solid"
                                  borderColor={colors.borderMedium}
                                  _placeholder={{ color: colors.textSubtle }}
                                  _focus={{ borderColor: colors.accentPurple }}
                                  size="sm"
                                />
                              </HStack>
                              <Button
                                colorPalette="purple"
                                size="sm"
                                alignSelf="flex-end"
                                onClick={handleAddCasterStats}
                                loading={casterLoading}
                              >
                                Update Caster Stats
                              </Button>
                            </VStack>
                          </Box>
                        </VStack>

                        {/* Camera Operator Stats */}
                        <VStack align="start" gap="5" w="full">
                          <VStack align="start" gap="1">
                            <HStack gap="2">
                              <Video size={16} color={colors.accentPurple} />
                              <Text fontWeight="700" fontSize="lg" color={colors.textPrimary}>
                                Camera Operator Statistics
                              </Text>
                            </HStack>
                            <Text fontSize="sm" color={colors.textMuted}>
                              Track camera operator event and match statistics.
                            </Text>
                          </VStack>

                          <Box
                            w="full"
                            p="5"
                            rounded="xl"
                            bg={colors.bgSecondary}
                            border="1px solid"
                            borderColor={colors.borderMedium}
                          >
                            <VStack gap="4" align="stretch">
                              <Input
                                placeholder="Camera operator name"
                                value={cameraName}
                                onChange={(e) => setCameraName(e.target.value)}
                                bg={colors.bgPrimary}
                                color={colors.textPrimary}
                                border="1px solid"
                                borderColor={colors.borderMedium}
                                _placeholder={{ color: colors.textSubtle }}
                                _focus={{ borderColor: colors.accentPurple }}
                                size="sm"
                              />
                              <HStack gap="3">
                                <Input
                                  placeholder="Events"
                                  type="number"
                                  min={0}
                                  value={cameraStats.events}
                                  onChange={(e) => setCameraStats({ ...cameraStats, events: e.target.value })}
                                  bg={colors.bgPrimary}
                                  color={colors.textPrimary}
                                  border="1px solid"
                                  borderColor={colors.borderMedium}
                                  _placeholder={{ color: colors.textSubtle }}
                                  _focus={{ borderColor: colors.accentPurple }}
                                  size="sm"
                                />
                                <Input
                                  placeholder="Matches"
                                  type="number"
                                  min={0}
                                  value={cameraStats.matches}
                                  onChange={(e) => setCameraStats({ ...cameraStats, matches: e.target.value })}
                                  bg={colors.bgPrimary}
                                  color={colors.textPrimary}
                                  border="1px solid"
                                  borderColor={colors.borderMedium}
                                  _placeholder={{ color: colors.textSubtle }}
                                  _focus={{ borderColor: colors.accentPurple }}
                                  size="sm"
                                />
                              </HStack>
                              <Button
                                colorPalette="purple"
                                size="sm"
                                alignSelf="flex-end"
                                onClick={handleAddCameraStats}
                                loading={cameraLoading}
                              >
                                Update Camera Stats
                              </Button>
                            </VStack>
                          </Box>
                        </VStack>
                      </VStack>
                    </Tabs.Content>

                    {/* Bot Commands */}
                    <Tabs.Content value="botcommands" p="6">
                      <VStack align="start" gap="5">
                        <VStack align="start" gap="1">
                          <Text fontWeight="700" fontSize="lg" color={colors.textPrimary}>
                            Bot Commands Reference
                          </Text>
                          <Text fontSize="sm" color={colors.textMuted}>
                            Director and Server Mod slash commands available in Discord.
                          </Text>
                        </VStack>

                        {[
                          {
                            cmd: '/zadminmatchentry',
                            desc: 'Enter a match result on behalf of two teams.',
                            palette: 'orange',
                          },
                          {
                            cmd: '/z_forfeit',
                            desc: 'ADMIN: Forfeit a match between two teams (reconciliation).',
                            palette: 'orange',
                          },
                          {
                            cmd: '/z_player_register',
                            desc: 'ADMIN: Register a player into the League (reconciliation). Executes immediately. Accepts either a Discord mention or a raw ID.',
                            palette: 'green',
                          },
                          {
                            cmd: '/z_player_unregister',
                            desc: 'ADMIN: Unregister (remove) a player from the League (reconciliation). No dry-run/apply; executes immediately.',
                            palette: 'red',
                          },
                          {
                            cmd: '/z_team_create',
                            desc: 'ADMIN: Create a team with an explicit captain (reconciliation).',
                            palette: 'blue',
                          },
                          {
                            cmd: '/z_team_disband',
                            desc: 'ADMIN: Disband a team historically (reconciliation).',
                            palette: 'red',
                          },
                          {
                            cmd: '/z_team_player_add',
                            desc: 'ADMIN: Add a player to a team historically (reconciliation).',
                            palette: 'green',
                          },
                          {
                            cmd: '/z_team_player_remove',
                            desc: 'ADMIN: Remove a player from a team historically (reconciliation).',
                            palette: 'red',
                          },
                          {
                            cmd: '/zadminfixroles',
                            desc: 'Fix Discord Roles — perform a manual accounting of server and league roles.',
                            palette: 'blue',
                          },
                          {
                            cmd: '/zadminsuspend',
                            desc: 'Suspend a Player — manually suspend a player for a specific duration. Kicks the player from everything and adds them to the suspension list. If the player is a captain, their team is disbanded.',
                            palette: 'red',
                          },
                          {
                            cmd: '/zadmingenerateuuid',
                            desc: 'Generate a UUID — perform UUID generation and related wizardry.',
                            palette: 'purple',
                          },
                          {
                            cmd: '/zdebugdbcache',
                            desc: 'Debug the local cache.',
                            palette: 'yellow',
                          },
                          {
                            cmd: '/zdebugdbqueue',
                            desc: 'Debug the pending writes.',
                            palette: 'yellow',
                          },
                        ].map(({ cmd, desc, palette }) => (
                          <Box
                            key={cmd}
                            w="full"
                            p="4"
                            rounded="xl"
                            bg={colors.bgSecondary}
                            border="1px solid"
                            borderColor={colors.borderMedium}
                          >
                            <HStack align="flex-start" gap="3">
                              <Terminal size={16} color={colors.accentOrange} style={{ marginTop: 2, flexShrink: 0 }} />
                              <VStack align="start" gap="1" flex="1">
                                <HStack gap="2" flexWrap="wrap">
                                  <Text
                                    fontFamily="mono"
                                    fontWeight="700"
                                    fontSize="sm"
                                    color={colors.textPrimary}
                                  >
                                    {cmd}
                                  </Text>
                                  <Badge colorPalette={palette} size="xs">Director / Mod</Badge>
                                </HStack>
                                <Text fontSize="xs" color={colors.textSecondary}>
                                  {desc}
                                </Text>
                              </VStack>
                            </HStack>
                          </Box>
                        ))}
                      </VStack>
                    </Tabs.Content>

                    {/* --- New Admin Tabs --- */}

                    {/* Teams Admin */}
                    <Tabs.Content value="team-ctrl" p="6">
                    <VStack align="start" gap="5">
                      <Text fontWeight="700" fontSize="lg" color={colors.textPrimary}>Team Management</Text>
                      <Box w="full" p="5" rounded="xl" bg={colors.bgSecondary} border="1px solid" borderColor={colors.borderMedium}>
                        <VStack gap="3" align="stretch">
                          <Input placeholder="Team ID" value={teamAdminId} onChange={e => setTeamAdminId(e.target.value)}
                            bg={colors.bgPrimary} color={colors.textPrimary} border="1px solid" borderColor={colors.borderMedium} size="sm"
                            _placeholder={{ color: colors.textSubtle }} _focus={{ borderColor: colors.accentOrange }} />
                          <HStack gap="3">
                            <Input placeholder="New Tier (Master/Diamond/...)" value={teamAdminTier} onChange={e => setTeamAdminTier(e.target.value)}
                              bg={colors.bgPrimary} color={colors.textPrimary} border="1px solid" borderColor={colors.borderMedium} size="sm"
                              _placeholder={{ color: colors.textSubtle }} _focus={{ borderColor: colors.accentOrange }} />
                            <Input placeholder="New ELO" type="number" value={teamAdminElo} onChange={e => setTeamAdminElo(e.target.value)}
                              bg={colors.bgPrimary} color={colors.textPrimary} border="1px solid" borderColor={colors.borderMedium} size="sm"
                              _placeholder={{ color: colors.textSubtle }} _focus={{ borderColor: colors.accentOrange }} />
                          </HStack>
                          {teamAdminMsg && <Text fontSize="xs" color={teamAdminMsg.includes('updated') ? '#22c55e' : '#ef4444'}>{teamAdminMsg}</Text>}
                          <Button colorPalette="orange" size="sm" alignSelf="flex-end" onClick={handleAdminTeam} loading={teamAdminLoading}>Update Team</Button>
                        </VStack>
                      </Box>
                    </VStack>
                  </Tabs.Content>

                  {/* Players Admin */}
                  <Tabs.Content value="player-ctrl" p="6">
                    <VStack align="start" gap="5">
                      <Text fontWeight="700" fontSize="lg" color={colors.textPrimary}>Player Management</Text>
                      <Box w="full" p="5" rounded="xl" bg={colors.bgSecondary} border="1px solid" borderColor={colors.borderMedium}>
                        <VStack gap="3" align="stretch">
                          <Input placeholder="Player Discord ID" value={playerAdminId} onChange={e => setPlayerAdminId(e.target.value)}
                            bg={colors.bgPrimary} color={colors.textPrimary} border="1px solid" borderColor={colors.borderMedium} size="sm"
                            _placeholder={{ color: colors.textSubtle }} _focus={{ borderColor: '#ef4444' }} />
                          <HStack gap="2">
                            {['ban', 'unban'].map(a => (
                              <Button key={a} size="sm" bg={playerAdminAction === a ? 'rgba(239,68,68,0.15)' : '#0a0a0a'}
                                border="1px solid" borderColor={playerAdminAction === a ? 'rgba(239,68,68,0.4)' : colors.borderMedium}
                                color={playerAdminAction === a ? '#ef4444' : colors.textMuted} rounded="lg" fontWeight="700"
                                onClick={() => setPlayerAdminAction(a)}>{a.charAt(0).toUpperCase() + a.slice(1)}</Button>
                            ))}
                          </HStack>
                          <Input placeholder="Reason" value={playerAdminReason} onChange={e => setPlayerAdminReason(e.target.value)}
                            bg={colors.bgPrimary} color={colors.textPrimary} border="1px solid" borderColor={colors.borderMedium} size="sm"
                            _placeholder={{ color: colors.textSubtle }} _focus={{ borderColor: '#ef4444' }} />
                          {playerAdminMsg && <Text fontSize="xs" color={playerAdminMsg.includes('banned') || playerAdminMsg.includes('unbanned') ? '#22c55e' : '#ef4444'}>{playerAdminMsg}</Text>}
                          <Button colorPalette="red" size="sm" alignSelf="flex-end" onClick={handleAdminPlayer} loading={playerAdminLoading}>Apply Action</Button>
                        </VStack>
                      </Box>
                    </VStack>
                  </Tabs.Content>

                  {/* Match Control */}
                  <Tabs.Content value="match-ctrl" p="6">
                    <VStack align="start" gap="5">
                      <Text fontWeight="700" fontSize="lg" color={colors.textPrimary}>Match Control</Text>
                      <Box w="full" p="5" rounded="xl" bg={colors.bgSecondary} border="1px solid" borderColor={colors.borderMedium}>
                        <VStack gap="3" align="stretch">
                          <Input placeholder="Match ID" value={matchAdminId} onChange={e => setMatchAdminId(e.target.value)}
                            bg={colors.bgPrimary} color={colors.textPrimary} border="1px solid" borderColor={colors.borderMedium} size="sm"
                            _placeholder={{ color: colors.textSubtle }} _focus={{ borderColor: colors.accentOrange }} />
                          <HStack gap="2" flexWrap="wrap">
                            {['force_report', 'forfeit', 'swap_teams'].map(a => (
                              <Button key={a} size="sm" bg={matchAdminAction === a ? 'rgba(255,107,43,0.15)' : '#0a0a0a'}
                                border="1px solid" borderColor={matchAdminAction === a ? 'rgba(255,107,43,0.4)' : colors.borderMedium}
                                color={matchAdminAction === a ? '#ff6b2b' : colors.textMuted} rounded="lg" fontWeight="700"
                                onClick={() => setMatchAdminAction(a)}>{a.replace(/_/g, ' ')}</Button>
                            ))}
                          </HStack>
                          <Input placeholder="Winner team ID (if applicable)" value={matchAdminWinner} onChange={e => setMatchAdminWinner(e.target.value)}
                            bg={colors.bgPrimary} color={colors.textPrimary} border="1px solid" borderColor={colors.borderMedium} size="sm"
                            _placeholder={{ color: colors.textSubtle }} _focus={{ borderColor: colors.accentOrange }} />
                          <Input placeholder="Admin note" value={matchAdminNote} onChange={e => setMatchAdminNote(e.target.value)}
                            bg={colors.bgPrimary} color={colors.textPrimary} border="1px solid" borderColor={colors.borderMedium} size="sm"
                            _placeholder={{ color: colors.textSubtle }} _focus={{ borderColor: colors.accentOrange }} />
                          {matchAdminMsg && <Text fontSize="xs" color={matchAdminMsg.includes('updated') ? '#22c55e' : '#ef4444'}>{matchAdminMsg}</Text>}
                          <Button colorPalette="orange" size="sm" alignSelf="flex-end" onClick={handleAdminMatch} loading={matchAdminLoading}>Execute</Button>
                        </VStack>
                      </Box>
                    </VStack>
                  </Tabs.Content>

                  {/* Audit Log */}
                  <Tabs.Content value="audit" p="6">
                    <VStack align="start" gap="5" w="full">
                      <HStack justify="space-between" w="full">
                        <Text fontWeight="700" fontSize="lg" color={colors.textPrimary}>Audit Log</Text>
                        <Button size="sm" bg={colors.bgSecondary} border="1px solid" borderColor={colors.borderMedium} color={colors.textMuted} onClick={loadAuditLog} loading={auditLoading}>Refresh</Button>
                      </HStack>
                      {auditLoading && <HStack justify="center" w="full" py="8"><Spinner color="#ff6b2b" /></HStack>}
                      {!auditLoading && auditLog.length === 0 && <Text fontSize="sm" color={colors.textMuted}>No audit entries yet. Click Refresh to load.</Text>}
                      <VStack gap="2" align="stretch" w="full">
                        {auditLog.map(entry => (
                          <Box key={entry.id} bg={colors.bgSecondary} border="1px solid" borderColor={colors.borderMedium} rounded="xl" p="3">
                            <HStack justify="space-between" flexWrap="wrap" gap="1">
                              <HStack gap="2">
                                <Badge colorPalette="orange" size="xs">{entry.action?.replace(/_/g, ' ')}</Badge>
                                {entry.teamId && <Text fontSize="xs" color={colors.textMuted}>team: {entry.teamId.slice(0, 8)}</Text>}
                                {entry.targetDiscordId && <Text fontSize="xs" color={colors.textMuted}>player: {entry.targetDiscordId.slice(0, 8)}</Text>}
                              </HStack>
                              <Text fontSize="2xs" color={colors.textSubtle}>{new Date(entry.createdAt).toLocaleString()}</Text>
                            </HStack>
                            {entry.reason && <Text fontSize="xs" color={colors.textSecondary} mt="1">{entry.reason}</Text>}
                            {entry.note && <Text fontSize="xs" color={colors.textSecondary} mt="1">{entry.note}</Text>}
                          </Box>
                        ))}
                      </VStack>
                    </VStack>
                  </Tabs.Content>

                  </Box>
                </HStack>
              </Tabs.Root>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default AdminPanel;
