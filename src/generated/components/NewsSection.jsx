import { Box, Container, VStack, Text, HStack, Badge, Grid } from '@chakra-ui/react';
import { Newspaper, Clock } from 'lucide-react';

const news = [
  { title: 'Season 12 Registration Now Open', date: 'Feb 10, 2024', category: 'Announcement', summary: 'Sign up your team for the most competitive season yet. New format and expanded competition.' },
  { title: 'New Tournament Format Revealed', date: 'Feb 8, 2024', category: 'Update', summary: 'Double elimination brackets and extended playoff series coming to Season 12.' },
  { title: 'Championship Results', date: 'Feb 5, 2024', category: 'Results', summary: 'Congratulations to Team Vortex for winning the Season 11 Grand Finals!' },
  { title: 'Rule Changes for 2024', date: 'Jan 28, 2024', category: 'Rules', summary: 'Updated competitive ruleset and anti-cheat measures now in effect.' }
];

const NewsSection = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <Box id="news" py="20" bg={isDark ? 'gray.900' : 'white'}>
      <Container maxW="6xl">
        <VStack gap="12">
          <VStack gap="4" textAlign="center">
            <HStack gap="2" justify="center">
              <Newspaper size={20} color={isDark ? '#fb923c' : '#3b82f6'} />
              <Text fontSize="sm" fontWeight="700" color={isDark ? 'orange.400' : 'blue.600'} textTransform="uppercase" letterSpacing="wider">
                Latest News
              </Text>
            </HStack>
            <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color={isDark ? 'white' : 'gray.900'}>
              Announcements & Updates
            </Text>
          </VStack>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="6" w="full">
            {news.map((item, idx) => (
              <Box
                key={idx}
                bg={isDark ? 'whiteAlpha.50' : 'gray.50'}
                backdropFilter="blur(10px)"
                border="1px solid"
                borderColor={isDark ? 'whiteAlpha.100' : 'blackAlpha.100'}
                p="6"
                rounded="2xl"
                cursor="pointer"
                _hover={{
                  transform: 'translateY(-4px)',
                  borderColor: isDark ? 'orange.500' : 'blue.500',
                  boxShadow: 'lg'
                }}
                transition="all 0.3s"
              >
                <VStack align="start" gap="3">
                  <HStack justify="space-between" w="full">
                    <Badge colorPalette={isDark ? 'orange' : 'blue'} size="sm" px="2" py="1">{item.category}</Badge>
                    <HStack gap="1" fontSize="xs" color={isDark ? 'gray.500' : 'gray.600'}>
                      <Clock size={12} />
                      <Text>{item.date}</Text>
                    </HStack>
                  </HStack>
                  <Text fontSize="lg" fontWeight="700" color={isDark ? 'white' : 'gray.900'}>{item.title}</Text>
                  <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>{item.summary}</Text>
                </VStack>
              </Box>
            ))}
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
};

export default NewsSection;
