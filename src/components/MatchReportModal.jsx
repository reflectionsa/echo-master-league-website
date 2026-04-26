import {
  Dialog, Portal, Box, VStack, HStack, Text, Button, CloseButton, Badge, Input,
} from '@chakra-ui/react';
import { useState, useMemo } from 'react';
import { ClipboardList, CheckCircle, ChevronDown } from 'lucide-react';
import { getThemedColors } from '../theme/colors';
import { useMatchReport } from '../hooks/useMatchReport';
import { useMyTeam } from '../hooks/useMyTeam';
import { useSchedule } from '../hooks/useSchedule';
import { useTeamRoles } from '../hooks/useTeamRoles';
import { emlApi } from '../hooks/useEmlApi';

// ─── helpers ──────────────────────────────────────────────────────────────────

function startOfDay(d) {
  const x = new Date(d); x.setHours(0, 0, 0, 0); return x;
}

// ─── RoundInput ───────────────────────────────────────────────────────────────

const RoundInput = ({ round, team1, team2, onChange, colors }) => (
  <Box bg={colors.bgCard} border="1px solid" borderColor={colors.borderMedium} rounded="xl" p="4">
    <Text fontSize="xs" color={colors.textMuted} textTransform="uppercase" letterSpacing="wider" mb="3">Round {round}</Text>
    <HStack gap="4" justify="center">
      <VStack gap="1" align="center">
        <Text fontSize="xs" color={colors.textMuted}>Your Team</Text>
        <Input
          type="number" min="0" max="20" value={team1 ?? ''}
          onChange={e => onChange('team1', parseInt(e.target.value) || 0)}
          w="16" textAlign="center" fontWeight="800" fontSize="xl" color={colors.textPrimary}
          bg={colors.bgPrimary} border="1px solid" borderColor={colors.borderMedium} rounded="lg"
          _focus={{ borderColor: colors.accentOrange, outline: 'none' }}
        />
      </VStack>
      <Text fontSize="lg" color={colors.textSubtle} fontWeight="700" mt="4">—</Text>
      <VStack gap="1" align="center">
        <Text fontSize="xs" color={colors.textMuted}>Opponent</Text>
        <Input
          type="number" min="0" max="20" value={team2 ?? ''}
          onChange={e => onChange('team2', parseInt(e.target.value) || 0)}
          w="16" textAlign="center" fontWeight="800" fontSize="xl" color={colors.textPrimary}
          bg={colors.bgPrimary} border="1px solid" borderColor={colors.borderMedium} rounded="lg"
          _focus={{ borderColor: colors.accentOrange, outline: 'none' }}
        />
      </VStack>
    </HStack>
  </Box>
);

// ─── Main component ───────────────────────────────────────────────────────────

const MatchReportModal = ({ open, onClose, theme }) => {
  const colors = getThemedColors(theme);
  const { team: myTeam } = useMyTeam();
  const { matches: schedule, loading: schedLoading } = useSchedule();
  const { teams: allTeams } = useTeamRoles();
  const { reportMatch, loading: reporting, error } = useMatchReport();

  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [rounds, setRounds] = useState([
    { team1: '', team2: '' },
    { team1: '', team2: '' },
    { team1: '', team2: '' },
  ]);
  const [forfeit, setForfeit] = useState(false);
  const [forfeitTeam, setForfeitTeam] = useState('');
  const [done, setDone] = useState(null);

  // ─── Build eligible opponent list ─────────────────────────────────────────
  // Rules:
  //   • Only matches where myTeam is one of the two teams
  //   • Show on/after the match's scheduled day (so future weeks don't appear early)
  //   • Show past unsubmitted matches (status ≠ confirmed/completed/resolved)
  const eligibleMatches = useMemo(() => {
    if (!myTeam || !schedule?.length) return [];
    const today = startOfDay(new Date());
    const myName = myTeam.name;

    return schedule
      .filter(m => {
        const items = m.participatingTeams?.linkedItems || [];
        const names = items.map(t => t.name);
        if (!names.includes(myName)) return false;
        if (['Completed', 'confirmed', 'resolved'].includes(m.status)) return false;
        const matchDay = startOfDay(m.matchDate);
        return matchDay <= today;
      })
      .map(m => {
        const items = m.participatingTeams?.linkedItems || [];
        const opponentName = items.find(t => t.name !== myName)?.name || '';
        return { matchId: m.id, label: opponentName, week: m.week, date: m.matchDate };
      });
  }, [myTeam, schedule]);

  const selectedMatch = eligibleMatches.find(m => m.matchId === selectedMatchId);
  const opponentTeam = selectedMatch?.label || '';

  const setRound = (i, key, val) => {
    setRounds(prev => prev.map((r, idx) => idx === i ? { ...r, [key]: val } : r));
  };

  // Bo3 — stop after 2 wins
  const team1Wins = rounds.reduce((w, r) => w + (r.team1 > r.team2 ? 1 : 0), 0);
  const team2Wins = rounds.reduce((w, r) => w + (r.team2 > r.team1 ? 1 : 0), 0);
  const roundsToShow = (team1Wins >= 2 || team2Wins >= 2)
    ? rounds.findIndex((_, i) => {
        const w1 = rounds.slice(0, i + 1).reduce((w, r) => w + (r.team1 > r.team2 ? 1 : 0), 0);
        const w2 = rounds.slice(0, i + 1).reduce((w, r) => w + (r.team2 > r.team1 ? 1 : 0), 0);
        return w1 >= 2 || w2 >= 2;
      }) + 1
    : 3;

  // Notify opponent captain & co-captain via worker
  const notifyOpponent = async (oppName, roundData) => {
    if (!oppName || !allTeams?.length) return;
    const oppTeamData = allTeams.find(t => t.name === oppName);
    if (!oppTeamData) return;
    const scoreText = roundData.map((r, i) => `R${i + 1}: ${r.team1}–${r.team2}`).join(' | ');
    const notif = {
      type: 'match_result_proposed',
      title: 'Match Result Proposed',
      body: `${myTeam?.name} submitted scores vs your team: ${scoreText} — please confirm.`,
    };
    const targets = [oppTeamData.captainDiscordId, oppTeamData.coCaptainDiscordId].filter(Boolean);
    await Promise.all(
      targets.map(id =>
        emlApi('POST', '/notifications/push', { userId: id, notification: notif }).catch(() => {})
      )
    );
  };

  const handleReport = async () => {
    if (!selectedMatchId) return;
    try {
      const result = await reportMatch(
        selectedMatchId, myTeam?.name, rounds.slice(0, roundsToShow), forfeit, forfeitTeam
      );
      await notifyOpponent(opponentTeam, rounds.slice(0, roundsToShow));
      setDone(result.report?.status === 'confirmed' ? 'confirmed' : 'pending');
    } catch { /* error shown */ }
  };

  const canSubmit = selectedMatchId && (forfeit
    ? !!forfeitTeam
    : rounds.some(r => r.team1 !== '' || r.team2 !== ''));

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="md">
      <Portal>
        <Dialog.Backdrop bg="rgba(0,0,0,0.85)" backdropFilter="blur(12px)" />
        <Dialog.Positioner>
          <Dialog.Content
            bg={colors.bgCard}
            border="1px solid"
            borderColor={colors.borderAccent}
            rounded="2xl"
            boxShadow={`0 0 60px ${colors.accentOrange}22`}
          >
            <Dialog.Header
              bg={colors.bgSecondary}
              borderBottom="1px solid"
              borderColor={colors.borderMedium}
              px="6" py="4"
            >
              <HStack justify="space-between">
                <HStack gap="3">
                  <Box
                    bg={`${colors.accentOrange}22`}
                    border="1px solid"
                    borderColor={`${colors.accentOrange}44`}
                    p="2" rounded="lg"
                  >
                    <ClipboardList size={18} color={colors.accentOrange} />
                  </Box>
                  <VStack align="start" gap="0">
                    <Dialog.Title fontSize="md" fontWeight="800" color={colors.textPrimary}>
                      Match Result Propose
                    </Dialog.Title>
                    <Text fontSize="xs" color={colors.textMuted}>
                      {myTeam?.name ? `${myTeam.name} · ` : ''}Submit your week's match scores
                    </Text>
                  </VStack>
                </HStack>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" color={colors.textMuted} />
                </Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>

            <Dialog.Body p="5">
              {done ? (
                <VStack gap="4" py="6" textAlign="center">
                  <CheckCircle size={40} color={done === 'confirmed' ? '#22c55e' : '#fbbf24'} />
                  <Text fontSize="md" fontWeight="700" color={done === 'confirmed' ? '#22c55e' : '#fbbf24'}>
                    {done === 'confirmed' ? 'Match Confirmed!' : 'Result Submitted'}
                  </Text>
                  <Text fontSize="sm" color={colors.textMuted}>
                    {done === 'confirmed'
                      ? 'Both captains agree — result recorded.'
                      : 'The opposing captain & co-captain have been notified to confirm.'}
                  </Text>
                  <Button
                    size="sm"
                    bg={colors.bgElevated}
                    border="1px solid" borderColor={colors.borderMedium}
                    color={colors.textMuted} rounded="lg"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                </VStack>
              ) : (
                <VStack gap="4" align="stretch">

                  {/* ─── Opponent selector ─────────────────────────────── */}
                  <VStack align="stretch" gap="1">
                    <Text fontSize="xs" fontWeight="700" color={colors.textMuted} textTransform="uppercase" letterSpacing="wider">
                      Select Opponent
                    </Text>
                    {schedLoading ? (
                      <Text fontSize="sm" color={colors.textMuted}>Loading schedule…</Text>
                    ) : eligibleMatches.length === 0 ? (
                      <Box
                        bg={colors.bgSecondary}
                        border="1px solid" borderColor={colors.borderMedium}
                        rounded="xl" p="4"
                      >
                        <Text fontSize="sm" color={colors.textMuted}>
                          No matches available to submit right now. Matches appear on or after their scheduled day.
                        </Text>
                      </Box>
                    ) : (
                      <Box position="relative">
                        <Box
                          as="select"
                          value={selectedMatchId}
                          onChange={e => {
                            setSelectedMatchId(e.target.value);
                            setRounds([{ team1: '', team2: '' }, { team1: '', team2: '' }, { team1: '', team2: '' }]);
                            setForfeit(false); setForfeitTeam('');
                          }}
                          style={{
                            width: '100%',
                            background: colors.bgSecondary,
                            border: `1px solid ${selectedMatchId ? colors.accentOrange : colors.borderMedium}`,
                            borderRadius: '12px',
                            color: selectedMatchId ? colors.textPrimary : colors.textMuted,
                            padding: '10px 36px 10px 14px',
                            fontSize: '14px', fontWeight: '600',
                            appearance: 'none', cursor: 'pointer',
                          }}
                        >
                          <option value="">— Choose opponent —</option>
                          {eligibleMatches.map(m => (
                            <option key={m.matchId} value={m.matchId} style={{ background: colors.bgCard }}>
                              {m.label}{m.week ? ` (Week ${m.week})` : ''}
                            </option>
                          ))}
                        </Box>
                        <Box position="absolute" right="3" top="50%" transform="translateY(-50%)" pointerEvents="none">
                          <ChevronDown size={14} color={colors.textMuted} />
                        </Box>
                      </Box>
                    )}
                  </VStack>

                  {/* ─── Score entry ────────────────────────────────────── */}
                  {selectedMatchId && (
                    <>
                      <HStack
                        gap="3"
                        bg={colors.bgSecondary}
                        border="1px solid"
                        borderColor={forfeit ? `${colors.accentOrange}44` : colors.borderMedium}
                        rounded="xl" p="3" cursor="pointer"
                        onClick={() => setForfeit(f => !f)}
                      >
                        <Box
                          w="4" h="4"
                          bg={forfeit ? colors.accentOrange : 'transparent'}
                          border="2px solid"
                          borderColor={forfeit ? colors.accentOrange : colors.borderMedium}
                          rounded="sm" flexShrink={0}
                        />
                        <Text fontSize="sm" color={colors.textPrimary}>Mark as Forfeit</Text>
                      </HStack>

                      {forfeit ? (
                        <VStack gap="2" align="stretch">
                          <Text fontSize="xs" color={colors.textMuted}>Which team forfeited?</Text>
                          {[myTeam?.name, opponentTeam].filter(Boolean).map(t => (
                            <Box
                              key={t}
                              bg={forfeitTeam === t ? 'rgba(239,68,68,0.1)' : colors.bgSecondary}
                              border="1px solid"
                              borderColor={forfeitTeam === t ? 'rgba(239,68,68,0.4)' : colors.borderMedium}
                              rounded="xl" p="3" cursor="pointer"
                              onClick={() => setForfeitTeam(t)}
                            >
                              <Text fontSize="sm" fontWeight="700" color={forfeitTeam === t ? '#ef4444' : colors.textPrimary}>{t}</Text>
                            </Box>
                          ))}
                        </VStack>
                      ) : (
                        <>
                          {Array.from({ length: roundsToShow }).map((_, i) => (
                            <RoundInput
                              key={i} round={i + 1}
                              team1={rounds[i]?.team1} team2={rounds[i]?.team2}
                              onChange={(key, val) => setRound(i, key, val)}
                              colors={colors}
                            />
                          ))}
                          {roundsToShow < 3 && (
                            <Badge
                              bg="rgba(34,197,94,0.1)" color="#22c55e"
                              border="1px solid rgba(34,197,94,0.3)"
                              textAlign="center" py="1" fontSize="xs"
                            >
                              Bo3 ends after 2 wins — {roundsToShow} round{roundsToShow > 1 ? 's' : ''} played
                            </Badge>
                          )}
                        </>
                      )}

                      {error && (
                        <Text fontSize="xs" color="#ef4444" bg="rgba(239,68,68,0.1)" border="1px solid rgba(239,68,68,0.3)" p="3" rounded="lg">
                          {error}
                        </Text>
                      )}

                      <Button
                        bg={`linear-gradient(135deg, ${colors.accentOrange}, ${colors.accentPink})`}
                        color="white" fontWeight="700" rounded="xl"
                        loading={reporting}
                        disabled={!canSubmit}
                        onClick={handleReport}
                      >
                        Submit Result
                      </Button>
                    </>
                  )}
                </VStack>
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default MatchReportModal;
