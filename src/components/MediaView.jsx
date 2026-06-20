import { Box, Dialog, Portal, CloseButton, HStack, VStack, Text, Button, Grid, Center } from '@chakra-ui/react';
import { Video, Youtube, Music2 } from 'lucide-react';
import { getThemedColors } from '../theme/colors';
import RoutePageLayout from './RoutePageLayout';

const MediaView = ({ theme }) => {
  const emlColors = getThemedColors(theme);

  const platforms = [
    { icon: Video, label: 'Twitch Streams', desc: 'Watch live matches & VODs', color: '#9146FF', url: 'https://www.twitch.tv/echomasterleague' },
    { icon: Youtube, label: 'YouTube Channel', desc: 'Highlights & tournament recaps', color: '#FF0000', url: 'https://www.youtube.com/@EchoMasterLeague' },
    { icon: Music2, label: 'TikTok Clips', desc: 'Best plays & moments', color: emlColors.accentCyan, url: 'https://www.tiktok.com/@echo.masterleague' }
  ];

  return (
    <RoutePageLayout
      maxW="900px"
      bg={emlColors.bgSecondary}
      border="1px solid"
      borderColor={emlColors.borderMedium}
      rounded="2xl"
      overflow="hidden"
    >
      <Box bg={emlColors.bgTertiary} borderBottom="1px solid" borderColor={emlColors.borderMedium} px="6" py="5">
        <HStack gap="2">
          <Video size={24} color={emlColors.accentOrange} />
          <Text fontSize="2xl" fontWeight="800" color={emlColors.textPrimary}>
            Highlights & Content
          </Text>
        </HStack>
      </Box>
      <Box p="6" overflowY="auto" flex="1">
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="6">
          {platforms.map(item => (
            <Box
              key={item.label}
              bg={`${emlColors.textPrimary}08`}
              border="1px solid"
              borderColor={emlColors.borderMedium}
              rounded="2xl"
              overflow="hidden"
              _hover={{ transform: 'translateY(-4px)', borderColor: emlColors.accentOrange }}
              transition="all 0.3s"
            >
              <Center h="160px" bg={`${emlColors.textPrimary}0c`}>
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
      </Box>
    </RoutePageLayout>
  );
};

export default MediaView;
