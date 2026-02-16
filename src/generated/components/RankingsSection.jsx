import { Box, Container, VStack, Text, HStack, Badge, Spinner, Center } from '@chakra-ui/react';
import { Award, Trophy } from 'lucide-react';
import { useRankings } from '../hooks/useRankings';

const RankingsSection = ({ theme }) => {
  const isDark = theme === 'dark';
  const { rankings, loading } = useRankings();

  const topTeams = (rankings || []).slice(0, 10);

  return (
    <Box id="rankings" py="20" bg={isDark ? 'gray.950' : 'gray.50'}>
      <Container maxW="5xl">
        <VStack gap="12">
          <VStack gap="4" textAlign="center">
            <HStack gap="2" justify="center">
              <Award size={20} color={isDark ? '#fb923c' : '#3b82f6'} />
              <Text fontSize="sm" fontWeight="700" color={isDark ? 'orange.400' : 'blue.600'} textTransform="uppercase" letterSpacing="wider" >
                League Rankings
              </Text>
            </HStack>
            <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color={isDark ? 'white' : 'gray.900'}>
              Top Teams
            </Text>
          </VStack>

          {loading ? (
            <Center py="12"><Spinner size="lg" color={isDark ? 'orange.500' : 'blue.500'} /></Center>
          ) : (
            <VStack gap="3" w="full">
              {topTeams.map((team, idx) => (
                <Box
                  key={team.id}
                  bg={idx < 3 ? (isDark ? 'whiteAlpha.100' : 'blackAlpha.50') : (isDark ? 'whiteAlpha.50' : 'white')}
                  backdropFilter="blur(10px)"
                  border="1px solid"
                  borderColor={idx < 3 ? (isDark ? 'orange.500' : 'blue.500') : (isDark ? 'whiteAlpha.100' : 'blackAlpha.100')}
                  p="5"
                  rounded="xl"
                  w="full"
                  _hover={{ transform: 'translateX(8px)' }}
                  transition="all 0.2s"
                >
                  <HStack justify="space-between">
                    <HStack gap="4">
                      <Center w="10" h="10" bg={isDark ? 'orange.500/20' : 'blue.500/20'} rounded="lg">
                        {idx < 3 ? (
                          <Trophy size={20} color={idx === 0 ? '#fbbf24' : idx === 1 ? '#d1d5db' : '#cd7f32'} />
                        ) : (
                          <Text fontSize="lg" fontWeight="800" color={isDark ? 'orange.300' : 'blue.600'}>#{idx + 1}</Text>
                        )}
                      </Center>
                      <VStack align="start" gap="0">
                        <Text fontSize="lg" fontWeight="700" color={isDark ? 'white' : 'gray.900'}>{team.name}</Text>
                        <HStack gap="2">
                          {team.tier && <Badge colorPalette="purple" size="sm">{team.tier}</Badge>}
                          {team.region && team.region[0] && <Text fontSize="xs" color={isDark ? 'gray.500' : 'gray.600'}>{team.region[0]}</Text>}
                        </HStack>
                      </VStack>
                    </HStack>
                    <Text fontSize="lg" fontWeight="800" color={isDark ? 'purple.400' : 'purple.600'}>
                      {team.mmr}
                    </Text>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default RankingsSection;