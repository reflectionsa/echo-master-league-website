import { Box, Container, VStack, Text, HStack, Badge, Grid } from '@chakra-ui/react';
import { Newspaper, Clock } from 'lucide-react';
import { emlColors } from '../theme/colors';

const news = [
  { title: 'Season 4 Week Four Matches Posted!', date: 'Feb 24, 2026', category: 'Announcement', summary: 'Week Four matches are live. Schedule by Friday noon EDT and play by Sunday. See EML Bot Instructions for commands.' },
  { title: 'Replay Files Policy', date: 'Feb 24, 2026', category: 'Rules', summary: 'A replay file is required for cheating reports. For bug abuse reports, one may be requested if evidence is unclear.' },
  { title: 'Pause Rules Reminder', date: 'Feb 24, 2026', category: 'Rules', summary: '1 between-round pause and 1 during-round pause per team (5 min each, extendable to 15 for tech). Illegal pauses result in point deductions.' },
  { title: 'Staff Applications Open', date: 'Feb 24, 2026', category: 'Update', summary: 'Use /staff app to apply anytime. Looking for Casters, Camera Ops, Helpers, and Future Mods.' }
];

const AnnouncementsSection = ({ theme }) => {
  return (
    <Box id="announcements" py="20" bg={emlColors.bgPrimary}>
      <Container maxW="6xl">
        <VStack gap="12">
          <VStack gap="4" textAlign="center">
            <HStack gap="2" justify="center">
              <Newspaper size={20} color={emlColors.accentOrange} />
              <Text fontSize="sm" fontWeight="700" color={emlColors.accentOrange} textTransform="uppercase" letterSpacing="wider">
                Latest News
              </Text>
            </HStack>
            <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color={emlColors.textPrimary}>
              Announcements & Updates
            </Text>
          </VStack>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="6" w="full">
            {news.map((item, idx) => (
              <Box
                key={idx}
                bg={emlColors.bgElevated}
                backdropFilter="blur(10px)"
                border="1px solid"
                borderColor={emlColors.borderMedium}
                p="6"
                rounded="2xl"
                cursor="pointer"
                _hover={{
                  transform: 'translateY(-4px)',
                  borderColor: emlColors.accentOrange,
                  boxShadow: 'lg'
                }}
                transition="all 0.3s"
              >
                <VStack align="start" gap="3">
                  <HStack justify="space-between" w="full">
                    <Badge colorPalette="orange" size="sm" px="2" py="1">{item.category}</Badge>
                    <HStack gap="1" fontSize="xs" color={emlColors.textMuted}>
                      <Clock size={12} />
                      <Text>{item.date}</Text>
                    </HStack>
                  </HStack>
                  <Text fontSize="lg" fontWeight="700" color={emlColors.textPrimary}>{item.title}</Text>
                  <Text fontSize="sm" color={emlColors.textMuted}>{item.summary}</Text>
                </VStack>
              </Box>
            ))}
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
};

export default AnnouncementsSection;
