import {
  Box, Dialog, Portal, CloseButton, HStack, VStack, Text, Badge,
  Button, Spinner, Center
} from '@chakra-ui/react';
import { Mic2, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSchedule } from '../hooks/useSchedule';
import { getThemedColors } from '../theme/colors';

const WORKER_URL = import.meta.env.VITE_WORKER_URL;

const ProductionSignup = ({ theme, open, onClose }) => {
  const colors = getThemedColors(theme);
  const { user, isCaster } = useAuth();
  const { matches, loading: matchesLoading } = useSchedule();

  const [signupsMap, setSignupsMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const [submittingId, setSubmittingId] = useState(null);

  const upcomingMatches = matches.filter(m => m.status === 'Scheduled' || m.status === 'Live');

  // Fetch signups for each upcoming match when modal opens
  useEffect(() => {
    if (!open || !upcomingMatches.length) return;

    upcomingMatches.forEach(async (match) => {
      if (signupsMap[match.id] !== undefined) return;
      setLoadingMap(prev => ({ ...prev, [match.id]: true }));
      try {
        const res = await fetch(`${WORKER_URL}/signups/${encodeURIComponent(match.id)}`);
        const data = await res.json();
        setSignupsMap(prev => ({ ...prev, [match.id]: data.signups || [] }));
      } catch {
        setSignupsMap(prev => ({ ...prev, [match.id]: [] }));
      } finally {
        setLoadingMap(prev => ({ ...prev, [match.id]: false }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const isSignedUp = (matchId) =>
    (signupsMap[matchId] || []).some(s => s.userId === user?.id);

  const handleToggleSignup = async (match) => {
    if (!user) return;
    setSubmittingId(match.id);
    const endpoint = isSignedUp(match.id) ? '/signups/remove' : '/signups/add';

    try {
      const res = await fetch(`${WORKER_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: match.id,
          userId: user.id,
          username: user.username,
          role: user.appRole,
        }),
      });
      const data = await res.json();
      setSignupsMap(prev => ({ ...prev, [match.id]: data.signups || [] }));
    } catch (err) {
      console.error('Signup error:', err);
    } finally {
      setSubmittingId(null);
    }
  };

  if (!isCaster) return null;

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="lg">
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.700" backdropFilter="blur(10px)" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="800px"
            maxH="90vh"
            bg={colors.bgPrimary}
            border="1px solid"
            borderColor={colors.borderMedium}
            rounded="2xl"
            overflow="hidden"
          >
            <Dialog.Header
              bg={colors.bgSecondary}
              borderBottom="1px solid"
              borderColor={colors.borderMedium}
              px="6"
              py="4"
            >
              <HStack justify="space-between">
                <HStack gap="2">
                  <Mic2 size={22} color={colors.accentOrange} />
                  <Dialog.Title fontSize="xl" fontWeight="800" color={colors.textPrimary}>
                    Production Signup
                  </Dialog.Title>
                  <Badge colorPalette="orange" size="sm">Casters Only</Badge>
                </HStack>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="md" color={colors.textMuted} />
                </Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>

            <Dialog.Body p="6" overflowY="auto">
              <Text fontSize="sm" color={colors.textMuted} mb="5">
                Sign up to cast upcoming matches. You can withdraw your signup at any time before the match starts.
              </Text>

              {matchesLoading ? (
                <Center py="14">
                  <Spinner size="xl" color={colors.accentOrange} />
                </Center>
              ) : upcomingMatches.length === 0 ? (
                <Center py="14">
                  <VStack gap="3">
                    <Calendar size={40} color={colors.textMuted} />
                    <Text color={colors.textMuted} fontSize="sm">No upcoming matches available for signup.</Text>
                  </VStack>
                </Center>
              ) : (
                <VStack gap="3" align="stretch">
                  {upcomingMatches.map(match => {
                    const teams = match.participatingTeams?.linkedItems || [];
                    const signups = signupsMap[match.id] || [];
                    const isLoading = loadingMap[match.id];
                    const signed = isSignedUp(match.id);

                    return (
                      <Box
                        key={match.id}
                        p="4"
                        rounded="xl"
                        bg={colors.bgSecondary}
                        border="1px solid"
                        borderColor={signed ? `${colors.accentOrange}60` : colors.borderLight}
                        transition="border-color 0.15s ease"
                      >
                        <HStack justify="space-between" flexWrap="wrap" gap="3">
                          <VStack align="start" gap="1" flex="1">
                            <Text fontWeight="700" color={colors.textPrimary} fontSize="sm">
                              {teams[0]?.name || 'TBA'} vs {teams[1]?.name || 'TBA'}
                            </Text>
                            <HStack gap="2">
                              {match.week && <Badge colorPalette="purple" size="xs">Week {match.week}</Badge>}
                              {match.status === 'Live' && <Badge colorPalette="red" size="xs">LIVE</Badge>}
                              <Text fontSize="xs" color={colors.textMuted}>
                                {match.matchDate instanceof Date
                                  ? match.matchDate.toLocaleDateString('en-US', {
                                    weekday: 'short', month: 'short', day: 'numeric'
                                  })
                                  : 'Date TBD'}
                              </Text>
                            </HStack>
                            {/* Casters already signed up */}
                            {isLoading ? (
                              <Spinner size="xs" color={colors.textMuted} />
                            ) : signups.length > 0 ? (
                              <HStack gap="1" flexWrap="wrap">
                                {signups.map(s => (
                                  <Badge
                                    key={s.userId}
                                    colorPalette={s.userId === user?.id ? 'orange' : 'cyan'}
                                    size="xs"
                                  >
                                    {s.username}
                                  </Badge>
                                ))}
                              </HStack>
                            ) : (
                              <Text fontSize="xs" color={colors.textSubtle} fontStyle="italic">
                                No casters signed up yet
                              </Text>
                            )}
                          </VStack>

                          <Button
                            size="sm"
                            variant={signed ? 'solid' : 'outline'}
                            colorPalette={signed ? 'orange' : 'gray'}
                            onClick={() => handleToggleSignup(match)}
                            loading={submittingId === match.id}
                            gap="1"
                            flexShrink={0}
                          >
                            {signed
                              ? <><XCircle size={13} /> Withdraw</>
                              : <><CheckCircle size={13} /> Sign Up</>
                            }
                          </Button>
                        </HStack>
                      </Box>
                    );
                  })}
                </VStack>
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ProductionSignup;
