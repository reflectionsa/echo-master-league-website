import { Box, Container, VStack, Text, HStack, Spinner, Center, Badge } from '@chakra-ui/react';
import { Award, Crown } from 'lucide-react';
import { usePlayerLeaderboard } from '../hooks/usePlayerLeaderboard';
import { getThemedColors } from '../theme/colors';

const PlayerLeaderboardSection = ({ theme }) => {
    const { leaderboard, loading } = usePlayerLeaderboard();
    const colors = getThemedColors(theme);

    const topPlayers = (leaderboard || []).slice(0, 10);

    return (
        <Box id="player-leaderboard" py="20" bg={colors.bgPrimary}>
            <Container maxW="5xl">
                <VStack gap="12">
                    <VStack gap="4" textAlign="center">
                        <HStack gap="2" justify="center">
                            <Award size={20} color={colors.accentOrange} />
                            <Text
                                fontSize="sm"
                                fontWeight="700"
                                color={colors.accentOrange}
                                textTransform="uppercase"
                                letterSpacing="wider"
                            >
                                Player Rankings
                            </Text>
                        </HStack>
                        <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color={colors.textPrimary}>
                            Top Players
                        </Text>
                    </VStack>

                    {loading ? (
                        <Center py="12">
                            <Spinner size="lg" color={colors.accentOrange} />
                        </Center>
                    ) : (
                        <VStack gap="3" w="full">
                            {topPlayers.map((player, idx) => (
                                <Box
                                    key={player.id}
                                    bg={idx < 3 ? `${colors.borderMedium}99` : colors.bgElevated}
                                    backdropFilter="blur(10px)"
                                    border="1px solid"
                                    borderColor={idx < 3 ? colors.accentOrange : colors.borderMedium}
                                    p="5"
                                    rounded="xl"
                                    w="full"
                                    _hover={{ transform: 'translateX(8px)' }}
                                    transition="all 0.2s"
                                >
                                    <HStack justify="space-between" w="full">
                                        <HStack gap="4" flex="1">
                                            {/* Rank Badge */}
                                            <Center w="10" h="10" bg={`${colors.accentOrange}33`} rounded="lg" minW="40px">
                                                {idx < 3 ? (
                                                    <Text fontSize="lg" fontWeight="800" color={idx === 0 ? '#fbbf24' : idx === 1 ? '#d1d5db' : '#cd7f32'}>
                                                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                                                    </Text>
                                                ) : (
                                                    <Text fontSize="lg" fontWeight="800" color={colors.accentOrange}>
                                                        #{idx + 1}
                                                    </Text>
                                                )}
                                            </Center>

                                            {/* Player Info */}
                                            <VStack align="start" gap="1" flex="1">
                                                <HStack gap="2">
                                                    <Text fontSize="lg" fontWeight="700" color={colors.textPrimary}>
                                                        {player.name}
                                                    </Text>
                                                    {player.isMvp && (
                                                        <Badge
                                                            bg={colors.accentOrange}
                                                            color={colors.bgPrimary}
                                                            px="2"
                                                            py="1"
                                                            rounded="md"
                                                            display="flex"
                                                            alignItems="center"
                                                            gap="1"
                                                            fontWeight="700"
                                                        >
                                                            <Crown size={12} />
                                                            MVP
                                                        </Badge>
                                                    )}
                                                </HStack>
                                                {player.team && (
                                                    <Text fontSize="xs" color={colors.textMuted} fontWeight="500">
                                                        {player.team}
                                                    </Text>
                                                )}
                                            </VStack>
                                        </HStack>

                                        {/* Stats */}
                                        <HStack gap="6" minW="max-content">
                                            <VStack align="end" gap="0">
                                                <Text fontSize="xs" fontWeight="600" color={colors.textMuted} textTransform="uppercase" letterSpacing="wider">
                                                    PSR
                                                </Text>
                                                <Text fontSize="lg" fontWeight="800" color={colors.accentPurple}>
                                                    {player.psr}
                                                </Text>
                                            </VStack>
                                            <VStack align="end" gap="0">
                                                <Text fontSize="xs" fontWeight="600" color={colors.textMuted} textTransform="uppercase" letterSpacing="wider">
                                                    Rating
                                                </Text>
                                                <Text fontSize="lg" fontWeight="800" color={colors.accentOrange}>
                                                    {player.overallRating}
                                                </Text>
                                            </VStack>
                                        </HStack>
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

export default PlayerLeaderboardSection;
