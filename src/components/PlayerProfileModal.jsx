import { Dialog, Portal, Box, VStack, HStack, Text, Spinner, Center, Badge, CloseButton } from '@chakra-ui/react';
import { User, Users, Shield, Award } from 'lucide-react';
import { usePlayerProfile } from '../hooks/usePlayerProfile';
import { useState } from 'react';
import TeamProfileModal from './TeamProfileModal';
import { getThemedColors } from '../theme/colors';

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
                    >
                      <User size={36} color={emlColors.accentPurple} />
                    </Box>

                    <VStack gap="1">
                      <Text fontSize="2xl" fontWeight="800" color={emlColors.textPrimary}>
                        {playerName}
                      </Text>
                      <Badge colorPalette={getRoleColor()} px="3" py="1" rounded="full" fontSize="xs">
                        <HStack gap="1">
                          {getRoleIcon()}
                          <Text>{playerRole}</Text>
                        </HStack>
                      </Badge>
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
