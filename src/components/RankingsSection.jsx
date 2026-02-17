import { Box, Container, VStack, Text, HStack, Badge, Spinner, Center, Image } from '@chakra-ui/react';
import { Award, Trophy } from 'lucide-react';
import { useRankings } from '../hooks/useRankings';
import { emlColors } from '../theme/colors';

const tierImages = {
  Master: 'https://media.discordapp.net/attachments/1241825775414677536/1473148628246986773/Untitled_design.png?ex=69952812&is=6993d692&hm=cb884e6b000e496a4fd0f5d2dd2ae10745cb2f05165b23616bed6b3a16c00ac2&animated=true',
  Diamond: 'https://media.discordapp.net/attachments/1241825775414677536/1473148627722440832/47d4a6da-edc5-4199-839b-57d41a7528f2.png?ex=69952812&is=6993d692&hm=637e229972387e1c434b33e87755dd754eb72ffbd185568eb2016a57bfa6c265&animated=true',
  Platinum: 'https://media.discordapp.net/attachments/1241825775414677536/1473148627236028509/platniumtriangle.eml.png?ex=69952812&is=6993d692&hm=bba6b394c750debadb3619aeddcd88c8859917d28be07ff93fa9a5f5cc2a18c6&animated=true',
  Gold: 'https://media.discordapp.net/attachments/1241825775414677536/1473148626732585162/goldtriangle.eml.png?ex=69952812&is=6993d692&hm=47765da999614de2be3329c65f73b51b190b9bfae82f685a591087225c0f8653&animated=true',
};

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
                          {team.tier && tierImages[team.tier] ? (
                            <HStack gap="1">
                              <Image src={tierImages[team.tier]} alt={team.tier} w="24px" h="24px" objectFit="contain" />
                              {team.division && (
                                <Text fontSize="sm" fontWeight="700" color={emlColors.textPrimary}>{team.division}</Text>
                              )}
                            </HStack>
                          ) : team.tier ? (
                            <Badge colorPalette="purple" size="sm">
                              {team.tier}{team.division ? ` ${team.division}` : ''}
                            </Badge>
                          ) : null}
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