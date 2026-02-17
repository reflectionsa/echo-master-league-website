import { Box, Container, VStack, Text, Grid, HStack, Badge, Button, Spinner, Center } from '@chakra-ui/react';
import { Calendar, ExternalLink } from 'lucide-react';
import { useSchedule } from '../hooks/useSchedule';
import { useAccessibility } from '../hooks/useAccessibility';
import { getThemedColors } from '../theme/colors';

const ScheduleSection = ({ theme }) => {
  const { needsColorBlindSupport } = useAccessibility();
  const emlColors = getThemedColors(theme, needsColorBlindSupport);
  const { matches, loading } = useSchedule();

  const upcoming = matches.filter(m => m.status === 'Scheduled' || m.status === 'Live').slice(0, 6);

  return (
    <Box id="schedule" py="20" bg={emlColors.bgPrimary}>
      <Container maxW="6xl">
        <VStack gap="12">
          <VStack gap="4" textAlign="center">
            <HStack gap="2" justify="center">
              <Calendar size={20} color={emlColors.accentOrange} />
              <Text fontSize="sm" fontWeight="700" color={emlColors.accentOrange} textTransform="uppercase" letterSpacing="wider">
                Match Schedule
              </Text>
            </HStack>
            <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color={emlColors.textPrimary}>
              Upcoming Matches
            </Text>
          </VStack>

          {loading ? (
            <Center py="12"><Spinner size="lg" color={emlColors.accentOrange} /></Center>
          ) : (
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="6" w="full">
              {upcoming.map(match => {
                const teams = match.participatingTeams?.linkedItems || [];
                return (
                  <Box
                    key={match.id}
                    bg={emlColors.bgElevated}
                    backdropFilter="blur(10px)"
                    border="1px solid"
                    borderColor={match.status === 'Live' ? emlColors.accentOrange : emlColors.borderMedium}
                    p="6"
                    rounded="2xl"
                    position="relative"
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                    transition="all 0.2s"
                  >
                    <VStack align="stretch" gap="4">
                      <HStack justify="space-between">
                        <Badge colorPalette={match.status === 'Live' ? emlColors.semantic.lossBadge : emlColors.semantic.winBadge} px="3" py="1" rounded="full" fontSize="xs" fontWeight="700">
                          {match.status}
                        </Badge>
                        {match.matchDate && (
                          <Text fontSize="xs" color={emlColors.textMuted} fontWeight="600">
                            {match.matchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </Text>
                        )}
                      </HStack>
                      <Text fontSize="lg" fontWeight="700" color={emlColors.textPrimary}>
                        {teams[0]?.name || 'TBA'} vs {teams[1]?.name || 'TBA'}
                      </Text>
                      {match.streamLink?.url && (
                        <Button
                          size="sm"
                          colorPalette="orange"
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
