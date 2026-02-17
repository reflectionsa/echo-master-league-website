import { Box, Container, VStack, Text, HStack, Grid, Center, Button } from '@chakra-ui/react';
import { Video, Youtube, Music2 } from 'lucide-react';
import { emlColors } from '../theme/colors';

const MediaSection = ({ theme }) => {
  return (
    <Box id="media" py="20" bg={emlColors.bgPrimary}>
      <Container maxW="6xl">
        <VStack gap="12">
          <VStack gap="4" textAlign="center">
            <HStack gap="2" justify="center">
              <Video size={20} color={emlColors.accentOrange} />
              <Text fontSize="sm" fontWeight="700" color={emlColors.accentOrange} textTransform="uppercase" letterSpacing="wider">
                Media Gallery
              </Text>
            </HStack>
            <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color={emlColors.textPrimary}>
              Highlights & Content
            </Text>
          </VStack>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="6" w="full">
            {[
              { icon: Video, label: 'Twitch Streams', desc: 'Watch live matches & VODs', color: '#9146FF', url: 'https://www.twitch.tv/echomasterleague' },
              { icon: Youtube, label: 'YouTube Channel', desc: 'Highlights & tournament recaps', color: '#FF0000', url: 'https://www.youtube.com/@EchoMasterLeague' },
              { icon: Music2, label: 'TikTok Clips', desc: 'Best plays & moments', color: emlColors.accentOrange, url: 'https://www.tiktok.com/@echo.masterleague' }
            ].map(item => (
              <Box
                key={item.label}
                bg={emlColors.bgElevated}
                border="1px solid"
                borderColor={emlColors.borderMedium}
                rounded="2xl"
                overflow="hidden"
                _hover={{ transform: 'translateY(-4px)', borderColor: emlColors.accentOrange }}
                transition="all 0.3s"
              >
                <Center h="160px" bg={`${emlColors.bgElevated}99`}>
                  <item.icon size={48} color={item.color} />
                </Center>
                <VStack p="5" align="stretch" gap="3">
                  <VStack align="start" gap="1">
                    <Text fontSize="lg" fontWeight="700" color={emlColors.textPrimary}>{item.label}</Text>
                    <Text fontSize="sm" color={emlColors.textMuted}>{item.desc}</Text>
                  </VStack>
                  <Button
                    size="sm"
                    variant="outline"
                    colorPalette="orange"
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
