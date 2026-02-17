import { Dialog, Portal, Box, VStack, HStack, Text, Spinner, Center, Image, Badge, Table, CloseButton, Button } from '@chakra-ui/react';
import { Trophy, Users, Calendar, Radio, ExternalLink } from 'lucide-react';
import { useTeamProfile } from '../hooks/useTeamProfile';
import { useAccessibility } from '../hooks/useAccessibility';
import { getThemedColors } from '../theme/colors';
import { getTierImage, getBaseTier } from '../utils/tierUtils';
import ChampionshipStars from './ChampionshipStars';
import TrophyCase from './TrophyCase';

const tierColors = {
  Master: { bg: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', text: 'yellow.400' },
  Diamond: { bg: 'linear-gradient(135deg, #B9F2FF 0%, #0EA5E9 100%)', text: 'cyan.400' },
  Platinum: { bg: 'linear-gradient(135deg, #A8B9C7 0%, #6B7FA0 100%)', text: 'gray.400' },
  Gold: { bg: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)', text: 'yellow.500' },
};

const TeamProfileModal = ({ open, onClose, teamName, theme }) => {
  const { team, matchHistory, mmr, loading, error } = useTeamProfile(teamName);
  const { needsColorBlindSupport } = useAccessibility();
  const emlColors = getThemedColors(theme, needsColorBlindSupport);
  const tierConfig = tierColors[getBaseTier(team?.tier)] || tierColors.Gold;

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="xl">
      <Portal>
        <Dialog.Backdrop bg={`${emlColors.bgPrimary}b3`} backdropFilter="blur(8px)" />
        <Dialog.Positioner>
          <Dialog.Content
            bg={emlColors.bgSecondary}
            border="1px solid"
            borderColor={emlColors.accentPurple}
            rounded="2xl"
            maxH="90vh"
            display="flex"
            flexDirection="column"
          >
            <Dialog.CloseTrigger asChild position="absolute" top="4" right="4" zIndex="10">
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>

            <Dialog.Body p="8" overflowY="auto" flex="1">
              {loading ? (
                <Center py="20"><Spinner size="lg" color={emlColors.accentPurple} /></Center>
              ) : error ? (
                <Box p="8"><Text color={emlColors.semantic.error}>Failed to load team profile</Text></Box>
              ) : (
                <VStack align="stretch" gap="6">
                  <HStack gap="6" align="start">
                    <Box
                      w="100px"
                      h="100px"
                      bg={emlColors.bgCard}
                      rounded="xl"
                      border="2px solid"
                      borderColor={emlColors.accentPurple}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      overflow="hidden"
                    >
                      {team?.teamLogo?.url ? (
                        <Image src={team.teamLogo.url} alt={teamName} objectFit="contain" w="full" h="full" p="2" />
                      ) : (
                        <Users size={40} color={emlColors.textSubtle} />
                      )}
                    </Box>

                    <VStack align="start" flex="1" gap="3">
                      <VStack align="start" gap="1">
                        <HStack gap="2">
                          <Text fontSize="2xl" fontWeight="800" color={emlColors.textPrimary}>
                            {teamName}
                          </Text>
                          <ChampionshipStars teamName={teamName} size={20} />
                        </HStack>
                        <HStack gap="3">
                          {getTierImage(team?.tier) ? (
                            <HStack gap="2" bg={emlColors.bgCard} px="3" py="1.5" rounded="full">
                              <Image src={getTierImage(team.tier)} alt={team.tier} w="20px" h="20px" minW="20px" minH="20px" />
                              <Text fontSize="xs" fontWeight="800" color={emlColors.textPrimary}>
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
                    </VStack>
                  </HStack>

                  <Box>
                    <Text fontSize="lg" fontWeight="700" color={emlColors.textPrimary} mb="3">
                      Team Roster
                    </Text>
                    <Box
                      border="1px solid"
                      borderColor={emlColors.borderMedium}
                      rounded="xl"
                      p="4"
                      bg={emlColors.bgCard}
                    >
                      <VStack align="stretch" gap="3">
                        {/* Captain */}
                        <HStack justify="space-between">
                          <HStack gap="2">
                            <Box bg="yellow.500" p="1" rounded="md">
                              <Trophy size={12} color="white" />
                            </Box>
                            <Text fontSize="sm" fontWeight="600" color={emlColors.textPrimary} textTransform="uppercase">
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
                              <Text fontSize="sm" fontWeight="600" color={emlColors.textPrimary} textTransform="uppercase">
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
                              <Box bg={emlColors.accentBlue} p="1" rounded="md">
                                <Users size={12} color="white" />
                              </Box>
                              <Text fontSize="sm" fontWeight="600" color={emlColors.textPrimary} textTransform="uppercase">
                                {player}
                              </Text>
                            </HStack>
                            <Badge colorPalette="blue" size="sm">Player</Badge>
                          </HStack>
                        ))}
                      </VStack>
                    </Box>
                  </Box>

                  {/* Trophy Case */}
                  <TrophyCase teamName={teamName} theme={theme} />

                  <Box>
                    <Text fontSize="lg" fontWeight="700" color={emlColors.textPrimary} mb="3">
                      Match History
                    </Text>
                    <Box
                      border="1px solid"
                      borderColor={emlColors.borderMedium}
                      rounded="xl"
                      overflow="hidden"
                    >
                      {matchHistory.length === 0 ? (
                        <Center py="8">
                          <Text color={emlColors.textMuted} fontSize="sm">No matches played yet</Text>
                        </Center>
                      ) : (
                        <Table.Root size="sm" variant="outline">
                          <Table.Header bg={emlColors.bgCard}>
                            <Table.Row>
                              <Table.ColumnHeader fontSize="xs" color={emlColors.textMuted}>Opponent</Table.ColumnHeader>
                              <Table.ColumnHeader fontSize="xs" color={emlColors.textMuted}>Result</Table.ColumnHeader>
                              <Table.ColumnHeader fontSize="xs" color={emlColors.textMuted}>Date</Table.ColumnHeader>
                              <Table.ColumnHeader fontSize="xs" color={emlColors.textMuted}>Casted</Table.ColumnHeader>
                              <Table.ColumnHeader fontSize="xs" color={emlColors.textMuted}>Votes</Table.ColumnHeader>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {matchHistory.slice(0, 10).map(match => (
                              <Table.Row key={match.id} _hover={{ bg: `-color(theme.colors.whiteAlpha.0.08)` }}>
                                <Table.Cell>
                                  <Text fontSize="sm" fontWeight="600" color={emlColors.textSecondary} textTransform="uppercase">
                                    {match.opponent}
                                  </Text>
                                </Table.Cell>
                                <Table.Cell>
                                  <Badge
                                    colorPalette={match.status === 'Won' ? emlColors.semantic.winBadge : match.status === 'Lost' ? emlColors.semantic.lossBadge : 'gray'}
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
                                    <Calendar size={12} color={emlColors.textSubtle} />
                                    <Text fontSize="xs" color={emlColors.textMuted}>
                                      {match.matchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </Text>
                                  </HStack>
                                </Table.Cell>
                                <Table.Cell>
                                  {match.caster && match.streamLink ? (
                                    <Button
                                      size="xs"
                                      variant="solid"
                                      colorPalette={emlColors.semantic.winBadge}
                                      onClick={() => window.open(match.streamLink.url, '_blank')}
                                      _hover={{
                                        bg: `${emlColors.semantic.winBadge}.600`,
                                        transform: 'translateY(-1px)',
                                        boxShadow: 'md'
                                      }}
                                      transition="all 0.2s"
                                    >
                                      <Radio size={12} /> Yes <ExternalLink size={12} />
                                    </Button>
                                  ) : match.caster ? (
                                    <Badge colorPalette={emlColors.semantic.winBadge} size="sm">
                                      <Radio size={12} /> Yes
                                    </Badge>
                                  ) : (
                                    <Badge colorPalette="gray" size="sm">No</Badge>
                                  )}
                                </Table.Cell>
                                <Table.Cell>
                                  <Text fontSize="sm" fontWeight="600" color={emlColors.accentPurple}>
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
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default TeamProfileModal;