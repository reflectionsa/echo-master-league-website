import { Dialog, Portal, Box, VStack, HStack, Text, Button, CloseButton, Badge, Tabs, Input, Image } from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import { Users, UserMinus, UserPlus, Crown, LogOut, Trash2, AlertTriangle, CheckCircle, Image as ImageIcon, X, Upload } from 'lucide-react';
import { getThemedColors } from '../theme/colors';
import { useAuth } from '../hooks/useAuth';
import { useTeamManagement } from '../hooks/useTeamManagement';
import { emlApi } from '../hooks/useEmlApi';

const _slug = (s) => (s || '').replace(/\s+/g, '_').toLowerCase();

const readFile = (file) => new Promise((resolve, reject) => {
  if (!['image/png', 'image/jpeg'].includes(file.type)) { reject(new Error('Only PNG and JPG images are allowed.')); return; }
  if (file.size > 2 * 1024 * 1024) { reject(new Error('File must be under 2 MB.')); return; }
  const reader = new FileReader();
  reader.onload = (e) => resolve(e.target.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

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

  // Branding state
  const [brandingLogo, setBrandingLogo] = useState(null);
  const [brandingBanner, setBrandingBanner] = useState(null);
  const [brandingMsg, setBrandingMsg] = useState(null);
  const [brandingSaving, setBrandingSaving] = useState(false);
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  useEffect(() => {
    if (open && teamId) {
      getTeam(teamId).then(d => setTeam(d.team)).catch(() => {});
    }
  }, [open, teamId]);

  // Load existing team assets from worker
  useEffect(() => {
    if (!open || !team?.name) return;
    const slug = _slug(team.name);
    emlApi('GET', `/team/assets/${encodeURIComponent(slug)}`)
      .then(d => {
        if (d.assets?.logoUrl) setBrandingLogo(d.assets.logoUrl);
        if (d.assets?.bannerUrl) setBrandingBanner(d.assets.bannerUrl);
      })
      .catch(() => {});
  }, [open, team?.name]);

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

  const handleLogoFile = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    try { setBrandingLogo(await readFile(file)); } catch (err) { setBrandingMsg({ text: err.message, type: 'error' }); }
    e.target.value = '';
  };
  const handleBannerFile = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    try { setBrandingBanner(await readFile(file)); } catch (err) { setBrandingMsg({ text: err.message, type: 'error' }); }
    e.target.value = '';
  };

  const saveBranding = async () => {
    if (!team?.name || !user?.id) return;
    setBrandingSaving(true);
    setBrandingMsg(null);
    try {
      await emlApi('POST', '/team/assets', {
        teamSlug: _slug(team.name),
        captainDiscordId: user.id,
        logoUrl: brandingLogo !== undefined ? brandingLogo : undefined,
        bannerUrl: brandingBanner !== undefined ? brandingBanner : undefined,
      });
      setBrandingMsg({ text: 'Branding saved! Others will see the update.', type: 'success' });
    } catch (err) {
      setBrandingMsg({ text: err.message, type: 'error' });
    } finally {
      setBrandingSaving(false);
    }
  };

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
                {['roster', ...(isCaptain ? ['invite', 'branding', 'danger'] : ['leave'])].map(tab => (
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

                {/* BRANDING (captain only) */}
                <Tabs.Content value="branding">
                  <VStack gap="5" align="stretch">
                    {brandingMsg && (
                      <HStack gap="2" bg={brandingMsg.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)'}
                        border="1px solid" borderColor={brandingMsg.type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}
                        p="3" rounded="lg">
                        {brandingMsg.type === 'error' ? <AlertTriangle size={13} color="#ef4444" /> : <CheckCircle size={13} color="#22c55e" />}
                        <Text fontSize="xs" color={brandingMsg.type === 'error' ? '#ef4444' : '#22c55e'}>{brandingMsg.text}</Text>
                      </HStack>
                    )}

                    {/* Team Logo */}
                    <Box bg="rgba(255,107,43,0.05)" border="1px solid rgba(255,107,43,0.15)" rounded="xl" p="4">
                      <HStack gap="2" mb="3">
                        <ImageIcon size={14} color="#ff6b2b" />
                        <Text fontSize="sm" fontWeight="700" color="#ff6b2b">Team Logo</Text>
                      </HStack>
                      <HStack gap="3" align="center">
                        {brandingLogo ? (
                          <>
                            <Box w="12" h="12" rounded="lg" overflow="hidden" border="1px solid rgba(255,107,43,0.3)" flexShrink={0}>
                              <Image src={brandingLogo} alt="Logo" w="full" h="full" objectFit="contain" />
                            </Box>
                            <Button size="xs" bg="rgba(239,68,68,0.1)" border="1px solid rgba(239,68,68,0.3)" color="#ef4444" rounded="lg"
                              onClick={() => { setBrandingLogo(null); }} title="Reset logo">
                              <X size={12} /> Reset Logo
                            </Button>
                          </>
                        ) : (
                          <Text fontSize="xs" color={colors.textMuted}>No logo set</Text>
                        )}
                        <input ref={logoInputRef} type="file" accept=".png,.jpg,.jpeg" style={{ display: 'none' }} onChange={handleLogoFile} />
                        <Button size="xs" bg="#111111" border="1px solid rgba(255,255,255,0.1)" color={colors.textMuted} rounded="lg"
                          onClick={() => logoInputRef.current?.click()} ml="auto">
                          <Upload size={12} /> Choose Logo
                        </Button>
                      </HStack>
                    </Box>

                    {/* Team Banner */}
                    <Box bg="rgba(255,107,43,0.05)" border="1px solid rgba(255,107,43,0.15)" rounded="xl" p="4">
                      <HStack gap="2" mb="3">
                        <ImageIcon size={14} color="#ff6b2b" />
                        <Text fontSize="sm" fontWeight="700" color="#ff6b2b">Team Banner</Text>
                      </HStack>
                      {brandingBanner && (
                        <Box mb="3" rounded="lg" overflow="hidden" border="1px solid rgba(255,107,43,0.2)" maxH="80px">
                          <Image src={brandingBanner} alt="Banner" w="full" h="80px" objectFit="cover" />
                        </Box>
                      )}
                      <HStack gap="3">
                        {brandingBanner ? (
                          <Button size="xs" bg="rgba(239,68,68,0.1)" border="1px solid rgba(239,68,68,0.3)" color="#ef4444" rounded="lg"
                            onClick={() => { setBrandingBanner(null); }} title="Reset banner">
                            <X size={12} /> Reset Banner
                          </Button>
                        ) : (
                          <Text fontSize="xs" color={colors.textMuted}>No banner set</Text>
                        )}
                        <input ref={bannerInputRef} type="file" accept=".png,.jpg,.jpeg" style={{ display: 'none' }} onChange={handleBannerFile} />
                        <Button size="xs" bg="#111111" border="1px solid rgba(255,255,255,0.1)" color={colors.textMuted} rounded="lg"
                          onClick={() => bannerInputRef.current?.click()} ml="auto">
                          <Upload size={12} /> Choose Banner
                        </Button>
                      </HStack>
                    </Box>

                    <Button bg="linear-gradient(135deg,#ff6b2b,#ff8c42)" color="white" fontWeight="700" rounded="xl"
                      loading={brandingSaving} onClick={saveBranding}>
                      Save Branding
                    </Button>
                    <Text fontSize="2xs" color={colors.textMuted}>PNG/JPG only · Logo max 2 MB · Banner max 2 MB. Changes are visible to all users.</Text>
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
