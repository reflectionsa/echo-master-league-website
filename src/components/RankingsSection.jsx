import { Box, Container, VStack, Text, HStack, Badge, Spinner, Center } from '@chakra-ui/react';
import { Award, Trophy } from 'lucide-react';
import { useRankings } from '../hooks/useRankings';
import { emlColors } from '../theme/colors';

const RankingsSection = ({ theme }) => {
  const { rankings, loading } = useRankings();

  const topTeams = (rankings || []).slice(0, 10);

  return (
    <Box id="rankings" py="20" bg={emlColors.bgPrimary}>
      <Container maxW="5xl">
        <VStack gap="12">
          <VStack gap="4" textAlign="center">
            <HStack gap="2" justify="center">
              <Award size={20} color={emlColors.accentOrange} />
              <Text fontSize="sm" fontWeight="700" color={emlColors.accentOrange} textTransform="uppercase" letterSpacing="wider" >
                League Rankings
              </Text>
            </HStack>
            <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color={emlColors.textPrimary}>
              Top Teams
            </Text>
          </VStack>

          {loading ? (
            <Center py="12"><Spinner size="lg" color={emlColors.accentOrange} /></Center>
          ) : (
            <VStack gap="3" w="full">
              {topTeams.map((team, idx) => (
                <Box
                  key={team.id}
                  bg={idx < 3 ? `${emlColors.borderMedium}99` : emlColors.bgElevated}
                  backdropFilter="blur(10px)"
                  border="1px solid"
                  borderColor={idx < 3 ? emlColors.accentOrange : emlColors.borderMedium}
                  p="5"
                  rounded="xl"
                  w="full"
                  _hover={{ transform: 'translateX(8px)' }}
                  transition="all 0.2s"
                >
                  <HStack justify="space-between">
                    <HStack gap="4">
                      <Center w="10" h="10" bg={`${emlColors.accentOrange}33`} rounded="lg">
                        {idx < 3 ? (
                          <Trophy size={20} color={idx === 0 ? '#fbbf24' : idx === 1 ? '#d1d5db' : '#cd7f32'} />
                        ) : (
                          <Text fontSize="lg" fontWeight="800" color={emlColors.accentOrange}>#{idx + 1}</Text>
                        )}
                      </Center>
                      <VStack align="start" gap="0">
                        <Text fontSize="lg" fontWeight="700" color={emlColors.textPrimary}>{team.name}</Text>
                        <HStack gap="2">
                          {team.tier && <Badge colorPalette="purple" size="sm">{team.tier}</Badge>}
                          {team.region && team.region[0] && <Text fontSize="xs" color={emlColors.textMuted}>{team.region[0]}</Text>}
                        </HStack>
                      </VStack>
                    </HStack>
                    <Text fontSize="lg" fontWeight="800" color={emlColors.accentPurple}>
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