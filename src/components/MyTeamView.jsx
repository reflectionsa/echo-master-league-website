import { useState, useRef, useEffect } from 'react';
import {
  Dialog, Portal, Box, VStack, HStack, Text, Spinner, Center,
  CloseButton, Button, Badge, SimpleGrid, Textarea, Input,
} from '@chakra-ui/react';
import {
  Crown, Star, User, Upload, Edit3, Users, Trophy,
  CheckCircle, Globe, MessageCircle, Shield,
} from 'lucide-react';
import { useMyTeam } from '../hooks/useMyTeam';
import { useAuth } from '../hooks/useAuth';
import { getThemedColors } from '../theme/colors';
import { getBaseTier, tierInfo } from '../utils/tierUtils';

// ─── localStorage helpers ──────────────────────────────────────────────────────
const slug = (str) => (str || '').replace(/\s+/g, '_').toLowerCase();

const lsGet = (key) => { try { return localStorage.getItem(key) || null; } catch { return null; } };
const lsSet = (key, val) => { try { localStorage.setItem(key, val); } catch {} };

const getTeamAsset = (teamName, type) => lsGet(`eml_team_${type}_${slug(teamName)}`);
const setTeamAsset = (teamName, type, val) => lsSet(`eml_team_${type}_${slug(teamName)}`, val);

// ─── Image upload helper ───────────────────────────────────────────────────────
/**
 * Hidden file input that accepts PNG/JPG up to 5 MB.
 * Calls onUpload(dataUrl) on success.
 */
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

const UploadButton = ({ label, onUpload, colors }) => {
  const inputRef = useRef(null);
  return (
    <Box>
      <ImageUpload onUpload={onUpload} inputRef={inputRef} />
      <Button
        size="sm"
        variant="outline"
        borderColor={colors.borderMedium}
        color={colors.textSecondary}
        _hover={{ borderColor: colors.accentOrange, color: colors.accentOrange }}
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={13} /> {label}
      </Button>
    </Box>
  );
};

// ─── Player card ──────────────────────────────────────────────────────────────
const ROLE_META = {
  Captain: { Icon: Crown, color: '#fbbf24', label: 'Captain' },
  'Co-Captain': { Icon: Star, color: '#ff6b2b', label: 'Co-Cap' },
  Player: { Icon: User, color: '#9ca3af', label: 'Player' },
};

const PlayerCard = ({ name, role, isMe, colors }) => {
  const { Icon, color, label } = ROLE_META[role] || ROLE_META.Player;
  const initials = (name || '?').split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <Box
      bg={colors.bgElevated}
      border="1px solid"
      borderColor={isMe ? colors.accentOrange : colors.borderLight}
      rounded="xl"
      p="3"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap="2"
      boxShadow={isMe ? `0 0 12px ${colors.accentOrange}33` : 'none'}
      transition="all 0.2s"
      _hover={{ borderColor: colors.borderMedium }}
    >
      {/* Avatar circle */}
      <Box
        w="48px" h="48px"
        bg={`${color}22`}
        border="2px solid"
        borderColor={`${color}55`}
        rounded="full"
        display="flex" alignItems="center" justifyContent="center"
        position="relative"
      >
        <Text fontSize="md" fontWeight="900" color={color}>{initials}</Text>
        {isMe && (
          <Box
            position="absolute" bottom="-2px" right="-2px"
            w="14px" h="14px"
            bg={colors.accentOrange}
            rounded="full"
            border="2px solid"
            borderColor={colors.bgElevated}
          />
        )}
      </Box>

      {/* Name */}
      <Text
        fontSize="xs" fontWeight="700"
        color={colors.textPrimary}
        textAlign="center"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        maxW="full"
      >
        {name}
      </Text>

      {/* Role badge */}
      <HStack gap="1">
        <Icon size={10} color={color} />
        <Text fontSize="2xs" color={color} fontWeight="600">{label}</Text>
      </HStack>
    </Box>
  );
};

// ─── Main component ────────────────────────────────────────────────────────────
const MyTeamView = ({ theme, open, onClose }) => {
  const colors = getThemedColors(theme);
  const { user } = useAuth();
  const { team, myRole, isOnTeam, standingsData, matchHistory, loading } = useMyTeam();

  const isCaptain = myRole === 'Captain' || myRole === 'Co-Captain';

  // Team assets (images stored as base64 DataURLs in localStorage)
  const [teamLogo, setTeamLogo] = useState(null);
  const [teamBanner, setTeamBanner] = useState(null);

  // Editable metadata
  const [bio, setBio] = useState('');
  const [editingBio, setEditingBio] = useState(false);
  const [recruiting, setRecruiting] = useState(false);
  const [socials, setSocials] = useState({ discord: '', twitch: '', youtube: '', twitter: '' });
  const [editingSocials, setEditingSocials] = useState(false);

  // Load persisted data when team changes
  useEffect(() => {
    if (!team?.name) return;
    setTeamLogo(getTeamAsset(team.name, 'logo'));
    setTeamBanner(getTeamAsset(team.name, 'banner'));
    setBio(lsGet(`eml_team_bio_${slug(team.name)}`) || '');
    setRecruiting(lsGet(`eml_team_recruiting_${slug(team.name)}`) === 'true');
    try {
      const saved = lsGet(`eml_team_socials_${slug(team.name)}`);
      if (saved) setSocials(JSON.parse(saved));
    } catch {}
  }, [team?.name]);

  const handleLogoUpload = (dataUrl) => {
    setTeamAsset(team.name, 'logo', dataUrl);
    setTeamLogo(dataUrl);
  };
  const handleBannerUpload = (dataUrl) => {
    setTeamAsset(team.name, 'banner', dataUrl);
    setTeamBanner(dataUrl);
  };
  const saveBio = () => {
    lsSet(`eml_team_bio_${slug(team.name)}`, bio);
    setEditingBio(false);
  };
  const saveSocials = () => {
    lsSet(`eml_team_socials_${slug(team.name)}`, JSON.stringify(socials));
    setEditingSocials(false);
  };
  const toggleRecruiting = () => {
    const next = !recruiting;
    setRecruiting(next);
    lsSet(`eml_team_recruiting_${slug(team.name)}`, String(next));
  };

  const baseTier = getBaseTier(standingsData?.tier);
  const tierCfg = tierInfo[baseTier] || {
    color: '#ff6b2b',
    borderColor: 'rgba(255,107,43,0.5)',
    glowColor: 'rgba(255,107,43,0.3)',
    gradient: 'linear-gradient(135deg, #ff6b2b 0%, #ff8c42 100%)',
  };

  const myName = (user?.globalName || user?.username || '').toLowerCase();

  // Build ordered roster (captain first)
  const roster = [];
  if (team) {
    if (team.captain) roster.push({ name: team.captain, role: 'Captain' });
    if (team.coCaptain) roster.push({ name: team.coCaptain, role: 'Co-Captain' });
    (team.players || []).forEach(p => roster.push({ name: p, role: 'Player' }));
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="full">
      <Portal>
        <Dialog.Backdrop bg={`${colors.bgPrimary}cc`} backdropFilter="blur(12px)" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="900px"
            w="95vw"
            maxH="92vh"
            bg={colors.bgPrimary}
            border="1px solid"
            borderColor={isOnTeam ? tierCfg.borderColor : colors.borderMedium}
            rounded="2xl"
            overflow="hidden"
            display="flex"
            flexDirection="column"
            boxShadow={isOnTeam ? `0 0 60px ${tierCfg.glowColor}` : 'none'}
            position="relative"
          >
            {/* Close button */}
            <Box position="absolute" top="4" right="4" zIndex="10">
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" color={colors.textPrimary} _hover={{ color: colors.accentOrange }} />
              </Dialog.CloseTrigger>
            </Box>

            <Box overflowY="auto" flex="1">
              {loading ? (
                <Center h="300px">
                  <Spinner size="xl" color={colors.accentOrange} />
                </Center>

              ) : !isOnTeam ? (
                /* ─── NO TEAM STATE ─────────────────────────────────────────────── */
                <Center h="420px" flexDirection="column" gap="4" p="8">
                  <Box fontSize="5xl" opacity="0.2" lineHeight="1">⚔️</Box>
                  <Text fontSize="2xl" fontWeight="900" color={colors.textPrimary}>No Team Yet</Text>
                  <Text color={colors.textMuted} textAlign="center" maxW="360px" lineHeight="1.6">
                    You're not currently on a roster. Ask your captain to make sure your Discord
                    display name matches what's listed in the team sheet.
                  </Text>
                </Center>

              ) : (
                <VStack align="stretch" gap="0">

                  {/* ─── TEAM BANNER (16:9) ───────────────────────────────────────── */}
                  <Box position="relative" h="220px" overflow="hidden" bg={colors.bgSecondary}>
                    {teamBanner ? (
                      <Box
                        as="img"
                        src={teamBanner}
                        alt="Team Banner"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <Box
                        position="absolute" inset="0"
                        background={tierCfg.gradient}
                        opacity="0.18"
                      />
                    )}
                    {/* Bottom fade */}
                    <Box
                      position="absolute" bottom="0" left="0" right="0" h="120px"
                      background={`linear-gradient(to top, ${colors.bgPrimary}, transparent)`}
                    />
                    {/* Captain: banner upload button */}
                    {isCaptain && (
                      <Box position="absolute" top="3" right="3" zIndex="2">
                        <UploadButton label="Change Banner" onUpload={handleBannerUpload} colors={colors} />
                      </Box>
                    )}
                  </Box>

                  {/* ─── TEAM LOGO + NAME ─────────────────────────────────────────── */}
                  <Box px="6" pb="4" mt="-52px" position="relative" zIndex="1">
                    <HStack align="flex-end" gap="4" mb="3">
                      {/* Team logo — 500×500 displayed as 80px square */}
                      <Box
                        w="80px" h="80px" minW="80px"
                        bg={`${tierCfg.color}22`}
                        border="3px solid"
                        borderColor={tierCfg.borderColor}
                        rounded="xl"
                        overflow="hidden"
                        boxShadow={`0 0 20px ${tierCfg.glowColor}`}
                        flexShrink={0}
                      >
                        {teamLogo ? (
                          <Box
                            as="img"
                            src={teamLogo}
                            alt="Team Logo"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                        ) : (
                          <Center h="full">
                            <Text fontSize="2xl" fontWeight="900" color={tierCfg.color}>
                              {(team.name || '?').slice(0, 2).toUpperCase()}
                            </Text>
                          </Center>
                        )}
                      </Box>

                      <VStack align="start" gap="1" pb="1">
                        <HStack gap="2" flexWrap="wrap">
                          <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="900" color={colors.textPrimary} lineHeight="1">
                            {team.name}
                          </Text>
                          {recruiting && (
                            <Badge
                              bg="#10b98122" color="#10b981"
                              border="1px solid #10b98144"
                              fontSize="2xs" px="2" rounded="full"
                            >
                              RECRUITING
                            </Badge>
                          )}
                          {myRole && (
                            <Badge
                              bg={`${tierCfg.color}22`}
                              color={tierCfg.color}
                              border={`1px solid ${tierCfg.borderColor}`}
                              fontSize="2xs" px="2" rounded="full"
                            >
                              {myRole}
                            </Badge>
                          )}
                        </HStack>
                        <HStack gap="2" flexWrap="wrap">
                          <Text fontSize="xs" color={tierCfg.color} fontWeight="700">◆ {baseTier || 'Unranked'}</Text>
                          <Text fontSize="xs" color={colors.textMuted}>•</Text>
                          <Text fontSize="xs" color={colors.textMuted}>NA</Text>
                          <Text fontSize="xs" color={colors.textMuted}>•</Text>
                          <Text fontSize="xs" color={colors.textMuted}>Echo Arena</Text>
                        </HStack>
                      </VStack>
                    </HStack>

                    {/* Stats strip */}
                    <HStack gap="0" bg={colors.bgElevated} rounded="xl" border="1px solid" borderColor={colors.borderLight} overflow="hidden" w="fit-content">
                      {[
                        { label: 'RANK', value: standingsData?.position ? `#${standingsData.position}` : '—', color: colors.accentOrange },
                        { label: 'MMR', value: standingsData?.mmr || '—' },
                        { label: 'W-L', value: standingsData ? `${standingsData.wins}-${standingsData.losses}` : '—' },
                        { label: 'TIER', value: baseTier || '—', color: tierCfg.color },
                      ].map((stat, i) => (
                        <Box key={stat.label} px="5" py="3" borderLeft={i > 0 ? '1px solid' : 'none'} borderColor={colors.borderLight}>
                          <Text fontSize="lg" fontWeight="900" color={stat.color || colors.textPrimary} lineHeight="1">{stat.value}</Text>
                          <Text fontSize="2xs" color={colors.textMuted} fontWeight="700" letterSpacing="wider">{stat.label}</Text>
                        </Box>
                      ))}
                    </HStack>
                  </Box>

                  <Box h="1px" bg={colors.borderLight} mx="6" />

                  {/* ─── ROSTER ───────────────────────────────────────────────────── */}
                  <Box px="6" py="5">
                    <HStack mb="4" gap="2">
                      <Users size={15} color={colors.accentOrange} />
                      <Text fontWeight="800" fontSize="sm" color={colors.textPrimary} textTransform="uppercase" letterSpacing="wider">
                        Roster ({roster.length})
                      </Text>
                    </HStack>
                    <SimpleGrid columns={{ base: 3, sm: 4, md: 6 }} gap="3">
                      {roster.map((member) => (
                        <PlayerCard
                          key={member.name}
                          name={member.name}
                          role={member.role}
                          isMe={member.name.toLowerCase() === myName}
                          colors={colors}
                        />
                      ))}
                    </SimpleGrid>
                  </Box>

                  <Box h="1px" bg={colors.borderLight} mx="6" />

                  {/* ─── RECENT RESULTS ───────────────────────────────────────────── */}
                  {matchHistory.length > 0 && (
                    <>
                      <Box px="6" py="5">
                        <HStack mb="4" gap="2">
                          <Trophy size={15} color={colors.accentOrange} />
                          <Text fontWeight="800" fontSize="sm" color={colors.textPrimary} textTransform="uppercase" letterSpacing="wider">
                            Recent Results
                          </Text>
                        </HStack>
                        <VStack gap="2" align="stretch">
                          {matchHistory.map((match, i) => {
                            const wld = match.result;
                            const resultColor = wld === 'W' ? '#10b981' : wld === 'D' ? '#f59e0b' : '#ef4444';
                            return (
                              <HStack
                                key={i}
                                px="4" py="3"
                                bg={colors.bgElevated}
                                rounded="xl"
                                border="1px solid"
                                borderColor={colors.borderLight}
                                justify="space-between"
                              >
                                <HStack gap="3">
                                  <Box
                                    w="28px" h="28px"
                                    bg={`${resultColor}22`}
                                    border="1px solid"
                                    borderColor={`${resultColor}44`}
                                    rounded="md"
                                    display="flex" alignItems="center" justifyContent="center"
                                  >
                                    <Text fontSize="xs" fontWeight="900" color={resultColor}>{wld}</Text>
                                  </Box>
                                  <Text fontSize="sm" fontWeight="600" color={colors.textPrimary}>vs {match.opponent}</Text>
                                </HStack>
                                <HStack gap="3">
                                  <Text fontSize="sm" fontWeight="700" color={colors.textSecondary}>
                                    {match.myScore} – {match.theirScore}
                                  </Text>
                                  {match.week && (
                                    <Text fontSize="xs" color={colors.textMuted}>Wk {match.week}</Text>
                                  )}
                                </HStack>
                              </HStack>
                            );
                          })}
                        </VStack>
                      </Box>
                      <Box h="1px" bg={colors.borderLight} mx="6" />
                    </>
                  )}

                  {/* ─── ABOUT & SOCIALS ──────────────────────────────────────────── */}
                  <Box px="6" py="5">
                    <HStack mb="4" gap="2" justify="space-between">
                      <HStack gap="2">
                        <Globe size={15} color={colors.accentOrange} />
                        <Text fontWeight="800" fontSize="sm" color={colors.textPrimary} textTransform="uppercase" letterSpacing="wider">
                          About & Socials
                        </Text>
                      </HStack>
                      {isCaptain && !editingSocials && (
                        <Button size="xs" variant="ghost" color={colors.textMuted} onClick={() => setEditingSocials(true)}>
                          <Edit3 size={11} /> Edit
                        </Button>
                      )}
                    </HStack>

                    {/* Bio */}
                    {editingBio ? (
                      <VStack align="start" gap="2" mb="4">
                        <Textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Team bio, philosophy, or 'About Us'…"
                          size="sm"
                          rows={3}
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
                      <HStack mb="4" align="start" gap="2">
                        <Text fontSize="sm" color={colors.textSecondary} lineHeight="1.7" flex="1">{bio}</Text>
                        {isCaptain && (
                          <Box cursor="pointer" color={colors.textMuted} onClick={() => setEditingBio(true)} flexShrink={0} pt="0.5">
                            <Edit3 size={12} />
                          </Box>
                        )}
                      </HStack>
                    ) : isCaptain ? (
                      <Text
                        fontSize="sm" color={colors.textMuted} mb="4"
                        cursor="pointer"
                        onClick={() => setEditingBio(true)}
                        _hover={{ color: colors.textSecondary }}
                      >
                        + Add team bio…
                      </Text>
                    ) : null}

                    {/* Social links */}
                    {editingSocials ? (
                      <VStack align="start" gap="2">
                        {['discord', 'twitch', 'youtube', 'twitter'].map(platform => (
                          <HStack key={platform} gap="2" w="full">
                            <Text fontSize="xs" color={colors.textMuted} w="64px" textTransform="capitalize" fontWeight="600">
                              {platform}
                            </Text>
                            <Input
                              size="sm"
                              placeholder={`${platform} link or invite…`}
                              value={socials[platform]}
                              onChange={(e) => setSocials(s => ({ ...s, [platform]: e.target.value }))}
                              bg={colors.bgElevated}
                              border="1px solid"
                              borderColor={colors.borderMedium}
                              color={colors.textPrimary}
                              rounded="lg"
                              flex="1"
                            />
                          </HStack>
                        ))}
                        <HStack gap="2" mt="1">
                          <Button size="xs" bg={colors.accentOrange} color="white" onClick={saveSocials}>Save</Button>
                          <Button size="xs" variant="ghost" color={colors.textMuted} onClick={() => setEditingSocials(false)}>Cancel</Button>
                        </HStack>
                      </VStack>
                    ) : (
                      <HStack gap="3" flexWrap="wrap">
                        {socials.discord && (
                          <Button size="xs" variant="outline" borderColor="#5865F2" color="#5865F2" onClick={() => window.open(socials.discord, '_blank')}>
                            <MessageCircle size={11} /> Discord
                          </Button>
                        )}
                        {socials.twitch && (
                          <Button size="xs" variant="outline" borderColor="#9146FF" color="#9146FF" onClick={() => window.open(socials.twitch, '_blank')}>
                            Twitch
                          </Button>
                        )}
                        {socials.youtube && (
                          <Button size="xs" variant="outline" borderColor="#FF0000" color="#FF0000" onClick={() => window.open(socials.youtube, '_blank')}>
                            YouTube
                          </Button>
                        )}
                        {socials.twitter && (
                          <Button size="xs" variant="outline" borderColor="#1DA1F2" color="#1DA1F2" onClick={() => window.open(socials.twitter, '_blank')}>
                            Twitter / X
                          </Button>
                        )}
                        {!socials.discord && !socials.twitch && !socials.youtube && !socials.twitter && (
                          <Text fontSize="xs" color={colors.textMuted}>
                            {isCaptain ? 'Click Edit to add social links' : 'No social links added yet'}
                          </Text>
                        )}
                      </HStack>
                    )}
                  </Box>

                  {/* ─── CAPTAIN TOOLS ────────────────────────────────────────────── */}
                  {isCaptain && (
                    <>
                      <Box h="1px" bg={colors.borderLight} mx="6" />
                      <Box px="6" py="5">
                        <HStack mb="4" gap="2">
                          <Crown size={15} color="#fbbf24" />
                          <Text fontWeight="800" fontSize="sm" color="#fbbf24" textTransform="uppercase" letterSpacing="wider">
                            Captain Tools
                          </Text>
                        </HStack>
                        <HStack gap="3" flexWrap="wrap">
                          <UploadButton label="Upload Logo (500×500)" onUpload={handleLogoUpload} colors={colors} />
                          <UploadButton label="Upload Banner (1920×1080)" onUpload={handleBannerUpload} colors={colors} />
                          <Button
                            size="sm"
                            variant="outline"
                            borderColor={recruiting ? '#10b981' : colors.borderMedium}
                            color={recruiting ? '#10b981' : colors.textSecondary}
                            _hover={{ borderColor: '#10b981', color: '#10b981' }}
                            onClick={toggleRecruiting}
                          >
                            {recruiting ? <CheckCircle size={13} /> : <Users size={13} />}
                            {recruiting ? 'Recruiting: ON' : 'Set Recruiting'}
                          </Button>
                        </HStack>
                        <Text fontSize="2xs" color={colors.textMuted} mt="3">
                          Images are stored locally on this device. Only PNG and JPG files are supported. Logo: 500×500 px · Banner: 1920×1080 px
                        </Text>
                      </Box>
                    </>
                  )}

                </VStack>
              )}
            </Box>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default MyTeamView;
