import { Box, Dialog, Portal, CloseButton, HStack, VStack, Text, Badge, Image, Spinner, Center } from '@chakra-ui/react';
import { Bell, Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import { getThemedColors } from '../theme/colors';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { getCurrentSeasonWeek, getWeekName, getWeekDateRange } from '../utils/weekUtils';

const formatRelativeTime = (isoStr) => {
  const diff = Date.now() - new Date(isoStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

// Render Discord markdown-lite: bold **text** and links
const renderContent = (text, primaryColor) => {
  if (!text) return null;
  // Split on **bold** first
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <Text as="span" key={i} fontWeight="800" color={primaryColor}>{part.slice(2, -2)}</Text>;
    }
    // Simple URL linkification
    const urlParts = part.split(/(https?:\/\/[^\s]+)/g);
    return urlParts.map((up, j) =>
      up.match(/^https?:\/\//) ? (
        <Text as="a" key={`${i}-${j}`} href={up} target="_blank" rel="noopener noreferrer" color="#ff6b2b" fontWeight="600" _hover={{ textDecoration: 'underline' }}>{up}</Text>
      ) : up
    );
  });
};

const AnnouncementCard = ({ announcement, colors, index }) => (
  <Box
    bg={index === 0 ? `linear-gradient(135deg, ${colors.accentOrange}0d, ${colors.accentPurple}0a)` : colors.bgSecondary}
    border="1px solid"
    borderColor={index === 0 ? `${colors.accentOrange}58` : colors.borderLight}
    rounded="2xl"
    overflow="hidden"
  >
    {/* Author + timestamp header */}
    <HStack bg={index === 0 ? `${colors.accentOrange}12` : `${colors.textPrimary}08`} px="5" py="3" borderBottom="1px solid" borderColor={colors.borderLight}>
      <HStack gap="2" flex="1">
        {announcement.author?.avatar && (
          <Image src={announcement.author.avatar} alt={announcement.author.username} w="6" h="6" rounded="full" />
        )}
        <Text fontSize="xs" fontWeight="700" color={colors.textPrimary}>{announcement.author?.username || 'EML Staff'}</Text>
        {index === 0 && <Badge bg="rgba(255,107,43,0.15)" color="#ff6b2b" border="1px solid rgba(255,107,43,0.3)" fontSize="2xs" fontWeight="800">LATEST</Badge>}
      </HStack>
      <Text fontSize="xs" color={colors.textMuted}>{formatRelativeTime(announcement.timestamp)}</Text>
    </HStack>

    {/* Content */}
    <Box px="5" py="4">
      <Text fontSize="sm" color={colors.textSecondary} lineHeight="1.75" whiteSpace="pre-wrap">
        {renderContent(announcement.content, colors.textPrimary)}
      </Text>
    </Box>

    {/* Images */}
    {(announcement.attachments?.length > 0 || announcement.embedImages?.length > 0) && (
      <Box px="5" pb="5">
        {[...announcement.attachments, ...announcement.embedImages].map((img, i) => (
          <Box key={i} rounded="xl" overflow="hidden" border="1px solid" borderColor={colors.borderLight} mt={i > 0 ? '3' : '0'}>
            <Image src={img.url} alt={img.filename || `Image ${i + 1}`} w="full" h="auto" maxH="480px" objectFit="contain" bg={colors.bgPrimary} />
          </Box>
        ))}
      </Box>
    )}
  </Box>
);

// Hardcoded fallback shown when Discord API is unavailable
const FallbackAnnouncement = ({ colors }) => {
  const currentWeek = getCurrentSeasonWeek();
  const weekName = getWeekName(currentWeek);
  const weekRange = getWeekDateRange(currentWeek);
  return (
    <Box bg="linear-gradient(135deg, rgba(255,107,43,0.08), rgba(124,58,237,0.06))" border="1px solid rgba(255,107,43,0.35)" rounded="2xl" p="6">
      <HStack justify="space-between" mb="4" flexWrap="wrap" gap="2">
        <Badge bg="rgba(255,107,43,0.15)" color="#ff6b2b" border="1px solid rgba(255,107,43,0.3)" fontWeight="800">SEASON 4 — WEEK {weekName?.toUpperCase()}</Badge>
        <HStack gap="1" fontSize="xs" color={colors.textMuted}><Calendar size={12} /><Text>{weekRange}</Text></HStack>
      </HStack>
      <Text fontSize="xl" fontWeight="800" color={colors.textPrimary} mb="3">Week {weekName} Matches are Posted!</Text>
      <Text fontSize="sm" color={colors.textSecondary} lineHeight="1.7">
        Matches need to be scheduled by Friday and played by Sunday. Use EML Bot commands to schedule — captains and co-captains have permissions. GLHF!
      </Text>
    </Box>
  );
};

const AnnouncementsView = ({ theme, open, onClose }) => {
  const colors = getThemedColors(theme);
  const { announcements, loading, error, refresh } = useAnnouncements();

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="lg">
      <Portal>
        <Dialog.Backdrop bg="rgba(0,0,0,0.85)" backdropFilter="blur(12px)" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="800px"
            maxH="90vh"
            bg={colors.bgPrimary}
            border="1px solid"
            borderColor={colors.borderLight}
            rounded="2xl"
            overflow="hidden"
            display="flex"
            flexDir="column"
          >
            <Dialog.Header bg={colors.bgCard} borderBottom="1px solid" borderColor={colors.borderLight} px="6" py="4">
              <HStack justify="space-between">
                <HStack gap="3">
                  <Box bg="rgba(255,107,43,0.15)" border="1px solid rgba(255,107,43,0.3)" p="2" rounded="lg">
                    <Bell size={18} color="#ff6b2b" />
                  </Box>
                  <Dialog.Title fontSize="lg" fontWeight="800" color={colors.textPrimary}>Announcements</Dialog.Title>
                  {announcements.length > 0 && (
                    <Badge bg="rgba(255,107,43,0.12)" color="#ff6b2b" border="1px solid rgba(255,107,43,0.25)" fontSize="xs">{announcements.length}</Badge>
                  )}
                </HStack>
                <HStack gap="2">
                  <Box as="button" onClick={refresh} p="1.5" rounded="lg" color={colors.textMuted} _hover={{ color: '#ff6b2b', bg: 'rgba(255,107,43,0.1)' }} transition="all 0.15s">
                    <RefreshCw size={14} />
                  </Box>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton size="sm" color={colors.textMuted} />
                  </Dialog.CloseTrigger>
                </HStack>
              </HStack>
            </Dialog.Header>

            <Dialog.Body p="5" overflowY="auto" flex="1">
              {loading && (
                <Center py="16">
                  <VStack gap="3">
                    <Spinner size="lg" color="#ff6b2b" />
                    <Text fontSize="sm" color={colors.textMuted}>Loading announcements…</Text>
                  </VStack>
                </Center>
              )}

              {!loading && error && (
                <VStack gap="4">
                  <Box bg="rgba(239,68,68,0.07)" border="1px solid rgba(239,68,68,0.2)" rounded="xl" p="4" w="full">
                    <HStack gap="2">
                      <AlertCircle size={14} color="#ef4444" />
                      <Text fontSize="xs" color="#ef4444">Could not load live announcements — showing cached content.</Text>
                    </HStack>
                  </Box>
                  <FallbackAnnouncement colors={colors} />
                </VStack>
              )}

              {!loading && !error && announcements.length === 0 && (
                <VStack gap="4">
                  <FallbackAnnouncement colors={colors} />
                </VStack>
              )}

              {!loading && !error && announcements.length > 0 && (
                <VStack gap="4" align="stretch">
                  {announcements.map((a, i) => (
                    <AnnouncementCard key={a.id} announcement={a} colors={colors} index={i} />
                  ))}
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

