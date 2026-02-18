import { Box, Dialog, Portal, CloseButton, HStack, VStack, Text, Button, Grid, Center, Spinner, Badge, AspectRatio, For, IconButton } from '@chakra-ui/react';
import { Video, Play, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useState } from 'react';
import { useHighlights } from '../hooks/useHighlights';
import { useAccessibility } from '../hooks/useAccessibility';
import { getThemedColors } from '../theme/colors';

const HighlightsView = ({ theme, open, onClose }) => {
  const { needsColorBlindSupport } = useAccessibility();
  const emlColors = getThemedColors(theme, needsColorBlindSupport);
  const { highlights, loading, error, getFeaturedHighlights } = useHighlights();
  const [selectedHighlight, setSelectedHighlight] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const featured = getFeaturedHighlights();
  const featuredClip = featured.length > 0 ? featured[carouselIndex % featured.length] : null;

  const nextClip = () => {
    setCarouselIndex((prev) => (prev + 1) % featured.length);
  };

  const prevClip = () => {
    setCarouselIndex((prev) => (prev - 1 + featured.length) % featured.length);
  };

  // Extract video ID from YouTube URL
  const getYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  // Extract Twitch clip ID
  const getTwitchClipId = (url) => {
    const match = url.match(/clip\.twitch\.tv\/([a-zA-Z0-9_-]+)|clips\.twitch\.tv\/([a-zA-Z0-9_-]+)/);
    return match ? (match[1] || match[2]) : null;
  };

  // Get allowed parent domains for Twitch embeds
  const getTwitchParent = () => {
    // Use production domain if available, otherwise localhost
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'localhost'; // Twitch allows localhost in development
    }
    return hostname; // Use actual hostname in production
  };

  const renderVideoPlayer = (highlight) => {
    const platform = highlight.platform.toLowerCase();
    
    if (platform.includes('youtube')) {
      const videoId = getYouTubeId(highlight.url);
      if (videoId) {
        return (
          <AspectRatio ratio={16 / 9}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={highlight.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: 'none', borderRadius: '12px' }}
            />
          </AspectRatio>
        );
      }
    } else if (platform.includes('twitch')) {
      const clipId = getTwitchClipId(highlight.url);
      if (clipId) {
        return (
          <AspectRatio ratio={16 / 9}>
            <iframe
              src={`https://clips.twitch.tv/embed?clip=${clipId}&parent=${getTwitchParent()}`}
              title={highlight.title}
              allowFullScreen
              style={{ border: 'none', borderRadius: '12px' }}
            />
          </AspectRatio>
        );
      }
    }

    // Fallback for other platforms or direct links
    return (
      <AspectRatio ratio={16 / 9}>
        <Center bg={emlColors.bgTertiary} rounded="xl">
          <Button
            onClick={() => window.open(highlight.url, '_blank')}
            colorPalette="orange"
            leftIcon={<Play size={20} />}
          >
            Watch on {highlight.platform}
          </Button>
        </Center>
      </AspectRatio>
    );
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
                  <Video size={24} color={emlColors.accentOrange} />
                  <Dialog.Title fontSize="2xl" fontWeight="800" color={emlColors.textPrimary}>
                    EML Highlights
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
                      Error loading highlights
                    </Text>
                    <Text color={emlColors.textMuted} fontSize="sm">
                      {error}
                    </Text>
                    <Text color={emlColors.textMuted} fontSize="xs" mt="4">
                      Check that the "Highlights" sheet exists in Google Sheets
                    </Text>
                  </Box>
                </Center>
              ) : (
                <VStack gap="8" align="stretch">
                  {/* Featured Clip Carousel */}
                  {featured.length > 0 && featuredClip && (
                    <Box>
                      <HStack justify="space-between" mb="4">
                        <HStack gap="2">
                          <Star size={20} color={emlColors.accentOrange} fill={emlColors.accentOrange} />
                          <Text fontSize="xl" fontWeight="700" color={emlColors.textPrimary}>
                            Featured Highlight
                          </Text>
                        </HStack>
                        {featured.length > 1 && (
                          <HStack gap="2">
                            <IconButton
                              size="sm"
                              variant="ghost"
                              onClick={prevClip}
                              aria-label="Previous clip"
                            >
                              <ChevronLeft size={20} />
                            </IconButton>
                            <Text fontSize="sm" color={emlColors.textMuted}>
                              {carouselIndex + 1} / {featured.length}
                            </Text>
                            <IconButton
                              size="sm"
                              variant="ghost"
                              onClick={nextClip}
                              aria-label="Next clip"
                            >
                              <ChevronRight size={20} />
                            </IconButton>
                          </HStack>
                        )}
                      </HStack>
                      <Box
                        bg={`${emlColors.textPrimary}08`}
                        border="2px solid"
                        borderColor={emlColors.accentOrange}
                        rounded="2xl"
                        p="6"
                      >
                        <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap="6">
                          <Box>
                            {renderVideoPlayer(featuredClip)}
                          </Box>
                          <VStack align="start" gap="3">
                            <Badge colorPalette="orange" size="lg">
                              {featuredClip.platform}
                            </Badge>
                            <Text fontSize="2xl" fontWeight="800" color={emlColors.textPrimary}>
                              {featuredClip.title}
                            </Text>
                            {featuredClip.player && (
                              <HStack>
                                <Text fontSize="sm" color={emlColors.textMuted}>Spotlight:</Text>
                                <Text fontSize="sm" fontWeight="600" color={emlColors.accentCyan}>
                                  {featuredClip.player}
                                </Text>
                              </HStack>
                            )}
                            {featuredClip.date && (
                              <Text fontSize="sm" color={emlColors.textMuted}>
                                {new Date(featuredClip.date).toLocaleDateString()}
                              </Text>
                            )}
                            {featuredClip.description && (
                              <Text fontSize="sm" color={emlColors.textPrimary}>
                                {featuredClip.description}
                              </Text>
                            )}
                          </VStack>
                        </Grid>
                      </Box>
                    </Box>
                  )}

                  {/* All Highlights Grid */}
                  {highlights.length > 0 ? (
                    <Box>
                      <Text fontSize="xl" fontWeight="700" color={emlColors.textPrimary} mb="4">
                        All Highlights
                      </Text>
                      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="4">
                        <For each={highlights}>
                          {(highlight) => (
                            <Box
                              key={highlight.id}
                              bg={`${emlColors.textPrimary}08`}
                              border="1px solid"
                              borderColor={emlColors.borderMedium}
                              rounded="xl"
                              overflow="hidden"
                              _hover={{ transform: 'translateY(-2px)', borderColor: emlColors.accentCyan }}
                              transition="all 0.2s"
                              cursor="pointer"
                              onClick={() => setSelectedHighlight(highlight)}
                            >
                              <Box position="relative">
                                {highlight.thumbnail ? (
                                  <AspectRatio ratio={16 / 9}>
                                    <img
                                      src={highlight.thumbnail}
                                      alt={highlight.title}
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
                                {highlight.featured && (
                                  <Box position="absolute" top="2" right="2">
                                    <Star size={16} color={emlColors.accentOrange} fill={emlColors.accentOrange} />
                                  </Box>
                                )}
                              </Box>
                              <VStack p="3" align="start" gap="2">
                                <Text fontSize="sm" fontWeight="700" color={emlColors.textPrimary} noOfLines={2}>
                                  {highlight.title}
                                </Text>
                                <HStack justify="space-between" w="full">
                                  <Badge colorPalette="cyan" size="sm">
                                    {highlight.platform}
                                  </Badge>
                                  {highlight.player && (
                                    <Text fontSize="xs" color={emlColors.textMuted} noOfLines={1}>
                                      {highlight.player}
                                    </Text>
                                  )}
                                </HStack>
                              </VStack>
                            </Box>
                          )}
                        </For>
                      </Grid>
                    </Box>
                  ) : (
                    <Center py="10">
                      <Text color={emlColors.textMuted}>No highlights available yet</Text>
                    </Center>
                  )}
                </VStack>
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>

      {/* Selected Highlight Detail Modal */}
      {selectedHighlight && (
        <Dialog.Root open={!!selectedHighlight} onOpenChange={() => setSelectedHighlight(null)} size="lg">
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
                    <Dialog.Title fontSize="xl" fontWeight="700" color={emlColors.textPrimary}>
                      {selectedHighlight.title}
                    </Dialog.Title>
                    <Dialog.CloseTrigger asChild>
                      <CloseButton />
                    </Dialog.CloseTrigger>
                  </HStack>
                </Dialog.Header>
                <Dialog.Body p="6">
                  <VStack gap="4" align="stretch">
                    {renderVideoPlayer(selectedHighlight)}
                    {selectedHighlight.description && (
                      <Text color={emlColors.textPrimary}>{selectedHighlight.description}</Text>
                    )}
                    <HStack justify="space-between">
                      {selectedHighlight.player && (
                        <HStack>
                          <Text fontSize="sm" color={emlColors.textMuted}>Player:</Text>
                          <Text fontSize="sm" fontWeight="600" color={emlColors.accentCyan}>
                            {selectedHighlight.player}
                          </Text>
                        </HStack>
                      )}
                      {selectedHighlight.date && (
                        <Text fontSize="sm" color={emlColors.textMuted}>
                          {new Date(selectedHighlight.date).toLocaleDateString()}
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

export default HighlightsView;
