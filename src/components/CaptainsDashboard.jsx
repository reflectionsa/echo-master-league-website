import { Dialog, Portal, Box, VStack, HStack, Text, CloseButton, Badge, Checkbox } from '@chakra-ui/react';
import { useState } from 'react';
import { CheckSquare, Circle, Shield, Key, FileText, Users, AlertCircle } from 'lucide-react';
import { getThemedColors } from '../theme/colors';
import { useAuth } from '../hooks/useAuth';
import { useTeamRoles } from '../hooks/useTeamRoles';

const CHECKLIST_STEPS = [
  {
    id: 'checkin',
    icon: CheckSquare,
    color: '#22c55e',
    title: 'Check In',
    description: 'Confirm your team is ready to play at least 30 minutes before match time.',
    detail: 'Post in your team\'s match channel: "✅ [Team Name] checked in for Week X"',
  },
  {
    id: 'relay',
    icon: Key,
    color: '#00bfff',
    title: 'Get Spark Link',
    description: 'Request your spark link from the match coordinator.',
    detail: 'Create a ticket in #create-a-ticket and choose "Comp Server Request". Ask for your spark link there. Both teams must use the same spark link to join the match lobby.',
  },
  {
    id: 'roster',
    icon: Users,
    color: '#a855f7',
    title: 'Confirm Roster',
    description: 'Make sure all playing members are on your active roster in the sheet.',
    detail: 'Contact a moderator if you need to make last-minute roster changes.',
  },
  {
    id: 'score',
    icon: FileText,
    color: '#fbbf24',
    title: 'Report Score',
    description: 'Submit the final score immediately after the match.',
    detail: 'Type the final score in your match ticket. Screenshots are recommended — and required if both captains cannot agree on the result.',
  },
];

const CaptainsDashboard = ({ open, onClose, theme }) => {
  const colors = getThemedColors(theme);
  const { user, isLoggedIn } = useAuth();
  const { teams } = useTeamRoles();

  // Find the team the logged-in user is captain of
  const myTeam = isLoggedIn && user
    ? teams?.find(t => t.captain?.toLowerCase() === user.username?.toLowerCase() || t.coCaptain?.toLowerCase() === user.username?.toLowerCase())
    : null;

  const [checked, setChecked] = useState({});
  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const completedCount = CHECKLIST_STEPS.filter(s => checked[s.id]).length;

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="lg">
      <Portal>
        <Dialog.Backdrop bg="rgba(0,0,0,0.85)" backdropFilter="blur(12px)" />
        <Dialog.Positioner>
          <Dialog.Content
            bg="#0d0d0d"
            border="1px solid rgba(255,107,43,0.3)"
            rounded="2xl"
            maxH="90vh"
            overflow="hidden"
            boxShadow="0 0 60px rgba(255,107,43,0.2)"
          >
            <Dialog.Header bg="#111111" borderBottom="1px solid rgba(255,255,255,0.08)" px="6" py="4">
              <HStack justify="space-between">
                <HStack gap="3">
                  <Box bg="rgba(255,107,43,0.15)" border="1px solid rgba(255,107,43,0.3)" p="2" rounded="lg">
                    <Shield size={20} color="#ff6b2b" />
                  </Box>
                  <VStack align="start" gap="0">
                    <Dialog.Title fontSize="lg" fontWeight="800" color={colors.textPrimary}>
                      Captain's Dashboard
                    </Dialog.Title>
                    {myTeam && (
                      <Text fontSize="xs" color={colors.accentOrange} fontWeight="600">
                        {myTeam.name}
                      </Text>
                    )}
                  </VStack>
                </HStack>
                <HStack gap="3">
                  {/* Progress badge */}
                  <Box
                    bg={completedCount === CHECKLIST_STEPS.length ? 'rgba(34,197,94,0.15)' : 'rgba(255,107,43,0.12)'}
                    border="1px solid"
                    borderColor={completedCount === CHECKLIST_STEPS.length ? 'rgba(34,197,94,0.4)' : 'rgba(255,107,43,0.3)'}
                    px="3"
                    py="1"
                    rounded="full"
                  >
                    <Text
                      fontSize="xs"
                      fontWeight="800"
                      color={completedCount === CHECKLIST_STEPS.length ? '#22c55e' : colors.accentOrange}
                    >
                      {completedCount}/{CHECKLIST_STEPS.length} Done
                    </Text>
                  </Box>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton size="sm" color={colors.textPrimary} _hover={{ color: colors.accentOrange }} />
                  </Dialog.CloseTrigger>
                </HStack>
              </HStack>
            </Dialog.Header>

            <Dialog.Body p="6" overflowY="auto">
              {!isLoggedIn ? (
                <VStack gap="3" py="8" textAlign="center">
                  <AlertCircle size={32} color={colors.textMuted} />
                  <Text color={colors.textMuted}>Sign in with Discord to access the Captain's Dashboard.</Text>
                </VStack>
              ) : (
                <VStack gap="4" align="stretch">
                  {/* Match day header */}
                  <Box
                    bg="rgba(255,107,43,0.06)"
                    border="1px solid rgba(255,107,43,0.2)"
                    rounded="xl"
                    p="4"
                  >
                    <HStack gap="2" mb="1">
                      <Circle size={10} color={colors.accentOrange} fill="#ff6b2b" />
                      <Text fontSize="xs" fontWeight="700" color={colors.accentOrange} textTransform="uppercase" letterSpacing="wider">
                        Match Day Checklist
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color={colors.textMuted}>
                      Complete each step before and after your match to keep things running smoothly.
                    </Text>
                  </Box>

                  {/* Checklist steps */}
                  {CHECKLIST_STEPS.map((step, i) => {
                    const Icon = step.icon;
                    const done = !!checked[step.id];
                    return (
                      <Box
                        key={step.id}
                        bg={done ? 'rgba(34,197,94,0.05)' : '#111111'}
                        border="1px solid"
                        borderColor={done ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}
                        rounded="xl"
                        p="4"
                        cursor="pointer"
                        onClick={() => toggle(step.id)}
                        transition="all 0.2s"
                        _hover={{ borderColor: done ? 'rgba(34,197,94,0.5)' : `${step.color}55` }}
                        opacity={done ? 0.75 : 1}
                      >
                        <HStack gap="4" align="start">
                          {/* Step number / check */}
                          <Box flexShrink="0">
                            {done ? (
                              <Box
                                w="32px" h="32px"
                                bg="rgba(34,197,94,0.15)"
                                border="1px solid rgba(34,197,94,0.4)"
                                rounded="lg"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Text fontSize="sm" color="#22c55e">✓</Text>
                              </Box>
                            ) : (
                              <Box
                                w="32px" h="32px"
                                bg={`${step.color}18`}
                                border={`1px solid ${step.color}44`}
                                rounded="lg"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Icon size={15} color={step.color} />
                              </Box>
                            )}
                          </Box>

                          {/* Content */}
                          <VStack align="start" gap="1" flex="1">
                            <HStack gap="2">
                              <Badge
                                bg="rgba(255,255,255,0.07)"
                                color={colors.textMuted}
                                fontSize="2xs"
                                fontWeight="700"
                                px="1.5"
                                py="0.5"
                                rounded="md"
                              >
                                STEP {i + 1}
                              </Badge>
                              <Text
                                fontSize="sm"
                                fontWeight="700"
                                color={done ? colors.textMuted : colors.textPrimary}
                                style={{ textDecoration: done ? 'line-through' : 'none' }}
                              >
                                {step.title}
                              </Text>
                            </HStack>
                            <Text fontSize="xs" color={colors.textMuted}>
                              {step.description}
                            </Text>
                            {!done && (
                              <Text fontSize="xs" color={colors.textSubtle} mt="0.5">
                                💡 {step.detail}
                              </Text>
                            )}
                          </VStack>
                        </HStack>
                      </Box>
                    );
                  })}

                  {/* All done message */}
                  {completedCount === CHECKLIST_STEPS.length && (
                    <Box
                      bg="rgba(34,197,94,0.1)"
                      border="1px solid rgba(34,197,94,0.4)"
                      rounded="xl"
                      p="4"
                      textAlign="center"
                    >
                      <Text fontSize="lg" mb="1">🎮</Text>
                      <Text fontSize="sm" fontWeight="700" color="#22c55e">All steps complete — GL HF!</Text>
                      <Text fontSize="xs" color={colors.textMuted} mt="1">
                        Remember to report your score immediately after the match ends.
                      </Text>
                    </Box>
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

export default CaptainsDashboard;
