import { useState, useRef, useEffect } from 'react';
import {
  Dialog, Portal, Box, VStack, HStack, Text, CloseButton,
  Button, Badge, Textarea, Image,
} from '@chakra-ui/react';
import { Upload, Edit3, Users, Shield, Mic2, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useMyTeam } from '../hooks/useMyTeam';
import { getThemedColors } from '../theme/colors';

// ─── localStorage helpers ──────────────────────────────────────────────────────
const lsGet = (key) => { try { return localStorage.getItem(key) || null; } catch { return null; } };
const lsSet = (key, val) => { try { localStorage.setItem(key, val); } catch {} };

// ─── Image upload helper ───────────────────────────────────────────────────────
const ImageUpload = ({ onUpload, inputRef }) => {
  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      alert('Only PNG and JPG files are supported.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File must be under 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => onUpload(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <input
      type="file"
      accept=".png,.jpg,.jpeg"
      ref={inputRef}
      style={{ display: 'none' }}
      onChange={handleChange}
    />
  );
};

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

  // Custom uploaded assets stored in localStorage by Discord user ID
  const [profilePic, setProfilePic] = useState(null);   // overrides Discord avatar
  const [profileBanner, setProfileBanner] = useState(null);
  const [bio, setBio] = useState('');
  const [editingBio, setEditingBio] = useState(false);

  const picInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  useEffect(() => {
    if (!user?.id) return;
    setProfilePic(lsGet(`eml_profile_pic_${user.id}`));
    setProfileBanner(lsGet(`eml_profile_banner_${user.id}`));
    setBio(lsGet(`eml_profile_bio_${user.id}`) || '');
  }, [user?.id]);

  const handlePicUpload = (dataUrl) => {
    lsSet(`eml_profile_pic_${user.id}`, dataUrl);
    setProfilePic(dataUrl);
  };
  const handleBannerUpload = (dataUrl) => {
    lsSet(`eml_profile_banner_${user.id}`, dataUrl);
    setProfileBanner(dataUrl);
  };
  const saveBio = () => {
    lsSet(`eml_profile_bio_${user.id}`, bio);
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

                {/* ─── PROFILE BANNER (4:1 ratio) ───────────────────────────────── */}
                <Box position="relative" h="160px" overflow="hidden" bg={colors.bgSecondary}>
                  {profileBanner ? (
                    <Box
                      as="img"
                      src={profileBanner}
                      alt="Profile Banner"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    /* Gradient fallback using role color */
                    <Box
                      position="absolute" inset="0"
                      background={`linear-gradient(135deg, ${roleColor}44 0%, ${colors.bgPrimary} 100%)`}
                    />
                  )}
                  {/* Bottom fade */}
                  <Box
                    position="absolute" bottom="0" left="0" right="0" h="80px"
                    background={`linear-gradient(to top, ${colors.bgPrimary}, transparent)`}
                  />

                  {/* Banner upload button */}
                  <ImageUpload onUpload={handleBannerUpload} inputRef={bannerInputRef} />
                  <Box position="absolute" top="3" right="3">
                    <Button
                      size="xs"
                      variant="outline"
                      borderColor={colors.borderMedium}
                      color={colors.textSecondary}
                      bg={`${colors.bgPrimary}aa`}
                      backdropFilter="blur(8px)"
                      _hover={{ borderColor: colors.accentOrange, color: colors.accentOrange }}
                      onClick={() => bannerInputRef.current?.click()}
                    >
                      <Upload size={11} /> Change Banner
                    </Button>
                  </Box>
                </Box>

                {/* ─── AVATAR + NAME ROW ────────────────────────────────────────── */}
                <Box px="6" pb="4" mt="-40px" position="relative" zIndex="1">
                  <HStack align="flex-end" gap="4" mb="4">
                    {/* Profile pic — 500×500 rendered at 80px */}
                    <Box
                      w="80px" h="80px" minW="80px"
                      rounded="full"
                      overflow="hidden"
                      border="3px solid"
                      borderColor={colors.bgPrimary}
                      boxShadow={`0 0 0 2px ${roleColor}`}
                      position="relative"
                      flexShrink={0}
                      cursor="pointer"
                      onClick={() => picInputRef.current?.click()}
                      _hover={{ '& .pic-overlay': { opacity: 1 } }}
                    >
                      <Image
                        src={avatarSrc}
                        alt={displayName}
                        w="full" h="full"
                        objectFit="cover"
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                      {/* Hover overlay */}
                      <Box
                        className="pic-overlay"
                        position="absolute" inset="0"
                        bg="rgba(0,0,0,0.55)"
                        display="flex" alignItems="center" justifyContent="center"
                        opacity="0"
                        transition="opacity 0.2s"
                        rounded="full"
                      >
                        <Upload size={18} color="white" />
                      </Box>
                      <ImageUpload onUpload={handlePicUpload} inputRef={picInputRef} />
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
                  <Text fontSize="2xs" color={colors.textMuted} mt="6">
                    Click your avatar to change your profile picture. Only PNG and JPG supported.
                    Profile Pic: 500×500 px · Banner: 1920×480 px. Stored locally on this device.
                  </Text>
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
