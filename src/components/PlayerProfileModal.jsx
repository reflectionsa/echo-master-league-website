import { Dialog, Portal, Box, VStack, HStack, Text, Spinner, Center, Badge, CloseButton, Image } from '@chakra-ui/react';
import { User, Users, Shield, Award, History } from 'lucide-react';
import { usePlayerProfile } from '../hooks/usePlayerProfile';
import { useTeamHistory } from '../hooks/useTeamHistory';
import { useState, useEffect } from 'react';
import TeamProfileModal from './TeamProfileModal';
import { getThemedColors } from '../theme/colors';
import { emlApi } from '../hooks/useEmlApi';

const _slug = (s) => (s || '').replace(/\s+/g, '_').toLowerCase();
const lsRead = (key) => { try { return localStorage.getItem(key) || null; } catch { return null; } };

// Fallback static profile pictures for known players
const staticProfilePictures = {
  'Krogers': 'https://static-cdn.jtvnw.net/jtv_user_pictures/424d11c2-415c-46c8-907a-d7cad7af2e96-profile_image-300x300.png',
  'Jaxxjh': 'https://cdn.discordapp.com/avatars/726952425012985906/d34d67b61edf0bac3783d93c30d8b1bb.webp?size=1024',
  'mikey': 'https://cdn.discordapp.com/avatars/841766167357816863/fbd3a5766f97a634f11fd8aa1e5db409.webp?size=1024',
  'Zu-Ko': 'https://cdn.discordapp.com/avatars/992867075657830400/7cbfc052ae88f6b7995d45c4bb94aa30.webp?size=1024',
};

const REN_CHAMPIONSHIPS = [
  { season: 2, image: '/images/seasons/season2-champion.svg' },
  { season: 3, image: '/images/seasons/season3-champion.svg' },
];

const seasonChampions = {
  'Krogers': REN_CHAMPIONSHIPS,
  'Jaxxjh': REN_CHAMPIONSHIPS,
  'mikey': REN_CHAMPIONSHIPS,
};

const PlayerProfileModal = ({ open, onClose, playerName, theme }) => {
  const { team, playerRole, loading } = usePlayerProfile(playerName);
  const { getPlayerHistory, loading: historyLoading } = useTeamHistory();
  const emlColors = getThemedColors(theme);
  const [teamModalOpen, setTeamModalOpen] = useState(false);

  // Profile pic: prefer worker KV, then localStorage, then static list
  const [workerPic, setWorkerPic] = useState(null);
  const savedPic = lsRead(`eml_player_pic_${_slug(playerName)}`);
  const profilePic = workerPic || savedPic || staticProfilePictures[playerName] || null;
  const savedBio = lsRead(`eml_player_bio_${_slug(playerName)}`);

  useEffect(() => {
    if (!open || !playerName) return;
    setWorkerPic(null);
    emlApi('GET', `/player/avatar/${encodeURIComponent(_slug(playerName))}`)
      .then(d => { if (d.avatarUrl) setWorkerPic(d.avatarUrl); })
      .catch(() => {});
  }, [open, playerName]);

  const getRoleIcon = () => {
    if (playerRole === 'Captain') return <Shield size={16} />;
    if (playerRole === 'Co-Captain') return <Award size={16} />;
    return <User size={16} />;
  };

  const getRoleColor = () => {
    if (playerRole === 'Captain') return 'yellow';
    if (playerRole === 'Co-Captain') return 'orange';
    return 'blue';
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="md">
        <Portal>
          <Dialog.Backdrop bg={`${emlColors.bgPrimary}b3`} backdropFilter="blur(8px)" />
          <Dialog.Positioner>
            <Dialog.Content
              bg={emlColors.bgSecondary}
              border="1px solid"
              borderColor={emlColors.accentPurple}
              rounded="2xl"
              overflow="hidden"
            >
              <Dialog.CloseTrigger asChild position="absolute" top="4" right="4">
                <CloseButton size="sm" color={emlColors.textPrimary} _hover={{ color: emlColors.accentPurple }} />
              </Dialog.CloseTrigger>

              {loading ? (
                <Center py="20"><Spinner size="lg" color={emlColors.accentPurple} /></Center>
              ) : !team ? (
                <Box p="8"><Text color={emlColors.textMuted}>Player not found</Text></Box>
              ) : (
                <VStack align="stretch" gap="6" p="8">
                  <VStack align="center" gap="3">
                    <Box
                      w="80px"
                      h="80px"
                      bg={`${emlColors.accentPurple}19`}
                      rounded="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      border="3px solid"
                      borderColor={emlColors.accentPurple}
                      overflow="hidden"
                    >
                      {profilePic ? (
                        <Image
                          src={profilePic}
                          alt={playerName}
                          w="80px"
                          h="80px"
                          objectFit="cover"
                        />
                      ) : (
                        <User size={36} color={emlColors.accentPurple} />
                      )}
                    </Box>

                    <VStack gap="1">
                      <Text fontSize="2xl" fontWeight="800" color={emlColors.textPrimary} textTransform="uppercase">
                        {playerName}
                      </Text>
                      <HStack gap="2">
                        <Badge colorPalette={getRoleColor()} px="3" py="1" rounded="full" fontSize="xs">
                          <HStack gap="1">
                            {getRoleIcon()}
                            <Text>{playerRole}</Text>
                          </HStack>
                        </Badge>
                        {seasonChampions[playerName] && seasonChampions[playerName].map((championship) => (
                          <HStack key={championship.season} gap="1" bg={emlColors.bgCard} px="2.5" py="1.5" rounded="full" border="2px solid" borderColor={emlColors.accentOrange}>
                            <Image
                              src={championship.image}
                              alt={`S${championship.season} Champions`}
                              w="20px"
                              h="20px"
                              objectFit="contain"
                              fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='20' height='20' fill='%23ff8c42'/%3E%3C/svg%3E"
                            />
                            <Text fontSize="xs" fontWeight="800" color={emlColors.accentOrange}>
                              S{championship.season} Champions
                            </Text>
                          </HStack>
                        ))}
                      </HStack>
                    </VStack>
                  </VStack>

                  {/* Bio */}
                  {savedBio && (
                    <Box
                      bg={emlColors.bgCard}
                      border="1px solid"
                      borderColor={emlColors.borderMedium}
                      rounded="xl"
                      p="4"
                    >
                      <Text fontSize="sm" color={emlColors.textSecondary} style={{ whiteSpace: 'pre-wrap' }}>{savedBio}</Text>
                    </Box>
                  )}

                  <Box
                    bg={emlColors.bgCard}
                    border="1px solid"
                    borderColor={emlColors.borderMedium}
                    rounded="xl"
                    p="4"
                  >
                    <VStack align="start" gap="3">
                      <HStack gap="2">
                        <Users size={16} color={emlColors.accentPurple} />
                        <Text fontSize="sm" fontWeight="700" color={emlColors.textMuted}>
                          Team
                        </Text>
                      </HStack>
                      <Box
                        as="button"
                        w="full"
                        textAlign="left"
                        p="3"
                        bg={emlColors.bgSecondary}
                        border="1px solid"
                        borderColor={emlColors.accentPurple}
                        rounded="lg"
                        _hover={{ borderColor: emlColors.accentPurple, transform: 'translateY(-1px)' }}
                        transition="all 0.2s"
                        onClick={() => setTeamModalOpen(true)}
                      >
                        <VStack align="start" gap="1">
                          <Text fontSize="md" fontWeight="700" color={emlColors.textPrimary}>
                            {team.name}
                          </Text>
                          <HStack gap="2">
                            <Badge colorPalette="purple" size="sm">
                              {team.status}
                            </Badge>
                            <Text fontSize="xs" color={emlColors.textMuted}>
                              Click to view team profile
                            </Text>
                          </HStack>
                        </VStack>
                      </Box>
                    </VStack>
                  </Box>

                  <Box textAlign="center">
                    <Text fontSize="xs" color={emlColors.textSubtle}>
                      MMR starts at 800 for all players
                    </Text>
                  </Box>

                  {/* Previous Teams from Team History sheet */}
                  {!historyLoading && (() => {
                    const history = getPlayerHistory(playerName);
                    const seen = new Set();
                    const previousTeams = history
                      .filter(h => h.team && h.team !== team?.name)
                      .filter(h => { if (seen.has(h.team)) return false; seen.add(h.team); return true; });
                    if (!previousTeams.length) return null;
                    return (
                      <Box
                        bg={emlColors.bgCard}
                        border="1px solid"
                        borderColor={emlColors.borderMedium}
                        rounded="xl"
                        p="4"
                      >
                        <VStack align="start" gap="3">
                          <HStack gap="2">
                            <History size={16} color={emlColors.textMuted} />
                            <Text fontSize="sm" fontWeight="700" color={emlColors.textMuted}>
                              Previous Teams
                            </Text>
                          </HStack>
                          <VStack align="stretch" gap="2" w="full">
                            {previousTeams.map((h, i) => (
                              <HStack key={i} justify="space-between" px="3" py="2" bg={emlColors.bgSecondary} rounded="lg">
                                <Text fontSize="sm" fontWeight="600" color={emlColors.textPrimary}>{h.team}</Text>
                                {h.season && (
                                  <Badge bg={`${emlColors.accentPurple}22`} color={emlColors.accentPurple} border={`1px solid ${emlColors.accentPurple}44`} size="xs" px="2" rounded="md">
                                    {h.season}
                                  </Badge>
                                )}
                              </HStack>
                            ))}
                          </VStack>
                        </VStack>
                      </Box>
                    );
                  })()}
                </VStack>
              )}
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {team && (
        <TeamProfileModal
          open={teamModalOpen}
          onClose={() => setTeamModalOpen(false)}
          teamId={team.id}
          teamName={team.name}
          teamData={team}
          theme={theme}
        />
      )}
    </>
  );
};

export default PlayerProfileModal;
