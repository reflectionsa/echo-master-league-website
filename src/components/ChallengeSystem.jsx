import { Dialog, Portal, Box, VStack, HStack, Text, Button, CloseButton, Badge, Spinner } from '@chakra-ui/react';
import { Swords, Shield, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { getThemedColors } from '../theme/colors';
import { useChallenges } from '../hooks/useChallenges';
import { useAuth } from '../hooks/useAuth';
import { useTeams } from '../hooks/useTeams';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)' },
  accepted: { label: 'Accepted', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)' },
  declined: { label: 'Declined', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
};

const ChallengeCard = ({ challenge, myTeamId, onRespond, colors }) => {
  const isIncoming = challenge.challengedTeamId === myTeamId;
  const status = STATUS_CONFIG[challenge.status] || STATUS_CONFIG.pending;

  return (
    <Box bg="#111111" border="1px solid rgba(255,255,255,0.08)" rounded="xl" p="4">
      <HStack justify="space-between" mb="2">
        <HStack gap="2">
          <Swords size={14} color={isIncoming ? '#00bfff' : '#ff6b2b'} />
          <Text fontSize="xs" fontWeight="700" color={isIncoming ? '#00bfff' : '#ff6b2b'} textTransform="uppercase">
            {isIncoming ? 'Incoming' : 'Outgoing'}
          </Text>
        </HStack>
        <Badge bg={status.bg} color={status.color} border={`1px solid ${status.border}`} fontSize="2xs">{status.label}</Badge>
      </HStack>

      <HStack gap="3" mb="3">
        <Text fontSize="sm" fontWeight="700" color={colors.textPrimary}>{challenge.challengerTeamName}</Text>
        <Text fontSize="xs" color={colors.textMuted}>vs</Text>
        <Text fontSize="sm" fontWeight="700" color={colors.textPrimary}>{challenge.challengedTeamName}</Text>
      </HStack>

      <HStack gap="2" mb={isIncoming && challenge.status === 'pending' ? '3' : '0'}>
        <Badge bg="rgba(255,255,255,0.05)" color={colors.textMuted} fontSize="2xs">
          <Shield size={10} /> ELO diff: {challenge.eloDiff}
        </Badge>
        <Badge bg="rgba(255,255,255,0.05)" color={colors.textMuted} fontSize="2xs">
          <Clock size={10} /> {new Date(challenge.createdAt).toLocaleDateString()}
        </Badge>
      </HStack>

      {isIncoming && challenge.status === 'pending' && (
        <HStack gap="2">
          <Button size="sm" bg="rgba(34,197,94,0.1)" border="1px solid rgba(34,197,94,0.3)" color="#22c55e" rounded="lg" fontWeight="700"
            onClick={() => onRespond(challenge.id, true)}>
            <CheckCircle size={12} /> Accept
          </Button>
          <Button size="sm" bg="rgba(239,68,68,0.1)" border="1px solid rgba(239,68,68,0.3)" color="#ef4444" rounded="lg" fontWeight="700"
            onClick={() => onRespond(challenge.id, false)}>
            <XCircle size={12} /> Decline
          </Button>
        </HStack>
      )}
    </Box>
  );
};

const EligibleTeamCard = ({ team, onChallenge, colors }) => (
  <Box bg="#111111" border="1px solid rgba(255,255,255,0.07)" rounded="xl" p="4">
    <HStack justify="space-between">
      <VStack align="start" gap="0">
        <Text fontSize="sm" fontWeight="700" color={colors.textPrimary}>{team.name}</Text>
        <HStack gap="1">
          <Badge bg="rgba(255,255,255,0.05)" color={colors.textMuted} fontSize="2xs">{team.tier}</Badge>
          <Badge bg="rgba(255,255,255,0.05)" color={colors.textMuted} fontSize="2xs">{team.elo || 800} ELO</Badge>
          <Badge bg="rgba(255,255,255,0.05)" color={colors.textMuted} fontSize="2xs">{team.region}</Badge>
        </HStack>
      </VStack>
      <Button size="sm" bg="rgba(255,107,43,0.1)" border="1px solid rgba(255,107,43,0.3)" color="#ff6b2b" rounded="lg" fontWeight="700"
        onClick={() => onChallenge(team.id)}>
        <Swords size={12} /> Challenge
      </Button>
    </HStack>
  </Box>
);

const ChallengeSystem = ({ open, onClose, myTeam, theme }) => {
  const colors = getThemedColors(theme);
  const { user } = useAuth();
  const { teams } = useTeams();
  const { challenges, loading, error, sendChallenge, respondToChallenge } = useChallenges(myTeam?.id);

  const eligibleTeams = (teams || []).filter(t =>
    t.id !== myTeam?.id &&
    !t.disbanded &&
    t.region === myTeam?.region &&
    Math.abs((t.elo || 800) - (myTeam?.elo || 800)) <= 300 &&
    !(myTeam?.tier === 'Diamond' && t.tier === 'Master')
  );

  const handleChallenge = async (targetId) => {
    try {
      await sendChallenge(myTeam.id, targetId);
    } catch (e) { /* error in hook */ }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="lg">
      <Portal>
        <Dialog.Backdrop bg="rgba(0,0,0,0.85)" backdropFilter="blur(12px)" />
        <Dialog.Positioner>
          <Dialog.Content bg="#0d0d0d" border="1px solid rgba(255,107,43,0.3)" rounded="2xl" boxShadow="0 0 60px rgba(255,107,43,0.15)" maxH="90vh">
            <Dialog.Header bg="#111111" borderBottom="1px solid rgba(255,255,255,0.08)" px="6" py="4">
              <HStack justify="space-between">
                <HStack gap="3">
                  <Box bg="rgba(255,107,43,0.15)" border="1px solid rgba(255,107,43,0.3)" p="2" rounded="lg">
                    <Swords size={18} color="#ff6b2b" />
                  </Box>
                  <VStack align="start" gap="0">
                    <Dialog.Title fontSize="md" fontWeight="800" color={colors.textPrimary}>Challenge System</Dialog.Title>
                    <Text fontSize="xs" color={colors.textMuted}>±300 ELO · 7-day cooldown · {myTeam?.region} region</Text>
                  </VStack>
                </HStack>
                <Dialog.CloseTrigger asChild><CloseButton size="sm" color={colors.textMuted} /></Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>

            <Dialog.Body p="5" overflowY="auto">
              {error && (
                <HStack gap="2" bg="rgba(239,68,68,0.1)" border="1px solid rgba(239,68,68,0.3)" p="3" rounded="lg" mb="4">
                  <AlertTriangle size={14} color="#ef4444" />
                  <Text fontSize="xs" color="#ef4444">{error}</Text>
                </HStack>
              )}

              {challenges.length > 0 && (
                <VStack gap="2" align="stretch" mb="5">
                  <Text fontSize="xs" fontWeight="700" color={colors.accentOrange} textTransform="uppercase" letterSpacing="wider">Active Challenges</Text>
                  {challenges.map(c => (
                    <ChallengeCard key={c.id} challenge={c} myTeamId={myTeam?.id} onRespond={respondToChallenge} colors={colors} />
                  ))}
                </VStack>
              )}

              <VStack gap="2" align="stretch">
                <HStack justify="space-between">
                  <Text fontSize="xs" fontWeight="700" color={colors.accentOrange} textTransform="uppercase" letterSpacing="wider">Eligible Opponents</Text>
                  <Text fontSize="xs" color={colors.textMuted}>{eligibleTeams.length} teams</Text>
                </HStack>
                {loading && <HStack justify="center" py="4"><Spinner size="sm" color="#ff6b2b" /></HStack>}
                {!loading && eligibleTeams.length === 0 && (
                  <Box bg="#111111" border="1px solid rgba(255,255,255,0.07)" rounded="xl" p="6" textAlign="center">
                    <Text fontSize="sm" color={colors.textMuted}>No eligible opponents in your ELO range.</Text>
                  </Box>
                )}
                {eligibleTeams.map(t => (
                  <EligibleTeamCard key={t.id} team={t} onChallenge={handleChallenge} colors={colors} />
                ))}
              </VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ChallengeSystem;
