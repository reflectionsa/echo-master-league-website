import { Dialog, Portal, Box, VStack, HStack, Text, Button, CloseButton, Input, Badge } from '@chakra-ui/react';
import { useState } from 'react';
import { Users, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { getThemedColors } from '../theme/colors';
import { useTeamManagement } from '../hooks/useTeamManagement';

const REGIONS = ['NA', 'EU', 'OCE'];

const Field = ({ label, children }) => (
  <VStack align="start" gap="1.5" w="full">
    <Text fontSize="xs" fontWeight="700" color="rgba(255,255,255,0.5)" textTransform="uppercase" letterSpacing="wider">{label}</Text>
    {children}
  </VStack>
);

const inputStyle = {
  bg: '#111111',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'white',
  rounded: 'xl',
  _placeholder: { color: 'rgba(255,255,255,0.25)' },
  _focus: { borderColor: '#ff6b2b', outline: 'none' },
};

const TeamCreationModal = ({ open, onClose, theme, onCreated }) => {
  const colors = getThemedColors(theme);
  const { createTeam, loading, error } = useTeamManagement();
  const [form, setForm] = useState({ name: '', tag: '', region: 'NA', logoUrl: '', bannerUrl: '' });
  const [done, setDone] = useState(false);
  const [createdTeam, setCreatedTeam] = useState(null);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const valid = form.name.trim().length >= 2 && form.tag.trim().length >= 2;

  const handleCreate = async () => {
    if (!valid) return;
    try {
      const result = await createTeam(form);
      setCreatedTeam(result.team);
      setDone(true);
      onCreated?.(result.team);
    } catch { /* shown via error */ }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="lg">
      <Portal>
        <Dialog.Backdrop bg="rgba(0,0,0,0.85)" backdropFilter="blur(12px)" />
        <Dialog.Positioner>
          <Dialog.Content bg="#0d0d0d" border="1px solid rgba(255,107,43,0.3)" rounded="2xl" boxShadow="0 0 60px rgba(255,107,43,0.15)">
            <Dialog.Header bg="#111111" borderBottom="1px solid rgba(255,255,255,0.08)" px="6" py="4">
              <HStack justify="space-between">
                <HStack gap="3">
                  <Box bg="rgba(255,107,43,0.15)" border="1px solid rgba(255,107,43,0.3)" p="2" rounded="lg">
                    <Users size={18} color="#ff6b2b" />
                  </Box>
                  <VStack align="start" gap="0">
                    <Dialog.Title fontSize="md" fontWeight="800" color={colors.textPrimary}>Create Team</Dialog.Title>
                    <Text fontSize="xs" color={colors.textMuted}>You'll be set as Captain</Text>
                  </VStack>
                </HStack>
                <Dialog.CloseTrigger asChild><CloseButton size="sm" color={colors.textMuted} /></Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>

            <Dialog.Body p="6">
              {done ? (
                <VStack gap="4" py="8" textAlign="center">
                  <CheckCircle size={48} color="#22c55e" />
                  <Text fontSize="lg" fontWeight="700" color={colors.textPrimary}>Team Created!</Text>
                  <Box bg="rgba(34,197,94,0.1)" border="1px solid rgba(34,197,94,0.3)" rounded="xl" px="4" py="2">
                    <Text fontSize="sm" color="#22c55e" fontWeight="700">{createdTeam?.name} [{createdTeam?.tag}]</Text>
                  </Box>
                  <Text fontSize="xs" color={colors.textMuted}>Invite players from your team panel.</Text>
                </VStack>
              ) : (
                <VStack gap="4" align="stretch">
                  <HStack gap="3">
                    <Field label="Team Name">
                      <Input {...inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Echo Warriors" maxLength={32} />
                    </Field>
                    <Field label="Tag (2-4 chars)">
                      <Input {...inputStyle} value={form.tag} onChange={e => set('tag', e.target.value.toUpperCase())} placeholder="EW" maxLength={4} w="28" />
                    </Field>
                  </HStack>

                  <Field label="Region">
                    <HStack gap="2">
                      {REGIONS.map(r => (
                        <Button
                          key={r}
                          size="sm"
                          bg={form.region === r ? 'rgba(255,107,43,0.2)' : '#111111'}
                          border="1px solid"
                          borderColor={form.region === r ? 'rgba(255,107,43,0.5)' : 'rgba(255,255,255,0.1)'}
                          color={form.region === r ? '#ff6b2b' : colors.textMuted}
                          rounded="lg"
                          onClick={() => set('region', r)}
                          fontWeight="700"
                          _hover={{ borderColor: 'rgba(255,107,43,0.35)' }}
                        >{r}</Button>
                      ))}
                    </HStack>
                  </Field>

                  <Field label="Logo URL (optional)">
                    <Input {...inputStyle} value={form.logoUrl} onChange={e => set('logoUrl', e.target.value)} placeholder="https://..." />
                  </Field>

                  <Field label="Banner URL (optional)">
                    <Input {...inputStyle} value={form.bannerUrl} onChange={e => set('bannerUrl', e.target.value)} placeholder="https://..." />
                  </Field>

                  {/* Preview strip */}
                  {(form.name || form.tag) && (
                    <Box bg="#111111" border="1px solid rgba(255,255,255,0.08)" rounded="xl" p="3">
                      <HStack gap="3">
                        <Box w="10" h="10" bg="rgba(255,107,43,0.15)" border="1px solid rgba(255,107,43,0.3)" rounded="lg" display="flex" alignItems="center" justifyContent="center">
                          {form.logoUrl ? (
                            <img src={form.logoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} onError={e => e.target.style.display = 'none'} />
                          ) : (
                            <ImageIcon size={16} color="#ff6b2b" />
                          )}
                        </Box>
                        <VStack align="start" gap="0">
                          <Text fontSize="sm" fontWeight="800" color={colors.textPrimary} textTransform="uppercase">{form.name || 'Team Name'}</Text>
                          <HStack gap="1">
                            <Badge bg="rgba(255,107,43,0.15)" color="#ff6b2b" border="1px solid rgba(255,107,43,0.3)" fontSize="2xs" fontWeight="800">{form.tag || 'TAG'}</Badge>
                            <Badge bg="rgba(255,255,255,0.07)" color={colors.textMuted} fontSize="2xs">{form.region}</Badge>
                          </HStack>
                        </VStack>
                      </HStack>
                    </Box>
                  )}

                  {error && (
                    <HStack gap="2" bg="rgba(239,68,68,0.1)" border="1px solid rgba(239,68,68,0.3)" p="3" rounded="lg">
                      <AlertCircle size={14} color="#ef4444" />
                      <Text fontSize="xs" color="#ef4444">{error}</Text>
                    </HStack>
                  )}

                  <Button
                    bg="linear-gradient(135deg, #ff6b2b 0%, #ff8c42 100%)"
                    color="white"
                    fontWeight="700"
                    size="lg"
                    rounded="xl"
                    disabled={!valid || loading}
                    loading={loading}
                    onClick={handleCreate}
                    _hover={{ opacity: 0.9 }}
                    mt="2"
                  >
                    Create Team
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

export default TeamCreationModal;
