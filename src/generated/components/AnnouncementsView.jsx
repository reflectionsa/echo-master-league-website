import { Box, Dialog, Portal, CloseButton, HStack, VStack, Text, Grid, Badge } from '@chakra-ui/react';
import { Bell, Calendar } from 'lucide-react';

const announcements = [
  { id: 1, category: 'Tournament', title: 'Season 4 Registration Open', date: 'Feb 1, 2026', summary: 'Sign up your team for the upcoming season. New format and expanded competition.' },
  { id: 2, category: 'Rules Update', title: 'Updated League Guidelines', date: 'Jan 28, 2026', summary: 'Review the latest changes to match protocols and code of conduct.' },
  { id: 3, category: 'Results', title: 'Championship Finals Results', date: 'Jan 25, 2026', summary: 'Congratulations to all teams who competed in the finals. See full results and highlights.' },
  { id: 4, category: 'Event', title: 'Community Meet & Greet', date: 'Jan 20, 2026', summary: 'Join us for a virtual meetup with players, casters, and staff.' }
];

const AnnouncementsView = ({ theme, open, onClose }) => {
  const isDark = theme === 'dark';

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="lg">
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.700" backdropFilter="blur(10px)" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="900px"
            maxH="90vh"
            bg={isDark ? 'gray.900' : 'white'}
            border="1px solid"
            borderColor={isDark ? 'gray.700' : 'gray.200'}
            rounded="2xl"
            overflow="hidden"
          >
            <Dialog.Header bg={isDark ? 'gray.850' : 'gray.50'} borderBottom="1px solid" borderColor={isDark ? 'gray.700' : 'gray.200'}>
              <HStack justify="space-between">
                <HStack gap="2">
                  <Bell size={24} color={isDark ? 'var(--chakra-colors-orange-400)' : 'var(--chakra-colors-blue-600)'} />
                  <Dialog.Title fontSize="2xl" fontWeight="800" color={isDark ? 'white' : 'gray.900'}>
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
                    bg={isDark ? 'whiteAlpha.50' : 'white'}
                    p="6"
                    rounded="2xl"
                    border="1px solid"
                    borderColor={isDark ? 'whiteAlpha.100' : 'blackAlpha.100'}
                    _hover={{ transform: 'translateY(-4px)', borderColor: isDark ? 'orange.500' : 'blue.500' }}
                    transition="all 0.3s"
                  >
                    <VStack align="start" gap="3">
                      <HStack justify="space-between" w="full">
                        <Badge colorPalette={isDark ? 'orange' : 'blue'} size="sm">{item.category}</Badge>
                        <HStack gap="1" fontSize="xs" color={isDark ? 'gray.500' : 'gray.600'}>
                          <Calendar size={12} />
                          <Text>{item.date}</Text>
                        </HStack>
                      </HStack>
                      <Text fontSize="lg" fontWeight="700" color={isDark ? 'white' : 'gray.900'}>{item.title}</Text>
                      <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'} lineHeight="1.6">
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
