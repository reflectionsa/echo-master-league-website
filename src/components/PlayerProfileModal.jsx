import { Dialog, Portal, Box, VStack, HStack, Text, Spinner, Center, Badge, CloseButton, Image } from '@chakra-ui/react';
import { User, Users, Shield, Award } from 'lucide-react';
import { usePlayerProfile } from '../hooks/usePlayerProfile';
import { useState } from 'react';
import TeamProfileModal from './TeamProfileModal';
import { getThemedColors } from '../theme/colors';

const playerProfilePictures = {
  'Krogers': 'https://static-cdn.jtvnw.net/jtv_user_pictures/424d11c2-415c-46c8-907a-d7cad7af2e96-profile_image-300x300.png',
};

const seasonChampions = {
  'Krogers': [
    { season: 2, image: 'https://cdn.discordapp.com/attachments/1241825775414677536/1473185735044759582/c19733f9-621e-4220-8deb-304586125467.png?ex=69954aa1&is=6993f921&hm=f934706494a58357a5c40c9d9039ee951e3d48b9b5c4e24e8e67b083eb309f58&' },
    { season: 3, image: 'https://media.discordapp.net/attachments/1241825775414677536/1473187865511989270/f4ac3eba-635c-4479-b74d-bce417a81577.png?ex=69954c9d&is=6993fb1d&hm=3a04a8036aeef84ae9f7153af8c5644f470b9f493761b7f79795ebd6bdc96cf5&animated=true' }
  ],
  'Jaxxjh': [
    { season: 2, image: 'https://cdn.discordapp.com/attachments/1241825775414677536/1473185735044759582/c19733f9-621e-4220-8deb-304586125467.png?ex=69954aa1&is=6993f921&hm=f934706494a58357a5c40c9d9039ee951e3d48b9b5c4e24e8e67b083eb309f58&' },
    { season: 3, image: 'https://media.discordapp.net/attachments/1241825775414677536/1473187865511989270/f4ac3eba-635c-4479-b74d-bce417a81577.png?ex=69954c9d&is=6993fb1d&hm=3a04a8036aeef84ae9f7153af8c5644f470b9f493761b7f79795ebd6bdc96cf5&animated=true' }
  ],
  'mikey': [
    { season: 2, image: 'https://cdn.discordapp.com/attachments/1241825775414677536/1473185735044759582/c19733f9-621e-4220-8deb-304586125467.png?ex=69954aa1&is=6993f921&hm=f934706494a58357a5c40c9d9039ee951e3d48b9b5c4e24e8e67b083eb309f58&' },
    { season: 3, image: 'https://media.discordapp.net/attachments/1241825775414677536/1473187865511989270/f4ac3eba-635c-4479-b74d-bce417a81577.png?ex=69954c9d&is=6993fb1d&hm=3a04a8036aeef84ae9f7153af8c5644f470b9f493761b7f79795ebd6bdc96cf5&animated=true' }
  ],
};

const PlayerProfileModal = ({ open, onClose, playerName, theme }) => {
  const { team, playerRole, loading } = usePlayerProfile(playerName);
  const emlColors = getThemedColors(theme);
  const [teamModalOpen, setTeamModalOpen] = useState(false);

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
            >
              <Dialog.CloseTrigger asChild position="absolute" top="4" right="4">
                <CloseButton size="sm" />
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
                      {playerProfilePictures[playerName] ? (
                        <Image
                          src={playerProfilePictures[playerName]}
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
                      <Text fontSize="2xl" fontWeight="800" color={emlColors.textPrimary}>
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
          theme={theme}
        />
      )}
    </>
  );
};

export default PlayerProfileModal;
