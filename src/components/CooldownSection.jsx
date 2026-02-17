import { Box, VStack, Heading, Text, Table, Badge, HStack, Spinner, Center } from '@chakra-ui/react';
import { Clock, Users, AlertCircle } from 'lucide-react';
import { useCooldownList } from '../hooks/useCooldownList';
import { emlColors } from '../theme/colors';

const CooldownSection = ({ theme }) => {
  const { cooldownPlayers, loading } = useCooldownList();

  return (
    <Box
      as="section"
      id="cooldown"
      py="20"
      bg={emlColors.bgPrimary}
      minH="100vh"
    >
      <VStack maxW="6xl" mx="auto" px="6" gap="8">
        <VStack gap="3" textAlign="center">
          <HStack gap="2" color={emlColors.accentOrange}>
            <Clock size={24} />
            <Heading
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="800"
              bgGradient={`linear(to-r, ${emlColors.accentOrange}, ${emlColors.accentRose})`}
              bgClip="text"
            >
              Player Cooldown List
            </Heading>
          </HStack>
          <Text color={emlColors.textMuted} maxW="2xl">
            Players who recently left a team must wait until their cooldown expires before joining another team
          </Text>
        </VStack>

        <Box
          w="full"
          bg={emlColors.bgSecondary}
          border="1px solid"
          borderColor={emlColors.borderMedium}
          rounded="2xl"
          overflow="hidden"
          backdropFilter="blur(10px)"
        >
          {loading ? (
            <Center py="12"><Spinner size="lg" color={emlColors.accentOrange} /></Center>
          ) : (
            <Table.Root size="md" variant="outline">
              <Table.Header>
                <Table.Row bg={`${emlColors.bgElevated}80`}>
                  <Table.ColumnHeader
                    fontWeight="700"
                    color={emlColors.textMuted}
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Player Name
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    fontWeight="700"
                    color={emlColors.textMuted}
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Previous Team
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    fontWeight="700"
                    color={emlColors.textMuted}
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Reason
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    fontWeight="700"
                    color={emlColors.textMuted}
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Eligible Date
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {cooldownPlayers.map(player => (
                  <Table.Row
                    key={player.id}
                    _hover={{ bg: `${emlColors.bgElevated}99` }}
                    transition="background 0.2s"
                  >
                    <Table.Cell>
                      <HStack gap="2">
                        <AlertCircle size={16} color={emlColors.accentOrange} />
                        <Text fontSize="sm" fontWeight="600" color={emlColors.textPrimary}>
                          {player.playerName}
                        </Text>
                      </HStack>
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontSize="sm" color={emlColors.textMuted}>
                        {player.team || 'N/A'}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge colorPalette="yellow" px="2.5" py="1" rounded="full" fontSize="xs" fontWeight="700">
                        {player.reason}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <HStack gap="1">
                        <Clock size={14} color={emlColors.accentOrange} />
                        <Text fontSize="sm" fontWeight="600" color={emlColors.accentOrange}>
                          {player.eligibleDate || player.cooldownUntil}
                        </Text>
                      </HStack>
                    </Table.Cell>
                  </Table.Row>
                ))}
                {cooldownPlayers.length === 0 && (
                  <Table.Row>
                    <Table.Cell colSpan={4}>
                      <Center py="8">
                        <Text color={emlColors.textMuted}>No players currently on cooldown</Text>
                      </Center>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Root>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default CooldownSection;
