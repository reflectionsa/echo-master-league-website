import { Box, Dialog, Portal, CloseButton, HStack, VStack, Text, Badge, Image, Separator } from '@chakra-ui/react';
import { Bell, Calendar, AlertCircle } from 'lucide-react';
import { getThemedColors } from '../theme/colors';

const AnnouncementsView = ({ theme, open, onClose }) => {
  const emlColors = getThemedColors(theme);

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="lg">
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.700" backdropFilter="blur(10px)" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="900px"
            maxH="90vh"
            bg={emlColors.bgPrimary}
            border="1px solid"
            borderColor={emlColors.borderMedium}
            rounded="2xl"
            overflow="hidden"
          >
            <Dialog.Header bg={`${emlColors.bgPrimary}dd`} borderBottom="1px solid" borderColor={emlColors.borderMedium}>
              <HStack justify="space-between">
                <HStack gap="2">
                  <Bell size={24} color={emlColors.accentOrange} />
                  <Dialog.Title fontSize="2xl" fontWeight="800" color={emlColors.textPrimary}>
                    Announcements & Updates
                  </Dialog.Title>
                </HStack>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="lg" />
                </Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>
            <Dialog.Body p="6" overflowY="auto">
              {/* Featured: Season 4 Week Three Announcement */}
              <Box
                bg={`linear-gradient(135deg, ${emlColors.accentOrange}15, ${emlColors.accentPurple}15)`}
                p="8"
                rounded="2xl"
                border="2px solid"
                borderColor={emlColors.accentOrange}
              >
                <VStack align="start" gap="6">
                  <HStack justify="space-between" w="full" flexWrap="wrap">
                    <Badge colorPalette="orange" size="lg" px="3" py="1">
                      SEASON 4 - WEEK THREE
                    </Badge>
                    <HStack gap="1" fontSize="sm" color={emlColors.textMuted}>
                      <Calendar size={14} />
                      <Text>Feb 16, 2026</Text>
                    </HStack>
                  </HStack>

                  <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="800" color={emlColors.textPrimary}>
                    Week Three Matches for Season 4 are Posted!
                  </Text>

                  <VStack align="start" gap="4" w="full">
                    <Text fontSize="sm" color={emlColors.textSecondary} lineHeight="1.7">
                      Go to <Text as="span" fontWeight="700" color={emlColors.accentOrange}>EML Bot Instructions</Text> to see the commands for sending and accepting scheduled matches once the teams agree.
                      Captains and Co-Captains have permissions to run the commands.
                    </Text>

                    <Separator borderColor={emlColors.borderMedium} />

                    {/* League Subs */}
                    <Box w="full" bg={`${emlColors.accentPurple}10`} p="4" rounded="lg" border="1px solid" borderColor={`${emlColors.accentPurple}40`}>
                      <HStack gap="2" mb="2">
                        <AlertCircle size={16} color={emlColors.accentPurple} />
                        <Text fontSize="sm" fontWeight="700" color={emlColors.textPrimary} textTransform="uppercase" letterSpacing="wide">
                          League Subs
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color={emlColors.textSecondary}>
                        League subs are active until Roster Lock
                      </Text>
                    </Box>

                    {/* Match Scheduling */}
                    <Box w="full" bg={`${emlColors.accentOrange}10`} p="4" rounded="lg" border="1px solid" borderColor={`${emlColors.accentOrange}40`}>
                      <HStack gap="2" mb="2">
                        <AlertCircle size={16} color={emlColors.accentOrange} />
                        <Text fontSize="sm" fontWeight="700" color={emlColors.textPrimary} textTransform="uppercase" letterSpacing="wide">
                          Matches Need to Be Scheduled by Friday and Played by Sunday
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color={emlColors.textSecondary}>
                        League rules require matches be scheduled by Friday at noon EDT. As always they can be played through Sunday night.
                        Forfeits are determined by the mod team using a variety of factors.
                      </Text>
                    </Box>

                    {/* Cooldowns */}
                    <Box w="full" bg={`${emlColors.accentPurple}10`} p="4" rounded="lg" border="1px solid" borderColor={`${emlColors.accentPurple}40`}>
                      <HStack gap="2" mb="2">
                        <AlertCircle size={16} color={emlColors.accentPurple} />
                        <Text fontSize="sm" fontWeight="700" color={emlColors.textPrimary} textTransform="uppercase" letterSpacing="wide">
                          Cooldowns Are Now Live
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color={emlColors.textSecondary}>
                        Players can leave a team and join another, or register as a League Substitute, but players will be on cooldown for leaving a team
                        and cannot participate in any EML match until the next matches are generated on the following Monday. No cooldowns will be waived.
                      </Text>
                    </Box>

                    {/* Forfeit Notice */}
                    <Box w="full" bg={`${emlColors.accentOrange}10`} p="4" rounded="lg" border="1px solid" borderColor={`${emlColors.accentOrange}40`}>
                      <HStack gap="2" mb="2">
                        <AlertCircle size={16} color={emlColors.accentOrange} />
                        <Text fontSize="sm" fontWeight="700" color={emlColors.textPrimary} textTransform="uppercase" letterSpacing="wide">
                          If Your Opponent Forfeits, Is Nonresponsive or Disbands Open a League Ticket
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color={emlColors.textSecondary}>
                        create-a-ticket
                      </Text>
                    </Box>

                    <Text fontSize="lg" fontWeight="800" color={emlColors.accentOrange} textAlign="center" w="full" mt="2">
                      GLHF!
                    </Text>

                    {/* Week Three Image */}
                    <Box w="full" mt="4" rounded="xl" overflow="hidden" border="1px solid" borderColor={emlColors.borderMedium}>
                      <Image
                        src="https://cdn.discordapp.com/attachments/1461811148482412835/1472831606065463337/image.png?ex=6994a992&is=69935812&hm=6980752c980bfd40e211df0317d5df12cef92c541a5cf1f1cc47763a1636def2&"
                        alt="Season 4 Week Three Matches"
                        w="full"
                        h="auto"
                        objectFit="contain"
                        maxH={{ base: '300px', md: '500px' }}
                      />
                    </Box>
                  </VStack>
                </VStack>
              </Box>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default AnnouncementsView;

