import { Box, Dialog, Portal, CloseButton, HStack, VStack, Text, Button, Grid, Center } from '@chakra-ui/react';
import { Video } from 'lucide-react';
import { Youtube, Music2 } from 'lucide-react';

const MediaView = ({ theme, open, onClose }) => {
  const isDark = theme === 'dark';

  const platforms = [
    { icon: Video, label: 'Twitch Streams', desc: 'Watch live matches & VODs', color: '#9146FF', url: 'https://www.twitch.tv/echomasterleague' },
    { icon: Youtube, label: 'YouTube Channel', desc: 'Highlights & tournament recaps', color: '#FF0000', url: 'https://www.youtube.com/@EchoMasterLeague' },
    { icon: Music2, label: 'TikTok Clips', desc: 'Best plays & moments', color: isDark ? '#00f2ea' : '#fe2c55', url: 'https://www.tiktok.com/@echo.masterleague' }
  ];

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="lg">
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.700" backdropFilter="blur(10px)" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="900px"
            bg={isDark ? 'gray.900' : 'white'}
            border="1px solid"
            borderColor={isDark ? 'gray.700' : 'gray.200'}
            rounded="2xl"
            overflow="hidden"
          >
            <Dialog.Header bg={isDark ? 'gray.850' : 'gray.50'} borderBottom="1px solid" borderColor={isDark ? 'gray.700' : 'gray.200'}>
              <HStack justify="space-between">
                <HStack gap="2">
                  <Video size={24} color={isDark ? 'var(--chakra-colors-orange-400)' : 'var(--chakra-colors-blue-600)'} />
                  <Dialog.Title fontSize="2xl" fontWeight="800" color={isDark ? 'white' : 'gray.900'}>
                    Highlights & Content
                  </Dialog.Title>
                </HStack>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="lg" />
                </Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>
            <Dialog.Body p="6">
              <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="6">
                {platforms.map(item => (
                  <Box
                    key={item.label}
                    bg={isDark ? 'whiteAlpha.50' : 'white'}
                    border="1px solid"
                    borderColor={isDark ? 'whiteAlpha.100' : 'blackAlpha.100'}
                    rounded="2xl"
                    overflow="hidden"
                    _hover={{ transform: 'translateY(-4px)', borderColor: isDark ? 'orange.500' : 'blue.500' }}
                    transition="all 0.3s"
                  >
                    <Center h="160px" bg={isDark ? 'whiteAlpha.50' : 'gray.100'}>
                      <item.icon size={48} color={item.color} />
                    </Center>
                    <VStack p="5" align="stretch" gap="3">
                      <VStack align="start" gap="1">
                        <Text fontSize="lg" fontWeight="700" color={isDark ? 'white' : 'gray.900'}>{item.label}</Text>
                        <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>{item.desc}</Text>
                      </VStack>
                      <Button
                        size="sm"
                        variant="outline"
                        colorPalette={isDark ? 'orange' : 'blue'}
                        onClick={() => window.open(item.url, '_blank')}
                        w="full"
                      >
                        Visit Channel
                      </Button>
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

export default MediaView;
