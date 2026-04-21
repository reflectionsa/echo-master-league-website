import { Box, Container, VStack, Text, HStack, Spinner, Center, Badge, Tabs } from '@chakra-ui/react';
import { Award, Crown, TrendingUp, Target, Shield, Zap } from 'lucide-react';
import { usePlayerLeaderboard } from '../hooks/usePlayerLeaderboard';
import { getThemedColors } from '../theme/colors';
import SparklineChart, { generateTrendData } from './SparklineChart';

// Medal colors for top 3
const medalColor = (idx) => (idx === 0 ? '#fbbf24' : idx === 1 ? '#d1d5db' : '#cd7f32');

const PlayerRow = ({ player, idx, statKey, statLabel, colors }) => {
    const trendData = generateTrendData(player.name + statKey, player[statKey] || player.overallRating || 100);
    const trend = trendData[trendData.length - 1] - trendData[0];

    return (
        <Box
            bg={idx < 3 ? 'rgba(255,107,43,0.05)' : '#111111'}
            border="1px solid"
            borderColor={idx < 3 ? 'rgba(255,107,43,0.25)' : 'rgba(255,255,255,0.07)'}
            p={{ base: '3', md: '4' }}
            rounded="xl"
            w="full"
            _hover={{ borderColor: 'rgba(255,107,43,0.4)', transform: 'translateX(4px)' }}
            transition="all 0.2s"
        >
            <HStack justify="space-between" w="full" gap="3">
                {/* Rank */}
                <Center w="9" h="9" bg="rgba(255,255,255,0.05)" rounded="lg" minW="36px" flexShrink="0">
                    {idx < 3 ? (
                        <Text fontSize="lg">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</Text>
                    ) : (
                        <Text fontSize="sm" fontWeight="800" color={colors.accentOrange}>#{idx + 1}</Text>
                    )}
                </Center>

                {/* Player Info */}
                <VStack align="start" gap="0" flex="1" minW="0">
                    <HStack gap="2" flexWrap="wrap">
                        <Text fontSize="sm" fontWeight="700" color={colors.textPrimary} noOfLines={1}>
                            {player.name}
                        </Text>
                        {player.isMvp && (
                            <Badge
                                bg={colors.accentOrange}
                                color="#0a0a0a"
                                px="1.5"
                                py="0.5"
                                rounded="md"
                                fontSize="2xs"
                                fontWeight="700"
                                display="flex"
                                alignItems="center"
                                gap="1"
                            >
                                <Crown size={9} />MVP
                            </Badge>
                        )}
                    </HStack>
                    {player.team && (
                        <Text fontSize="xs" color={colors.textSubtle} noOfLines={1}>{player.team}</Text>
                    )}
                </VStack>

                {/* Sparkline trend chart */}
                <Box flexShrink="0" display={{ base: 'none', sm: 'block' }}>
                    <SparklineChart data={trendData} width={72} height={24} color={colors.accentOrange} />
                </Box>

                {/* Trend arrow */}
                <Box flexShrink="0" display={{ base: 'none', sm: 'block' }}>
                    <Text fontSize="xs" color={trend >= 0 ? '#22c55e' : '#ef4444'} fontWeight="700">
                        {trend >= 0 ? '▲' : '▼'}
                    </Text>
                </Box>

                {/* Stat value */}
                <VStack align="end" gap="0" minW="max-content" flexShrink="0">
                    <Text fontSize="xs" fontWeight="600" color={colors.textMuted} textTransform="uppercase" letterSpacing="wider">
                        {statLabel}
                    </Text>
                    <Text fontSize="lg" fontWeight="800" color={colors.accentOrange}>
                        {player[statKey] ?? player.overallRating ?? 0}
                    </Text>
                </VStack>
            </HStack>
        </Box>
    );
};

const HallOfFameCategory = ({ players, sortKey, label, icon: Icon, iconColor, colors }) => {
    const sorted = [...players]
        .filter(p => (p[sortKey] ?? 0) > 0 || sortKey === 'overallRating')
        .sort((a, b) => (b[sortKey] ?? 0) - (a[sortKey] ?? 0))
        .slice(0, 10);

    if (sorted.length === 0) {
        return (
            <Center py="8">
                <Text color={colors.textMuted} fontSize="sm">No {label.toLowerCase()} data available yet</Text>
            </Center>
        );
    }

    return (
        <VStack gap="2" w="full">
            <HStack gap="2" mb="1" w="full">
                <Icon size={16} color={iconColor} />
                <Text fontSize="xs" fontWeight="700" color={iconColor} textTransform="uppercase" letterSpacing="wider">
                    {label} Leaders
                </Text>
            </HStack>
            {sorted.map((player, idx) => (
                <PlayerRow
                    key={player.id}
                    player={player}
                    idx={idx}
                    statKey={sortKey}
                    statLabel={label}
                    colors={colors}
                />
            ))}
        </VStack>
    );
};

const PlayerLeaderboardSection = ({ theme }) => {
    const { leaderboard, loading } = usePlayerLeaderboard();
    const colors = getThemedColors(theme);
    const players = leaderboard || [];

    const topPlayers = (leaderboard || []).slice(0, 10);

    return (
        <Box id="player-leaderboard" py="16" bg="#0a0a0a">
            <Container maxW="5xl">
                <VStack gap="10">
                    {/* Header */}
                    <VStack gap="3" textAlign="center">
                        <HStack gap="2" justify="center">
                            <Award size={18} color={colors.accentOrange} />
                            <Text
                                fontSize="xs"
                                fontWeight="700"
                                color={colors.accentOrange}
                                textTransform="uppercase"
                                letterSpacing="wider"
                            >
                                Hall of Fame
                            </Text>
                        </HStack>
                        <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="900" color={colors.textPrimary} letterSpacing="-0.5px">
                            Season Leaders
                        </Text>
                        <Text fontSize="sm" color={colors.textMuted}>
                            Performance sparklines show each player's recent trend
                        </Text>
                    </VStack>

                    {loading ? (
                        <Center py="12">
                            <Spinner size="lg" color={colors.accentOrange} />
                        </Center>
                    ) : (
                        <Tabs.Root defaultValue="rating" w="full">
                            <Tabs.List
                                mb="6"
                                bg="#111111"
                                border="1px solid rgba(255,255,255,0.08)"
                                p="1"
                                rounded="xl"
                                flexWrap="wrap"
                                gap="1"
                            >
                                <Tabs.Trigger value="rating" fontWeight="600" fontSize="sm" color={colors.textSecondary}
                                    _selected={{ color: colors.accentOrange, bg: 'rgba(255,107,43,0.12)' }}>
                                    <TrendingUp size={14} /> Rating
                                </Tabs.Trigger>
                                <Tabs.Trigger value="goals" fontWeight="600" fontSize="sm" color={colors.textSecondary}
                                    _selected={{ color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' }}>
                                    <Target size={14} /> Goals
                                </Tabs.Trigger>
                                <Tabs.Trigger value="saves" fontWeight="600" fontSize="sm" color={colors.textSecondary}
                                    _selected={{ color: '#00bfff', bg: 'rgba(0,191,255,0.12)' }}>
                                    <Shield size={14} /> Saves
                                </Tabs.Trigger>
                                <Tabs.Trigger value="stuns" fontWeight="600" fontSize="sm" color={colors.textSecondary}
                                    _selected={{ color: '#a855f7', bg: 'rgba(168,85,247,0.12)' }}>
                                    <Zap size={14} /> Stuns
                                </Tabs.Trigger>
                            </Tabs.List>

                            <Tabs.Content value="rating">
                                <HallOfFameCategory
                                    players={players}
                                    sortKey="overallRating"
                                    label="Rating"
                                    icon={TrendingUp}
                                    iconColor={colors.accentOrange}
                                    colors={colors}
                                />
                            </Tabs.Content>
                            <Tabs.Content value="goals">
                                <HallOfFameCategory
                                    players={players}
                                    sortKey="goals"
                                    label="Goals"
                                    icon={Target}
                                    iconColor="#fbbf24"
                                    colors={colors}
                                />
                            </Tabs.Content>
                            <Tabs.Content value="saves">
                                <HallOfFameCategory
                                    players={players}
                                    sortKey="saves"
                                    label="Saves"
                                    icon={Shield}
                                    iconColor="#00bfff"
                                    colors={colors}
                                />
                            </Tabs.Content>
                            <Tabs.Content value="stuns">
                                <HallOfFameCategory
                                    players={players}
                                    sortKey="stuns"
                                    label="Stuns"
                                    icon={Zap}
                                    iconColor="#a855f7"
                                    colors={colors}
                                />
                            </Tabs.Content>
                        </Tabs.Root>
                    )}
                </VStack>
            </Container>
        </Box>
    );
};

export default PlayerLeaderboardSection;
