import { Dialog, Portal, Box, VStack, HStack, Text, Button, CloseButton, Badge, Image } from '@chakra-ui/react';
import { useState } from 'react';
import { Globe, User, CheckCircle } from 'lucide-react';
import { getThemedColors } from '../theme/colors';
import { useAuth } from '../hooks/useAuth';
import { useTeamManagement } from '../hooks/useTeamManagement';

const REGIONS = [
  { id: 'NA', label: 'North America', flag: '🌎', description: 'NA servers · EST/PST primetime' },
  { id: 'EU', label: 'Europe', flag: '🌍', description: 'EU servers · CET/GMT primetime' },
  { id: 'OCE', label: 'Oceania', flag: '🌏', description: 'OCE/AU servers · AEST primetime' },
];

const PlayerRegistrationModal = ({ open, onClose, theme, onSuccess }) => {
  const colors = getThemedColors(theme);
  const { user } = useAuth();
  const { registerProfile, loading, error } = useTeamManagement();
  const [region, setRegion] = useState('');
  const [done, setDone] = useState(false);

  const handleRegister = async () => {
    if (!region) return;
    try {
      await registerProfile(region);
      // Mark as fully registered — suppresses future auto-popups
      if (user?.id) {
        localStorage.setItem(`eml_registered_${user.id}`, '1');
        localStorage.setItem(`eml_reg_seen_${user.id}`, '1');
      }
      onSuccess?.();
      setDone(true);
      setTimeout(onClose, 1800);
    } catch { /* error shown via hook */ }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="md">
      <Portal>
        <Dialog.Backdrop bg="rgba(0,0,0,0.85)" backdropFilter="blur(12px)" />
        <Dialog.Positioner>
          <Dialog.Content
            bg="#0d0d0d"
            border="1px solid rgba(255,107,43,0.3)"
            rounded="2xl"
            overflow="hidden"
            boxShadow="0 0 60px rgba(255,107,43,0.15)"
          >
            <Dialog.Header bg="#111111" borderBottom="1px solid rgba(255,255,255,0.08)" px="6" py="4">
              <HStack justify="space-between">
                <HStack gap="3">
                  <Box bg="rgba(255,107,43,0.15)" border="1px solid rgba(255,107,43,0.3)" p="2" rounded="lg">
                    <User size={18} color="#ff6b2b" />
                  </Box>
                  <VStack align="start" gap="0">
                    <Dialog.Title fontSize="md" fontWeight="800" color={colors.textPrimary}>Player Registration</Dialog.Title>
                    <Text fontSize="xs" color={colors.textMuted}>Complete your EML profile</Text>
                  </VStack>
                </HStack>
                <Dialog.CloseTrigger asChild><CloseButton size="sm" color={colors.textPrimary} _hover={{ color: colors.accentOrange }} /></Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>

            <Dialog.Body p="6">
              {done ? (
                <VStack gap="4" py="8" textAlign="center">
                  <CheckCircle size={48} color="#22c55e" />
                  <Text fontSize="lg" fontWeight="700" color={colors.textPrimary}>Registered!</Text>
                  <Text fontSize="sm" color={colors.textMuted}>Welcome to EML, {user?.globalName || user?.username}</Text>
                </VStack>
              ) : (
                <VStack gap="5" align="stretch">
                  {/* Discord identity */}
                  <Box bg="rgba(88,101,242,0.1)" border="1px solid rgba(88,101,242,0.3)" rounded="xl" p="4">
                    <HStack gap="3">
                      <Image src={user?.avatar} alt={user?.username} w="10" h="10" rounded="full" />
                      <VStack align="start" gap="0">
                        <Text fontSize="sm" fontWeight="700" color={colors.textPrimary}>{user?.globalName || user?.username}</Text>
                        <Text fontSize="xs" color={colors.textMuted}>@{user?.username}</Text>
                      </VStack>
                      <Badge bg="rgba(88,101,242,0.2)" color="#7289da" border="1px solid rgba(88,101,242,0.3)" ml="auto">Discord Linked</Badge>
                    </HStack>
                  </Box>

                  {/* Region selection */}
                  <VStack gap="2" align="stretch">
                    <HStack gap="2" mb="1">
                      <Globe size={14} color={colors.accentOrange} />
                      <Text fontSize="xs" fontWeight="700" color={colors.accentOrange} textTransform="uppercase" letterSpacing="wider">Select Your Region</Text>
                    </HStack>
                    {REGIONS.map((r) => (
                      <Box
                        key={r.id}
                        bg={region === r.id ? 'rgba(255,107,43,0.12)' : '#111111'}
                        border="1px solid"
                        borderColor={region === r.id ? 'rgba(255,107,43,0.5)' : 'rgba(255,255,255,0.08)'}
                        rounded="xl"
                        p="4"
                        cursor="pointer"
                        onClick={() => setRegion(r.id)}
                        transition="all 0.15s"
                        _hover={{ borderColor: 'rgba(255,107,43,0.35)' }}
                      >
                        <HStack justify="space-between">
                          <HStack gap="3">
                            <Text fontSize="xl">{r.flag}</Text>
                            <VStack align="start" gap="0">
                              <Text fontSize="sm" fontWeight="700" color={region === r.id ? '#ff6b2b' : colors.textPrimary}>{r.label}</Text>
                              <Text fontSize="xs" color={colors.textMuted}>{r.description}</Text>
                            </VStack>
                          </HStack>
                          {region === r.id && (
                            <Box w="5" h="5" bg="#ff6b2b" rounded="full" display="flex" alignItems="center" justifyContent="center">
                              <Text color="white" fontSize="2xs">✓</Text>
                            </Box>
                          )}
                        </HStack>
                      </Box>
                    ))}
                  </VStack>

                  {error && (
                    <Text fontSize="xs" color="#ef4444" bg="rgba(239,68,68,0.1)" border="1px solid rgba(239,68,68,0.3)" p="3" rounded="lg">{error}</Text>
                  )}

                  <Button
                    bg="linear-gradient(135deg, #ff6b2b 0%, #ff8c42 100%)"
                    color="white"
                    fontWeight="700"
                    size="lg"
                    rounded="xl"
                    disabled={!region || loading}
                    loading={loading}
                    onClick={handleRegister}
                    _hover={{ opacity: 0.9 }}
                  >
                    Complete Registration
                  </Button>
                </VStack>
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default PlayerRegistrationModal;
