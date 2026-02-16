import { Dialog, Portal, Box, VStack, HStack, Text, Spinner, Center, Image, Badge, Table, CloseButton, Button } from '@chakra-ui/react';
import { Trophy, Users, Target, Calendar, Radio, ExternalLink } from 'lucide-react';
import { useTeamProfile } from '../hooks/useTeamProfile';

const tierColors = {
  Master: { bg: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', text: 'yellow.400' },
  Diamond: { bg: 'linear-gradient(135deg, #B9F2FF 0%, #0EA5E9 100%)', text: 'cyan.400' },
  Platinum: { bg: 'linear-gradient(135deg, #A8B9C7 0%, #6B7FA0 100%)', text: 'gray.400' },
  Gold: { bg: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)', text: 'yellow.500' },
};

const tierImages = {
  Master: 'https://cdn.discordapp.com/emojis/1429992743207309462.webp?size=80',
  Diamond: 'https://cdn.discordapp.com/emojis/1429992740942385152.webp?size=80',
  Platinum: 'https://cdn.discordapp.com/attachments/1460754809064784014/1472871797820096555/content.png?ex=69942641&is=6992d4c1&hm=a4f6ec61690c89480c7235cf454f0ea37d325d40606b93da2b3867c304a59b4c&',
  Gold: 'https://cdn.discordapp.com/attachments/1460754809064784014/1472872310464712775/width240.png?ex=699426bb&is=6992d53b&hm=4e35d0dcaa7ab0d3df98faadaafe3c82b433bebe6456dc44ddd5860c6bd9b1dd&animated=true',
};

const TeamProfileModal = ({ open, onClose, teamName, theme }) => {
  const isDark = theme === 'dark';
  const { team, matchHistory, mmr, loading, error } = useTeamProfile(teamName);
  const tierConfig = tierColors[team?.tier] || tierColors.Gold;

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="xl">
      <Portal>
        <Dialog.Backdrop bg={isDark ? 'blackAlpha.700' : 'whiteAlpha.700'} backdropFilter="blur(8px)" />
        <Dialog.Positioner>
          <Dialog.Content
            bg={isDark ? 'gray.900' : 'white'}
            border="1px solid"
            borderColor={isDark ? 'purple.800' : 'gray.200'}
            rounded="2xl"
            maxH="90vh"
            overflow="hidden"
          >
            <Dialog.CloseTrigger asChild position="absolute" top="4" right="4">
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>

            {loading ? (
              <Center py="20"><Spinner size="lg" color={isDark ? 'purple.500' : 'blue.500'} /></Center>
            ) : error ? (
              <Box p="8"><Text color="red.500">Failed to load team profile</Text></Box>
            ) : (
              <VStack align="stretch" gap="6" p="8">
                <HStack gap="6" align="start">
                  <Box
                    w="100px"
                    h="100px"
                    bg={isDark ? 'gray.800' : 'gray.100'}
                    rounded="xl"
                    border="2px solid"
                    borderColor={isDark ? 'purple.700' : 'gray.300'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    overflow="hidden"
                  >
                    {team?.teamLogo?.url ? (
                      <Image src={team.teamLogo.url} alt={teamName} objectFit="contain" w="full" h="full" p="2" />
                    ) : (
                      <Users size={40} color={isDark ? 'var(--chakra-colors-gray-600)' : 'var(--chakra-colors-gray-400)'} />
                    )}
                  </Box>

                  <VStack align="start" flex="1" gap="3">
                    <VStack align="start" gap="1">
                      <Text fontSize="2xl" fontWeight="800" color={isDark ? 'white' : 'gray.900'}>
                        {teamName}
                      </Text>
                      <HStack gap="3">
                        {tierImages[team?.tier] ? (
                          <HStack gap="2" bg={isDark ? 'gray.800' : 'gray.100'} px="3" py="1.5" rounded="full">
                            <Image src={tierImages[team.tier]} alt={team.tier} w="20px" h="20px" objectFit="contain" />
                            <Text fontSize="xs" fontWeight="800" color={isDark ? 'white' : 'gray.900'}>
                              {team.tier}
                            </Text>
                          </HStack>
                        ) : (
                          <Box background={tierConfig.bg} px="3" py="1" rounded="full">
                            <HStack gap="1">
                              <Trophy size={12} color="white" />
                              <Text fontSize="xs" fontWeight="800" color="white">
                                {team?.tier || 'Unranked'}
                              </Text>
                            </HStack>
                          </Box>
                        )}
                        <Badge colorPalette="purple" px="2.5" py="1" rounded="full">
                          MMR: {mmr}
                        </Badge>
                      </HStack>
                    </VStack>

                    <HStack gap="6">
                      <HStack gap="2">
                        <Target size={16} color={isDark ? 'var(--chakra-colors-purple-400)' : 'var(--chakra-colors-purple-600)'} />
                        <VStack align="start" gap="0">
                          <Text fontSize="xs" color={isDark ? 'gray.500' : 'gray.600'}>Points</Text>
                          <Text fontSize="lg" fontWeight="700" color={isDark ? 'purple.400' : 'purple.600'}>
                            {team?.leaguePoints ?? 0}
                          </Text>
                        </VStack>
                      </HStack>
                    </HStack>
                  </VStack>
                </HStack>

                <Box>
                  <Text fontSize="lg" fontWeight="700" color={isDark ? 'white' : 'gray.900'} mb="3">
                    Team Roster
                  </Text>
                  <Box
                    border="1px solid"
                    borderColor={isDark ? 'gray.800' : 'gray.200'}
                    rounded="xl"
                    p="4"
                    bg={isDark ? 'gray.850' : 'gray.50'}
                  >
                    <VStack align="stretch" gap="3">
                      {/* Captain */}
                      <HStack justify="space-between">
                        <HStack gap="2">
                          <Box bg="yellow.500" p="1" rounded="md">
                            <Trophy size={12} color="white" />
                          </Box>
                          <Text fontSize="sm" fontWeight="600" color={isDark ? 'white' : 'gray.900'}>
                            {team?.captain || 'N/A'}
                          </Text>
                        </HStack>
                        <Badge colorPalette="yellow" size="sm">Captain</Badge>
                      </HStack>

                      {/* Co-Captain */}
                      {team?.coCaptain && (
                        <HStack justify="space-between">
                          <HStack gap="2">
                            <Box bg="orange.500" p="1" rounded="md">
                              <Users size={12} color="white" />
                            </Box>
                            <Text fontSize="sm" fontWeight="600" color={isDark ? 'white' : 'gray.900'}>
                              {team.coCaptain}
                            </Text>
                          </HStack>
                          <Badge colorPalette="orange" size="sm">Co-Captain</Badge>
                        </HStack>
                      )}

                      {/* Players */}
                      {team?.players?.map((player, idx) => (
                        <HStack key={idx} justify="space-between">
                          <HStack gap="2">
                            <Box bg={isDark ? 'blue.700' : 'blue.500'} p="1" rounded="md">
                              <Users size={12} color="white" />
                            </Box>
                            <Text fontSize="sm" fontWeight="600" color={isDark ? 'white' : 'gray.900'}>
                              {player}
                            </Text>
                          </HStack>
                          <Badge colorPalette="blue" size="sm">Player</Badge>
                        </HStack>
                      ))}
                    </VStack>
                  </Box>
                </Box>

                <Box>
                  <Text fontSize="lg" fontWeight="700" color={isDark ? 'white' : 'gray.900'} mb="3">
                    Match History
                  </Text>
                  <Box
                    border="1px solid"
                    borderColor={isDark ? 'gray.800' : 'gray.200'}
                    rounded="xl"
                    overflow="hidden"
                  >
                    {matchHistory.length === 0 ? (
                      <Center py="8">
                        <Text color={isDark ? 'gray.500' : 'gray.600'} fontSize="sm">No matches played yet</Text>
                      </Center>
                    ) : (
                      <Table.Root size="sm" variant="outline">
                        <Table.Header bg={isDark ? 'gray.850' : 'gray.50'}>
                          <Table.Row>
                            <Table.ColumnHeader fontSize="xs" color={isDark ? 'gray.400' : 'gray.600'}>Opponent</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="xs" color={isDark ? 'gray.400' : 'gray.600'}>Result</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="xs" color={isDark ? 'gray.400' : 'gray.600'}>Date</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="xs" color={isDark ? 'gray.400' : 'gray.600'}>Casted</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="xs" color={isDark ? 'gray.400' : 'gray.600'}>Votes</Table.ColumnHeader>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {matchHistory.slice(0, 10).map(match => (
                            <Table.Row key={match.id} _hover={{ bg: isDark ? 'gray.800' : 'gray.50' }}>
                              <Table.Cell>
                                <Text fontSize="sm" fontWeight="600" color={isDark ? 'gray.300' : 'gray.700'}>
                                  {match.opponent}
                                </Text>
                              </Table.Cell>
                              <Table.Cell>
                                <Badge
                                  colorPalette={match.status === 'Won' ? 'green' : match.status === 'Lost' ? 'red' : 'gray'}
                                  size="sm"
                                  px="2"
                                  py="0.5"
                                  rounded="md"
                                >
                                  {match.score}
                                </Badge>
                              </Table.Cell>
                              <Table.Cell>
                                <HStack gap="1">
                                  <Calendar size={12} color={isDark ? 'var(--chakra-colors-gray-500)' : 'var(--chakra-colors-gray-400)'} />
                                  <Text fontSize="xs" color={isDark ? 'gray.500' : 'gray.600'}>
                                    {match.matchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </Text>
                                </HStack>
                              </Table.Cell>
                              <Table.Cell>
                                {match.caster && match.streamLink ? (
                                  <Button
                                    size="xs"
                                    variant="solid"
                                    colorPalette="green"
                                    onClick={() => window.open(match.streamLink.url, '_blank')}
                                    _hover={{ 
                                      bg: 'green.600', 
                                      transform: 'translateY(-1px)',
                                      boxShadow: 'md'
                                    }}
                                    transition="all 0.2s"
                                  >
                                    <Radio size={12} /> Yes <ExternalLink size={12} />
                                  </Button>
                                ) : match.caster ? (
                                  <Badge colorPalette="green" size="sm">
                                    <Radio size={12} /> Yes
                                  </Badge>
                                ) : (
                                  <Badge colorPalette="gray" size="sm">No</Badge>
                                )}
                              </Table.Cell>
                              <Table.Cell>
                                <Text fontSize="sm" fontWeight="600" color={isDark ? 'purple.400' : 'purple.600'}>
                                  {match.votes}
                                </Text>
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table.Root>
                    )}
                  </Box>
                </Box>
              </VStack>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default TeamProfileModal;