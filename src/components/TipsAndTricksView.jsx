import { Box, Dialog, Portal, CloseButton, HStack, VStack, Text, Grid, Center, Spinner, Badge, AspectRatio, For, Button } from '@chakra-ui/react';
import { Lightbulb, Play, Filter } from 'lucide-react';
import { useState } from 'react';
import { useTipsAndTricks } from '../hooks/useTipsAndTricks';
import { useAccessibility } from '../hooks/useAccessibility';
import { getThemedColors } from '../theme/colors';

const TipsAndTricksView = ({ theme, open, onClose }) => {
  const { needsColorBlindSupport } = useAccessibility();
  const emlColors = getThemedColors(theme, needsColorBlindSupport);
  const { tips, loading, error, getTipsByCategory } = useTipsAndTricks();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTip, setSelectedTip] = useState(null);

  const categories = ['All', 'Humorous', 'Instructional', 'Strategy'];
  
  const filteredTips = selectedCategory === 'All' 
    ? tips 
    : getTipsByCategory(selectedCategory);

  // Extract video ID from YouTube URL
  const getYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const renderVideoPlayer = (tip) => {
    const videoId = getYouTubeId(tip.url);
    if (videoId) {
      return (
        <AspectRatio ratio={16 / 9}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={tip.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: 'none', borderRadius: '12px' }}
          />
        </AspectRatio>
      );
    }

    return (
      <AspectRatio ratio={16 / 9}>
        <Center bg={emlColors.bgTertiary} rounded="xl">
          <Button
            onClick={() => window.open(tip.url, '_blank')}
            colorPalette="orange"
            leftIcon={<Play size={20} />}
          >
            Watch Video
          </Button>
        </Center>
      </AspectRatio>
    );
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'humorous':
        return 'orange';
      case 'instructional':
        return 'cyan';
      case 'strategy':
        return 'purple';
      default:
        return 'gray';
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="full">
      <Portal>
        <Dialog.Backdrop bg={`${emlColors.bgPrimary}b3`} backdropFilter="blur(10px)" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="90vw"
            maxH="90vh"
            bg={emlColors.bgSecondary}
            border="1px solid"
            borderColor={emlColors.borderMedium}
            rounded="2xl"
            overflow="hidden"
          >
            <Dialog.Header bg={emlColors.bgTertiary} borderBottom="1px solid" borderColor={emlColors.borderMedium}>
              <HStack justify="space-between">
                <HStack gap="2">
                  <Lightbulb size={24} color={emlColors.accentOrange} />
                  <Dialog.Title fontSize="2xl" fontWeight="800" color={emlColors.textPrimary}>
                    Tips & Tricks
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
                      Error loading tips & tricks
                    </Text>
                    <Text color={emlColors.textMuted} fontSize="sm">
                      {error}
                    </Text>
                    <Text color={emlColors.textMuted} fontSize="xs" mt="4">
                      Check that the "Tips And Tricks" sheet exists in Google Sheets
                    </Text>
                  </Box>
                </Center>
              ) : (
                <VStack gap="6" align="stretch">
                  {/* Category Filter */}
                  <HStack gap="2" justify="center" flexWrap="wrap">
                    <Filter size={16} color={emlColors.textMuted} />
                    <For each={categories}>
                      {(category) => (
                        <Badge
                          key={category}
                          colorPalette={selectedCategory === category ? getCategoryColor(category) : 'gray'}
                          size="lg"
                          cursor="pointer"
                          onClick={() => setSelectedCategory(category)}
                          _hover={{ opacity: 0.8 }}
                        >
                          {category}
                        </Badge>
                      )}
                    </For>
                  </HStack>

                  {/* Tips Grid */}
                  {filteredTips.length > 0 ? (
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="4">
                      <For each={filteredTips}>
                        {(tip) => (
                          <Box
                            key={tip.id}
                            bg={`${emlColors.textPrimary}08`}
                            border="1px solid"
                            borderColor={emlColors.borderMedium}
                            rounded="xl"
                            overflow="hidden"
                            _hover={{ transform: 'translateY(-2px)', borderColor: emlColors.accentOrange }}
                            transition="all 0.2s"
                            cursor="pointer"
                            onClick={() => setSelectedTip(tip)}
                          >
                            <Box position="relative">
                              {tip.thumbnail ? (
                                <AspectRatio ratio={16 / 9}>
                                  <img
                                    src={tip.thumbnail}
                                    alt={tip.title}
                                    style={{ objectFit: 'cover' }}
                                  />
                                </AspectRatio>
                              ) : (
                                <AspectRatio ratio={16 / 9}>
                                  <Center bg={emlColors.bgTertiary}>
                                    <Play size={48} color={emlColors.textMuted} />
                                  </Center>
                                </AspectRatio>
                              )}
                              {tip.duration && (
                                <Box position="absolute" bottom="2" right="2">
                                  <Badge colorPalette="gray" size="sm">
                                    {tip.duration}
                                  </Badge>
                                </Box>
                              )}
                            </Box>
                            <VStack p="3" align="start" gap="2">
                              <Badge colorPalette={getCategoryColor(tip.category)} size="sm">
                                {tip.category}
                              </Badge>
                              <Text fontSize="sm" fontWeight="700" color={emlColors.textPrimary} noOfLines={2}>
                                {tip.title}
                              </Text>
                              {tip.description && (
                                <Text fontSize="xs" color={emlColors.textMuted} noOfLines={2}>
                                  {tip.description}
                                </Text>
                              )}
                            </VStack>
                          </Box>
                        )}
                      </For>
                    </Grid>
                  ) : (
                    <Center py="10">
                      <Text color={emlColors.textMuted}>
                        {selectedCategory === 'All' 
                          ? 'No tips available yet' 
                          : `No ${selectedCategory.toLowerCase()} tips available`}
                      </Text>
                    </Center>
                  )}
                </VStack>
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>

      {/* Selected Tip Detail Modal */}
      {selectedTip && (
        <Dialog.Root open={!!selectedTip} onOpenChange={() => setSelectedTip(null)} size="lg">
          <Portal>
            <Dialog.Backdrop bg={`${emlColors.bgPrimary}b3`} backdropFilter="blur(10px)" />
            <Dialog.Positioner>
              <Dialog.Content
                maxW="1200px"
                bg={emlColors.bgSecondary}
                border="1px solid"
                borderColor={emlColors.borderMedium}
                rounded="2xl"
                overflow="hidden"
              >
                <Dialog.Header bg={emlColors.bgTertiary} borderBottom="1px solid" borderColor={emlColors.borderMedium}>
                  <HStack justify="space-between">
                    <HStack gap="2">
                      <Badge colorPalette={getCategoryColor(selectedTip.category)} size="sm">
                        {selectedTip.category}
                      </Badge>
                      <Dialog.Title fontSize="xl" fontWeight="700" color={emlColors.textPrimary}>
                        {selectedTip.title}
                      </Dialog.Title>
                    </HStack>
                    <Dialog.CloseTrigger asChild>
                      <CloseButton />
                    </Dialog.CloseTrigger>
                  </HStack>
                </Dialog.Header>
                <Dialog.Body p="6">
                  <VStack gap="4" align="stretch">
                    {renderVideoPlayer(selectedTip)}
                    {selectedTip.description && (
                      <Text color={emlColors.textPrimary}>{selectedTip.description}</Text>
                    )}
                    <HStack justify="space-between">
                      {selectedTip.duration && (
                        <Text fontSize="sm" color={emlColors.textMuted}>
                          Duration: {selectedTip.duration}
                        </Text>
                      )}
                      {selectedTip.date && (
                        <Text fontSize="sm" color={emlColors.textMuted}>
                          {new Date(selectedTip.date).toLocaleDateString()}
                        </Text>
                      )}
                    </HStack>
                  </VStack>
                </Dialog.Body>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      )}
    </Dialog.Root>
  );
};

export default TipsAndTricksView;
