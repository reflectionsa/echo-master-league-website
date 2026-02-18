import { Box, Dialog, Portal, CloseButton, HStack, VStack, Text, Progress, Center, Spinner, Badge, For } from '@chakra-ui/react';
import { BarChart3, TrendingUp, Lock } from 'lucide-react';
import { usePredictions } from '../hooks/usePredictions';
import { useMatches } from '../hooks/useMatches';
import { useAccessibility } from '../hooks/useAccessibility';
import { getThemedColors } from '../theme/colors';

const PredictionsView = ({ theme, open, onClose }) => {
  const { needsColorBlindSupport } = useAccessibility();
  const emlColors = getThemedColors(theme, needsColorBlindSupport);
  const { predictions, loading, error } = usePredictions();
  const { matches } = useMatches();

  // Merge predictions with match data
  const matchPredictions = matches.map(match => {
    const prediction = predictions.find(p => p.matchId === match.id || p.matchId === `${match.teamA}-${match.teamB}`);
    return {
      ...match,
      prediction: prediction || null,
    };
  }).filter(m => m.prediction); // Only show matches with predictions

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="lg">
      <Portal>
        <Dialog.Backdrop bg={`${emlColors.bgPrimary}b3`} backdropFilter="blur(10px)" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="900px"
            bg={emlColors.bgSecondary}
            border="1px solid"
            borderColor={emlColors.borderMedium}
            rounded="2xl"
            overflow="hidden"
          >
            <Dialog.Header bg={emlColors.bgTertiary} borderBottom="1px solid" borderColor={emlColors.borderMedium}>
              <HStack justify="space-between">
                <HStack gap="2">
                  <BarChart3 size={24} color={emlColors.accentCyan} />
                  <Dialog.Title fontSize="2xl" fontWeight="800" color={emlColors.textPrimary}>
                    Community Predictions
                  </Dialog.Title>
                </HStack>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="lg" />
                </Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>
            <Dialog.Body p="6" overflowY="auto">
              {loading ? (
                <Center py="20"><Spinner size="xl" color={emlColors.accentCyan} /></Center>
              ) : error ? (
                <Center py="20">
                  <Box textAlign="center">
                    <Text color={emlColors.semantic.error} fontSize="lg" fontWeight="600" mb="2">
                      Error loading predictions
                    </Text>
                    <Text color={emlColors.textMuted} fontSize="sm">
                      {error}
                    </Text>
                    <Text color={emlColors.textMuted} fontSize="xs" mt="4">
                      Check that the "Predictions" sheet exists in Google Sheets
                    </Text>
                  </Box>
                </Center>
              ) : matchPredictions.length === 0 ? (
                <Center py="20">
                  <VStack gap="3">
                    <BarChart3 size={48} color={emlColors.textMuted} />
                    <Text color={emlColors.textMuted}>No active predictions at this time</Text>
                    <Text fontSize="sm" color={emlColors.textMuted} textAlign="center">
                      Check back before upcoming matches!
                    </Text>
                  </VStack>
                </Center>
              ) : (
                <VStack gap="4" align="stretch">
                  <Text fontSize="sm" color={emlColors.textMuted} textAlign="center">
                    🗳️ Community poll-based predictions • No betting or currency involved
                  </Text>

                  <For each={matchPredictions}>
                    {(match) => {
                      const pred = match.prediction;
                      const teamALeading = pred.teamAVotes > pred.teamBVotes;
                      const isTie = pred.teamAVotes === pred.teamBVotes;

                      return (
                        <Box
                          key={match.id}
                          bg={`${emlColors.textPrimary}08`}
                          border="1px solid"
                          borderColor={pred.closed ? emlColors.borderMedium : emlColors.accentCyan}
                          rounded="xl"
                          p="5"
                        >
                          <VStack gap="4" align="stretch">
                            {/* Match Header */}
                            <HStack justify="space-between">
                              <HStack gap="2">
                                <Text fontSize="lg" fontWeight="700" color={emlColors.textPrimary}>
                                  {match.teamA}
                                </Text>
                                <Text color={emlColors.textMuted}>vs</Text>
                                <Text fontSize="lg" fontWeight="700" color={emlColors.textPrimary}>
                                  {match.teamB}
                                </Text>
                              </HStack>
                              {pred.closed ? (
                                <Badge colorPalette="red" gap="1">
                                  <Lock size={12} /> Closed
                                </Badge>
                              ) : (
                                <Badge colorPalette="green">Open</Badge>
                              )}
                            </HStack>

                            {/* Vote Counts */}
                            <HStack justify="space-between" fontSize="sm">
                              <HStack gap="2">
                                <TrendingUp 
                                  size={16} 
                                  color={teamALeading && !isTie ? emlColors.accentCyan : emlColors.textMuted} 
                                />
                                <Text fontWeight="700" color={emlColors.textPrimary}>
                                  {pred.teamAVotes} votes
                                </Text>
                                <Text color={emlColors.textMuted}>({pred.teamAPercentage}%)</Text>
                              </HStack>
                              <HStack gap="2">
                                <Text color={emlColors.textMuted}>({pred.teamBPercentage}%)</Text>
                                <Text fontWeight="700" color={emlColors.textPrimary}>
                                  {pred.teamBVotes} votes
                                </Text>
                                <TrendingUp 
                                  size={16} 
                                  color={!teamALeading && !isTie ? emlColors.accentCyan : emlColors.textMuted} 
                                />
                              </HStack>
                            </HStack>

                            {/* Progress Bar */}
                            <Box>
                              <Progress.Root
                                value={pred.teamAPercentage}
                                size="lg"
                                colorPalette="cyan"
                                rounded="full"
                              >
                                <Progress.Track>
                                  <Progress.Range />
                                </Progress.Track>
                              </Progress.Root>
                            </Box>

                            {/* Result if closed */}
                            {pred.closed && pred.result && (
                              <Box
                                bg={emlColors.bgTertiary}
                                border="1px solid"
                                borderColor={emlColors.borderMedium}
                                rounded="lg"
                                p="3"
                                textAlign="center"
                              >
                                <Text fontSize="sm" color={emlColors.textMuted} mb="1">
                                  Result
                                </Text>
                                <Text fontSize="lg" fontWeight="700" color={emlColors.accentOrange}>
                                  {pred.result}
                                </Text>
                              </Box>
                            )}

                            {/* Total Votes */}
                            <Text fontSize="xs" color={emlColors.textMuted} textAlign="center">
                              {pred.totalVotes} total votes
                            </Text>
                          </VStack>
                        </Box>
                      );
                    }}
                  </For>
                </VStack>
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default PredictionsView;
