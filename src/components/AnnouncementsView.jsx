import { Box, Dialog, Portal, CloseButton, HStack, VStack, Text, Grid, Badge } from '@chakra-ui/react';
import { Bell, Calendar } from 'lucide-react';
import { emlColors } from '../theme/colors';

const announcements = [
  { id: 1, category: 'Tournament', title: 'Season 4 Registration Open', date: 'Feb 1, 2026', summary: 'Sign up your team for the upcoming season. New format and expanded competition.' },
  { id: 2, category: 'Rules Update', title: 'Updated League Guidelines', date: 'Jan 28, 2026', summary: 'Review the latest changes to match protocols and code of conduct.' },
  { id: 3, category: 'Results', title: 'Championship Finals Results', date: 'Jan 25, 2026', summary: 'Congratulations to all teams who competed in the finals. See full results and highlights.' },
  { id: 4, category: 'Event', title: 'Community Meet & Greet', date: 'Jan 20, 2026', summary: 'Join us for a virtual meetup with players, casters, and staff.' }
];

const AnnouncementsView = ({ theme, open, onClose }) => {

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
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="6">
                {announcements.map(item => (
                  <Box
                    key={item.id}
                    bg={emlColors.bgElevated}
                    p="6"
                    rounded="2xl"
                    border="1px solid"
                    borderColor={emlColors.borderMedium}
                    _hover={{ transform: 'translateY(-4px)', borderColor: emlColors.accentOrange }}
                    transition="all 0.3s"
                  >
                    <VStack align="start" gap="3">
                      <HStack justify="space-between" w="full">
                        <Badge colorPalette="orange" size="sm">{item.category}</Badge>
                        <HStack gap="1" fontSize="xs" color={emlColors.textMuted}>
                          <Calendar size={12} />
                          <Text>{item.date}</Text>
                        </HStack>
                      </HStack>
                      <Text fontSize="lg" fontWeight="700" color={emlColors.textPrimary}>{item.title}</Text>
                      <Text fontSize="sm" color={emlColors.textMuted} lineHeight="1.6">
                        {item.summary}
                      </Text>
                    </VStack>
                  </Box>
                ))}
              </Grid>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default AnnouncementsView;
