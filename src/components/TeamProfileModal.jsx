import { Dialog, Portal, Box, VStack, HStack, Text, Spinner, Center, Image, Badge, Table, CloseButton, Button, SimpleGrid } from '@chakra-ui/react';
import { Trophy, Users, Calendar, Radio, ExternalLink, Award, Zap, History, Star } from 'lucide-react';
import { useTeamProfile } from '../hooks/useTeamProfile';
import { useAccessibility } from '../hooks/useAccessibility';
import { getThemedColors } from '../theme/colors';
import { getTierImage, getBaseTier, getTierInfo } from '../utils/tierUtils';
import { useState, useEffect } from 'react';
import { emlApi } from '../hooks/useEmlApi';

const _slug = (s) => (s || '').replace(/\s+/g, '_').toLowerCase();
const lsRead = (key) => { try { return localStorage.getItem(key) || null; } catch { return null; } };
const getTeamAsset = (name, type) => lsRead(`eml_team_${type}_${_slug(name)}`);
const getPlayerPic = (name) => lsRead(`eml_player_pic_${_slug(name)}`);

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

const TeamProfileModal = ({ open, onClose, teamName, theme }) => {
  const { team, matchHistory, mmr, loading, error } = useTeamProfile(teamName);
  const { needsColorBlindSupport } = useAccessibility();
  const emlColors = getThemedColors(theme, needsColorBlindSupport);
  const baseTier = getBaseTier(team?.tier);
  const tierConfig = getTierInfo(baseTier) || {
    gradient: 'linear-gradient(135deg, #ff6b2b 0%, #ff8c42 100%)',
    bannerGradient: 'linear-gradient(135deg, rgba(255,107,43,0.2) 0%, rgba(17,17,17,0) 100%)',
    borderColor: 'rgba(255,107,43,0.5)',
    color: '#ff6b2b',
    glowColor: 'rgba(255,107,43,0.4)',
    badge: '—',
  };

  // Worker assets (visible to all users) override localStorage
  const [workerAssets, setWorkerAssets] = useState({ logoUrl: null, bannerUrl: null });
  useEffect(() => {
    if (!open || !teamName) return;
    setWorkerAssets({ logoUrl: null, bannerUrl: null });
    emlApi('GET', `/team/assets/${encodeURIComponent(_slug(teamName))}`)
      .then(d => { if (d.assets) setWorkerAssets(d.assets); })
      .catch(() => {});
  }, [open, teamName]);

  // localStorage-uploaded assets as fallback
  const customBanner = workerAssets.bannerUrl || getTeamAsset(teamName, 'banner');
  const customLogo = workerAssets.logoUrl || getTeamAsset(teamName, 'logo');

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="xl">
      <Portal>
        <Dialog.Backdrop bg={`${emlColors.bgPrimary}cc`} backdropFilter="blur(12px)" />
        <Dialog.Positioner>
          <Dialog.Content
            bg={emlColors.bgPrimary}
            border="1px solid"
            borderColor={tierConfig.borderColor}
            rounded="2xl"
            maxH="90vh"
            overflow="hidden"
            display="flex"
            flexDirection="column"
            boxShadow={`0 0 60px ${tierConfig.glowColor}`}
          >
            <Dialog.CloseTrigger asChild position="absolute" top="4" right="4" zIndex="10">
              <CloseButton size="sm" color={emlColors.textPrimary} _hover={{ color: emlColors.accentOrange }} />
            </Dialog.CloseTrigger>

            <Dialog.Body p="0" overflowY="auto" flex="1">
              {loading ? (
                <Center py="20"><Spinner size="lg" color={emlColors.accentOrange} /></Center>
              ) : error ? (
                <Box p="8"><Text color={emlColors.semantic.error}>Failed to load team profile</Text></Box>
              ) : (
                <VStack align="stretch" gap="0">
                  {/* ─── G2-STYLE TEAM BANNER ────────────────────────────────────────────────── */}
                  <Box
                    position="relative"
                    h="220px"
                    bg={tierConfig.bannerGradient}
                    borderBottom="1px solid"
                    borderColor={tierConfig.borderColor}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    overflow="hidden"
                  >
                    {customBanner && (
                      <Box as="img" src={customBanner} alt="Team Banner" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                    {/* G2-style diagonal stripe background */}
                    <Box
                      position="absolute"
                      top="0" left="0" right="0" bottom="0"
                      opacity="0.06"
                      pointerEvents="none"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
                        backgroundSize: '24px 24px',
                      }}
                    />
                    {/* Top accent bar — tier color */}
                    <Box position="absolute" top="0" left="0" right="0" h="4px" bg={tierConfig.gradient} />

                    {/* Team logo */}
                    <Box
                      position="relative"
                      zIndex="1"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      w="160px"
                      h="160px"
                      style={{
                        filter: `drop-shadow(0 0 24px ${tierConfig.glowColor})`,
                      }}
                    >
                      {team?.teamLogo?.url || customLogo ? (
                        <Image src={customLogo || team.teamLogo.url} alt={teamName} w="150px" h="150px" objectFit={customLogo ? 'cover' : 'contain'} rounded={customLogo ? 'xl' : 'none'} />
                      ) : (
                        <Trophy size={80} color={tierConfig.color} opacity="0.7" />
                      )}
                    </Box>

                    {/* ── VRML STAR TIER BADGE ── prominent, top-right */}
                    {team?.tier && (
                      <Box
                        position="absolute"
                        top="16px"
                        left="20px"
                        zIndex="2"
                        bg="rgba(0,0,0,0.7)"
                        border="1px solid"
                        borderColor={tierConfig.borderColor}
                        rounded="xl"
                        px="4"
                        py="2"
                        backdropFilter="blur(8px)"
                      >
                        <HStack gap="2">
                          {getTierImage(team.tier) ? (
                            <Image
                              src={getTierImage(team.tier)}
                              alt={baseTier}
                              w="28px"
                              h="28px"
                              style={{ filter: `drop-shadow(0 0 6px ${tierConfig.glowColor})` }}
                            />
                          ) : null}
                          <VStack gap="0" align="start">
                            <Text fontSize="xs" fontWeight="600" color={emlColors.textMuted} letterSpacing="wider" textTransform="uppercase">
                              Division
                            </Text>
                            <Text fontSize="sm" fontWeight="800" color={tierConfig.color} letterSpacing="wide">
                              {team.tier}
                            </Text>
                          </VStack>
                        </HStack>
                        {/* Star row */}
                        <HStack gap="1" mt="1">
                          {Array.from({ length: getTierInfo(baseTier)?.stars || 1 }).map((_, i) => (
                            <Star key={i} size={10} fill={tierConfig.color} color={tierConfig.color} />
                          ))}
                        </HStack>
                      </Box>
                    )}

                    {/* Championship triangles */}
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
                  <Box p="8" bg={emlColors.bgPrimary}>
                    <VStack align="stretch" gap="6">
                      {/* Team name + MMR row — G2 style */}
                      <HStack gap="4" align="center" justify="space-between" flexWrap="wrap">
                        <VStack align="start" gap="1">
                          <Text
                            fontSize={{ base: '2xl', md: '3xl' }}
                            fontWeight="900"
                            color={emlColors.textPrimary}
                            letterSpacing="-0.5px"
                            textTransform="uppercase"
                          >
                            {teamName}
                          </Text>
                          <HStack gap="3" flexWrap="wrap">
                            {/* VRML Star Tier pill */}
                            {team?.tier && (
                              <HStack
                                gap="2"
                            bg={emlColors.bgElevated}
                                border="1px solid"
                                borderColor={tierConfig.borderColor}
                                px="3"
                                py="1.5"
                                rounded="full"
                              >
                                {getTierImage(team.tier) && (
                                  <Image src={getTierImage(team.tier)} alt={baseTier} w="18px" h="18px" />
                                )}
                                <Text fontSize="xs" fontWeight="800" color={tierConfig.color} letterSpacing="wider" textTransform="uppercase">
                                  {team.tier}
                                </Text>
                              </HStack>
                            )}
                            <Box
                              bg="rgba(255,107,43,0.1)"
                              border="1px solid rgba(255,107,43,0.3)"
                              px="3"
                              py="1.5"
                              rounded="full"
                            >
                              <Text fontSize="xs" fontWeight="800" color={emlColors.accentOrange}>
                                MMR {mmr}
                              </Text>
                            </Box>
                            {teamChampionships[teamName]?.length > 0 && (
                              <HStack
                                gap="1"
                                bg="rgba(251,191,36,0.1)"
                                border="1px solid rgba(251,191,36,0.3)"
                                px="3"
                                py="1.5"
                                rounded="full"
                              >
                                <Trophy size={12} color="#fbbf24" />
                                <Text fontSize="xs" fontWeight="800" color="#fbbf24">
                                  {teamChampionships[teamName].length}× Champ
                                </Text>
                              </HStack>
                            )}
                          </HStack>
                        </VStack>
                      </HStack>

                      {/* ─── TEAM ROSTER ─────────────────────────────────────────────────────── */}
                      <Box>
                        <Text fontSize="sm" fontWeight="700" color={emlColors.textMuted} mb="3" textTransform="uppercase" letterSpacing="wider">
                          Roster
                        </Text>
                        <Box
                          border="1px solid"
                          borderColor={emlColors.borderLight}
                          rounded="xl"
                          p="4"
                          bg={emlColors.bgCard}
                        >
                          <VStack align="stretch" gap="3">
                            {/* Captain */}
                            <HStack justify="space-between">
                              <HStack gap="2">
                                <Box
                                  w="28px" h="28px"
                                  bg={getPlayerPic(team?.captain) ? 'transparent' : 'rgba(251,191,36,0.15)'}
                                  border="1px solid rgba(251,191,36,0.3)"
                                  rounded="full"
                                  overflow="hidden"
                                  display="flex" alignItems="center" justifyContent="center"
                                  flexShrink={0}
                                >
                                  {getPlayerPic(team?.captain) ? (
                                    <Box as="img" src={getPlayerPic(team.captain)} alt={team.captain} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  ) : (
                                    <Trophy size={12} color="#fbbf24" />
                                  )}
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
                                  <Box
                                    w="28px" h="28px"
                                    bg={getPlayerPic(team.coCaptain) ? 'transparent' : 'rgba(255,107,43,0.15)'}
                                    border="1px solid rgba(255,107,43,0.3)"
                                    rounded="full"
                                    overflow="hidden"
                                    display="flex" alignItems="center" justifyContent="center"
                                    flexShrink={0}
                                  >
                                    {getPlayerPic(team.coCaptain) ? (
                                      <Box as="img" src={getPlayerPic(team.coCaptain)} alt={team.coCaptain} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                      <Users size={12} color="#ff6b2b" />
                                    )}
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
                                  <Box
                                    w="28px" h="28px"
                                    bg={getPlayerPic(player) ? 'transparent' : emlColors.accentBlue}
                                    rounded="full"
                                    overflow="hidden"
                                    display="flex" alignItems="center" justifyContent="center"
                                    flexShrink={0}
                                  >
                                    {getPlayerPic(player) ? (
                                      <Box as="img" src={getPlayerPic(player)} alt={player} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                      <Users size={12} color="white" />
                                    )}
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