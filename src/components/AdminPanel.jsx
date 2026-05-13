import {
  Box, Dialog, Portal, CloseButton, HStack, VStack, Text, Badge,
  Button, Tabs, Input, Textarea, Select, Spinner, createListCollection
} from '@chakra-ui/react';
import { Shield, FileText, Users, Trophy, Terminal, Zap, Video, UserX, AlertTriangle, ClipboardList, ChevronDown } from 'lucide-react';
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

  // Command form state
  const [selectedCmd, setSelectedCmd] = useState(null);
  const [cmdMsg, setCmdMsg] = useState('');
  const [cmdLoading, setCmdLoading] = useState(false);
  const [teamCreateName, setTeamCreateName] = useState('');
  const [teamCreateCaptain, setTeamCreateCaptain] = useState('');
  const [teamDisbandId, setTeamDisbandId] = useState('');
  const [teamPlayerAddTeamId, setTeamPlayerAddTeamId] = useState('');
  const [teamPlayerAddPlayerId, setTeamPlayerAddPlayerId] = useState('');
  const [teamPlayerRemoveTeamId, setTeamPlayerRemoveTeamId] = useState('');
  const [teamPlayerRemovePlayerId, setTeamPlayerRemovePlayerId] = useState('');
  const [suspendDuration, setSuspendDuration] = useState('');

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

  const renderCmdForm = (cmd) => {
    const inp = {
      bg: colors.bgPrimary,
      color: colors.textPrimary,
      border: '1px solid',
      borderColor: colors.borderMedium,
      size: 'sm',
      _placeholder: { color: colors.textSubtle },
      _focus: { borderColor: colors.accentOrange },
    };
    switch (cmd) {
      case '/zadminmatchentry':
      case '/z_forfeit':
        return (
          <>
            <Input placeholder="Match ID (e.g. match-week4-1)" value={matchAdminId} onChange={e => setMatchAdminId(e.target.value)} {...inp} />
            <Input placeholder="Winner Team ID" value={matchAdminWinner} onChange={e => setMatchAdminWinner(e.target.value)} {...inp} />
            <Input placeholder="Admin note (optional)" value={matchAdminNote} onChange={e => setMatchAdminNote(e.target.value)} {...inp} />
          </>
        );
      case '/z_player_register':
      case '/z_player_unregister':
        return (
          <>
            <Input placeholder="Player Discord ID or mention" value={playerAdminId} onChange={e => setPlayerAdminId(e.target.value)} {...inp} />
            <Input placeholder="Reason (optional)" value={playerAdminReason} onChange={e => setPlayerAdminReason(e.target.value)} {...inp} />
          </>
        );
      case '/z_team_create':
        return (
          <>
            <Input placeholder="Team name" value={teamCreateName} onChange={e => setTeamCreateName(e.target.value)} {...inp} />
            <Input placeholder="Captain Discord ID" value={teamCreateCaptain} onChange={e => setTeamCreateCaptain(e.target.value)} {...inp} />
          </>
        );
      case '/z_team_disband':
        return <Input placeholder="Team ID" value={teamDisbandId} onChange={e => setTeamDisbandId(e.target.value)} {...inp} />;
      case '/z_team_player_add':
        return (
          <>
            <Input placeholder="Team ID" value={teamPlayerAddTeamId} onChange={e => setTeamPlayerAddTeamId(e.target.value)} {...inp} />
            <Input placeholder="Player Discord ID" value={teamPlayerAddPlayerId} onChange={e => setTeamPlayerAddPlayerId(e.target.value)} {...inp} />
          </>
        );
      case '/z_team_player_remove':
        return (
          <>
            <Input placeholder="Team ID" value={teamPlayerRemoveTeamId} onChange={e => setTeamPlayerRemoveTeamId(e.target.value)} {...inp} />
            <Input placeholder="Player Discord ID" value={teamPlayerRemovePlayerId} onChange={e => setTeamPlayerRemovePlayerId(e.target.value)} {...inp} />
          </>
        );
      case '/zadminsuspend':
        return (
          <>
            <Input placeholder="Player Discord ID" value={playerAdminId} onChange={e => setPlayerAdminId(e.target.value)} {...inp} />
            <Input placeholder="Duration (e.g. 7d, 30d, permanent)" value={suspendDuration} onChange={e => setSuspendDuration(e.target.value)} {...inp} />
            <Input placeholder="Reason" value={playerAdminReason} onChange={e => setPlayerAdminReason(e.target.value)} {...inp} />
          </>
        );
      default:
        return null;
    }
  };

  const handleCmdSubmit = async (cmd) => {
    setCmdLoading(true);
    setCmdMsg('');
    try {
      switch (cmd) {
        case '/zadminmatchentry':
          await emlApi('POST', '/admin/match', { adminDiscordId: user.id, matchId: matchAdminId, action: 'force_report', winner: matchAdminWinner, note: matchAdminNote });
          setCmdMsg('Match result recorded.');
          break;
        case '/z_forfeit':
          await emlApi('POST', '/admin/match', { adminDiscordId: user.id, matchId: matchAdminId, action: 'forfeit', winner: matchAdminWinner, note: matchAdminNote });
          setCmdMsg('Match forfeited.');
          break;
        case '/z_player_register':
          await emlApi('POST', '/admin/player', { adminDiscordId: user.id, targetDiscordId: playerAdminId, action: 'register', reason: playerAdminReason });
          setCmdMsg('Player registered.');
          break;
        case '/z_player_unregister':
          await emlApi('POST', '/admin/player', { adminDiscordId: user.id, targetDiscordId: playerAdminId, action: 'unregister', reason: playerAdminReason });
          setCmdMsg('Player unregistered.');
          break;
        case '/z_team_create':
          await emlApi('POST', '/admin/team', { adminDiscordId: user.id, teamName: teamCreateName, captainDiscordId: teamCreateCaptain, action: 'create' });
          setCmdMsg('Team created.');
          break;
        case '/z_team_disband':
          await emlApi('POST', '/admin/team', { adminDiscordId: user.id, teamId: teamDisbandId, action: 'disband' });
          setCmdMsg('Team disbanded.');
          break;
        case '/z_team_player_add':
          await emlApi('POST', '/admin/team', { adminDiscordId: user.id, teamId: teamPlayerAddTeamId, playerDiscordId: teamPlayerAddPlayerId, action: 'add_player' });
          setCmdMsg('Player added to team.');
          break;
        case '/z_team_player_remove':
          await emlApi('POST', '/admin/team', { adminDiscordId: user.id, teamId: teamPlayerRemoveTeamId, playerDiscordId: teamPlayerRemovePlayerId, action: 'remove_player' });
          setCmdMsg('Player removed from team.');
          break;
        case '/zadminsuspend':
          await emlApi('POST', '/admin/player', { adminDiscordId: user.id, targetDiscordId: playerAdminId, action: 'ban', reason: playerAdminReason, duration: suspendDuration });
          setCmdMsg('Player suspended.');
          break;
        default:
          setCmdMsg('No backend integration for this command.');
      }
    } catch (e) { setCmdMsg(e.message || 'Error executing command.'); } finally { setCmdLoading(false); }
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
                  <CloseButton size="md" color={colors.textPrimary} _hover={{ color: colors.accentOrange }} />
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
                      <VStack align="start" gap="4">
                        <VStack align="start" gap="1">
                          <Text fontWeight="700" fontSize="lg" color={colors.textPrimary}>
                            Bot Commands
                          </Text>
                          <Text fontSize="sm" color={colors.textMuted}>
                            Click a command to expand and fill in the parameters, then execute.
                          </Text>
                        </VStack>

                        {[
                          { cmd: '/zadminmatchentry', desc: 'Enter a match result on behalf of two teams.', color: colors.accentOrange, label: 'Match', hasForm: true },
                          { cmd: '/z_forfeit', desc: 'ADMIN: Forfeit a match between two teams (reconciliation).', color: colors.accentOrange, label: 'Match', hasForm: true },
                          { cmd: '/z_player_register', desc: 'ADMIN: Register a player into the League. Accepts a Discord mention or raw ID.', color: colors.accentBlue, label: 'Player', hasForm: true },
                          { cmd: '/z_player_unregister', desc: 'ADMIN: Unregister (remove) a player from the League. Executes immediately.', color: colors.accentBlue, label: 'Player', hasForm: true },
                          { cmd: '/z_team_create', desc: 'ADMIN: Create a team with an explicit captain (reconciliation).', color: colors.accentBlue, label: 'Team', hasForm: true },
                          { cmd: '/z_team_disband', desc: 'ADMIN: Disband a team historically (reconciliation).', color: colors.accentBlue, label: 'Team', hasForm: true },
                          { cmd: '/z_team_player_add', desc: 'ADMIN: Add a player to a team historically (reconciliation).', color: colors.accentBlue, label: 'Team', hasForm: true },
                          { cmd: '/z_team_player_remove', desc: 'ADMIN: Remove a player from a team historically (reconciliation).', color: colors.accentBlue, label: 'Team', hasForm: true },
                          { cmd: '/zadminfixroles', desc: 'Fix Discord Roles — perform a manual accounting of server and league roles.', color: colors.accentOrange, label: 'Roles', hasForm: false },
                          { cmd: '/zadminsuspend', desc: 'Suspend a Player — manually suspend a player for a specific duration. If the player is a captain, their team is disbanded.', color: colors.accentOrange, label: 'Moderation', hasForm: true },
                          { cmd: '/zadmingenerateuuid', desc: 'Generate a UUID — perform UUID generation and related wizardry.', color: colors.accentBlue, label: 'Utility', hasForm: false },
                          { cmd: '/zdebugdbcache', desc: 'Debug the local cache.', color: colors.accentBlue, label: 'Debug', hasForm: false },
                          { cmd: '/zdebugdbqueue', desc: 'Debug the pending writes.', color: colors.accentBlue, label: 'Debug', hasForm: false },
                        ].map(({ cmd, desc, color, label, hasForm }) => (
                          <Box
                            key={cmd}
                            w="full"
                            rounded="xl"
                            bg={colors.bgSecondary}
                            border="1px solid"
                            borderColor={selectedCmd === cmd ? `${color}66` : colors.borderMedium}
                            overflow="hidden"
                            transition="border-color 0.2s"
                          >
                            <HStack
                              p="4"
                              gap="3"
                              cursor={hasForm ? 'pointer' : 'default'}
                              onClick={() => {
                                if (!hasForm) return;
                                if (selectedCmd !== cmd) setCmdMsg('');
                                setSelectedCmd(selectedCmd === cmd ? null : cmd);
                              }}
                              _hover={hasForm ? { bg: colors.bgHover } : {}}
                              transition="background 0.15s"
                            >
                              <Terminal size={16} color={color} style={{ marginTop: 2, flexShrink: 0 }} />
                              <VStack align="start" gap="1" flex="1">
                                <HStack gap="2" flexWrap="wrap">
                                  <Text fontFamily="mono" fontWeight="700" fontSize="sm" color={colors.textPrimary}>{cmd}</Text>
                                  <Box px="2" py="0.5" rounded="md" fontSize="xs" fontWeight="700" bg={`${color}22`} color={color} border="1px solid" borderColor={`${color}44`} letterSpacing="wide">{label}</Box>
                                </HStack>
                                <Text fontSize="xs" color={colors.textSecondary}>{desc}</Text>
                              </VStack>
                              {hasForm && (
                                <ChevronDown
                                  size={16}
                                  color={colors.textMuted}
                                  style={{ transform: selectedCmd === cmd ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
                                />
                              )}
                            </HStack>

                            {selectedCmd === cmd && hasForm && (
                              <Box px="4" pb="4" borderTop="1px solid" borderColor={colors.borderMedium}>
                                <VStack gap="3" align="stretch" mt="3">
                                  {renderCmdForm(cmd)}
                                  {cmdMsg && (
                                    <Text fontSize="xs" color={cmdMsg.includes('Error') || cmdMsg.includes('fail') ? '#ef4444' : '#22c55e'}>
                                      {cmdMsg}
                                    </Text>
                                  )}
                                  <Button
                                    colorPalette="orange"
                                    size="sm"
                                    alignSelf="flex-end"
                                    onClick={() => handleCmdSubmit(cmd)}
                                    loading={cmdLoading}
                                  >
                                    Execute
                                  </Button>
                                </VStack>
                              </Box>
                            )}
                          </Box>
                        ))}
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
