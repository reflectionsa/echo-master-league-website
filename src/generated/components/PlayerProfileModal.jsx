import { Dialog, Portal, Box, VStack, HStack, Text, Spinner, Center, Badge, CloseButton } from '@chakra-ui/react';
import { User, Users, Shield, Award } from 'lucide-react';
import { usePlayerProfile } from '../hooks/usePlayerProfile';
import { useState } from 'react';
import TeamProfileModal from './TeamProfileModal';

const PlayerProfileModal = ({ open, onClose, playerName, theme }) => {
  const isDark = theme === 'dark';
  const { team, playerRole, loading } = usePlayerProfile(playerName);
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
          <Dialog.Backdrop bg={isDark ? 'blackAlpha.700' : 'whiteAlpha.700'} backdropFilter="blur(8px)" />
          <Dialog.Positioner>
            <Dialog.Content
              bg={isDark ? 'gray.900' : 'white'}
              border="1px solid"
              borderColor={isDark ? 'purple.800' : 'gray.200'}
              rounded="2xl"
            >
              <Dialog.CloseTrigger asChild position="absolute" top="4" right="4">
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>

              {loading ? (
                <Center py="20"><Spinner size="lg" color={isDark ? 'purple.500' : 'blue.500'} /></Center>
              ) : !team ? (
                <Box p="8"><Text color={isDark ? 'gray.500' : 'gray.600'}>Player not found</Text></Box>
              ) : (
                <VStack align="stretch" gap="6" p="8">
                  <VStack align="center" gap="3">
                    <Box
                      w="80px"
                      h="80px"
                      bg={isDark ? 'purple.900' : 'purple.100'}
                      rounded="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      border="3px solid"
                      borderColor={isDark ? 'purple.700' : 'purple.300'}
                    >
                      <User size={36} color={isDark ? 'var(--chakra-colors-purple-400)' : 'var(--chakra-colors-purple-600)'} />
                    </Box>

                    <VStack gap="1">
                      <Text fontSize="2xl" fontWeight="800" color={isDark ? 'white' : 'gray.900'}>
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
                    bg={isDark ? 'gray.850' : 'gray.50'}
                    border="1px solid"
                    borderColor={isDark ? 'gray.800' : 'gray.200'}
                    rounded="xl"
                    p="4"
                  >
                    <VStack align="start" gap="3">
                      <HStack gap="2">
                        <Users size={16} color={isDark ? 'var(--chakra-colors-purple-400)' : 'var(--chakra-colors-purple-600)'} />
                        <Text fontSize="sm" fontWeight="700" color={isDark ? 'gray.400' : 'gray.600'}>
                          Team
                        </Text>
                      </HStack>
                      <Box
                        as="button"
                        w="full"
                        textAlign="left"
                        p="3"
                        bg={isDark ? 'gray.900' : 'white'}
                        border="1px solid"
                        borderColor={isDark ? 'purple.800' : 'gray.200'}
                        rounded="lg"
                        _hover={{ borderColor: isDark ? 'purple.600' : 'purple.400', transform: 'translateY(-1px)' }}
                        transition="all 0.2s"
                        onClick={() => setTeamModalOpen(true)}
                      >
                        <VStack align="start" gap="1">
                          <Text fontSize="md" fontWeight="700" color={isDark ? 'white' : 'gray.900'}>
                            {team.name}
                          </Text>
                          <HStack gap="2">
                            <Badge colorPalette="purple" size="sm">
                              {team.status}
                            </Badge>
                            <Text fontSize="xs" color={isDark ? 'gray.500' : 'gray.600'}>
                              Click to view team profile
                            </Text>
                          </HStack>
                        </VStack>
                      </Box>
                    </VStack>
                  </Box>

                  <Box textAlign="center">
                    <Text fontSize="xs" color={isDark ? 'gray.600' : 'gray.500'}>
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
