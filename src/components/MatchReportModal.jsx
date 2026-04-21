import { Dialog, Portal, Box, VStack, HStack, Text, Button, CloseButton, Badge, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { FileText, AlertTriangle, CheckCircle, Flag } from 'lucide-react';
import { getThemedColors } from '../theme/colors';
import { useMatchReport } from '../hooks/useMatchReport';

const RoundInput = ({ round, team1, team2, onChange }) => (
  <Box bg="#111111" border="1px solid rgba(255,255,255,0.08)" rounded="xl" p="4">
    <Text fontSize="xs" color="rgba(255,255,255,0.4)" textTransform="uppercase" letterSpacing="wider" mb="3">Round {round}</Text>
    <HStack gap="4" justify="center">
      <VStack gap="1" align="center">
        <Text fontSize="xs" color="rgba(255,255,255,0.4)">Your Team</Text>
        <Input
          type="number" min="0" max="20" value={team1 ?? ''}
          onChange={e => onChange('team1', parseInt(e.target.value) || 0)}
          w="16" textAlign="center" fontWeight="800" fontSize="xl" color="white"
          bg="#0a0a0a" border="1px solid rgba(255,255,255,0.1)" rounded="lg"
          _focus={{ borderColor: '#ff6b2b', outline: 'none' }}
        />
      </VStack>
      <Text fontSize="lg" color="rgba(255,255,255,0.25)" fontWeight="700" mt="4">—</Text>
      <VStack gap="1" align="center">
        <Text fontSize="xs" color="rgba(255,255,255,0.4)">Opponent</Text>
        <Input
          type="number" min="0" max="20" value={team2 ?? ''}
          onChange={e => onChange('team2', parseInt(e.target.value) || 0)}
          w="16" textAlign="center" fontWeight="800" fontSize="xl" color="white"
          bg="#0a0a0a" border="1px solid rgba(255,255,255,0.1)" rounded="lg"
          _focus={{ borderColor: '#ff6b2b', outline: 'none' }}
        />
      </VStack>
    </HStack>
  </Box>
);

const MatchReportModal = ({ open, onClose, matchId, myTeam, opponentTeam, theme }) => {
  const colors = getThemedColors(theme);
  const { reportMatch, disputeMatch, loading, error } = useMatchReport();
  const [rounds, setRounds] = useState([
    { team1: '', team2: '' },
    { team1: '', team2: '' },
    { team1: '', team2: '' },
  ]);
  const [forfeit, setForfeit] = useState(false);
  const [forfeitTeam, setForfeitTeam] = useState('');
  const [mode, setMode] = useState('report'); // 'report' | 'dispute'
  const [disputeReason, setDisputeReason] = useState('');
  const [done, setDone] = useState(null);

  const setRound = (i, key, val) => {
    setRounds(prev => prev.map((r, idx) => idx === i ? { ...r, [key]: val } : r));
  };

  // Determine which rounds to show (Bo3 - stop after 2 wins)
  const team1Wins = rounds.reduce((w, r) => w + (r.team1 > r.team2 ? 1 : 0), 0);
  const team2Wins = rounds.reduce((w, r) => w + (r.team2 > r.team1 ? 1 : 0), 0);
  const roundsToShow = (team1Wins >= 2 || team2Wins >= 2) ? rounds.findIndex((_, i) => {
    const w1 = rounds.slice(0, i + 1).reduce((w, r) => w + (r.team1 > r.team2 ? 1 : 0), 0);
    const w2 = rounds.slice(0, i + 1).reduce((w, r) => w + (r.team2 > r.team1 ? 1 : 0), 0);
    return w1 >= 2 || w2 >= 2;
  }) + 1 : 3;

  const handleReport = async () => {
    try {
      const result = await reportMatch(matchId, myTeam, rounds.slice(0, roundsToShow), forfeit, forfeitTeam);
      setDone(result.report.status === 'confirmed' ? 'confirmed' : 'pending');
    } catch { /* error shown */ }
  };

  const handleDispute = async () => {
    try {
      await disputeMatch(matchId, disputeReason);
      setDone('disputed');
    } catch { /* error shown */ }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="md">
      <Portal>
        <Dialog.Backdrop bg="rgba(0,0,0,0.85)" backdropFilter="blur(12px)" />
        <Dialog.Positioner>
          <Dialog.Content bg="#0d0d0d" border="1px solid rgba(255,107,43,0.3)" rounded="2xl" boxShadow="0 0 60px rgba(255,107,43,0.15)">
            <Dialog.Header bg="#111111" borderBottom="1px solid rgba(255,255,255,0.08)" px="6" py="4">
              <HStack justify="space-between">
                <HStack gap="3">
                  <Box bg="rgba(255,107,43,0.15)" border="1px solid rgba(255,107,43,0.3)" p="2" rounded="lg">
                    <FileText size={18} color="#ff6b2b" />
                  </Box>
                  <VStack align="start" gap="0">
                    <Dialog.Title fontSize="md" fontWeight="800" color={colors.textPrimary}>Report Match</Dialog.Title>
                    <Text fontSize="xs" color={colors.textMuted}>{myTeam || 'Your Team'} vs {opponentTeam || 'Opponent'}</Text>
                  </VStack>
                </HStack>
                <Dialog.CloseTrigger asChild><CloseButton size="sm" color={colors.textMuted} /></Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>

            <Dialog.Body p="5">
              {done ? (
                <VStack gap="4" py="6" textAlign="center">
                  {done === 'confirmed' && <><CheckCircle size={40} color="#22c55e" /><Text fontSize="md" fontWeight="700" color="#22c55e">Match Confirmed!</Text><Text fontSize="sm" color={colors.textMuted}>Both captains agree. Result recorded.</Text></>}
                  {done === 'pending' && <><CheckCircle size={40} color="#fbbf24" /><Text fontSize="md" fontWeight="700" color="#fbbf24">Report Submitted</Text><Text fontSize="sm" color={colors.textMuted}>Waiting for opponent captain to confirm.</Text></>}
                  {done === 'disputed' && <><AlertTriangle size={40} color="#ef4444" /><Text fontSize="md" fontWeight="700" color="#ef4444">Dispute Filed</Text><Text fontSize="sm" color={colors.textMuted}>An admin will review the match.</Text></>}
                  <Button size="sm" bg="#111111" border="1px solid rgba(255,255,255,0.1)" color={colors.textMuted} rounded="lg" onClick={onClose}>Close</Button>
                </VStack>
              ) : (
                <VStack gap="4" align="stretch">
                  {/* Mode toggle */}
                  <HStack gap="2">
                    {['report', 'dispute'].map(m => (
                      <Button key={m} size="sm" bg={mode === m ? 'rgba(255,107,43,0.15)' : '#111111'}
                        border="1px solid" borderColor={mode === m ? 'rgba(255,107,43,0.4)' : 'rgba(255,255,255,0.08)'}
                        color={mode === m ? '#ff6b2b' : colors.textMuted} rounded="lg" fontWeight="700"
                        onClick={() => setMode(m)}>
                        {m === 'report' ? <><FileText size={12} /> Report Score</> : <><Flag size={12} /> File Dispute</>}
                      </Button>
                    ))}
                  </HStack>

                  {mode === 'report' ? (
                    <>
                      {/* Forfeit toggle */}
                      <HStack gap="3" bg="#111111" border="1px solid rgba(255,255,255,0.08)" rounded="xl" p="3" cursor="pointer" onClick={() => setForfeit(f => !f)}>
                        <Box w="4" h="4" bg={forfeit ? '#ff6b2b' : 'transparent'} border="2px solid" borderColor={forfeit ? '#ff6b2b' : 'rgba(255,255,255,0.2)'} rounded="sm" />
                        <Text fontSize="sm" color={colors.textPrimary}>Mark as Forfeit</Text>
                      </HStack>

                      {forfeit ? (
                        <VStack gap="2" align="stretch">
                          <Text fontSize="xs" color={colors.textMuted}>Which team forfeited?</Text>
                          {[myTeam, opponentTeam].filter(Boolean).map(t => (
                            <Box key={t} bg={forfeitTeam === t ? 'rgba(239,68,68,0.1)' : '#111111'}
                              border="1px solid" borderColor={forfeitTeam === t ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)'}
                              rounded="xl" p="3" cursor="pointer" onClick={() => setForfeitTeam(t)}>
                              <Text fontSize="sm" fontWeight="700" color={forfeitTeam === t ? '#ef4444' : colors.textPrimary}>{t}</Text>
                            </Box>
                          ))}
                        </VStack>
                      ) : (
                        <>
                          {Array.from({ length: roundsToShow }).map((_, i) => (
                            <RoundInput key={i} round={i + 1} team1={rounds[i]?.team1} team2={rounds[i]?.team2}
                              onChange={(key, val) => setRound(i, key, val)} />
                          ))}
                          {roundsToShow < 3 && (
                            <Badge bg="rgba(34,197,94,0.1)" color="#22c55e" border="1px solid rgba(34,197,94,0.3)" textAlign="center" py="1" fontSize="xs">
                              Bo3 ends after 2 wins — {roundsToShow} round{roundsToShow > 1 ? 's' : ''} played
                            </Badge>
                          )}
                        </>
                      )}

                      {error && <Text fontSize="xs" color="#ef4444" bg="rgba(239,68,68,0.1)" border="1px solid rgba(239,68,68,0.3)" p="3" rounded="lg">{error}</Text>}

                      <Button bg="linear-gradient(135deg,#ff6b2b,#ff8c42)" color="white" fontWeight="700" rounded="xl" loading={loading}
                        disabled={!forfeit && rounds.every(r => r.team1 === '' && r.team2 === '')}
                        onClick={handleReport}>
                        Submit Report
                      </Button>
                    </>
                  ) : (
                    <>
                      <VStack gap="2" align="stretch">
                        <Text fontSize="xs" color={colors.textMuted}>Describe the issue with this match.</Text>
                        <Box as="textarea" rows={4} value={disputeReason} onChange={e => setDisputeReason(e.target.value)}
                          placeholder="Explain what happened..." maxLength={500}
                          style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', padding: '12px', fontSize: '13px', resize: 'vertical', width: '100%' }} />
                      </VStack>
                      {error && <Text fontSize="xs" color="#ef4444" bg="rgba(239,68,68,0.1)" border="1px solid rgba(239,68,68,0.3)" p="3" rounded="lg">{error}</Text>}
                      <Button bg="rgba(239,68,68,0.15)" border="1px solid rgba(239,68,68,0.4)" color="#ef4444" fontWeight="700" rounded="xl" loading={loading}
                        disabled={!disputeReason.trim()} onClick={handleDispute}>
                        File Dispute
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
