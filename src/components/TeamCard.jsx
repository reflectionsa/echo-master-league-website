import { Box, HStack, VStack, Text, Badge, Card, Image, Center } from '@chakra-ui/react';
import { Users, Trophy, MapPin } from 'lucide-react';

const tierColors = {
  Master: { bg: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', shadow: '0 8px 24px rgba(255, 215, 0, 0.4)' },
  Diamond: { bg: 'linear-gradient(135deg, #B9F2FF 0%, #0EA5E9 100%)', shadow: '0 8px 24px rgba(14, 165, 233, 0.4)' },
  Platinum: { bg: 'linear-gradient(135deg, #A8B9C7 0%, #6B7FA0 100%)', shadow: '0 8px 24px rgba(107, 127, 160, 0.4)' },
  Gold: { bg: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)', shadow: '0 8px 24px rgba(245, 158, 11, 0.4)' },
};

const tierImages = {
  Master: 'https://media.discordapp.net/attachments/1241825775414677536/1473148628246986773/Untitled_design.png?ex=69952812&is=6993d692&hm=cb884e6b000e496a4fd0f5d2dd2ae10745cb2f05165b23616bed6b3a16c00ac2&animated=true',
  Diamond: 'https://media.discordapp.net/attachments/1241825775414677536/1473148627722440832/47d4a6da-edc5-4199-839b-57d41a7528f2.png?ex=69952812&is=6993d692&hm=637e229972387e1c434b33e87755dd754eb72ffbd185568eb2016a57bfa6c265&animated=true',
  Platinum: 'https://media.discordapp.net/attachments/1241825775414677536/1473148627236028509/platniumtriangle.eml.png?ex=69952812&is=6993d692&hm=bba6b394c750debadb3619aeddcd88c8859917d28be07ff93fa9a5f5cc2a18c6&animated=true',
  Gold: 'https://media.discordapp.net/attachments/1241825775414677536/1473148626732585162/goldtriangle.eml.png?ex=69952812&is=6993d692&hm=47765da999614de2be3329c65f73b51b190b9bfae82f685a591087225c0f8653&animated=true',
};

const TeamCard = ({ team }) => {
  const tierConfig = tierColors[team.tier] || tierColors.Gold;

  return (
    <Card.Root
      bg="gray.900"
      border="1px solid"
      borderColor="gray.800"
      rounded="2xl"
      overflow="hidden"
      _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl', borderColor: 'purple.700' }}
      transition="all 0.3s"
    >
      <Box position="relative" h="140px" bg="linear-gradient(180deg, rgba(139, 92, 246, 0.15) 0%, rgba(17, 24, 39, 0) 100%)">
        {team.teamLogo?.url ? (
          <Image src={team.teamLogo.url} alt={team.name} objectFit="contain" h="full" w="full" p="6" />
        ) : (
          <Center h="full">
            <Users size={48} color="var(--chakra-colors-gray-700)" />
          </Center>
        )}
        
        <Box position="absolute" top="3" right="3" bg="blackAlpha.600" backdropFilter="blur(8px)" px="3" py="1.5" rounded="full" boxShadow={tierConfig.shadow}>
          {tierImages[team.tier] ? (
            <HStack gap="1.5">
              <Image src={tierImages[team.tier]} alt={team.tier} w="16px" h="16px" objectFit="contain" />
              <Text fontSize="xs" fontWeight="800" color="white" textShadow="0 1px 2px rgba(0,0,0,0.3)">
                {team.tier}
              </Text>
            </HStack>
          ) : (
            <HStack gap="1">
              <Trophy size={12} color="white" />
              <Text fontSize="xs" fontWeight="800" color="white" textShadow="0 1px 2px rgba(0,0,0,0.3)">
                {team.tier}
              </Text>
            </HStack>
          )}
        </Box>
      </Box>

      <Card.Body p="5">
        <VStack align="start" gap="4">
          <VStack align="start" gap="1" w="full">
            <Text fontSize="lg" fontWeight="800" color="white" lineClamp={1}>
              {team.name}
            </Text>
            {team.region && team.region.length > 0 && (
              <HStack gap="1.5" color="gray.400">
                <MapPin size={13} />
                <Text fontSize="xs">{team.region[0]}</Text>
              </HStack>
            )}
          </VStack>

          <HStack justify="space-between" w="full" pt="3" borderTop="1px solid" borderColor="gray.800">
            <VStack align="start" gap="0">
              <Text fontSize="xs" color="gray.500" fontWeight="600">CAPTAIN</Text>
              <Text fontSize="sm" color="gray.200" fontWeight="600">{team.captain || 'TBA'}</Text>
            </VStack>
            <VStack align="end" gap="0">
              <Text fontSize="xs" color="gray.500" fontWeight="600">POINTS</Text>
              <Text fontSize="xl" fontWeight="800" color="purple.400">
                {team.leaguePoints ?? 0}
              </Text>
            </VStack>
          </HStack>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};

export default TeamCard;
