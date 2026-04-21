import { Dialog, Portal, Box, VStack, HStack, Text, Button, CloseButton, Badge, Tabs, Input } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Users, UserMinus, UserPlus, Crown, LogOut, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { getThemedColors } from '../theme/colors';
import { useAuth } from '../hooks/useAuth';
import { useTeamManagement } from '../hooks/useTeamManagement';

const ROLE_COLORS = { captain: '#ffd700', cocaptain: '#00bfff', player: 'rgba(255,255,255,0.5)' };

const TeamManagementPanel = ({ open, onClose, teamId, theme, onTeamUpdate }) => {
  const colors = getThemedColors(theme);
  const { user } = useAuth();
  const { getTeam, invitePlayer, kickPlayer, leaveTeam, transferCaptain, disbandTeam, loading, error } = useTeamManagement();
  const [team, setTeam] = useState(null);
  const [activeTab, setActiveTab] = useState('roster');
  const [inviteTarget, setInviteTarget] = useState('');
  const [inviteUsername, setInviteUsername] = useState('');
  const [transferTarget, setTransferTarget] = useState('');
  const [message, setMessage] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    if (open && teamId) {
      getTeam(teamId).then(d => setTeam(d.team)).catch(() => {});
    }
  }, [open, teamId]);

  const refresh = () => getTeam(teamId).then(d => { setTeam(d.team); onTeamUpdate?.(d.team); }).catch(() => {});

  const isCaptain = team?.captainDiscordId === user?.id || team?.coCaptainDiscordId === user?.id;

  const notify = (msg, type = 'success') => {
    setMessage({ msg, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleInvite = async () => {
    if (!inviteTarget) return;
    try {
      await invitePlayer(teamId, inviteTarget, inviteUsername || inviteTarget);
      notify('Invite sent!');
      setInviteTarget('');
      setInviteUsername('');
    } catch (e) { notify(e.message, 'error'); }
  };

  const handleKick = async (targetId) => {
    try {
      await kickPlayer(teamId, targetId);
      notify('Player removed');
      await refresh();
    } catch (e) { notify(e.message, 'error'); }
  };

  const handleLeave = async () => {
    try {
      await leaveTeam(teamId);
      notify('You left the team');
      onClose();
    } catch (e) { notify(e.message, 'error'); }
  };

  const handleTransfer = async () => {
    if (!transferTarget) return;
    try {
      await transferCaptain(teamId, transferTarget);
      notify('Captain transferred');
      await refresh();
      setTransferTarget('');
    } catch (e) { notify(e.message, 'error'); }
  };

  const handleDisband = async () => {
    try {
      await disbandTeam(teamId);
      notify('Team disbanded');
      onClose();
    } catch (e) { notify(e.message, 'error'); }
  };

  const tabStyle = { color: colors.textMuted, fontWeight: '600', fontSize: 'sm', px: '4', py: '2.5' };
  const selectedTabStyle = { color: '#ff6b2b', borderBottom: '2px solid #ff6b2b' };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="lg">
      <Portal>
        <Dialog.Backdrop bg="rgba(0,0,0,0.85)" backdropFilter="blur(12px)" />
        <Dialog.Positioner>
          <Dialog.Content bg="#0d0d0d" border="1px solid rgba(255,107,43,0.3)" rounded="2xl" boxShadow="0 0 60px rgba(255,107,43,0.15)" maxH="90vh" display="flex" flexDir="column">
            <Dialog.Header bg="#111111" borderBottom="1px solid rgba(255,255,255,0.08)" px="6" py="4">
              <HStack justify="space-between">
                <HStack gap="3">
                  <Box bg="rgba(255,107,43,0.15)" border="1px solid rgba(255,107,43,0.3)" p="2" rounded="lg">
                    <Users size={18} color="#ff6b2b" />
                  </Box>
                  <VStack align="start" gap="0">
                    <Dialog.Title fontSize="md" fontWeight="800" color={colors.textPrimary}>{team?.name || 'Team Management'}</Dialog.Title>
                    <Text fontSize="xs" color={colors.textMuted}>{team?.players?.length || 0} players · {team?.tier} · {team?.region}</Text>
                  </VStack>
                </HStack>
                <Dialog.CloseTrigger asChild><CloseButton size="sm" color={colors.textMuted} /></Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>

            {message && (
              <Box px="6" py="2" bg={message.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)'} borderBottom="1px solid" borderColor={message.type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}>
                <HStack gap="2">
                  {message.type === 'error' ? <AlertTriangle size={13} color="#ef4444" /> : <CheckCircle size={13} color="#22c55e" />}
                  <Text fontSize="xs" color={message.type === 'error' ? '#ef4444' : '#22c55e'}>{message.msg}</Text>
                </HStack>
              </Box>
            )}

            <Tabs.Root value={activeTab} onValueChange={e => setActiveTab(e.value)} flex="1" overflow="hidden" display="flex" flexDir="column">
              <Tabs.List bg="#111111" borderBottom="1px solid rgba(255,255,255,0.08)" px="4" gap="0">
                {['roster', ...(isCaptain ? ['invite', 'danger'] : ['leave'])].map(tab => (
                  <Tabs.Trigger key={tab} value={tab} {...tabStyle} _selected={selectedTabStyle}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>

              <Dialog.Body flex="1" overflowY="auto" p="5">
                {/* ROSTER */}
                <Tabs.Content value="roster">
                  <VStack gap="2" align="stretch">
                    {(team?.players || []).map(p => (
                      <Box key={p.discordId} bg="#111111" border="1px solid rgba(255,255,255,0.07)" rounded="xl" px="4" py="3">
                        <HStack justify="space-between">
                          <HStack gap="3">
                            <Box w="8" h="8" bg="rgba(255,107,43,0.1)" border="1px solid rgba(255,107,43,0.2)" rounded="lg" display="flex" alignItems="center" justifyContent="center">
                              {p.role === 'captain' && <Crown size={14} color="#ffd700" />}
                              {p.role !== 'captain' && <Text fontSize="xs" color={colors.textMuted}>{p.username?.charAt(0)?.toUpperCase()}</Text>}
                            </Box>
                            <VStack align="start" gap="0">
                              <Text fontSize="sm" fontWeight="700" color={colors.textPrimary}>{p.username}</Text>
                              <Badge bg="rgba(255,255,255,0.05)" color={ROLE_COLORS[p.role] || colors.textMuted} border="none" fontSize="2xs" textTransform="capitalize">{p.role}</Badge>
                            </VStack>
                          </HStack>
                          {isCaptain && p.discordId !== user?.id && p.discordId !== team?.captainDiscordId && (
                            <Button size="xs" bg="rgba(239,68,68,0.1)" border="1px solid rgba(239,68,68,0.3)" color="#ef4444" rounded="lg" fontWeight="700"
                              onClick={() => setConfirmAction({ label: `Kick ${p.username}?`, action: () => handleKick(p.discordId) })}>
                              <UserMinus size={12} />
                            </Button>
                          )}
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                </Tabs.Content>

                {/* INVITE (captain only) */}
                <Tabs.Content value="invite">
                  <VStack gap="4" align="stretch">
                    <Text fontSize="xs" color={colors.textMuted}>Enter the Discord ID and username of the player to invite.</Text>
                    <VStack gap="2" align="stretch">
                      <Input placeholder="Discord ID (e.g. 123456789)" value={inviteTarget} onChange={e => setInviteTarget(e.target.value)}
                        bg="#111111" border="1px solid rgba(255,255,255,0.1)" color="white" rounded="xl"
                        _placeholder={{ color: 'rgba(255,255,255,0.25)' }} _focus={{ borderColor: '#ff6b2b', outline: 'none' }} />
                      <Input placeholder="Username (e.g. PlayerName)" value={inviteUsername} onChange={e => setInviteUsername(e.target.value)}
                        bg="#111111" border="1px solid rgba(255,255,255,0.1)" color="white" rounded="xl"
                        _placeholder={{ color: 'rgba(255,255,255,0.25)' }} _focus={{ borderColor: '#ff6b2b', outline: 'none' }} />
                      <Button bg="linear-gradient(135deg,#ff6b2b,#ff8c42)" color="white" fontWeight="700" rounded="xl"
                        disabled={!inviteTarget || loading} loading={loading} onClick={handleInvite}>
                        <UserPlus size={14} /> Send Invite
                      </Button>
                    </VStack>
                  </VStack>
                </Tabs.Content>

                {/* DANGER (captain only) */}
                <Tabs.Content value="danger">
                  <VStack gap="4" align="stretch">
                    {/* Transfer Captain */}
                    <Box bg="rgba(255,215,0,0.05)" border="1px solid rgba(255,215,0,0.15)" rounded="xl" p="4">
                      <HStack gap="2" mb="3">
                        <Crown size={14} color="#ffd700" />
                        <Text fontSize="sm" fontWeight="700" color="#ffd700">Transfer Captain</Text>
                      </HStack>
                      <VStack gap="2" align="stretch">
                        <Input placeholder="New captain's Discord ID" value={transferTarget} onChange={e => setTransferTarget(e.target.value)}
                          bg="#111111" border="1px solid rgba(255,255,255,0.1)" color="white" rounded="xl" size="sm"
                          _placeholder={{ color: 'rgba(255,255,255,0.25)' }} _focus={{ borderColor: '#ffd700', outline: 'none' }} />
                        <Button size="sm" bg="rgba(255,215,0,0.1)" border="1px solid rgba(255,215,0,0.3)" color="#ffd700" rounded="lg" fontWeight="700"
                          disabled={!transferTarget || loading} onClick={handleTransfer}>
                          Transfer
                        </Button>
                      </VStack>
                    </Box>

                    {/* Disband Team */}
                    <Box bg="rgba(239,68,68,0.05)" border="1px solid rgba(239,68,68,0.2)" rounded="xl" p="4">
                      <HStack gap="2" mb="3">
                        <Trash2 size={14} color="#ef4444" />
                        <Text fontSize="sm" fontWeight="700" color="#ef4444">Disband Team</Text>
                      </HStack>
                      <Text fontSize="xs" color={colors.textMuted} mb="3">This permanently disbands the team. All members will be removed.</Text>
                      <Button size="sm" bg="rgba(239,68,68,0.1)" border="1px solid rgba(239,68,68,0.3)" color="#ef4444" rounded="lg" fontWeight="700"
                        loading={loading} onClick={() => setConfirmAction({ label: 'Disband team permanently?', action: handleDisband })}>
                        Disband Team
                      </Button>
                    </Box>
                  </VStack>
                </Tabs.Content>

                {/* LEAVE (non-captain) */}
                <Tabs.Content value="leave">
                  <VStack gap="4" align="stretch" py="4">
                    <Box bg="rgba(239,68,68,0.05)" border="1px solid rgba(239,68,68,0.2)" rounded="xl" p="4">
                      <HStack gap="2" mb="3">
                        <LogOut size={14} color="#ef4444" />
                        <Text fontSize="sm" fontWeight="700" color="#ef4444">Leave Team</Text>
                      </HStack>
                      <Text fontSize="xs" color={colors.textMuted} mb="3">You'll be removed from {team?.name}. You can join another team after.</Text>
                      <Button size="sm" bg="rgba(239,68,68,0.1)" border="1px solid rgba(239,68,68,0.3)" color="#ef4444" rounded="lg" fontWeight="700"
                        loading={loading} onClick={() => setConfirmAction({ label: `Leave ${team?.name}?`, action: handleLeave })}>
                        Leave Team
                      </Button>
                    </Box>
                  </VStack>
                </Tabs.Content>
              </Dialog.Body>
            </Tabs.Root>

            {/* Confirm overlay */}
            {confirmAction && (
              <Box position="absolute" inset="0" bg="rgba(0,0,0,0.75)" backdropFilter="blur(8px)" display="flex" alignItems="center" justifyContent="center" zIndex="10" rounded="2xl">
                <VStack gap="4" bg="#0d0d0d" border="1px solid rgba(239,68,68,0.4)" rounded="xl" p="6" w="72" textAlign="center">
                  <AlertTriangle size={32} color="#ef4444" />
                  <Text fontSize="sm" fontWeight="700" color="white">{confirmAction.label}</Text>
                  <HStack gap="3">
                    <Button size="sm" bg="#111111" border="1px solid rgba(255,255,255,0.1)" color={colors.textMuted} rounded="lg" onClick={() => setConfirmAction(null)}>Cancel</Button>
                    <Button size="sm" bg="rgba(239,68,68,0.15)" border="1px solid rgba(239,68,68,0.4)" color="#ef4444" rounded="lg" fontWeight="700"
                      onClick={() => { confirmAction.action(); setConfirmAction(null); }}>Confirm</Button>
                  </HStack>
                </VStack>
              </Box>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default TeamManagementPanel;
