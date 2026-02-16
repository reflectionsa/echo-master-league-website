import { Box, Container, VStack, Text, HStack, Grid, Center, Button } from '@chakra-ui/react';
import { Video, Youtube, Music2 } from 'lucide-react';

const MediaSection = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <Box id="media" py="20" bg={isDark ? 'gray.950' : 'gray.50'}>
      <Container maxW="6xl">
        <VStack gap="12">
          <VStack gap="4" textAlign="center">
            <HStack gap="2" justify="center">
              <Video size={20} color={isDark ? '#fb923c' : '#3b82f6'} />
              <Text fontSize="sm" fontWeight="700" color={isDark ? 'orange.400' : 'blue.600'} textTransform="uppercase" letterSpacing="wider">
                Media Gallery
              </Text>
            </HStack>
            <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color={isDark ? 'white' : 'gray.900'}>
              Highlights & Content
            </Text>
          </VStack>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="6" w="full">
            {[
              { icon: Video, label: 'Twitch Streams', desc: 'Watch live matches & VODs', color: '#9146FF', url: 'https://www.twitch.tv/echomasterleague' },
              { icon: Youtube, label: 'YouTube Channel', desc: 'Highlights & tournament recaps', color: '#FF0000', url: 'https://www.youtube.com/@EchoMasterLeague' },
              { icon: Music2, label: 'TikTok Clips', desc: 'Best plays & moments', color: isDark ? '#00f2ea' : '#fe2c55', url: 'https://www.tiktok.com/@echo.masterleague' }
            ].map(item => (
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
        </VStack>
      </Container>
    </Box>
  );
};

export default MediaSection;
