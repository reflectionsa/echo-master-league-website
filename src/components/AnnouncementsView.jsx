import { Box, Dialog, Portal, CloseButton, HStack, VStack, Text, Badge, Image, Separator } from '@chakra-ui/react';
import { Bell, Calendar, AlertCircle } from 'lucide-react';
import { getThemedColors } from '../theme/colors';
import { getCurrentSeasonWeek, getWeekName, getWeekDateRange } from '../utils/weekUtils';

const AnnouncementsView = ({ theme, open, onClose }) => {
  const emlColors = getThemedColors(theme);
  const currentWeek = getCurrentSeasonWeek();
  const weekName = getWeekName(currentWeek);
  const weekRange = getWeekDateRange(currentWeek);

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
              {/* Featured: Season 4 Week Four Announcement */}
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
                      SEASON 4 - WEEK {weekName.toUpperCase()}
                    </Badge>
                    <HStack gap="1" fontSize="sm" color={emlColors.textMuted}>
                      <Calendar size={14} />
                      <Text>{weekRange}</Text>
                    </HStack>
                  </HStack>

                  <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="800" color={emlColors.textPrimary}>
                    <Text as="a" href="https://echomasterleague.com/assigned-matches/" target="_blank" rel="noopener noreferrer" color={emlColors.accentOrange} _hover={{ textDecoration: 'underline' }}>
                      Week {weekName} Matches
                    </Text>{' '}for Season 4 are Posted!
                  </Text>

                  <VStack align="start" gap="4" w="full">
                    <Text fontSize="sm" color={emlColors.textSecondary} lineHeight="1.7">
                      Go to{' '}
                      <Text as="a" href="https://echomasterleague.com/eml-bot-instructions/" target="_blank" rel="noopener noreferrer" fontWeight="700" color={emlColors.accentOrange} _hover={{ textDecoration: 'underline' }}>
                        EML Bot Instructions
                      </Text>{' '}
                      to see the commands for sending and accepting scheduled matches once the teams agree.
                      Captains and Co-Captains have permissions to run the commands.
                    </Text>

                    <Separator borderColor={emlColors.borderMedium} />

                    {/* Replay Files */}
                    <Box w="full" bg={`${emlColors.accentPurple}10`} p="4" rounded="lg" border="1px solid" borderColor={`${emlColors.accentPurple}40`}>
                      <HStack gap="2" mb="2">
                        <AlertCircle size={16} color={emlColors.accentPurple} />
                        <Text fontSize="sm" fontWeight="700" color={emlColors.textPrimary} textTransform="uppercase" letterSpacing="wide">
                          Replay Files
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color={emlColors.textSecondary} lineHeight="1.7">
                        In the event of a player being reported for bug abuse (half-cycling, yaw stremming, walking) a replay file may be requested if the evidence isn't clear enough. In the event of a player being reported for cheating, you NEED a replay file to make a valid report.
                      </Text>
                    </Box>

                    {/* Pauses */}
                    <Box w="full" bg={`${emlColors.accentOrange}10`} p="4" rounded="lg" border="1px solid" borderColor={`${emlColors.accentOrange}40`}>
                      <HStack gap="2" mb="2">
                        <AlertCircle size={16} color={emlColors.accentOrange} />
                        <Text fontSize="sm" fontWeight="700" color={emlColors.textPrimary} textTransform="uppercase" letterSpacing="wide">
                          Pauses
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color={emlColors.textSecondary} lineHeight="1.7">
                        Teams get 1 five-minute between-round pause, and 1 five-minute during-round pause (that can be extended to 15 for tech). Any illegal pause will result in a scoring penalty. For every 20 seconds the match is paused as a result of an illegal pause, 2 points will be deducted from the offending team.
                      </Text>
                    </Box>

                    {/* Staff Applications */}
                    <Box w="full" bg={`${emlColors.accentPurple}10`} p="4" rounded="lg" border="1px solid" borderColor={`${emlColors.accentPurple}40`}>
                      <HStack gap="2" mb="2">
                        <AlertCircle size={16} color={emlColors.accentPurple} />
                        <Text fontSize="sm" fontWeight="700" color={emlColors.textPrimary} textTransform="uppercase" letterSpacing="wide">
                          Staff Applications
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color={emlColors.textSecondary} lineHeight="1.7">
                        At any time you can type <Text as="span" fontWeight="700" color={emlColors.accentPurple}>/staff app</Text> and it will pop up with our applications. We are always open for more Casters, Camera Ops, Helpers and Future Mods.
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
                      <Text fontSize="sm" color={emlColors.textSecondary} lineHeight="1.7">
                        League rules require matches be scheduled by <Text as="span" fontStyle="italic">Friday at noon EDT</Text>. If the match is not scheduled by Friday noon please open a ticket.
                      </Text>
                    </Box>

                    <Text fontSize="lg" fontWeight="800" color={emlColors.accentOrange} textAlign="center" w="full" mt="2">
                      GLHF!
                    </Text>

                    {/* Week Four Image */}
                    <Box w="full" mt="4" rounded="xl" overflow="hidden" border="1px solid" borderColor={emlColors.borderMedium}>
                      <Image
                        src="https://media.discordapp.net/attachments/1461811148482412835/1475358463306498161/1BiQ6mb.png?ex=699f2c64&is=699ddae4&hm=5eaed7a939acd27983441ae709c919fd59a162c801e52048937c4f6fd363771f&=&format=webp&quality=lossless&width=960&height=540"
                        alt={`Season 4 Week ${weekName} Matches`}
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

