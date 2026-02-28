import {
  Box, Dialog, Portal, CloseButton, HStack, VStack, Text, Badge,
  Button, Tabs, Input, Textarea
} from '@chakra-ui/react';
import { Shield, FileText, Users, Trophy } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getThemedColors } from '../theme/colors';

const AdminPanel = ({ theme, open, onClose }) => {
  const colors = getThemedColors(theme);
  const { isAdmin, isMod } = useAuth();

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
                  <CloseButton size="md" color={colors.textMuted} />
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
