import { Box, Container, VStack, Text, HStack, Badge, Grid, Image, Spinner, Center } from '@chakra-ui/react';
import { Bell, RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { getThemedColors } from '../theme/colors';
import { useAnnouncements } from '../hooks/useAnnouncements';

const formatRelativeTime = (isoStr) => {
  if (!isoStr) return '';
  const diff = Date.now() - new Date(isoStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const renderContent = (text, accentColor) => {
  if (!text) return null;
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <Text as="span" key={i} fontWeight="800" color={accentColor}>{part.slice(2, -2)}</Text>;
    }
    return part.split(/(https?:\/\/[^\s]+)/g).map((up, j) =>
      up.match(/^https?:\/\//) ? (
        <Text as="a" key={`${i}-${j}`} href={up} target="_blank" rel="noopener noreferrer"
          color="#ff6b2b" fontWeight="600" _hover={{ textDecoration: 'underline' }}>{up}</Text>
      ) : up
    );
  });
};

const AnnouncementCard = ({ ann, index, colors }) => {
  const isLatest = index === 0;
  const images = [...(ann.attachments || []), ...(ann.embedImages || [])];
  return (
    <Box
      bg={isLatest
        ? `linear-gradient(135deg, ${colors.accentOrange}0e, ${colors.accentPurple}0a)`
        : colors.bgElevated}
      border="1px solid"
      borderColor={isLatest ? `${colors.accentOrange}50` : colors.borderLight}
      rounded="2xl"
      overflow="hidden"
      transition="all 0.25s"
      _hover={{ transform: 'translateY(-3px)', borderColor: colors.accentOrange, boxShadow: `0 12px 28px ${colors.accentOrange}28` }}
    >
      <HStack bg={isLatest ? `${colors.accentOrange}12` : `${colors.textPrimary}07`}
        px="5" py="3" borderBottom="1px solid" borderColor={colors.borderLight} justify="space-between">
        <HStack gap="2">
          {ann.author?.avatar && <Image src={ann.author.avatar} alt={ann.author.username} w="6" h="6" rounded="full" />}
          <Text fontSize="xs" fontWeight="700" color={colors.textPrimary}>{ann.author?.username || 'EML Staff'}</Text>
          {isLatest && <Badge bg="rgba(255,107,43,0.15)" color="#ff6b2b" border="1px solid rgba(255,107,43,0.3)" fontSize="2xs" fontWeight="800">LATEST</Badge>}
        </HStack>
        <HStack gap="1" fontSize="xs" color={colors.textMuted}><Clock size={11} /><Text>{formatRelativeTime(ann.timestamp)}</Text></HStack>
      </HStack>
      <Box px="5" py="4">
        <Text fontSize="sm" color={colors.textSecondary} lineHeight="1.75" whiteSpace="pre-wrap">
          {renderContent(ann.content, colors.textPrimary)}
        </Text>
      </Box>
      {images.length > 0 && (
        <Box px="5" pb="5">
          {images.map((img, i) => (
            <Box key={i} rounded="xl" overflow="hidden" border="1px solid" borderColor={colors.borderLight} mt={i > 0 ? '3' : '0'}>
              <Image src={img.url} alt={img.filename || `Image ${i + 1}`} w="full" h="auto" maxH="360px" objectFit="contain" bg={colors.bgPrimary} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

const FallbackCards = ({ colors }) => {
  const items = [
    { title: 'Season 4 Finals — 8 Teams Qualified!', date: 'May 11 – May 17', category: 'Finals', summary: 'Ren, WLDCRD, frug, Big Silly Monkeys, Skyline, Eleven Point Five, Vicious, and Banshee advance to the Season 4 Finals!' },
    { title: 'Finals Bracket on Challonge', date: 'May 11 – May 17', category: 'Announcement', summary: 'View the bracket and make your predictions at challonge.com/EML_Season_4_Finals.' },
    { title: 'Tune In May 16–17 Starting 6:00 PM EST', date: 'May 16 – May 17', category: 'Broadcast', summary: 'Watch live on twitch.tv/echomasterleague and twitch.tv/echomasterleague_2.' },
    { title: 'Good Luck to All Finalists!', date: 'May 11 – May 17', category: 'Update', summary: 'Eight teams, one champion. The Season 4 Finals are here — GLHF!' },
  ];
  return (
    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="6" w="full">
      {items.map((item, idx) => (
        <Box key={idx} bg={colors.bgElevated} border="1px solid" borderColor={colors.borderLight}
          p="6" rounded="2xl" transition="all 0.25s" _hover={{ transform: 'translateY(-3px)', borderColor: colors.accentOrange }}>
          <VStack align="start" gap="3">
            <HStack justify="space-between" w="full">
              <Badge colorPalette="orange" size="sm" px="2" py="1">{item.category}</Badge>
              <HStack gap="1" fontSize="xs" color={colors.textMuted}><Clock size={12} /><Text>{item.date}</Text></HStack>
            </HStack>
            <Text fontSize="md" fontWeight="700" color={colors.textPrimary}>{item.title}</Text>
            <Text fontSize="sm" color={colors.textMuted}>{item.summary}</Text>
          </VStack>
        </Box>
      ))}
    </Grid>
  );
};

const AnnouncementsSection = ({ theme }) => {
  const colors = getThemedColors(theme);
  const { announcements, loading, error, refresh, lastFetched } = useAnnouncements();
  const displayed = announcements.slice(0, 6);

  return (
    <Box id="announcements" py="20" bg={colors.bgPrimary} position="relative">
      <Container maxW="6xl">
        <VStack gap="12">
          <VStack gap="4" textAlign="center">
            <HStack gap="2" justify="center">
              <Bell size={20} color={colors.accentOrange} />
              <Text fontSize="sm" fontWeight="700" color={colors.accentOrange} textTransform="uppercase" letterSpacing="wider">Latest News</Text>
              {displayed.length > 0 && (
                <HStack gap="1.5" bg="rgba(239,68,68,0.12)" border="1px solid rgba(239,68,68,0.35)" px="2" py="0.5" rounded="full">
                  <span className="eml-live-dot" style={{ width: 7, height: 7 }} />
                  <Text fontSize="2xs" fontWeight="800" color="#ef4444" letterSpacing="wider">LIVE</Text>
                </HStack>
              )}
            </HStack>
            <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color={colors.textPrimary}>
              Announcements &amp; Updates
            </Text>
            {lastFetched && (
              <HStack gap="1.5" fontSize="xs" color={colors.textSubtle}>
                <RefreshCw size={11} />
                <Text>Live from Discord · auto-refreshes every 5 min</Text>
              </HStack>
            )}
          </VStack>

          {loading && <Center py="12"><Spinner size="lg" color={colors.accentOrange} /></Center>}

          {!loading && error && (
            <Box w="full">
              <HStack gap="2" mb="6" justify="center" color={colors.textMuted}>
                <AlertCircle size={14} />
                <Text fontSize="sm">Discord unavailable — showing cached announcements</Text>
              </HStack>
              <FallbackCards colors={colors} />
            </Box>
          )}

          {!loading && !error && displayed.length > 0 && (
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="6" w="full">
              <Box gridColumn={{ md: '1 / -1' }}>
                <AnnouncementCard ann={displayed[0]} index={0} colors={colors} />
              </Box>
              {displayed.slice(1).map((ann, i) => (
                <AnnouncementCard key={ann.id || i} ann={ann} index={i + 1} colors={colors} />
              ))}
            </Grid>
          )}

          {!loading && !error && displayed.length === 0 && <FallbackCards colors={colors} />}
        </VStack>
      </Container>
    </Box>
  );
};

export default AnnouncementsSection;
