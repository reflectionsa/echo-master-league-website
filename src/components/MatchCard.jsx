import { Box, HStack, VStack, Text, Badge, Card, Button, Separator } from '@chakra-ui/react';
import { Calendar, ExternalLink, Radio } from 'lucide-react';
import { useState } from 'react';
import TeamProfileModal from './TeamProfileModal';

const statusConfig = {
  Scheduled: { color: 'green', icon: Calendar },
  Live: { color: 'red', icon: Radio, pulse: true },
  Completed: { color: 'blue', icon: Calendar },
  Disputed: { color: 'purple', icon: Calendar },
  Forfeit: { color: 'gray', icon: Calendar },
};

const MatchCard = ({ match, theme }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const config = statusConfig[match.status] || statusConfig.Scheduled;
  const Icon = config.icon;

  const teams = match.participatingTeams?.linkedItems || [];
  const team1 = teams[0]?.name || 'TBA';
  const team2 = teams[1]?.name || 'TBA';

  const handleStreamClick = () => {
    if (match.streamLink?.url) {
      window.open(match.streamLink.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <Card.Root
        bg="gray.900"
        border="1px solid"
        borderColor={match.status === 'Live' ? 'red.600' : 'gray.800'}
        rounded="xl"
        overflow="hidden"
        _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
        transition="all 0.2s"
        position="relative"
      >
        {config.pulse && (
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            h="2px"
            bg="red.500"
            animationStyle="pulse"
            animationDuration="2s"
            animationIterationCount="infinite"
          />
        )}

        <Card.Body p="5">
          <VStack align="stretch" gap="4">
            <HStack justify="space-between">
              <Badge
                colorPalette={config.color}
                px="2.5"
                py="1"
                rounded="full"
                fontSize="xs"
                fontWeight="700"
                textTransform="uppercase"
              >
                <HStack gap="1">
                  <Icon size={11} />
                  <Text>{match.status}</Text>
                </HStack>
              </Badge>
              {match.matchDate && (
                <Text fontSize="xs" color="gray.500" fontWeight="600">
                  {match.matchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              )}
            </HStack>

            <HStack justify="space-between" align="center" gap="4">
              <VStack align="end" flex="1" gap="1">
                <Text
                  as="button"
                  fontSize="md"
                  fontWeight="700"
                  color="blue.400"
                  _hover={{ textDecoration: 'underline', color: 'blue.300' }}
                  onClick={() => setSelectedTeam(team1)}
                  cursor="pointer"
                  textAlign="right"
                  lineClamp={1}
                >
                  {team1}
                </Text>
              </VStack>

              {match.score ? (
                <Box bg="purple.900" px="4" py="2" rounded="lg" border="1px solid" borderColor="purple.700">
                  <Text fontSize="lg" fontWeight="800" color="purple.300" letterSpacing="wider">
                    {match.score}
                  </Text>
                </Box>
              ) : (
                <Text fontSize="sm" color="gray.600" fontWeight="700">VS</Text>
              )}

              <VStack align="start" flex="1" gap="1">
                <Text
                  as="button"
                  fontSize="md"
                  fontWeight="700"
                  color="blue.400"
                  _hover={{ textDecoration: 'underline', color: 'blue.300' }}
                  onClick={() => setSelectedTeam(team2)}
                  cursor="pointer"
                  textAlign="left"
                  lineClamp={1}
                >
                  {team2}
                </Text>
              </VStack>
            </HStack>

            {match.streamLink?.url && (
              <>
                <Separator borderColor="gray.800" />
                <Button
                  size="sm"
                  colorPalette={match.status === 'Live' ? 'red' : 'purple'}
                  rounded="lg"
                  fontWeight="700"
                  onClick={handleStreamClick}
                  w="full"
                >
                  <ExternalLink size={14} />
                  {match.status === 'Live' ? 'Watch Live' : 'View Stream'}
                </Button>
              </>
            )}
          </VStack>
        </Card.Body>
      </Card.Root>

      <TeamProfileModal
        open={!!selectedTeam}
        onClose={() => setSelectedTeam(null)}
        teamName={selectedTeam}
        theme={theme}
      />
    </>
  );
};

export default MatchCard;
