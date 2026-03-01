import { Box, Container, VStack, Text, HStack, Spinner, Center, Grid, Badge } from '@chakra-ui/react';
import { Video, Users } from 'lucide-react';
import { useProductionStats } from '../hooks/useProductionStats';
import { getThemedColors } from '../theme/colors';

const ProductionStatsSection = ({ theme }) => {
    const { casterStats, cameraStats, total, loading } = useProductionStats();
    const colors = getThemedColors(theme);

    return (
        <Box id="production-stats" py="20" bg={colors.bgPrimary}>
            <Container maxW="6xl">
                <VStack gap="12">
                    {/* Header */}
                    <VStack gap="4" textAlign="center">
                        <HStack gap="2" justify="center">
                            <Video size={20} color={colors.accentOrange} />
                            <Text
                                fontSize="sm"
                                fontWeight="700"
                                color={colors.accentOrange}
                                textTransform="uppercase"
                                letterSpacing="wider"
                            >
                                Production Crew
                            </Text>
                        </HStack>
                        <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color={colors.textPrimary}>
                            Production Statistics
                        </Text>
                    </VStack>

                    {loading ? (
                        <Center py="12">
                            <Spinner size="lg" color={colors.accentOrange} />
                        </Center>
                    ) : (
                        <VStack gap="12" w="full">
                            {/* Stats Summary */}
                            <Grid templateColumns={{ base: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }} gap="4" w="full">
                                <Box
                                    p="4"
                                    rounded="xl"
                                    bg={colors.bgSecondary}
                                    border="1px solid"
                                    borderColor={colors.borderMedium}
                                    textAlign="center"
                                >
                                    <Text fontSize="2xl" fontWeight="900" color={colors.accentOrange}>
                                        {total.casters}
                                    </Text>
                                    <Text fontSize="xs" color={colors.textMuted} fontWeight="600" textTransform="uppercase">
                                        Casters
                                    </Text>
                                </Box>
                                <Box
                                    p="4"
                                    rounded="xl"
                                    bg={colors.bgSecondary}
                                    border="1px solid"
                                    borderColor={colors.borderMedium}
                                    textAlign="center"
                                >
                                    <Text fontSize="2xl" fontWeight="900" color={colors.accentPurple}>
                                        {total.cameraOps}
                                    </Text>
                                    <Text fontSize="xs" color={colors.textMuted} fontWeight="600" textTransform="uppercase">
                                        Camera Ops
                                    </Text>
                                </Box>
                                <Box
                                    p="4"
                                    rounded="xl"
                                    bg={colors.bgSecondary}
                                    border="1px solid"
                                    borderColor={colors.borderMedium}
                                    textAlign="center"
                                >
                                    <Text fontSize="2xl" fontWeight="900" color={colors.accentGreen || colors.accentOrange}>
                                        {total.totalEvents}
                                    </Text>
                                    <Text fontSize="xs" color={colors.textMuted} fontWeight="600" textTransform="uppercase">
                                        Total Events
                                    </Text>
                                </Box>
                                <Box
                                    p="4"
                                    rounded="xl"
                                    bg={colors.bgSecondary}
                                    border="1px solid"
                                    borderColor={colors.borderMedium}
                                    textAlign="center"
                                >
                                    <Text fontSize="2xl" fontWeight="900" color={colors.accentBlue || colors.accentOrange}>
                                        {total.totalMatches}
                                    </Text>
                                    <Text fontSize="xs" color={colors.textMuted} fontWeight="600" textTransform="uppercase">
                                        Total Matches
                                    </Text>
                                </Box>
                            </Grid>

                            {/* Casters */}
                            {casterStats.length > 0 && (
                                <VStack align="start" gap="4" w="full">
                                    <HStack gap="2">
                                        <Video size={16} color={colors.accentOrange} />
                                        <Text fontWeight="700" fontSize="lg" color={colors.textPrimary}>
                                            Top Casters
                                        </Text>
                                    </HStack>
                                    <VStack gap="3" w="full">
                                        {casterStats.slice(0, 5).map((caster, idx) => (
                                            <Box
                                                key={caster.id}
                                                p="4"
                                                rounded="xl"
                                                bg={colors.bgSecondary}
                                                border="1px solid"
                                                borderColor={colors.borderMedium}
                                                w="full"
                                            >
                                                <HStack justify="space-between">
                                                    <HStack gap="3">
                                                        <Center w="8" h="8" bg={`${colors.accentOrange}33`} rounded="lg">
                                                            <Text fontSize="sm" fontWeight="800" color={colors.accentOrange}>
                                                                #{idx + 1}
                                                            </Text>
                                                        </Center>
                                                        <VStack align="start" gap="0">
                                                            <Text fontWeight="700" color={colors.textPrimary}>
                                                                {caster.name}
                                                            </Text>
                                                            <Badge colorPalette="orange" size="xs">
                                                                Caster
                                                            </Badge>
                                                        </VStack>
                                                    </HStack>
                                                    <HStack gap="4">
                                                        <VStack gap="0" align="end">
                                                            <Text fontSize="xs" color={colors.textMuted} fontWeight="600">
                                                                Events
                                                            </Text>
                                                            <Text fontSize="lg" fontWeight="800" color={colors.textPrimary}>
                                                                {caster.events}
                                                            </Text>
                                                        </VStack>
                                                        <VStack gap="0" align="end">
                                                            <Text fontSize="xs" color={colors.textMuted} fontWeight="600">
                                                                Matches
                                                            </Text>
                                                            <Text fontSize="lg" fontWeight="800" color={colors.accentOrange}>
                                                                {caster.matches}
                                                            </Text>
                                                        </VStack>
                                                    </HStack>
                                                </HStack>
                                            </Box>
                                        ))}
                                    </VStack>
                                </VStack>
                            )}

                            {/* Camera Operators */}
                            {cameraStats.length > 0 && (
                                <VStack align="start" gap="4" w="full">
                                    <HStack gap="2">
                                        <Users size={16} color={colors.accentPurple} />
                                        <Text fontWeight="700" fontSize="lg" color={colors.textPrimary}>
                                            Top Camera Operators
                                        </Text>
                                    </HStack>
                                    <VStack gap="3" w="full">
                                        {cameraStats.slice(0, 5).map((camera, idx) => (
                                            <Box
                                                key={camera.id}
                                                p="4"
                                                rounded="xl"
                                                bg={colors.bgSecondary}
                                                border="1px solid"
                                                borderColor={colors.borderMedium}
                                                w="full"
                                            >
                                                <HStack justify="space-between">
                                                    <HStack gap="3">
                                                        <Center w="8" h="8" bg={`${colors.accentPurple}33`} rounded="lg">
                                                            <Text fontSize="sm" fontWeight="800" color={colors.accentPurple}>
                                                                #{idx + 1}
                                                            </Text>
                                                        </Center>
                                                        <VStack align="start" gap="0">
                                                            <Text fontWeight="700" color={colors.textPrimary}>
                                                                {camera.name}
                                                            </Text>
                                                            <Badge colorPalette="purple" size="xs">
                                                                Camera Operator
                                                            </Badge>
                                                        </VStack>
                                                    </HStack>
                                                    <HStack gap="4">
                                                        <VStack gap="0" align="end">
                                                            <Text fontSize="xs" color={colors.textMuted} fontWeight="600">
                                                                Events
                                                            </Text>
                                                            <Text fontSize="lg" fontWeight="800" color={colors.textPrimary}>
                                                                {camera.events}
                                                            </Text>
                                                        </VStack>
                                                        <VStack gap="0" align="end">
                                                            <Text fontSize="xs" color={colors.textMuted} fontWeight="600">
                                                                Matches
                                                            </Text>
                                                            <Text fontSize="lg" fontWeight="800" color={colors.accentPurple}>
                                                                {camera.matches}
                                                            </Text>
                                                        </VStack>
                                                    </HStack>
                                                </HStack>
                                            </Box>
                                        ))}
                                    </VStack>
                                </VStack>
                            )}

                            {casterStats.length === 0 && cameraStats.length === 0 && (
                                <Center py="12">
                                    <Text color={colors.textMuted} fontSize="sm">
                                        No production statistics available yet.
                                    </Text>
                                </Center>
                            )}
                        </VStack>
                    )}
                </VStack>
            </Container>
        </Box>
    );
};

export default ProductionStatsSection;
