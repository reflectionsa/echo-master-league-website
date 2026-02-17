import { Box, Dialog, Portal, CloseButton, HStack, VStack, Text, Badge, Separator, Spinner, Center, For } from '@chakra-ui/react';
import { Bell, Calendar, AlertCircle, Megaphone } from 'lucide-react';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { useAccessibility } from '../hooks/useAccessibility';
import { getThemedColors } from '../theme/colors';

const AnnouncementsView = ({ theme, open, onClose }) => {
  const { needsColorBlindSupport } = useAccessibility();
  const emlColors = getThemedColors(theme, needsColorBlindSupport);
  const { announcements, loading, error, getHighPriorityAnnouncements } = useAnnouncements();

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'league updates':
        return 'orange';
      case 'management':
        return 'purple';
      case 'schedule':
        return 'cyan';
      case 'major events':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getPriorityBorder = (priority) => {
    return priority?.toLowerCase() === 'high' ? emlColors.accentOrange : emlColors.borderMedium;
  };

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
              {loading ? (
                <Center py="20"><Spinner size="xl" color={emlColors.accentOrange} /></Center>
              ) : error ? (
                <Center py="20">
                  <Box textAlign="center">
                    <Text color={emlColors.semantic.error} fontSize="lg" fontWeight="600" mb="2">
                      Error loading announcements
                    </Text>
                    <Text color={emlColors.textMuted} fontSize="sm">
                      {error}
                    </Text>
                    <Text color={emlColors.textMuted} fontSize="xs" mt="4">
                      Check that the "Announcements" sheet exists in Google Sheets
                    </Text>
                  </Box>
                </Center>
              ) : announcements.length === 0 ? (
                <Center py="20">
                  <VStack gap="3">
                    <Megaphone size={48} color={emlColors.textMuted} />
                    <Text color={emlColors.textMuted}>No announcements at this time</Text>
                  </VStack>
                </Center>
              ) : (
                <VStack gap="6" align="stretch">
                  <For each={announcements}>
                    {(announcement) => (
                      <Box
                        key={announcement.id}
                        bg={announcement.priority?.toLowerCase() === 'high' 
                          ? `linear-gradient(135deg, ${emlColors.accentOrange}15, ${emlColors.accentPurple}15)`
                          : `${emlColors.textPrimary}08`}
                        p="6"
                        rounded="2xl"
                        border="2px solid"
                        borderColor={getPriorityBorder(announcement.priority)}
                      >
                        <VStack align="start" gap="4">
                          <HStack justify="space-between" w="full" flexWrap="wrap">
                            <Badge 
                              colorPalette={getCategoryColor(announcement.category)} 
                              size="lg" 
                              px="3" 
                              py="1"
                            >
                              {announcement.category.toUpperCase()}
                            </Badge>
                            <HStack gap="2">
                              {announcement.priority?.toLowerCase() === 'high' && (
                                <Badge colorPalette="red" size="sm">
                                  <AlertCircle size={12} /> HIGH PRIORITY
                                </Badge>
                              )}
                              <HStack gap="1" fontSize="sm" color={emlColors.textMuted}>
                                <Calendar size={14} />
                                <Text>
                                  {new Date(announcement.date).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                  })}
                                </Text>
                              </HStack>
                            </HStack>
                          </HStack>

                          <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="800" color={emlColors.textPrimary}>
                            {announcement.title}
                          </Text>

                          <Separator borderColor={emlColors.borderMedium} />

                          <Text 
                            fontSize="sm" 
                            color={emlColors.textSecondary} 
                            lineHeight="1.7"
                            whiteSpace="pre-wrap"
                          >
                            {announcement.content}
                          </Text>

                          {announcement.author && (
                            <Text fontSize="xs" color={emlColors.textMuted} textAlign="right" w="full">
                              — {announcement.author}
                            </Text>
                          )}
                        </VStack>
                      </Box>
                    )}
                  </For>
                </VStack>
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default AnnouncementsView;

