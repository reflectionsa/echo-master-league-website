import { Dialog, Portal, Box, VStack, HStack, Text, Spinner, Center, Image, Badge, Table, CloseButton, Button, SimpleGrid } from '@chakra-ui/react';
import { Trophy, Users, Calendar, Radio, ExternalLink, Award, Zap, History } from 'lucide-react';
import { useTeamProfile } from '../hooks/useTeamProfile';
import { useAccessibility } from '../hooks/useAccessibility';
import { getThemedColors } from '../theme/colors';
import { getTierImage, getBaseTier } from '../utils/tierUtils';

// Team championship history (mock data - replace with real data from sheets)
const teamChampionships = {
  'Phoenix Rising': [
    { season: 11, year: 2025, image: '/images/seasons/season11-champion.svg' },
    { season: 8, year: 2024, image: '/images/seasons/season8-champion.svg' },
  ],
  'Team Vortex': [
    { season: 12, year: 2026, image: '/images/seasons/season12-champion.svg' },
  ],
  // Add more teams as needed
};

// Team history (founding season, notable achievements, timeline)
const teamHistory = {
  'Phoenix Rising': {
    founded: 3,
    achievements: [
      { season: 11, title: 'Season Championship', description: 'Won the Season 11 Grand Finals' },
      { season: 10, title: 'Runner-Up', description: 'Reached the Grand Finals' },
      { season: 8, title: 'Season Championship', description: 'Won the Season 8 Grand Finals' },
    ],
  },
  'Team Vortex': {
    founded: 1,
    achievements: [
      { season: 12, title: 'Season Championship', description: 'Current champions, won Season 12 Grand Finals' },
      { season: 11, title: 'Playoff Finalist', description: 'Reached Grand Finals' },
    ],
  },
  // Add more teams as needed
};

const tierColors = {
  Master: { bg: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', text: 'yellow.400', banner: 'linear-gradient(135deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 165, 0, 0.1) 100%)' },
  Diamond: { bg: 'linear-gradient(135deg, #B9F2FF 0%, #0EA5E9 100%)', text: 'cyan.400', banner: 'linear-gradient(135deg, rgba(14, 165, 233, 0.3) 0%, rgba(185, 242, 255, 0.1) 100%)' },
  Platinum: { bg: 'linear-gradient(135deg, #A8B9C7 0%, #6B7FA0 100%)', text: 'gray.400', banner: 'linear-gradient(135deg, rgba(107, 127, 160, 0.3) 0%, rgba(168, 185, 199, 0.1) 100%)' },
  Gold: { bg: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)', text: 'yellow.500', banner: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(252, 211, 77, 0.1) 100%)' },
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

            <Dialog.Body p="0" overflowY="auto" flex="1">
              {loading ? (
                <Center py="20"><Spinner size="lg" color={emlColors.accentPurple} /></Center>
              ) : error ? (
                <Box p="8"><Text color={emlColors.semantic.error}>Failed to load team profile</Text></Box>
              ) : (
                <VStack align="stretch" gap="0">
                  {/* ─── TEAM BANNER ─────────────────────────────────────────────────────────── */}
                  <Box
                    position="relative"
                    h="200px"
                    bg={tierConfig.banner || 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(17, 24, 39, 0) 100%)'}
                    borderBottom="2px solid"
                    borderColor={emlColors.borderMedium}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    overflow="hidden"
                  >
                    {/* Banner accent stripes */}
                    <Box position="absolute" top="0" left="0" right="0" bottom="0" opacity="0.3" pointerEvents="none">
                      <Box position="absolute" w="full" h="3px" bg={emlColors.accentOrange} top="0" />
                      <Box position="absolute" w="full" h="2px" bg={emlColors.accentPurple} top="4" />
                    </Box>

                    {/* Team logo in banner */}
                    {team?.teamLogo?.url ? (
                      <Image src={team.teamLogo.url} alt={teamName} w="140px" h="140px" objectFit="contain" />
                    ) : (
                      <Trophy size={80} color={emlColors.textSubtle} opacity="0.4" />
                    )}

                    {/* Championship triangles (overlaid) */}
                    {teamChampionships[teamName] && teamChampionships[teamName].length > 0 && (
                      <HStack position="absolute" bottom="4" right="6" gap="2">
                        {teamChampionships[teamName].map((championship) => (
                          <Box
                            key={championship.season}
                            position="relative"
                            w="48px"
                            h="48px"
                            bg={emlColors.accentOrange}
                            borderRadius="0"
                            style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            boxShadow="0 4px 12px rgba(255, 140, 66, 0.4)"
                            title={`S${championship.season} Champion`}
                          >
                            <Box style={{ transform: 'rotate(180deg)' }} display="flex" alignItems="center" justifyContent="center">
                              <Trophy size={20} color="white" />
                            </Box>
                          </Box>
                        ))}
                      </HStack>
                    )}
                  </Box>

                  {/* ─── MAIN CONTENT ────────────────────────────────────────────────────────── */}
                  <Box p="8">
                    <VStack align="stretch" gap="6">
                      {/* Team info header */}
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
                            <Text fontSize="2xl" fontWeight="800" color={emlColors.textPrimary}>
                              {teamName}
                            </Text>
                            <HStack gap="3" flexWrap="wrap">
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

                              {/* Championship count badge */}
                              {teamChampionships[teamName] && teamChampionships[teamName].length > 0 && (
                                <Badge colorPalette="orange" px="2.5" py="1" rounded="full" display="flex" alignItems="center" gap="1">
                                  <Trophy size={12} /> {teamChampionships[teamName].length} Championships
                                </Badge>
                              )}
                            </HStack>
                          </VStack>
                        </VStack>
                      </HStack>

                      {/* ─── TEAM ROSTER ─────────────────────────────────────────────────────── */}
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

                      {/* ─── CHAMPIONSHIPS/TROPHIES ──────────────────────────────────────────── */}
                      {teamChampionships[teamName] && teamChampionships[teamName].length > 0 && (
                        <Box>
                          <Text fontSize="lg" fontWeight="700" color={emlColors.textPrimary} mb="3" display="flex" alignItems="center" gap="2">
                            <Award size={20} color={emlColors.accentOrange} /> Trophy Display
                          </Text>
                          <SimpleGrid columns={{ base: 2, md: 3 }} gap="4">
                            {teamChampionships[teamName].map((trophy) => (
                              <Box
                                key={trophy.season}
                                border="2px solid"
                                borderColor={emlColors.accentOrange}
                                rounded="xl"
                                p="4"
                                bg={emlColors.bgCard}
                                textAlign="center"
                                _hover={{ borderColor: emlColors.accentOrange, boxShadow: `0 8px 16px rgba(255, 140, 66, 0.2)` }}
                                transition="0.3s"
                              >
                                <Trophy size={40} color={emlColors.accentOrange} style={{ margin: '0 auto 12px' }} />
                                <Text fontSize="lg" fontWeight="800" color={emlColors.accentOrange}>
                                  Season {trophy.season}
                                </Text>
                                <Text fontSize="xs" color={emlColors.textMuted}>
                                  {trophy.year}
                                </Text>
                                <Text fontSize="xs" fontWeight="600" color={emlColors.textSecondary} mt="2">
                                  GRAND CHAMPIONS
                                </Text>
                              </Box>
                            ))}
                          </SimpleGrid>
                        </Box>
                      )}

                      {/* ─── TEAM HISTORY ────────────────────────────────────────────────────── */}
                      {teamHistory[teamName] && (
                        <Box>
                          <Text fontSize="lg" fontWeight="700" color={emlColors.textPrimary} mb="3" display="flex" alignItems="center" gap="2">
                            <History size={20} color={emlColors.accentPurple} /> Team History
                          </Text>
                          <VStack align="stretch" gap="4">
                            {/* Founded info */}
                            <Box
                              border="1px solid"
                              borderColor={emlColors.borderMedium}
                              rounded="xl"
                              p="4"
                              bg={emlColors.bgCard}
                            >
                              <HStack gap="3" mb="2">
                                <Zap size={16} color={emlColors.accentPurple} />
                                <Text fontSize="sm" fontWeight="700" color={emlColors.textPrimary}>
                                  Founded in Season {teamHistory[teamName].founded}
                                </Text>
                              </HStack>
                              <Text fontSize="xs" color={emlColors.textMuted}>
                                This team has been competing since the early seasons of EML.
                              </Text>
                            </Box>

                            {/* Achievements timeline */}
                            <Box
                              border="1px solid"
                              borderColor={emlColors.borderMedium}
                              rounded="xl"
                              overflow="hidden"
                              bg={emlColors.bgCard}
                            >
                              <Box bg={emlColors.bgSecondary} px="4" py="3" borderBottom="1px solid" borderColor={emlColors.borderMedium}>
                                <Text fontSize="sm" fontWeight="700" color={emlColors.textPrimary}>
                                  Notable Achievements
                                </Text>
                              </Box>
                              <VStack align="stretch" gap="0" divider={<Box borderT="1px solid" borderColor={emlColors.borderMedium} />}>
                                {teamHistory[teamName].achievements.map((achievement, idx) => (
                                  <HStack key={idx} gap="4" p="4" _hover={{ bg: `${emlColors.bgSecondary}66` }} transition="0.2s">
                                    <VStack align="start" gap="0" flex="1">
                                      <HStack gap="2">
                                        <Badge colorPalette="orange" size="sm">
                                          Season {achievement.season}
                                        </Badge>
                                        <Text fontSize="sm" fontWeight="700" color={emlColors.textPrimary}>
                                          {achievement.title}
                                        </Text>
                                      </HStack>
                                      <Text fontSize="xs" color={emlColors.textMuted} mt="1">
                                        {achievement.description}
                                      </Text>
                                    </VStack>
                                    {achievement.title === 'Season Championship' && (
                                      <Trophy size={24} color={emlColors.accentOrange} />
                                    )}
                                    {achievement.title === 'Runner-Up' && (
                                      <Trophy size={24} color={emlColors.textSubtle} />
                                    )}
                                    {achievement.title === 'Playoff Finalist' && (
                                      <Award size={24} color={emlColors.accentPurple} />
                                    )}
                                  </HStack>
                                ))}
                              </VStack>
                            </Box>
                          </VStack>
                        </Box>
                      )}

                      {/* ─── MATCH HISTORY ───────────────────────────────────────────────────── */}
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
                                  <Table.Row key={match.id} _hover={{ bg: `${emlColors.textPrimary}14` }}>
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
                  </Box>
                </VStack>
              )}
            </Dialog.Body>
      </Dialog.Content>
    </Dialog.Positioner>
      </Portal >
    </Dialog.Root >
  );
};

export default TeamProfileModal;