import { useState, useRef, useEffect } from 'react';
import {
  Dialog, Portal, Box, VStack, HStack, Text, CloseButton,
  Button, Badge, Textarea, Image,
} from '@chakra-ui/react';
import { Upload, Edit3, Users, Shield, Mic2, User, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useMyTeam } from '../hooks/useMyTeam';
import { getThemedColors } from '../theme/colors';
import { emlApi } from '../hooks/useEmlApi';

// ─── localStorage helpers ──────────────────────────────────────────────────────
const lsGet = (key) => { try { return localStorage.getItem(key) || null; } catch { return null; } };
const lsSet = (key, val) => { try { localStorage.setItem(key, val); } catch {} };

// ─── Role display config ───────────────────────────────────────────────────────
const ROLE_CONFIG = {
  admin: { label: 'Admin', color: '#ef4444', Icon: Shield },
  mod: { label: 'Mod', color: '#7c3aed', Icon: Shield },
  caster: { label: 'Caster', color: '#00bfff', Icon: Mic2 },
  player: { label: 'Player', color: '#3b82f6', Icon: Users },
  viewer: { label: 'Viewer', color: '#9ca3af', Icon: User },
};

// ─── Main component ────────────────────────────────────────────────────────────
const MyProfileModal = ({ theme, open, onClose }) => {
  const colors = getThemedColors(theme);
  const { user } = useAuth();
  const { team, myRole, isOnTeam } = useMyTeam();

  const [profilePic, setProfilePic] = useState(null);
  const [bio, setBio] = useState('');
  const [editingBio, setEditingBio] = useState(false);
  const [picSaving, setPicSaving] = useState(false);
  const [picMsg, setPicMsg] = useState(null);
  const picInputRef = useRef(null);

  useEffect(() => {
    if (!user?.id) return;
    setProfilePic(lsGet(`eml_profile_pic_${user.id}`));
    setBio(lsGet(`eml_profile_bio_${user.id}`) || '');
  }, [user?.id]);

  const handlePicFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg'].includes(file.type)) { setPicMsg({ text: 'Only PNG and JPG allowed.', type: 'error' }); return; }
    if (file.size > 2 * 1024 * 1024) { setPicMsg({ text: 'File must be under 2 MB.', type: 'error' }); return; }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result;
      const nameSlug = displayName.replace(/\s+/g, '_').toLowerCase();
      lsSet(`eml_profile_pic_${user.id}`, dataUrl);
      lsSet(`eml_player_pic_${nameSlug}`, dataUrl);
      setProfilePic(dataUrl);
      setPicSaving(true);
      try {
        await emlApi('POST', '/player/avatar', { nameSlug, avatarUrl: dataUrl });
        setPicMsg({ text: 'Profile picture saved — visible to everyone.', type: 'success' });
      } catch {
        setPicMsg({ text: 'Saved locally. Could not sync to server.', type: 'warn' });
      } finally {
        setPicSaving(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handlePicReset = async () => {
    const nameSlug = displayName.replace(/\s+/g, '_').toLowerCase();
    localStorage.removeItem(`eml_profile_pic_${user.id}`);
    localStorage.removeItem(`eml_player_pic_${nameSlug}`);
    setProfilePic(null);
    setPicMsg(null);
    emlApi('POST', '/player/avatar', { nameSlug, avatarUrl: null }).catch(() => {});
  };

  const saveBio = () => {
    lsSet(`eml_profile_bio_${user.id}`, bio);
    const nameSlug = displayName.replace(/\s+/g, '_').toLowerCase();
    lsSet(`eml_player_bio_${nameSlug}`, bio);
    setEditingBio(false);
  };

  if (!user) return null;

  const roleKey = user.appRole || 'viewer';
  const { label: roleLabel, color: roleColor, Icon: RoleIcon } = ROLE_CONFIG[roleKey] || ROLE_CONFIG.viewer;
  const displayName = user.globalName || user.username;
  const avatarSrc = profilePic || user.avatar;

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="full">
      <Portal>
        <Dialog.Backdrop bg={`${colors.bgPrimary}cc`} backdropFilter="blur(12px)" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="640px"
            w="95vw"
            maxH="88vh"
            bg={colors.bgPrimary}
            border="1px solid"
            borderColor={colors.borderMedium}
            rounded="2xl"
            overflow="hidden"
            display="flex"
            flexDirection="column"
            position="relative"
          >
            {/* Close button */}
            <Box position="absolute" top="4" right="4" zIndex="10">
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" color={colors.textMuted} _hover={{ color: colors.textPrimary }} />
              </Dialog.CloseTrigger>
            </Box>

            <Box overflowY="auto" flex="1">
              <VStack align="stretch" gap="0">

                {/* ─── HEADER gradient (no banner, just a role-tinted strip) ─── */}
                <Box
                  position="relative"
                  h="100px"
                  bg={colors.bgSecondary}
                  overflow="hidden"
                >
                  <Box
                    position="absolute" inset="0"
                    background={`linear-gradient(135deg, ${roleColor}33 0%, ${colors.bgPrimary} 100%)`}
                  />
                  {/* Bottom fade into card background */}
                  <Box
                    position="absolute" bottom="0" left="0" right="0" h="60px"
                    background={`linear-gradient(to top, ${colors.bgPrimary}, transparent)`}
                  />
                </Box>

                {/* ─── AVATAR + NAME ROW ────────────────────────────────────────── */}
                <Box px="6" pb="4" mt="-32px" position="relative" zIndex="1">
                  <HStack align="flex-end" gap="4" mb="4">
                    {/* Avatar — display only, upload handled at the bottom */}
                    <Box
                      w="80px" h="80px" minW="80px"
                      rounded="full"
                      overflow="hidden"
                      border="3px solid"
                      borderColor={colors.bgPrimary}
                      boxShadow={`0 0 0 2px ${roleColor}`}
                      flexShrink={0}
                    >
                      <Image
                        src={avatarSrc}
                        alt={displayName}
                        w="full" h="full"
                        objectFit="cover"
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                    </Box>

                    <VStack align="start" gap="1" pb="1">
                      <Text fontSize="xl" fontWeight="900" color={colors.textPrimary} lineHeight="1">
                        {displayName}
                      </Text>
                      <Text fontSize="xs" color={colors.textMuted}>@{user.username}</Text>
                    </VStack>
                  </HStack>

                  {/* Role + team badges */}
                  <HStack gap="2" flexWrap="wrap" mb="5">
                    <Badge
                      bg={`${roleColor}22`}
                      color={roleColor}
                      border={`1px solid ${roleColor}44`}
                      px="3" py="1" rounded="full"
                      fontSize="xs"
                    >
                      <HStack gap="1">
                        <RoleIcon size={11} />
                        <Text>{roleLabel}</Text>
                      </HStack>
                    </Badge>
                    {isOnTeam && team?.name && (
                      <Badge
                        bg={`${colors.accentOrange}22`}
                        color={colors.accentOrange}
                        border={`1px solid ${colors.accentOrange}44`}
                        px="3" py="1" rounded="full"
                        fontSize="xs"
                      >
                        <HStack gap="1">
                          <Users size={11} />
                          <Text>{team.name} · {myRole}</Text>
                        </HStack>
                      </Badge>
                    )}
                  </HStack>

                  <Box h="1px" bg={colors.borderLight} mb="5" />

                  {/* ─── BIO ──────────────────────────────────────────────────────── */}
                  <HStack mb="3" gap="2" justify="space-between">
                    <Text fontWeight="800" fontSize="xs" color={colors.textMuted} textTransform="uppercase" letterSpacing="wider">
                      About Me
                    </Text>
                    {!editingBio && (
                      <Button size="xs" variant="ghost" color={colors.textMuted} onClick={() => setEditingBio(true)}>
                        <Edit3 size={11} /> Edit
                      </Button>
                    )}
                  </HStack>

                  {editingBio ? (
                    <VStack align="start" gap="2">
                      <Textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Write something about yourself…"
                        size="sm"
                        rows={4}
                        bg={colors.bgElevated}
                        border="1px solid"
                        borderColor={colors.borderMedium}
                        color={colors.textPrimary}
                        rounded="lg"
                        resize="none"
                      />
                      <HStack gap="2">
                        <Button size="xs" bg={colors.accentOrange} color="white" onClick={saveBio}>Save</Button>
                        <Button size="xs" variant="ghost" color={colors.textMuted} onClick={() => setEditingBio(false)}>Cancel</Button>
                      </HStack>
                    </VStack>
                  ) : bio ? (
                    <Text fontSize="sm" color={colors.textSecondary} lineHeight="1.7">{bio}</Text>
                  ) : (
                    <Text
                      fontSize="sm" color={colors.textMuted}
                      cursor="pointer"
                      onClick={() => setEditingBio(true)}
                      _hover={{ color: colors.textSecondary }}
                    >
                      + Add a bio…
                    </Text>
                  )}

                  {/* Upload hint */}
                  <Box h="1px" bg={colors.borderLight} mt="5" mb="5" />

                  {/* ─── PROFILE PICTURE (bottom upload section) ──────────────── */}
                  <Box bg={`${roleColor}0d`} border="1px solid" borderColor={`${roleColor}30`} rounded="xl" p="4">
                    <HStack gap="2" mb="3">
                      <User size={14} color={roleColor} />
                      <Text fontSize="sm" fontWeight="700" color={roleColor}>Profile Picture</Text>
                    </HStack>

                    {picMsg && (
                      <HStack gap="2"
                        bg={picMsg.type === 'error' ? 'rgba(239,68,68,0.1)' : picMsg.type === 'warn' ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)'}
                        border="1px solid"
                        borderColor={picMsg.type === 'error' ? 'rgba(239,68,68,0.3)' : picMsg.type === 'warn' ? 'rgba(245,158,11,0.3)' : 'rgba(34,197,94,0.3)'}
                        p="2.5" rounded="lg" mb="3">
                        <Text fontSize="xs" color={picMsg.type === 'error' ? '#ef4444' : picMsg.type === 'warn' ? '#f59e0b' : '#22c55e'}>{picMsg.text}</Text>
                      </HStack>
                    )}

                    <HStack gap="3" align="center">
                      {/* Current pic preview */}
                      <Box w="10" h="10" rounded="full" overflow="hidden" border={`2px solid ${roleColor}60`} flexShrink={0}>
                        <Image src={avatarSrc} alt={displayName} w="full" h="full" objectFit="cover" />
                      </Box>

                      {/* Hidden file input */}
                      <input
                        ref={picInputRef}
                        type="file"
                        accept=".png,.jpg,.jpeg"
                        style={{ display: 'none' }}
                        onChange={handlePicFile}
                      />

                      <Button
                        size="sm" flex="1"
                        bg={colors.bgElevated}
                        border="1px solid"
                        borderColor={colors.borderMedium}
                        color={colors.textSecondary}
                        rounded="lg"
                        loading={picSaving}
                        _hover={{ borderColor: roleColor, color: roleColor }}
                        onClick={() => picInputRef.current?.click()}
                      >
                        <Upload size={13} /> {profilePic ? 'Change Photo' : 'Choose Photo'}
                      </Button>

                      {profilePic && (
                        <Button
                          size="sm"
                          bg="rgba(239,68,68,0.1)"
                          border="1px solid rgba(239,68,68,0.3)"
                          color="#ef4444"
                          rounded="lg"
                          onClick={handlePicReset}
                          title="Reset to Discord avatar"
                        >
                          <X size={13} /> Reset Photo
                        </Button>
                      )}
                    </HStack>
                    <Text fontSize="2xs" color={colors.textMuted} mt="2">PNG or JPG · max 2 MB · 500×500 px recommended · visible to all users.</Text>
                  </Box>
                </Box>

              </VStack>
            </Box>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default MyProfileModal;
