import { Box, Container, VStack, Text, Grid, HStack, Badge, Button, Spinner, Center } from '@chakra-ui/react';
import { Calendar, ExternalLink } from 'lucide-react';
import { useSchedule } from '../hooks/useSchedule';

const ScheduleSection = ({ theme }) => {
  const isDark = theme === 'dark';
  const { matches, loading } = useSchedule();

  const upcoming = matches.filter(m => m.status === 'Scheduled' || m.status === 'Live').slice(0, 6);

  return (
    <Box id="schedule" py="20" bg={isDark ? 'gray.900' : 'white'}>
      <Container maxW="6xl">
        <VStack gap="12">
          <VStack gap="4" textAlign="center">
            <HStack gap="2" justify="center">
              <Calendar size={20} color={isDark ? '#fb923c' : '#3b82f6'} />
              <Text fontSize="sm" fontWeight="700" color={isDark ? 'orange.400' : 'blue.600'} textTransform="uppercase" letterSpacing="wider">
                Match Schedule
              </Text>
            </HStack>
            <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color={isDark ? 'white' : 'gray.900'}>
              Upcoming Matches
            </Text>
          </VStack>

          {loading ? (
            <Center py="12"><Spinner size="lg" color={isDark ? 'orange.500' : 'blue.500'} /></Center>
          ) : (
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="6" w="full">
              {upcoming.map(match => {
                const teams = match.participatingTeams?.linkedItems || [];
                return (
                  <Box
                    key={match.id}
                    bg={isDark ? 'whiteAlpha.50' : 'gray.50'}
                    backdropFilter="blur(10px)"
                    border="1px solid"
                    borderColor={match.status === 'Live' ? (isDark ? 'orange.500' : 'blue.500') : (isDark ? 'whiteAlpha.100' : 'blackAlpha.100')}
                    p="6"
                    rounded="2xl"
                    position="relative"
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                    transition="all 0.2s"
                  >
                    <VStack align="stretch" gap="4">
                      <HStack justify="space-between">
                        <Badge colorPalette={match.status === 'Live' ? 'red' : 'green'} px="3" py="1" rounded="full" fontSize="xs" fontWeight="700">
                          {match.status}
                        </Badge>
                        {match.matchDate && (
                          <Text fontSize="xs" color={isDark ? 'gray.500' : 'gray.600'} fontWeight="600">
                            {match.matchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </Text>
                        )}
                      </HStack>
                      <Text fontSize="lg" fontWeight="700" color={isDark ? 'white' : 'gray.900'}>
                        {teams[0]?.name || 'TBA'} vs {teams[1]?.name || 'TBA'}
                      </Text>
                      {match.streamLink?.url && (
                        <Button
                          size="sm"
                          colorPalette={isDark ? 'orange' : 'blue'}
                          onClick={() => window.open(match.streamLink.url, '_blank')}
                          w="full"
                        >
                          <ExternalLink size={14} />
                          {match.status === 'Live' ? 'Watch Now' : 'Stream Info'}
                        </Button>
                      )}
                    </VStack>
                  </Box>
                );
              })}
            </Grid>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default ScheduleSection;
